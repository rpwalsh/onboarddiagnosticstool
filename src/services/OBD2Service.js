/*
 * Copyright (c) 2026 Ryan P. Walsh. All rights reserved.
 * Proprietary commercial software published for public reference only.
 * No license is granted to use, copy, modify, distribute, or create derivative works.
 */

/**
 * OBD2Service - Core service for communicating with ELM327 OBD2 adapters
 * Supports standard OBD2 PIDs and vehicle-specific commands
 */

class OBD2Service {
  constructor() {
    this.device = null;
    this.characteristic = null;
  this.reader = null;
    this.writer = null;
    this.connected = false;
    this.buffer = '';
    this.responseCallbacks = [];
  }

  // Connect to Bluetooth OBD2 adapter
  async connect() {
    try {
      // Request Bluetooth device
      this.device = await navigator.bluetooth.requestDevice({
    filters: [
          { namePrefix: 'VEEPEAK' },
          { namePrefix: 'OBDLink' },
      { namePrefix: 'ELM327' },
   { namePrefix: 'OBDII' },
          { services: ['0000fff0-0000-1000-8000-00805f9b34fb'] }
      ],
        optionalServices: [
          '0000fff0-0000-1000-8000-00805f9b34fb',
          '0000ffe0-0000-1000-8000-00805f9b34fb'
        ]
      });

      const server = await this.device.gatt.connect();
   console.log('Connected to GATT server');

      // Try common OBD2 service UUIDs
      const serviceUUIDs = [
        '0000fff0-0000-1000-8000-00805f9b34fb',
        '0000ffe0-0000-1000-8000-00805f9b34fb'
      ];

      let service;
      for (const uuid of serviceUUIDs) {
        try {
   service = await server.getPrimaryService(uuid);
     break;
        } catch (e) {
   continue;
     }
      }

      if (!service) {
    throw new Error('Could not find OBD2 service');
      }

      // Get characteristic
      const characteristicUUIDs = [
  '0000fff1-0000-1000-8000-00805f9b34fb',
        '0000ffe1-0000-1000-8000-00805f9b34fb'
      ];

      for (const uuid of characteristicUUIDs) {
        try {
   this.characteristic = await service.getCharacteristic(uuid);
          break;
        } catch (e) {
          continue;
        }
      }

      if (!this.characteristic) {
    throw new Error('Could not find OBD2 characteristic');
      }

      // Start notifications
    await this.characteristic.startNotifications();
  this.characteristic.addEventListener('characteristicvaluechanged', 
        this.handleNotification.bind(this));

      this.connected = true;

      // Initialize ELM327
 await this.initialize();

    return { success: true, device: this.device.name };
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  // Initialize ELM327 adapter
  async initialize() {
    await this.sendCommand('ATZ');  // Reset
    await this.delay(1000);
    await this.sendCommand('ATE0'); // Echo off
    await this.sendCommand('ATL0'); // Linefeeds off
    await this.sendCommand('ATS0'); // Spaces off
    await this.sendCommand('ATH1'); // Headers on (for advanced features)
    await this.sendCommand('ATSP0'); // Auto protocol detection
    await this.sendCommand('0100'); // Test command
  }

  // Handle incoming data
  handleNotification(event) {
    const value = event.target.value;
    const decoder = new TextDecoder();
    const text = decoder.decode(value);
    
 this.buffer += text;

    // Check for prompt character (>)
    if (this.buffer.includes('>')) {
      const response = this.buffer.replace(/>/g, '').trim();
      this.buffer = '';
      
      // Call waiting callbacks
    if (this.responseCallbacks.length > 0) {
        const callback = this.responseCallbacks.shift();
  callback(response);
 }
 }
  }

  // Send command and wait for response
  async sendCommand(command, timeout = 5000) {
    if (!this.connected) {
      throw new Error('Not connected to OBD2 adapter');
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const index = this.responseCallbacks.indexOf(callback);
        if (index > -1) {
          this.responseCallbacks.splice(index, 1);
        }
        reject(new Error('Command timeout'));
      }, timeout);

      const callback = (response) => {
    clearTimeout(timeoutId);
     resolve(response);
      };

      this.responseCallbacks.push(callback);

      // Send command
      const encoder = new TextEncoder();
      const data = encoder.encode(command + '\r');
      
      this.characteristic.writeValue(data).catch(reject);
    });
  }

  // Read standard OBD2 PID
  async readPID(mode, pid) {
  const command = `${mode}${pid}`;
    const response = await this.sendCommand(command);
    return this.parseResponse(response, mode, pid);
  }

  // Parse OBD2 response
  parseResponse(response, mode, pid) {
    // Remove spaces and convert to uppercase
    const cleaned = response.replace(/\s/g, '').toUpperCase();
    
    // Look for the response pattern (mode + 40, pid, data)
    const expectedResponse = (parseInt(mode, 16) + 0x40).toString(16).toUpperCase().padStart(2, '0');
    const pattern = new RegExp(expectedResponse + pid.toUpperCase() + '([0-9A-F]+)');
    const match = cleaned.match(pattern);

    if (match) {
      return match[1];
    }

  return null;
  }

  // Read multiple PIDs
  async readMultiplePIDs(pids) {
    const results = {};
    for (const { mode, pid, name } of pids) {
      try {
        const data = await this.readPID(mode, pid);
 results[name] = data;
      } catch (error) {
        console.error(`Error reading ${name}:`, error);
        results[name] = null;
}
    }
    return results;
  }

  // Read DTCs (Diagnostic Trouble Codes)
  async readDTCs() {
    try {
      const response = await this.sendCommand('03');
    return this.parseDTCs(response);
    } catch (error) {
      console.error('Error reading DTCs:', error);
      return [];
    }
  }

  // Parse DTCs from response
  parseDTCs(response) {
    const dtcs = [];

    // ELM327 responses vary (with/without CAN headers, multi-line). We extract the
    // payload starting at service 0x43 and decode 2-byte DTCs until 0000.
    const lines = String(response)
      .replace(/>/g, '')
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);

    for (const line of lines) {
      const hex = line.replace(/[^0-9A-F]/gi, '').toUpperCase();
      const idx = hex.indexOf('43');
      if (idx === -1) continue;

      const data = hex.slice(idx + 2);
      for (let i = 0; i + 4 <= data.length; i += 4) {
        const raw = data.slice(i, i + 4);
        if (raw === '0000') continue;
        dtcs.push(this.decodeDTC(raw));
      }
    }

    return [...new Set(dtcs)];
  }

  // Decode 2-byte DTC to readable format (e.g., "P0133")
  decodeDTC(hex) {
    const a = parseInt(hex.slice(0, 2), 16);
    const b = parseInt(hex.slice(2, 4), 16);

    const firstChar = ['P', 'C', 'B', 'U'][(a & 0xC0) >> 6];
    const d1 = ((a & 0x30) >> 4).toString(16).toUpperCase();
    const d2 = (a & 0x0F).toString(16).toUpperCase();
    const d3 = ((b & 0xF0) >> 4).toString(16).toUpperCase();
    const d4 = (b & 0x0F).toString(16).toUpperCase();

    return `${firstChar}${d1}${d2}${d3}${d4}`;
  }

  // Clear DTCs
  async clearDTCs() {
    try {
      await this.sendCommand('04');
      return { success: true };
    } catch (error) {
      console.error('Error clearing DTCs:', error);
      return { success: false, error: error.message };
    }
  }

  // Read freeze frame data
  async readFreezeFrame(dtcIndex = 0) {
    try {
      const response = await this.sendCommand(`02${dtcIndex.toString(16).padStart(2, '0')}`);
      return response;
    } catch (error) {
  console.error('Error reading freeze frame:', error);
      return null;
    }
  }

  // Read vehicle information
  async readVIN() {
    try {
      const response = await this.sendCommand('0902');
      return this.parseVIN(response);
    } catch (error) {
      console.error('Error reading VIN:', error);
      return null;
    }
  }

  // Parse VIN from response
  parseVIN(response) {
    const cleaned = response.replace(/\s/g, '').replace(/^49020[0-9]/g, '');
    let vin = '';
    
    for (let i = 0; i < cleaned.length; i += 2) {
  const byte = cleaned.substring(i, i + 2);
      if (byte === '00') break;
      vin += String.fromCharCode(parseInt(byte, 16));
    }
    
    return vin;
  }

  // Read calibration ID
  async readCalibrationID() {
    try {
  const response = await this.sendCommand('0904');
  return response;
    } catch (error) {
    console.error('Error reading calibration ID:', error);
      return null;
    }
  }

  // Monitor live data with callback
  startMonitoring(pids, callback, interval = 1000) {
    const monitorInterval = setInterval(async () => {
      if (!this.connected) {
        clearInterval(monitorInterval);
        return;
      }

 try {
        const data = await this.readMultiplePIDs(pids);
        callback(data);
      } catch (error) {
        console.error('Monitoring error:', error);
  }
    }, interval);

    return monitorInterval;
  }

  // Stop monitoring
  stopMonitoring(intervalId) {
    clearInterval(intervalId);
  }

  // Send custom command (for bidirectional features)
  async sendCustomCommand(command) {
    try {
      const response = await this.sendCommand(command);
      return response;
    } catch (error) {
      console.error('Error sending custom command:', error);
      throw error;
    }
  }

  // Disconnect
  async disconnect() {
    if (this.device && this.device.gatt.connected) {
      await this.device.gatt.disconnect();
    }
    this.connected = false;
    this.device = null;
    this.characteristic = null;
  }

  // Helper delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Check if Web Bluetooth is supported
  isSupported() {
    return 'bluetooth' in navigator;
  }
}

export default new OBD2Service();

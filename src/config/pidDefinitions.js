/*
 * Copyright (c) 2026 Ryan Walsh. All rights reserved.
 * Proprietary commercial software published for public reference only.
 * No license is granted to use, copy, modify, distribute, or create derivative works.
 */

/**
 * Standard OBD2 PID Definitions
 * Mode 01 - Show current data
 */

export const STANDARD_PIDS = {
  // Engine
  ENGINE_RPM: {
    mode: '01',
    pid: '0C',
    name: 'Engine RPM',
    description: 'Engine revolutions per minute',
    unit: 'RPM',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      const b = parseInt(data.substring(2, 4), 16);
      return ((a * 256) + b) / 4;
    }
  },
  ENGINE_LOAD: {
    mode: '01',
    pid: '04',
    name: 'Engine Load',
    description: 'Calculated engine load value',
    unit: '%',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      return (a * 100) / 255;
    }
  },
  COOLANT_TEMP: {
    mode: '01',
    pid: '05',
    name: 'Coolant Temperature',
    description: 'Engine coolant temperature',
    unit: 'C',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      return a - 40;
    }
  },
  INTAKE_TEMP: {
    mode: '01',
    pid: '0F',
    name: 'Intake Air Temperature',
    description: 'Intake manifold air temperature',
    unit: 'C',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      return a - 40;
    }
  },
  THROTTLE_POS: {
    mode: '01',
    pid: '11',
    name: 'Throttle Position',
    description: 'Throttle position percentage',
    unit: '%',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      return (a * 100) / 255;
    }
  },

  // Fuel System
  FUEL_PRESSURE: {
    mode: '01',
    pid: '0A',
    name: 'Fuel Pressure',
    description: 'Fuel rail pressure',
    unit: 'kPa',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      return a * 3;
    }
  },
  FUEL_LEVEL: {
    mode: '01',
    pid: '2F',
    name: 'Fuel Level',
    description: 'Fuel tank level input',
    unit: '%',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      return (a * 100) / 255;
    }
  },
  SHORT_FUEL_TRIM_1: {
    mode: '01',
    pid: '06',
    name: 'Short Term Fuel Trim Bank 1',
    description: 'Short term fuel trim',
    unit: '%',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      return ((a - 128) * 100) / 128;
    }
  },
  LONG_FUEL_TRIM_1: {
    mode: '01',
    pid: '07',
    name: 'Long Term Fuel Trim Bank 1',
    description: 'Long term fuel trim',
    unit: '%',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      return ((a - 128) * 100) / 128;
    }
  },

  // Speed & Distance
  VEHICLE_SPEED: {
    mode: '01',
    pid: '0D',
    name: 'Vehicle Speed',
    description: 'Vehicle speed',
    unit: 'km/h',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      return a;
    }
  },
  MAF_RATE: {
    mode: '01',
    pid: '10',
    name: 'MAF Air Flow Rate',
    description: 'Mass air flow sensor rate',
    unit: 'g/s',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      const b = parseInt(data.substring(2, 4), 16);
      return ((a * 256) + b) / 100;
    }
  },

  // Timing
  TIMING_ADVANCE: {
    mode: '01',
    pid: '0E',
    name: 'Timing Advance',
    description: 'Ignition timing advance',
    unit: 'deg before TDC',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      return (a / 2) - 64;
    }
  },

  // O2 Sensors
  O2_SENSOR_1_VOLTAGE: {
    mode: '01',
    pid: '14',
    name: 'O2 Sensor 1 Voltage',
    description: 'Oxygen sensor 1 voltage',
    unit: 'V',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      return a / 200;
    }
  },

  // Battery/Charging
  CONTROL_MODULE_VOLTAGE: {
    mode: '01',
    pid: '42',
    name: 'Control Module Voltage',
    description: 'Control module power supply',
    unit: 'V',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      const b = parseInt(data.substring(2, 4), 16);
      return ((a * 256) + b) / 1000;
    }
  },

  // Absolute values
  ABSOLUTE_LOAD: {
    mode: '01',
    pid: '43',
    name: 'Absolute Load Value',
    description: 'Absolute load value',
    unit: '%',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      const b = parseInt(data.substring(2, 4), 16);
      return ((a * 256) + b) * 100 / 255;
    }
  },

  AMBIENT_AIR_TEMP: {
    mode: '01',
    pid: '46',
    name: 'Ambient Air Temperature',
    description: 'Ambient air temperature',
    unit: 'C',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      return a - 40;
    }
  },

  RUNTIME_SINCE_START: {
    mode: '01',
    pid: '1F',
    name: 'Runtime Since Engine Start',
    description: 'Time since engine started',
    unit: 'seconds',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      const b = parseInt(data.substring(2, 4), 16);
      return (a * 256) + b;
    }
  },

  DISTANCE_MIL: {
    mode: '01',
    pid: '21',
    name: 'Distance with MIL On',
    description: 'Distance traveled with MIL on',
    unit: 'km',
    formula: (data) => {
      const a = parseInt(data.substring(0, 2), 16);
      const b = parseInt(data.substring(2, 4), 16);
      return (a * 256) + b;
    }
  }
};

export const STANDARD_PIDS_ARRAY = Object.values(STANDARD_PIDS);

export const DASHBOARD_PIDS = [
  STANDARD_PIDS.ENGINE_RPM,
  STANDARD_PIDS.VEHICLE_SPEED,
  STANDARD_PIDS.COOLANT_TEMP,
  STANDARD_PIDS.ENGINE_LOAD,
  STANDARD_PIDS.THROTTLE_POS,
  STANDARD_PIDS.FUEL_LEVEL,
  STANDARD_PIDS.INTAKE_TEMP,
  STANDARD_PIDS.MAF_RATE
];

export const LIVE_DATA_PIDS = STANDARD_PIDS_ARRAY;

export const DIAGNOSTIC_PIDS = [
  STANDARD_PIDS.ENGINE_LOAD,
  STANDARD_PIDS.COOLANT_TEMP,
  STANDARD_PIDS.SHORT_FUEL_TRIM_1,
  STANDARD_PIDS.LONG_FUEL_TRIM_1,
  STANDARD_PIDS.INTAKE_TEMP,
  STANDARD_PIDS.TIMING_ADVANCE,
  STANDARD_PIDS.O2_SENSOR_1_VOLTAGE,
  STANDARD_PIDS.CONTROL_MODULE_VOLTAGE
];

export default STANDARD_PIDS;

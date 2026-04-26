/*
 * Copyright (c) 2026 Ryan Walsh. All rights reserved.
 * Proprietary commercial software published for public reference only.
 * No license is granted to use, copy, modify, distribute, or create derivative works.
 */

/**
 * Vehicle-specific profiles with custom PIDs and bidirectional commands.
 *
 * This module is intentionally limited to a small, known-good set of examples.
 */

export const VEHICLE_PROFILES = {
  CHEVY_TAHOE_2005: {
    id: 'tahoe_2005',
    make: 'Chevrolet',
    model: 'Tahoe',
    year: 2005,
    engine: '5.3L V8',
    protocol: 'ISO 15765-4 (CAN)',

    customPIDs: [
      {
        mode: '22',
        pid: '1001',
        name: 'Transmission Temperature',
        description: 'Automatic transmission fluid temperature',
        unit: 'C',
        formula: (data) => parseInt(data, 16) - 40
      },
      {
        mode: '22',
        pid: '1003',
        name: 'Oil Life Remaining',
        description: 'Engine oil life percentage',
        unit: '%',
        formula: (data) => parseInt(data, 16)
      }
    ],

    bidirectionalCommands: [
      {
        id: 'reset_oil_life',
        name: 'Reset Oil Life',
        category: 'Maintenance',
        description: 'Reset oil life monitor to 100%',
        command: '1001',
        confirmation: true,
        warning: 'Only reset after oil change'
      },
      {
        id: 'fuel_pump_test',
        name: 'Fuel Pump Test',
        category: 'Actuator Tests',
        description: 'Activate fuel pump',
        command: '1002',
        confirmation: true
      }
    ],

    knownDTCs: {
      P0300: 'Random/Multiple Cylinder Misfire Detected',
      P0420: 'Catalyst System Efficiency Below Threshold',
      P0171: 'System Too Lean (Bank 1)',
      P0174: 'System Too Lean (Bank 2)'
    }
  },

  TOYOTA_4RUNNER_2021: {
    id: '4runner_2021',
    make: 'Toyota',
    model: '4Runner',
    year: 2021,
    engine: '4.0L V6',
    protocol: 'ISO 15765-4 (CAN)',

    customPIDs: [
      {
        mode: '22',
        pid: '0180',
        name: 'Battery Voltage',
        description: 'Hybrid system battery voltage',
        unit: 'V',
        formula: (data) => parseInt(data, 16) / 10
      },
      {
        mode: '22',
        pid: '018C',
        name: 'Transmission Gear',
        description: 'Current transmission gear',
        unit: 'gear',
        formula: (data) => parseInt(data, 16)
      }
    ],

    bidirectionalCommands: [
      {
        id: 'maintenance_reset',
        name: 'Reset Maintenance Light',
        category: 'Maintenance',
        description: 'Reset maintenance required indicator',
        command: '30C0',
        confirmation: true
      },
      {
        id: 'tpms_learn',
        name: 'TPMS Learn Mode',
        category: 'TPMS',
        description: 'Enter tire pressure monitoring system learn mode',
        command: '30C2',
        confirmation: true
      }
    ],

    knownDTCs: {
      P0171: 'System Too Lean (Bank 1)',
      P0174: 'System Too Lean (Bank 2)',
      P0420: 'Catalyst System Efficiency Below Threshold (Bank 1)',
      P0430: 'Catalyst System Efficiency Below Threshold (Bank 2)',
      P2757: 'Torque Converter Clutch Pressure Control Solenoid'
    }
  },

  TOYOTA_2019: {
    id: 'toyota_2019',
    make: 'Toyota',
    model: 'Generic',
    year: 2019,
    engine: 'Various',
    protocol: 'ISO 15765-4 (CAN)',

    customPIDs: [
      {
        mode: '22',
        pid: '0180',
        name: 'Battery Voltage',
        description: 'System battery voltage',
        unit: 'V',
        formula: (data) => parseInt(data, 16) / 10
      }
    ],

    bidirectionalCommands: [
      {
        id: 'maintenance_reset',
        name: 'Reset Maintenance Light',
        category: 'Maintenance',
        description: 'Reset maintenance required indicator',
        command: '30C0',
        confirmation: true
      }
    ],

    knownDTCs: {
      P0171: 'System Too Lean (Bank 1)',
      P0420: 'Catalyst System Efficiency Below Threshold'
    }
  },

  LAND_ROVER_EVOQUE_2017: {
    id: 'evoque_2017',
    make: 'Land Rover',
    model: 'Range Rover Evoque',
    year: 2017,
    engine: '2.0L Turbo',
    protocol: 'ISO 15765-4 (CAN)',

    customPIDs: [
      {
        mode: '22',
        pid: '2001',
        name: 'Turbo Boost Pressure',
        description: 'Turbocharger boost pressure',
        unit: 'kPa',
        formula: (data) => parseInt(data, 16) / 10
      },
      {
        mode: '22',
        pid: '2005',
        name: 'DPF Regeneration Status',
        description: 'Diesel particulate filter regeneration status',
        unit: '%',
        formula: (data) => parseInt(data, 16)
      },
      {
        mode: '22',
        pid: '2010',
        name: 'Terrain Response Mode',
        description: 'Current terrain response setting',
        unit: 'mode',
        formula: (data) => {
          const modes = ['General', 'Grass/Gravel/Snow', 'Mud/Ruts', 'Sand', 'Rock Crawl'];
          const value = parseInt(data, 16);
          return modes[value] || 'Unknown';
        }
      }
    ],

    bidirectionalCommands: [
      {
        id: 'dpf_regen',
        name: 'Force DPF Regeneration',
        category: 'Emissions',
        description: 'Force diesel particulate filter regeneration cycle',
        command: '3001',
        confirmation: true,
        warning: 'Vehicle must be driven at highway speeds'
      },
      {
        id: 'service_reset',
        name: 'Reset Service Indicator',
        category: 'Maintenance',
        description: 'Reset service interval reminder',
        command: '3100',
        confirmation: true
      },
      {
        id: 'suspension_cal',
        name: 'Calibrate Air Suspension',
        category: 'Chassis',
        description: 'Recalibrate air suspension height sensors',
        command: '3200',
        confirmation: true,
        warning: 'Vehicle must be on level ground'
      }
    ],

    knownDTCs: {
      P0299: 'Turbocharger/Supercharger A Underboost Condition',
      P2002: 'Diesel Particulate Filter Efficiency Below Threshold',
      P0401: 'Exhaust Gas Recirculation Flow Insufficient',
      P2463: 'DPF Soot Accumulation'
    }
  }
};

export const getVehicleProfile = (vehicleId) => {
  return Object.values(VEHICLE_PROFILES).find(v => v.id === vehicleId);
};

export const getAllVehicleProfiles = () => {
  return Object.values(VEHICLE_PROFILES);
};

export const getCustomPIDs = (vehicleId) => {
  const profile = getVehicleProfile(vehicleId);
  return profile?.customPIDs || [];
};

export const getBidirectionalCommands = (vehicleId) => {
  const profile = getVehicleProfile(vehicleId);
  return profile?.bidirectionalCommands || [];
};

export const lookupDTC = (code, vehicleId) => {
  const profile = getVehicleProfile(vehicleId);
  return profile?.knownDTCs?.[code] || null;
};

export default VEHICLE_PROFILES;

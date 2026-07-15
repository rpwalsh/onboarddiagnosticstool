/*
 * Copyright (c) 2026 Sarah Walsh. All rights reserved.
 * Proprietary commercial software published for public reference only.
 * No license is granted to use, copy, modify, distribute, or create derivative works.
 */

/**
 * DTC (Diagnostic Trouble Code) Database
 * Comprehensive list of common OBD2 trouble codes
 */

export const DTC_DATABASE = {
// Powertrain Codes (P0xxx - P3xxx)
  
  // Fuel and Air Metering
  'P0100': { description: 'Mass or Volume Air Flow Circuit Malfunction', severity: 'medium', category: 'Fuel/Air' },
'P0101': { description: 'Mass or Volume Air Flow Circuit Range/Performance Problem', severity: 'medium', category: 'Fuel/Air' },
  'P0102': { description: 'Mass or Volume Air Flow Circuit Low Input', severity: 'medium', category: 'Fuel/Air' },
  'P0103': { description: 'Mass or Volume Air Flow Circuit High Input', severity: 'medium', category: 'Fuel/Air' },
  'P0171': { description: 'System Too Lean (Bank 1)', severity: 'medium', category: 'Fuel/Air' },
  'P0172': { description: 'System Too Rich (Bank 1)', severity: 'medium', category: 'Fuel/Air' },
  'P0174': { description: 'System Too Lean (Bank 2)', severity: 'medium', category: 'Fuel/Air' },
  'P0175': { description: 'System Too Rich (Bank 2)', severity: 'medium', category: 'Fuel/Air' },

  // Ignition System
  'P0300': { description: 'Random/Multiple Cylinder Misfire Detected', severity: 'high', category: 'Ignition' },
  'P0301': { description: 'Cylinder 1 Misfire Detected', severity: 'high', category: 'Ignition' },
  'P0302': { description: 'Cylinder 2 Misfire Detected', severity: 'high', category: 'Ignition' },
  'P0303': { description: 'Cylinder 3 Misfire Detected', severity: 'high', category: 'Ignition' },
  'P0304': { description: 'Cylinder 4 Misfire Detected', severity: 'high', category: 'Ignition' },
  'P0305': { description: 'Cylinder 5 Misfire Detected', severity: 'high', category: 'Ignition' },
  'P0306': { description: 'Cylinder 6 Misfire Detected', severity: 'high', category: 'Ignition' },
  'P0307': { description: 'Cylinder 7 Misfire Detected', severity: 'high', category: 'Ignition' },
  'P0308': { description: 'Cylinder 8 Misfire Detected', severity: 'high', category: 'Ignition' },
  'P0351': { description: 'Ignition Coil A Primary/Secondary Circuit Malfunction', severity: 'high', category: 'Ignition' },
  'P0352': { description: 'Ignition Coil B Primary/Secondary Circuit Malfunction', severity: 'high', category: 'Ignition' },

  // Emissions
  'P0420': { description: 'Catalyst System Efficiency Below Threshold (Bank 1)', severity: 'medium', category: 'Emissions' },
  'P0430': { description: 'Catalyst System Efficiency Below Threshold (Bank 2)', severity: 'medium', category: 'Emissions' },
  'P0440': { description: 'Evaporative Emission Control System Malfunction', severity: 'low', category: 'Emissions' },
  'P0441': { description: 'Evaporative Emission Control System Incorrect Purge Flow', severity: 'low', category: 'Emissions' },
  'P0442': { description: 'Evaporative Emission Control System Leak Detected (Small Leak)', severity: 'low', category: 'Emissions' },
  'P0443': { description: 'Evaporative Emission Control System Purge Control Valve Circuit Malfunction', severity: 'low', category: 'Emissions' },
  'P0455': { description: 'Evaporative Emission Control System Leak Detected (Large Leak)', severity: 'medium', category: 'Emissions' },

  // Oxygen Sensors
  'P0130': { description: 'O2 Sensor Circuit Malfunction (Bank 1, Sensor 1)', severity: 'medium', category: 'Sensors' },
  'P0131': { description: 'O2 Sensor Circuit Low Voltage (Bank 1, Sensor 1)', severity: 'medium', category: 'Sensors' },
  'P0132': { description: 'O2 Sensor Circuit High Voltage (Bank 1, Sensor 1)', severity: 'medium', category: 'Sensors' },
  'P0133': { description: 'O2 Sensor Circuit Slow Response (Bank 1, Sensor 1)', severity: 'medium', category: 'Sensors' },
  'P0134': { description: 'O2 Sensor Circuit No Activity Detected (Bank 1, Sensor 1)', severity: 'medium', category: 'Sensors' },
  'P0135': { description: 'O2 Sensor Heater Circuit Malfunction (Bank 1, Sensor 1)', severity: 'medium', category: 'Sensors' },
  'P0140': { description: 'O2 Sensor Circuit Malfunction (Bank 1, Sensor 2)', severity: 'medium', category: 'Sensors' },

  // Engine Sensors
  'P0106': { description: 'Manifold Absolute Pressure/Barometric Pressure Circuit Range/Performance', severity: 'medium', category: 'Sensors' },
  'P0107': { description: 'Manifold Absolute Pressure/Barometric Pressure Circuit Low Input', severity: 'medium', category: 'Sensors' },
  'P0108': { description: 'Manifold Absolute Pressure/Barometric Pressure Circuit High Input', severity: 'medium', category: 'Sensors' },
  'P0110': { description: 'Intake Air Temperature Circuit Malfunction', severity: 'low', category: 'Sensors' },
  'P0115': { description: 'Engine Coolant Temperature Circuit Malfunction', severity: 'medium', category: 'Sensors' },
  'P0116': { description: 'Engine Coolant Temperature Circuit Range/Performance', severity: 'medium', category: 'Sensors' },
  'P0117': { description: 'Engine Coolant Temperature Circuit Low Input', severity: 'medium', category: 'Sensors' },
  'P0118': { description: 'Engine Coolant Temperature Circuit High Input', severity: 'medium', category: 'Sensors' },
  'P0120': { description: 'Throttle Position Sensor/Switch A Circuit Malfunction', severity: 'high', category: 'Sensors' },
  'P0121': { description: 'Throttle Position Sensor/Switch A Circuit Range/Performance', severity: 'high', category: 'Sensors' },

  // Transmission
  'P0700': { description: 'Transmission Control System Malfunction', severity: 'high', category: 'Transmission' },
  'P0705': { description: 'Transmission Range Sensor Circuit Malfunction (PRNDL Input)', severity: 'medium', category: 'Transmission' },
  'P0715': { description: 'Input/Turbine Speed Sensor Circuit Malfunction', severity: 'medium', category: 'Transmission' },
  'P0720': { description: 'Output Speed Sensor Circuit Malfunction', severity: 'medium', category: 'Transmission' },
  'P0730': { description: 'Incorrect Gear Ratio', severity: 'high', category: 'Transmission' },

  // EGR System
  'P0400': { description: 'Exhaust Gas Recirculation Flow Malfunction', severity: 'medium', category: 'Emissions' },
  'P0401': { description: 'Exhaust Gas Recirculation Flow Insufficient Detected', severity: 'medium', category: 'Emissions' },
  'P0402': { description: 'Exhaust Gas Recirculation Flow Excessive Detected', severity: 'medium', category: 'Emissions' },

  // Turbocharger/Supercharger
  'P0234': { description: 'Engine Overboost Condition', severity: 'high', category: 'Turbo' },
  'P0235': { description: 'Turbocharger Boost Sensor A Circuit Malfunction', severity: 'medium', category: 'Turbo' },
  'P0236': { description: 'Turbocharger Boost Sensor A Circuit Range/Performance', severity: 'medium', category: 'Turbo' },
  'P0299': { description: 'Turbocharger/Supercharger A Underboost Condition', severity: 'high', category: 'Turbo' },

  // Diesel Specific
  'P2002': { description: 'Diesel Particulate Filter Efficiency Below Threshold (Bank 1)', severity: 'high', category: 'Emissions' },
  'P2003': { description: 'Diesel Particulate Filter Efficiency Below Threshold (Bank 2)', severity: 'high', category: 'Emissions' },
  'P2463': { description: 'Diesel Particulate Filter Soot Accumulation', severity: 'medium', category: 'Emissions' },

  // Generic Codes
  'P0562': { description: 'System Voltage Low', severity: 'medium', category: 'Electrical' },
  'P0563': { description: 'System Voltage High', severity: 'medium', category: 'Electrical' },
  'P0601': { description: 'Internal Control Module Memory Check Sum Error', severity: 'high', category: 'ECU' },
  'P0602': { description: 'Control Module Programming Error', severity: 'high', category: 'ECU' },
  'P0603': { description: 'Internal Control Module Keep Alive Memory (KAM) Error', severity: 'high', category: 'ECU' },

  // Body Codes (B)
  'B0001': { description: 'Driver Airbag Circuit Short to Ground', severity: 'high', category: 'Safety' },
  'B0002': { description: 'Driver Airbag Circuit Open', severity: 'high', category: 'Safety' },

  // Chassis Codes (C)
  'C0035': { description: 'Left Front Wheel Speed Sensor Circuit Malfunction', severity: 'medium', category: 'ABS' },
  'C0040': { description: 'Right Front Wheel Speed Sensor Circuit Malfunction', severity: 'medium', category: 'ABS' },
  'C0045': { description: 'Left Rear Wheel Speed Sensor Circuit Malfunction', severity: 'medium', category: 'ABS' },
  'C0050': { description: 'Right Rear Wheel Speed Sensor Circuit Malfunction', severity: 'medium', category: 'ABS' },

  // Network Communication Codes (U)
  'U0001': { description: 'High Speed CAN Communication Bus', severity: 'high', category: 'Network' },
  'U0100': { description: 'Lost Communication with ECM/PCM', severity: 'high', category: 'Network' },
  'U0101': { description: 'Lost Communication with TCM', severity: 'high', category: 'Network' },
  'U0121': { description: 'Lost Communication with ABS Control Module', severity: 'high', category: 'Network' }
};

// Get DTC information
export const getDTCInfo = (code) => {
  return DTC_DATABASE[code] || { 
    description: 'Unknown diagnostic trouble code', 
    severity: 'unknown', 
    category: 'Unknown' 
  };
};

// Get severity color
export const getSeverityColor = (severity) => {
  const colors = {
    'low': '#4caf50',      // Green
    'medium': '#ff9800',   // Orange
    'high': '#f44336',     // Red
    'unknown': '#9e9e9e'   // Grey
  };
  return colors[severity] || colors.unknown;
};

// Get category icon (Material-UI icon names)
export const getCategoryIcon = (category) => {
  const icons = {
    'Fuel/Air': 'AirIcon',
    'Ignition': 'FlashOnIcon',
    'Emissions': 'CloudIcon',
    'Sensors': 'SensorsIcon',
    'Transmission': 'SettingsIcon',
    'Turbo': 'SpeedIcon',
    'Electrical': 'BoltIcon',
    'ECU': 'MemoryIcon',
    'Safety': 'SecurityIcon',
    'ABS': 'CarCrashIcon',
    'Network': 'CableIcon',
    'Unknown': 'HelpIcon'
  };
  return icons[category] || icons.Unknown;
};

export default DTC_DATABASE;

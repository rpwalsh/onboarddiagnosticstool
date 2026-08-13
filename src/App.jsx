/*
 * Copyright (c) 2026 Ryan P. Walsh. All rights reserved.
 * Proprietary commercial software published for public reference only.
 * No license is granted to use, copy, modify, distribute, or create derivative works.
 */

import { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Alert,
  Snackbar,
  Tabs,
  Tab
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  Build as BuildIcon,
  Settings as SettingsIcon,
  Bluetooth as BluetoothIcon,
  DirectionsCar as DirectionsCarIcon
} from '@mui/icons-material';

import ConnectionPanel from './components/ConnectionPanel';
import DashboardView from './components/DashboardView';
import LiveDataView from './components/LiveDataView';
import DTCView from './components/DTCView';
import BidirectionalView from './components/BidirectionalView';
import SettingsView from './components/SettingsView';
import './App.css';

import OBD2Service from './services/OBD2Service';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3'
    },
    secondary: {
      main: '#ff5722'
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
});

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'livedata', label: 'Live Data', icon: <SpeedIcon /> },
  { id: 'dtc', label: 'Trouble Codes', icon: <WarningIcon /> },
  { id: 'bidirectional', label: 'Commands', icon: <BuildIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> }
];

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [connected, setConnected] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const currentTab = Math.max(
    0,
    menuItems.findIndex(i => i.id === currentView)
  );

  useEffect(() => {
    if (!OBD2Service.isSupported()) {
      setNotification({
        open: true,
        message: 'Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Opera.',
        severity: 'error'
      });
    }

    const savedVehicle = localStorage.getItem('selectedVehicle');
    if (savedVehicle) {
      setSelectedVehicle(savedVehicle);
    }
  }, []);

  const handleConnect = async () => {
    try {
      const result = await OBD2Service.connect();
      setConnected(true);
      setDeviceName(result.device);
      setNotification({
        open: true,
        message: `Connected to ${result.device}`,
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: `Connection failed: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleDisconnect = async () => {
    await OBD2Service.disconnect();
    setConnected(false);
    setDeviceName('');
    setNotification({
      open: true,
      message: 'Disconnected from OBD2 adapter',
      severity: 'info'
    });
  };

  const handleVehicleChange = (vehicleId) => {
    setSelectedVehicle(vehicleId);
    localStorage.setItem('selectedVehicle', vehicleId);
    setNotification({
      open: true,
      message: 'Vehicle profile updated',
      severity: 'success'
    });
  };

  const handleTabChange = (_event, newValue) => {
    const item = menuItems[newValue];
    if (item) setCurrentView(item.id);
  };

  const renderView = () => {
    if (!connected) {
      return (
        <ConnectionPanel
          onConnect={handleConnect}
          selectedVehicle={selectedVehicle}
          onVehicleChange={handleVehicleChange}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardView vehicleId={selectedVehicle} />;
      case 'livedata':
        return <LiveDataView vehicleId={selectedVehicle} />;
      case 'dtc':
        return <DTCView vehicleId={selectedVehicle} />;
      case 'bidirectional':
        return <BidirectionalView vehicleId={selectedVehicle} />;
      case 'settings':
        return (
          <SettingsView
            selectedVehicle={selectedVehicle}
            onVehicleChange={handleVehicleChange}
            onDisconnect={handleDisconnect}
          />
        );
      default:
        return <DashboardView vehicleId={selectedVehicle} />;
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <DirectionsCarIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              OBD2 Diagnostic Tool
            </Typography>
            {connected && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BluetoothIcon color="primary" />
                <Typography variant="body2">{deviceName}</Typography>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
          {connected && (
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                {menuItems.map((item) => (
                  <Tab key={item.id} icon={item.icon} iconPosition="start" label={item.label} />
                ))}
              </Tabs>
            </Box>
          )}

          {renderView()}
        </Container>

        <Box
          component="footer"
          sx={{
            py: 2,
            px: 2,
            mt: 'auto',
            backgroundColor: 'background.paper',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            OBD2 Diagnostic Tool - Basic diagnostics (DTCs, live PIDs, custom commands)
          </Typography>
        </Box>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;

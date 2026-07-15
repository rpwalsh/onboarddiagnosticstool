/*
 * Copyright (c) 2026 Sarah Walsh. All rights reserved.
 * Proprietary commercial software published for public reference only.
 * No license is granted to use, copy, modify, distribute, or create derivative works.
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  Save as SaveIcon,
  Info as InfoIcon,
  DirectionsCar as CarIcon,
  Bluetooth as BluetoothIcon
} from '@mui/icons-material';
import { getAllVehicleProfiles } from '../config/vehicleProfiles';

export default function SettingsView({ selectedVehicle, onVehicleChange, onDisconnect }) {
  const [settings, setSettings] = useState({
    autoConnect: false,
    soundAlerts: true,
    dataLogging: false,
    updateInterval: 1000,
    temperatureUnit: 'celsius',
    speedUnit: 'kmh',
    theme: 'dark'
  });
  const [saved, setSaved] = useState(false);

  const vehicles = getAllVehicleProfiles();
  const currentVehicle = vehicles.find(v => v.id === selectedVehicle);

  useEffect(() => {
    const savedSettings = localStorage.getItem('obd2Settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('obd2Settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CarIcon color="primary" />
                <Typography variant="h6">Vehicle Profile</Typography>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Vehicle</InputLabel>
                <Select
                  value={selectedVehicle || ''}
                  onChange={(e) => onVehicleChange(e.target.value)}
                  label="Select Vehicle"
                >
                  {vehicles.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.engine}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {currentVehicle && (
                <Alert severity="info" icon={<InfoIcon />}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Current Vehicle Details
                  </Typography>
                  <List dense>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Make & Model"
                        secondary={`${currentVehicle.year} ${currentVehicle.make} ${currentVehicle.model}`}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText primary="Engine" secondary={currentVehicle.engine} />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText primary="Protocol" secondary={currentVehicle.protocol} />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Custom PIDs Available"
                        secondary={currentVehicle.customPIDs?.length || 0}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Bidirectional Commands"
                        secondary={currentVehicle.bidirectionalCommands?.length || 0}
                      />
                    </ListItem>
                  </List>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BluetoothIcon color="primary" />
                <Typography variant="h6">Connection</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoConnect}
                    onChange={(e) => handleSettingChange('autoConnect', e.target.checked)}
                  />
                }
                label="Auto-connect on startup"
              />

              <Divider sx={{ my: 2 }} />

              <FormControl fullWidth>
                <InputLabel>Data Update Interval</InputLabel>
                <Select
                  value={settings.updateInterval}
                  onChange={(e) => handleSettingChange('updateInterval', e.target.value)}
                  label="Data Update Interval"
                >
                  <MenuItem value={500}>Fast (500ms)</MenuItem>
                  <MenuItem value={1000}>Normal (1s)</MenuItem>
                  <MenuItem value={2000}>Slow (2s)</MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={onDisconnect}
                sx={{ mt: 2 }}
              >
                Disconnect Adapter
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Display Settings
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Temperature Unit</InputLabel>
                <Select
                  value={settings.temperatureUnit}
                  onChange={(e) => handleSettingChange('temperatureUnit', e.target.value)}
                  label="Temperature Unit"
                >
                  <MenuItem value="celsius">Celsius (C)</MenuItem>
                  <MenuItem value="fahrenheit">Fahrenheit (F)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Speed Unit</InputLabel>
                <Select
                  value={settings.speedUnit}
                  onChange={(e) => handleSettingChange('speedUnit', e.target.value)}
                  label="Speed Unit"
                >
                  <MenuItem value="kmh">Kilometers per hour (km/h)</MenuItem>
                  <MenuItem value="mph">Miles per hour (mph)</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.soundAlerts}
                    onChange={(e) => handleSettingChange('soundAlerts', e.target.checked)}
                  />
                }
                label="Sound alerts for warnings"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Logging
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.dataLogging}
                    onChange={(e) => handleSettingChange('dataLogging', e.target.checked)}
                  />
                }
                label="Enable data logging"
              />

              <Alert severity="info" sx={{ mt: 2 }}>
                Data logging saves diagnostic data to your device for later analysis.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>OBD2 Diagnostic Tool</strong>
              </Typography>
              <Typography variant="body2" paragraph>
                A free, open-source tool for basic OBD2 diagnostics using ELM327-compatible Bluetooth adapters.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Version 1.0.0
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Features:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Real-time vehicle data (PIDs)" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Read and clear diagnostic trouble codes" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Live data monitoring with graphs" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Custom command sending (advanced)" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

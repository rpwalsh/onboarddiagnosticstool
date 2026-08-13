/*
 * Copyright (c) 2026 Ryan P. Walsh. All rights reserved.
 * Proprietary commercial software published for public reference only.
 * No license is granted to use, copy, modify, distribute, or create derivative works.
 */

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Stack
} from '@mui/material';
import { Bluetooth as BluetoothIcon, DirectionsCar as CarIcon } from '@mui/icons-material';
import { getAllVehicleProfiles } from '../config/vehicleProfiles';

export default function ConnectionPanel({ onConnect, selectedVehicle, onVehicleChange }) {
  const [loading, setLoading] = useState(false);
  const vehicles = getAllVehicleProfiles();

  const handleConnect = async () => {
    setLoading(true);
    try {
      await onConnect();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
    sx={{
        display: 'flex',
  justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh'
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent>
     <Stack spacing={3}>
     <Box sx={{ textAlign: 'center' }}>
        <BluetoothIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
        Connect OBD2 Adapter
     </Typography>
       <Typography variant="body2" color="text.secondary">
    Connect your Veepeak Bluetooth OBD2 adapter to start diagnostics
         </Typography>
            </Box>

      <Alert severity="info">
  Make sure your OBD2 adapter is plugged into your vehicle's port and Bluetooth is enabled on your device.
            </Alert>

            <FormControl fullWidth>
              <InputLabel>Select Your Vehicle</InputLabel>
       <Select
    value={selectedVehicle || ''}
     onChange={(e) => onVehicleChange(e.target.value)}
           label="Select Your Vehicle"
   >
      {vehicles.map((vehicle) => (
           <MenuItem key={vehicle.id} value={vehicle.id}>
     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CarIcon fontSize="small" />
<Typography>
 {vehicle.year} {vehicle.make} {vehicle.model}
               </Typography>
             </Box>
       </MenuItem>
   ))}
              </Select>
  </FormControl>

       <Button
     variant="contained"
size="large"
fullWidth
        onClick={handleConnect}
       disabled={loading || !selectedVehicle}
  startIcon={<BluetoothIcon />}
            >
     {loading ? 'Connecting...' : 'Connect to OBD2 Adapter'}
            </Button>

 <Alert severity="warning" sx={{ mt: 2 }}>
   <Typography variant="caption">
      <strong>Note:</strong> Web Bluetooth requires Chrome, Edge, or Opera browser.
     HTTPS connection is required for Bluetooth access.
        </Typography>
          </Alert>
          </Stack>
        </CardContent>
    </Card>
    </Box>
  );
}

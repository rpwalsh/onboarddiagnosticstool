/*
 * Copyright (c) 2026 Ryan P. Walsh. All rights reserved.
 * Proprietary commercial software published for public reference only.
 * No license is granted to use, copy, modify, distribute, or create derivative works.
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import OBD2Service from '../services/OBD2Service';
import { getDTCInfo, getSeverityColor } from '../config/dtcDatabase';
import { lookupDTC } from '../config/vehicleProfiles';

export default function DTCView({ vehicleId }) {
  const [dtcs, setDtcs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [selectedDTC, setSelectedDTC] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
  readDTCs();
  }, []);

  const readDTCs = async () => {
    setLoading(true);
    try {
  const codes = await OBD2Service.readDTCs();
      
      // Enhance DTCs with database info
      const enhancedDTCs = codes.map(code => {
  const dbInfo = getDTCInfo(code);
      const vehicleSpecific = lookupDTC(code, vehicleId);
 
        return {
          code,
          description: vehicleSpecific || dbInfo.description,
          severity: dbInfo.severity,
          category: dbInfo.category,
  isVehicleSpecific: !!vehicleSpecific
      };
      });
      
      setDtcs(enhancedDTCs);
    } catch (error) {
      console.error('Error reading DTCs:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearDTCs = async () => {
    setClearing(true);
    try {
      await OBD2Service.clearDTCs();
      await readDTCs();
    } catch (error) {
      console.error('Error clearing DTCs:', error);
    } finally {
      setClearing(false);
    }
  };

  const handleDTCClick = (dtc) => {
    setSelectedDTC(dtc);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
<Typography variant="h4">
    Diagnostic Trouble Codes
      </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
  <Button
          variant="outlined"
            startIcon={<RefreshIcon />}
        onClick={readDTCs}
  disabled={loading}
  >
     Refresh
      </Button>
  <Button
     variant="contained"
      color="error"
        startIcon={<DeleteIcon />}
            onClick={clearDTCs}
     disabled={clearing || dtcs.length === 0}
      >
            Clear DTCs
          </Button>
        </Box>
      </Box>

      {loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <CircularProgress />
        </Box>
      ) : dtcs.length === 0 ? (
        <Alert severity="success" icon={<CheckCircleIcon />}>
          <Typography variant="h6">No Trouble Codes Found</Typography>
  <Typography variant="body2">
  Your vehicle's computer has not detected any issues. All systems are operating normally.
     </Typography>
     </Alert>
      ) : (
        <>
          <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
           Found {dtcs.length} diagnostic trouble code{dtcs.length !== 1 ? 's' : ''}. 
      Click on any code for more details and recommended actions.
        </Typography>
        </Alert>

          <Grid container spacing={2}>
   {dtcs.map((dtc) => (
 <Grid item xs={12} key={dtc.code}>
   <Card 
    sx={{ 
        cursor: 'pointer',
                '&:hover': { boxShadow: 6 },
            borderLeft: `4px solid ${getSeverityColor(dtc.severity)}`
                  }}
            onClick={() => handleDTCClick(dtc)}
     >
           <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
     <Box sx={{ flex: 1 }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
    <Typography variant="h5" component="div">
       {dtc.code}
    </Typography>
                   <Chip 
         label={dtc.severity.toUpperCase()} 
               size="small"
     sx={{ 
    backgroundColor: getSeverityColor(dtc.severity),
            color: 'white'
      }}
         />
 <Chip 
               label={dtc.category} 
      size="small"
  variant="outlined"
   />
   {dtc.isVehicleSpecific && (
 <Chip 
        label="Vehicle Specific" 
   size="small"
                   color="primary"
  />
         )}
      </Box>
  <Typography variant="body1" color="text.secondary">
         {dtc.description}
   </Typography>
              </Box>
            <WarningIcon sx={{ color: getSeverityColor(dtc.severity), fontSize: 40 }} />
      </Box>
  </CardContent>
         </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* DTC Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
  onClose={() => setDialogOpen(false)}
        maxWidth="md"
     fullWidth
      >
        {selectedDTC && (
    <>
         <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
  <Typography variant="h5">{selectedDTC.code}</Typography>
  <Chip 
         label={selectedDTC.severity.toUpperCase()} 
    sx={{ 
     backgroundColor: getSeverityColor(selectedDTC.severity),
                color: 'white'
         }}
   />
  </Box>
         </DialogTitle>
            <DialogContent>
              <Typography variant="h6" gutterBottom>
           {selectedDTC.description}
              </Typography>
      
              <Divider sx={{ my: 2 }} />
        
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Code Information
      </Typography>
    <List dense>
   <ListItem>
             <ListItemText 
 primary="Category" 
      secondary={selectedDTC.category}
  />
                </ListItem>
    <ListItem>
          <ListItemText 
         primary="Severity Level" 
              secondary={selectedDTC.severity.charAt(0).toUpperCase() + selectedDTC.severity.slice(1)}
       />
                </ListItem>
                <ListItem>
<ListItemText 
           primary="Type" 
           secondary={selectedDTC.code.startsWith('P') ? 'Powertrain' : 
              selectedDTC.code.startsWith('C') ? 'Chassis' :
            selectedDTC.code.startsWith('B') ? 'Body' :
    selectedDTC.code.startsWith('U') ? 'Network' : 'Unknown'}
      />
    </ListItem>
          </List>

       <Divider sx={{ my: 2 }} />

          <Paper sx={{ p: 2, backgroundColor: 'background.default' }}>
      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
       <InfoIcon fontSize="small" />
        Recommended Actions
             </Typography>
              <Typography variant="body2" paragraph>
                  {getSeverityAdvice(selectedDTC.severity)}
       </Typography>
       <Typography variant="body2">
        {getCategoryAdvice(selectedDTC.category)}
     </Typography>
          </Paper>

          {selectedDTC.isVehicleSpecific && (
       <Alert severity="info" sx={{ mt: 2 }}>
  This code description is specific to your vehicle make and model.
   </Alert>
   )}
     </DialogContent>
    <DialogActions>
           <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
   )}
      </Dialog>
    </Box>
  );
}

function getSeverityAdvice(severity) {
  switch (severity) {
    case 'high':
 return 'This is a serious issue that requires immediate attention. Continued driving may cause damage to your vehicle or be unsafe.';
    case 'medium':
   return 'This issue should be addressed soon. While not immediately dangerous, it may affect vehicle performance or fuel economy.';
    case 'low':
  return 'This is a minor issue that should be monitored. It may not affect immediate vehicle operation but should be checked during regular maintenance.';
    default:
      return 'Consult a qualified technician for proper diagnosis and repair.';
  }
}

function getCategoryAdvice(category) {
  const advice = {
    'Fuel/Air': 'Check air filter, MAF sensor, and fuel system components. May affect fuel economy.',
    'Ignition': 'Inspect spark plugs, ignition coils, and related wiring. Misfires can damage catalytic converter.',
    'Emissions': 'May require inspection of oxygen sensors, catalytic converter, or EVAP system.',
    'Sensors': 'Verify sensor connections and wiring. May need sensor replacement or recalibration.',
    'Transmission': 'Check transmission fluid level and condition. Consult transmission specialist if needed.',
    'Electrical': 'Inspect battery, alternator, and electrical connections.',
    'ECU': 'May require ECU reprogramming or replacement. Consult dealer or specialist.',
    'Safety': 'Critical safety system affected. Immediate professional inspection required.',
    'ABS': 'Anti-lock brake system issue. Have brakes inspected immediately.',
    'Network': 'Communication issue between vehicle modules. Professional diagnosis recommended.',
  };
  return advice[category] || 'Consult your vehicle service manual or a qualified technician for specific guidance.';
}

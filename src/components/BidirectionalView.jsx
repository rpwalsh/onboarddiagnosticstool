/*
 * Copyright (c) 2026 Sarah Walsh. All rights reserved.
 * Proprietary commercial software published for public reference only.
 * No license is granted to use, copy, modify, distribute, or create derivative works.
 */

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  TextField
} from '@mui/material';
import {
  Build as BuildIcon,
  Warning as WarningIcon,
  PlayArrow as PlayIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { getBidirectionalCommands } from '../config/vehicleProfiles';
import OBD2Service from '../services/OBD2Service';

export default function BidirectionalView({ vehicleId }) {
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [customCommand, setCustomCommand] = useState('');
  const [customResponse, setCustomResponse] = useState('');
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState(null);

  const commands = getBidirectionalCommands(vehicleId);

  // Group commands by category
  const groupedCommands = commands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
  acc[cmd.category].push(cmd);
    return acc;
  }, {});

  const handleCommandClick = (command) => {
    setSelectedCommand(command);
  if (command.confirmation) {
      setConfirmDialog(true);
    } else {
      executeCommand(command);
    }
  };

  const executeCommand = async (command) => {
    setExecuting(true);
    setConfirmDialog(false);
    
    try {
      const response = await OBD2Service.sendCustomCommand(command.command);
      setResult({
    success: true,
        message: `Successfully executed: ${command.name}`,
        response
      });
    } catch (error) {
  setResult({
        success: false,
      message: `Failed to execute command: ${error.message}`
      });
    } finally {
      setExecuting(false);
      setTimeout(() => setResult(null), 5000);
    }
  };

  const handleCustomCommand = async () => {
    if (!customCommand.trim()) return;

    setExecuting(true);
    try {
      const response = await OBD2Service.sendCustomCommand(customCommand);
      setCustomResponse(response);
    } catch (error) {
    setCustomResponse(`Error: ${error.message}`);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bidirectional Controls
   </Typography>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight="bold">
          ?? Warning: Advanced Features
        </Typography>
        <Typography variant="body2">
    Bidirectional commands directly control vehicle systems. Only use features you understand.
          Improper use may affect vehicle operation or void warranties.
        </Typography>
      </Alert>

      {result && (
     <Alert severity={result.success ? 'success' : 'error'} sx={{ mb: 3 }}>
     {result.message}
        </Alert>
      )}

      {!vehicleId ? (
        <Alert severity="info">
          Select your vehicle profile in Settings to see available bidirectional commands.
 </Alert>
      ) : commands.length === 0 ? (
        <Alert severity="info">
          No bidirectional commands available for your vehicle profile yet.
          Custom commands can be sent below.
 </Alert>
      ) : (
        <Grid container spacing={3}>
  {Object.entries(groupedCommands).map(([category, cmds]) => (
            <Grid item xs={12} key={category}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
     {category}
   </Typography>
            <Grid container spacing={2}>
      {cmds.map((command) => (
         <Grid item xs={12} sm={6} md={4} key={command.id}>
            <Card sx={{ height: '100%' }}>
        <CardContent>
   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <BuildIcon color="primary" />
           <Typography variant="h6" component="div">
       {command.name}
         </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary" paragraph>
     {command.description}
            </Typography>
        {command.warning && (
    <Alert severity="warning" sx={{ mb: 2 }}>
           <Typography variant="caption">
 {command.warning}
         </Typography>
        </Alert>
    )}
      <Button
  variant="contained"
      fullWidth
         startIcon={<PlayIcon />}
      onClick={() => handleCommandClick(command)}
       disabled={executing}
           >
            Execute
          </Button>
 </CardContent>
      </Card>
     </Grid>
        ))}
   </Grid>
       </Grid>
          ))}
        </Grid>
      )}

      {/* Custom Command Section */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
    <CodeIcon color="secondary" />
     <Typography variant="h6">
    Custom Command
       </Typography>
  </Box>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            Send custom OBD2 commands for advanced diagnostics and testing.
         Use standard OBD2 hex format (e.g., "010C" for Engine RPM).
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
         fullWidth
  label="Command (Hex)"
  value={customCommand}
   onChange={(e) => setCustomCommand(e.target.value.toUpperCase())}
     placeholder="010C"
       helperText="Enter OBD2 command in hexadecimal format"
              />
      </Grid>
            <Grid item xs={12} md={4}>
       <Button
          fullWidth
     variant="contained"
        color="secondary"
         onClick={handleCustomCommand}
          disabled={executing || !customCommand.trim()}
    sx={{ height: 56 }}
         >
      Send Command
    </Button>
            </Grid>
            {customResponse && (
              <Grid item xs={12}>
         <TextField
      fullWidth
     label="Response"
         value={customResponse}
                  multiline
         rows={4}
   InputProps={{
  readOnly: true,
            }}
                />
</Grid>
         )}
          </Grid>
        </CardContent>
      </Card>

      {/* Common Commands Reference */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
      <Typography variant="h6" gutterBottom>
            Common Command Reference
   </Typography>
  <List dense>
     <ListItem>
       <ListItemText 
  primary="Mode 01" 
     secondary="Show current data (PIDs)"
    />
       </ListItem>
            <ListItem>
              <ListItemText 
      primary="Mode 02" 
                secondary="Show freeze frame data"
    />
            </ListItem>
<ListItem>
              <ListItemText 
            primary="Mode 03" 
             secondary="Show stored DTCs"
 />
       </ListItem>
        <ListItem>
        <ListItemText 
        primary="Mode 04" 
      secondary="Clear DTCs and stored values"
              />
            </ListItem>
            <ListItem>
            <ListItemText 
   primary="Mode 09" 
            secondary="Request vehicle information (VIN, Calibration ID)"
              />
    </ListItem>
            <ListItem>
    <ListItemText 
            primary="Mode 22" 
     secondary="Manufacturer-specific data (custom PIDs)"
              />
        </ListItem>
       </List>
     </CardContent>
      </Card>

  {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
  {selectedCommand && (
   <>
      <DialogTitle>
     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon color="warning" />
                Confirm Action
          </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="h6" gutterBottom>
{selectedCommand.name}
  </Typography>
    <Typography variant="body2" paragraph>
            {selectedCommand.description}
      </Typography>
{selectedCommand.warning && (
      <Alert severity="warning" sx={{ mb: 2 }}>
   {selectedCommand.warning}
           </Alert>
              )}
              <Alert severity="info">
           This command will send: <code>{selectedCommand.command}</code>
  </Alert>
    <Typography variant="body2" sx={{ mt: 2 }}>
    Are you sure you want to execute this command?
</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDialog(false)}>
                Cancel
              </Button>
    <Button 
       onClick={() => executeCommand(selectedCommand)} 
   variant="contained"
      color="primary"
    >
   Confirm & Execute
    </Button>
            </DialogActions>
       </>
      )}
      </Dialog>
    </Box>
  );
}

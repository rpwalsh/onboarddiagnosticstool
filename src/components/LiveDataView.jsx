/*
 * Copyright (c) 2026 Ryan P. Walsh. All rights reserved.
 * Proprietary commercial software published for public reference only.
 * No license is granted to use, copy, modify, distribute, or create derivative works.
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Paper,
  Chip
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import OBD2Service from '../services/OBD2Service';
import { LIVE_DATA_PIDS } from '../config/pidDefinitions';
import { getCustomPIDs } from '../config/vehicleProfiles';

const MAX_DATA_POINTS = 30;

export default function LiveDataView({ vehicleId }) {
  const [selectedPIDs, setSelectedPIDs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currentValues, setCurrentValues] = useState({});
  const [availablePIDs, setAvailablePIDs] = useState([]);

  useEffect(() => {
    // Combine standard and custom PIDs
    const customPIDs = getCustomPIDs(vehicleId);
    const allPIDs = [...LIVE_DATA_PIDS, ...customPIDs];
    setAvailablePIDs(allPIDs);

  // Auto-select some common PIDs
    const defaultPIDs = allPIDs.filter(pid => 
      ['Engine RPM', 'Vehicle Speed', 'Coolant Temperature', 'Throttle Position'].includes(pid.name)
    );
    setSelectedPIDs(defaultPIDs);
  }, [vehicleId]);

  useEffect(() => {
    if (selectedPIDs.length === 0) return;

    let interval = OBD2Service.startMonitoring(selectedPIDs, (data) => {
      const timestamp = new Date().toLocaleTimeString();
      const processed = { timestamp };
      const current = {};

      selectedPIDs.forEach(pid => {
        const rawValue = data[pid.name];
        if (rawValue && pid.formula) {
          const value = pid.formula(rawValue);
          processed[pid.name] = value;
          current[pid.name] = { value, unit: pid.unit };
        }
      });

      setCurrentValues(current);
      setChartData(prev => {
        const newData = [...prev, processed];
        return newData.slice(-MAX_DATA_POINTS);
    });
    }, 500);

    return () => {
if (interval) {
 OBD2Service.stopMonitoring(interval);
    }
    };
}, [selectedPIDs]);

  const handlePIDSelection = (event) => {
 const value = event.target.value;
    const selected = availablePIDs.filter(pid => value.includes(pid.name));
    setSelectedPIDs(selected);
    setChartData([]); // Reset chart data
  };

  const colors = ['#2196f3', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4'];

  return (
  <Box>
      <Typography variant="h4" gutterBottom>
    Live Data Stream
      </Typography>

      <Grid container spacing={3}>
        {/* PID Selector */}
        <Grid item xs={12}>
    <Card>
     <CardContent>
           <FormControl fullWidth>
 <InputLabel>Select Parameters to Monitor</InputLabel>
      <Select
    multiple
              value={selectedPIDs.map(pid => pid.name)}
          onChange={handlePIDSelection}
      renderValue={(selected) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selected.map((value) => (
       <Chip key={value} label={value} size="small" />
        ))}
     </Box>
       )}
  label="Select Parameters to Monitor"
                >
       {availablePIDs.map((pid) => (
  <MenuItem key={pid.name} value={pid.name}>
        <Checkbox checked={selectedPIDs.some(p => p.name === pid.name)} />
     <ListItemText 
              primary={pid.name} 
  secondary={`${pid.description} (${pid.unit})`} 
          />
                    </MenuItem>
     ))}
     </Select>
  </FormControl>
            </CardContent>
          </Card>
  </Grid>

        {/* Current Values */}
        {selectedPIDs.map((pid) => (
    <Grid item xs={12} sm={6} md={3} key={pid.name}>
     <Card>
     <CardContent>
       <Typography variant="subtitle2" color="text.secondary" gutterBottom>
  {pid.name}
         </Typography>
     <Typography variant="h4" component="div">
      {currentValues[pid.name]?.value !== undefined
    ? typeof currentValues[pid.name].value === 'number'
    ? currentValues[pid.name].value.toFixed(1)
     : currentValues[pid.name].value
 : '--'}
  </Typography>
     <Typography variant="body2" color="text.secondary">
       {pid.unit}
                </Typography>
  </CardContent>
          </Card>
          </Grid>
        ))}

        {/* Chart */}
 <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
       <Typography variant="h6" gutterBottom>
    Real-Time Graph
        </Typography>
            <ResponsiveContainer width="100%" height={400}>
    <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" />
  <XAxis 
                dataKey="timestamp" 
            tick={{ fontSize: 12 }}
   interval="preserveStartEnd"
          />
    <YAxis tick={{ fontSize: 12 }} />
         <Tooltip 
       contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
     />
      <Legend />
     {selectedPIDs.map((pid, index) => (
    <Line
key={pid.name}
type="monotone"
     dataKey={pid.name}
            stroke={colors[index % colors.length]}
  strokeWidth={2}
  dot={false}
               name={`${pid.name} (${pid.unit})`}
         />
    ))}
      </LineChart>
   </ResponsiveContainer>
          </Paper>
        </Grid>

     {/* Data Table */}
  <Grid item xs={12}>
    <Card>
        <CardContent>
              <Typography variant="h6" gutterBottom>
                Parameter Details
              </Typography>
   <Grid container spacing={2}>
  {selectedPIDs.map((pid) => (
         <Grid item xs={12} sm={6} key={pid.name}>
         <Box sx={{ 
  display: 'flex', 
        justifyContent: 'space-between',
      p: 1,
          borderBottom: '1px solid #333'
        }}>
 <Box>
       <Typography variant="body2" fontWeight="bold">
     {pid.name}
         </Typography>
            <Typography variant="caption" color="text.secondary">
   {pid.description}
               </Typography>
             </Box>
                <Typography variant="body1" color="primary">
     {currentValues[pid.name]?.value !== undefined
          ? `${typeof currentValues[pid.name].value === 'number' 
        ? currentValues[pid.name].value.toFixed(2) 
            : currentValues[pid.name].value} ${pid.unit}`
    : 'N/A'}
       </Typography>
       </Box>
           </Grid>
           ))}
       </Grid>
  </CardContent>
       </Card>
    </Grid>
  </Grid>
    </Box>
  );
}

/*
 * Copyright (c) 2026 Ryan Walsh. All rights reserved.
 * Proprietary commercial software published for public reference only.
 * No license is granted to use, copy, modify, distribute, or create derivative works.
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Thermostat as ThermostatIcon,
  LocalGasStation as FuelIcon,
  Engineering as EngineIcon
} from '@mui/icons-material';
import OBD2Service from '../services/OBD2Service';
import { DASHBOARD_PIDS } from '../config/pidDefinitions';
import { getCustomPIDs } from '../config/vehicleProfiles';

function GaugeCard({ title, value, unit, icon, min = 0, max = 100, color = 'primary.main' }) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', my: 2 }}>
          <Typography variant="h3" sx={{ color }}>
            {value !== null && value !== undefined ? Math.round(value) : '--'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {unit}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={Math.min(Math.max(percentage, 0), 100)}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </CardContent>
    </Card>
  );
}

export default function DashboardView({ vehicleId }) {
  const [liveData, setLiveData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;

    const customPIDs = getCustomPIDs(vehicleId);
    const allPIDs = [...DASHBOARD_PIDS, ...customPIDs];

    interval = OBD2Service.startMonitoring(
      allPIDs,
      (data) => {
        const processed = {};

        allPIDs.forEach((pid) => {
          const rawValue = data[pid.name];
          if (rawValue && pid.formula) {
            processed[pid.name] = {
              value: pid.formula(rawValue),
              unit: pid.unit
            };
          }
        });

        setLiveData(processed);
        setLoading(false);
      },
      1000
    );

    return () => {
      if (interval) OBD2Service.stopMonitoring(interval);
    };
  }, [vehicleId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const getColorForTemp = (temp) => {
    if (temp < 80) return 'info.main';
    if (temp < 100) return 'success.main';
    if (temp < 110) return 'warning.main';
    return 'error.main';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <GaugeCard
            title="Engine RPM"
            value={liveData['Engine RPM']?.value}
            unit="RPM"
            icon={<EngineIcon color="primary" />}
            min={0}
            max={7000}
            color="primary.main"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <GaugeCard
            title="Speed"
            value={liveData['Vehicle Speed']?.value}
            unit="km/h"
            icon={<SpeedIcon color="secondary" />}
            min={0}
            max={200}
            color="secondary.main"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <GaugeCard
            title="Coolant Temp"
            value={liveData['Coolant Temperature']?.value}
            unit="C"
            icon={
              <ThermostatIcon
                sx={{ color: getColorForTemp(liveData['Coolant Temperature']?.value || 0) }}
              />
            }
            min={0}
            max={120}
            color={getColorForTemp(liveData['Coolant Temperature']?.value || 0)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <GaugeCard
            title="Fuel Level"
            value={liveData['Fuel Level']?.value}
            unit="%"
            icon={<FuelIcon color="warning" />}
            min={0}
            max={100}
            color="warning.main"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Engine Load
              </Typography>
              <Typography variant="h4" color="primary">
                {liveData['Engine Load']?.value !== undefined ? Math.round(liveData['Engine Load'].value) : '--'}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={liveData['Engine Load']?.value || 0}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Throttle Position
              </Typography>
              <Typography variant="h4" color="secondary">
                {liveData['Throttle Position']?.value !== undefined
                  ? Math.round(liveData['Throttle Position'].value)
                  : '--'}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={liveData['Throttle Position']?.value || 0}
                color="secondary"
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Intake Air Temp
              </Typography>
              <Typography variant="h4" color="info.main">
                {liveData['Intake Air Temperature']?.value !== undefined
                  ? Math.round(liveData['Intake Air Temperature'].value)
                  : '--'}
                C
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                MAF Air Flow Rate
              </Typography>
              <Typography variant="h4">
                {liveData['MAF Air Flow Rate']?.value !== undefined
                  ? liveData['MAF Air Flow Rate'].value.toFixed(2)
                  : '--'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                g/s
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {vehicleId &&
          Object.entries(liveData)
            .filter(([key]) => !DASHBOARD_PIDS.find(p => p.name === key))
            .map(([key, data]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {key}
                    </Typography>
                    <Typography variant="h4">
                      {typeof data.value === 'number' ? data.value.toFixed(1) : data.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data.unit}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>
    </Box>
  );
}

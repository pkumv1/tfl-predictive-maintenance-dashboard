import React, { useState, useEffect, useMemo, useCallback, memo, Suspense, lazy } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, AreaChart, Area, ComposedChart, ReferenceLine, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap } from 'recharts';
import { AlertTriangle, Activity, MapPin, TrendingUp, Clock, Zap, Thermometer, Download, Target, Layers, BarChart3, Brain, Shield, Radio, Wifi, Server, Globe, Network, Timer, RefreshCw, GitBranch, Share2, Calendar, Gauge, Cpu, Database, TrendingDown, Award, Crosshair, Bell, Users, Settings, AlertCircle, CheckCircle, XCircle, Wrench, Map, Battery, Signal, Monitor, Maximize2, Info, FileText, Lightbulb, Clipboard } from 'lucide-react';

// Constants
const COLORS = {
  fault: {
    'Infant Mortality': '#dc2626',
    'Wear-out': '#ea580c',
    'Early-life': '#eab308',
    'Protective': '#22c55e',
    'Normal Operation': '#3b82f6'
  },
  significance: {
    'Critical': '#dc2626',
    'High': '#ea580c',
    'Medium': '#eab308',
    'Protective': '#22c55e'
  },
  category: {
    'Operational': '#dc2626',
    'Performance': '#ea580c',
    'Hardware': '#3b82f6',
    'Service': '#22c55e',
    'Configuration': '#8b5cf6',
    'Payment': '#f97316',
    'Environmental': '#06b6d4'
  },
  cluster: {
    'High-Volume': '#dc2626',
    'Critical': '#ea580c',
    'Stable': '#22c55e',
    'Efficient': '#3b82f6',
    'Moderate': '#8b5cf6'
  },
  model: {
    'Logistic Regression': '#ef4444',
    'Random Forest': '#22c55e',
    'XGBoost': '#3b82f6',
    'CatBoost': '#8b5cf6',
    'KNN': '#f97316',
    'ANN': '#06b6d4'
  }
};

// Tab configuration
const TABS = [
  { id: 'overview', label: 'System Overview', icon: BarChart3 },
  { id: 'realtime', label: 'Real-time Monitor', icon: Radio },
  { id: 'ml-analytics', label: 'ML Analytics', icon: Brain },
  { id: 'survival', label: 'Survival Analysis', icon: Activity },
  { id: 'hazard', label: 'Hazard Models', icon: Target },
  { id: 'rul', label: 'RUL Prediction', icon: Timer },
  { id: 'fault-patterns', label: 'Fault Patterns', icon: Thermometer },
  { id: 'clustering', label: 'Device Clustering', icon: Globe },
  { id: 'association', label: 'Association Rules', icon: Network },
  { id: 'reliability', label: 'Reliability Metrics', icon: Shield },
  { id: 'recommendations', label: 'Recommendations', icon: TrendingUp }
];

// Mock data - Compressed and optimized
const DATA = {
  stations: [
    { id: 'TOC1444', name: 'EUSTON', devices: 28, critical: 3, high: 5, medium: 12, low: 8, riskScore: 0.65, mtbf: 512.3, cluster: 'High-Volume', passengerFlow: 45000, energyUsage: 89.2, networkHealth: 78, availability: 94.2, mttr: 45 },
    { id: 'NLR1409', name: 'GOSPEL OAK', devices: 26, critical: 2, high: 4, medium: 10, low: 10, riskScore: 0.42, mtbf: 687.5, cluster: 'Stable', passengerFlow: 12000, energyUsage: 67.8, networkHealth: 92, availability: 98.1, mttr: 32 },
    { id: '0728', name: 'TOTTENHAM COURT ROAD', devices: 32, critical: 4, high: 6, medium: 15, low: 7, riskScore: 0.78, mtbf: 398.2, cluster: 'Critical', passengerFlow: 52000, energyUsage: 95.4, networkHealth: 65, availability: 91.5, mttr: 67 },
    { id: '0534', name: 'CALEDONIAN ROAD', devices: 24, critical: 1, high: 3, medium: 9, low: 11, riskScore: 0.28, mtbf: 892.7, cluster: 'Efficient', passengerFlow: 8500, energyUsage: 45.2, networkHealth: 95, availability: 99.2, mttr: 18 },
    { id: 'TOC5112', name: 'BLACKFRIARS', devices: 29, critical: 3, high: 5, medium: 13, low: 8, riskScore: 0.55, mtbf: 578.9, cluster: 'Moderate', passengerFlow: 28000, energyUsage: 72.1, networkHealth: 85, availability: 96.8, mttr: 38 },
    { id: 'TOC2156', name: 'KINGS CROSS ST PANCRAS', devices: 27, critical: 2, high: 4, medium: 11, low: 10, riskScore: 0.48, mtbf: 723.8, cluster: 'Stable', passengerFlow: 48000, energyUsage: 87.3, networkHealth: 88, availability: 96.5, mttr: 35 },
    { id: 'TOC3401', name: 'PADDINGTON', devices: 30, critical: 3, high: 6, medium: 12, low: 9, riskScore: 0.62, mtbf: 545.7, cluster: 'High-Volume', passengerFlow: 46500, energyUsage: 91.8, networkHealth: 82, availability: 95.1, mttr: 42 },
    { id: 'TOC4782', name: 'VICTORIA', devices: 25, critical: 2, high: 3, medium: 10, low: 10, riskScore: 0.38, mtbf: 812.4, cluster: 'Stable', passengerFlow: 41000, energyUsage: 78.5, networkHealth: 90, availability: 97.3, mttr: 28 },
    { id: 'TOC5923', name: 'WATERLOO', devices: 31, critical: 4, high: 7, medium: 13, low: 7, riskScore: 0.72, mtbf: 458.3, cluster: 'Critical', passengerFlow: 55000, energyUsage: 98.2, networkHealth: 68, availability: 92.8, mttr: 58 },
    { id: 'TOC6754', name: 'LONDON BRIDGE', devices: 24, critical: 1, high: 3, medium: 8, low: 12, riskScore: 0.32, mtbf: 885.9, cluster: 'Efficient', passengerFlow: 38000, energyUsage: 72.9, networkHealth: 93, availability: 98.7, mttr: 22 },
    { id: 'TOC7845', name: 'LIVERPOOL STREET', devices: 26, critical: 2, high: 4, medium: 11, low: 9, riskScore: 0.45, mtbf: 667.2, cluster: 'Moderate', passengerFlow: 42500, energyUsage: 83.7, networkHealth: 86, availability: 96.9, mttr: 31 }
  ],
  realTimeMetrics: [
    { timestamp: '10:00', activeDevices: 137, faults: 12, networkUtilization: 78, powerConsumption: 342, criticalRulDevices: 2, avgRulHours: 204.5 },
    { timestamp: '10:15', activeDevices: 137, faults: 15, networkUtilization: 82, powerConsumption: 356, criticalRulDevices: 3, avgRulHours: 198.2 },
    { timestamp: '10:30', activeDevices: 136, faults: 18, networkUtilization: 85, powerConsumption: 378, criticalRulDevices: 4, avgRulHours: 187.8 },
    { timestamp: '10:45', activeDevices: 135, faults: 21, networkUtilization: 88, powerConsumption: 395, criticalRulDevices: 5, avgRulHours: 175.3 },
    { timestamp: '11:00', activeDevices: 134, faults: 19, networkUtilization: 84, powerConsumption: 387, criticalRulDevices: 4, avgRulHours: 182.6 },
    { timestamp: '11:15', activeDevices: 135, faults: 16, networkUtilization: 81, powerConsumption: 369, criticalRulDevices: 3, avgRulHours: 195.7 },
    { timestamp: '11:30', activeDevices: 136, faults: 14, networkUtilization: 79, powerConsumption: 358, criticalRulDevices: 2, avgRulHours: 208.4 }
  ],
  rulPredictions: [
    { deviceId: '7758', faultCode: 111, rulDays: 12.2, priority: 'Critical', lastFailure: '2024-06-23', expectedRulMinutes: 17561.69, occurrences: 4260, rollingAvgTBF: 294.38, confidence: 0.85, lowerCI: 10.1, upperCI: 14.8, failureTimeframe: 'This Week' },
    { deviceId: '7952', faultCode: 111, rulDays: 14.8, priority: 'Critical', lastFailure: '2024-06-23', expectedRulMinutes: 38670.86, occurrences: 5738, rollingAvgTBF: 212.75, confidence: 0.88, lowerCI: 12.5, upperCI: 17.6, failureTimeframe: 'Next 2 Weeks' },
    { deviceId: '18625', faultCode: 111, rulDays: 16.3, priority: 'Critical', lastFailure: '2024-06-23', expectedRulMinutes: 40699.78, occurrences: 4307, rollingAvgTBF: 166.82, confidence: 0.82, lowerCI: 13.8, upperCI: 19.2, failureTimeframe: 'Next 2 Weeks' },
    { deviceId: '18913', faultCode: 111, rulDays: 18.9, priority: 'High', lastFailure: '2024-06-23', expectedRulMinutes: 126894.36, occurrences: 3167, rollingAvgTBF: 188.57, confidence: 0.90, lowerCI: 16.7, upperCI: 21.8, failureTimeframe: 'Next 3 Weeks' },
    { deviceId: '19060', faultCode: 111, rulDays: 8.5, priority: 'Critical', lastFailure: '2024-06-23', expectedRulMinutes: 12254.30, occurrences: 23138, rollingAvgTBF: 24.71, confidence: 0.92, lowerCI: 7.2, upperCI: 10.1, failureTimeframe: 'Next 7 Days' },
    { deviceId: '8912', faultCode: 37, rulDays: 25.6, priority: 'Medium', lastFailure: '2024-06-20', expectedRulMinutes: 36874.56, occurrences: 2156, rollingAvgTBF: 342.18, confidence: 0.78, lowerCI: 22.1, upperCI: 29.3, failureTimeframe: 'Next Month' },
    { deviceId: '9345', faultCode: 40, rulDays: 42.3, priority: 'Low', lastFailure: '2024-06-18', expectedRulMinutes: 60912.45, occurrences: 1523, rollingAvgTBF: 425.67, confidence: 0.85, lowerCI: 38.7, upperCI: 46.8, failureTimeframe: 'Next 6 Weeks' }
  ],
  mlModelResults: [
    { model: 'Logistic Regression', accuracy: 0.937, rocAuc: 0.9849, precision: 0.94, recall: 0.94, f1Score: 0.94 },
    { model: 'Random Forest', accuracy: 0.977, rocAuc: 0.9948, precision: 0.98, recall: 0.98, f1Score: 0.98 },
    { model: 'XGBoost', accuracy: 0.987, rocAuc: 0.9976, precision: 0.99, recall: 0.99, f1Score: 0.99 },
    { model: 'CatBoost', accuracy: 0.987, rocAuc: 0.9975, precision: 0.99, recall: 0.99, f1Score: 0.99 },
    { model: 'KNN', accuracy: 0.952, rocAuc: 0.9789, precision: 0.95, recall: 0.95, f1Score: 0.95 },
    { model: 'ANN', accuracy: 0.973, rocAuc: 0.9891, precision: 0.97, recall: 0.97, f1Score: 0.97 }
  ],
  reliabilityTrends: [
    { month: 'Jan', mtbf: 545.2, mttr: 42, availability: 94.8, totalFailures: 87, deviceHours: 47508 },
    { month: 'Feb', mtbf: 567.8, mttr: 39, availability: 95.2, totalFailures: 82, deviceHours: 46559 },
    { month: 'Mar', mtbf: 523.6, mttr: 45, availability: 94.1, totalFailures: 92, deviceHours: 48171 },
    { month: 'Apr', mtbf: 589.4, mttr: 36, availability: 95.8, totalFailures: 78, deviceHours: 46013 },
    { month: 'May', mtbf: 612.8, mttr: 34, availability: 96.2, totalFailures: 74, deviceHours: 45347 },
    { month: 'Jun', mtbf: 598.3, mttr: 38, availability: 95.9, totalFailures: 79, deviceHours: 47286 }
  ],
  featureImportance: {
    xgboost: [
      { feature: 'ResetsSinceEOD', importance: 0.338688, category: 'Operational', rank: 1 },
      { feature: 'ResetDuration', importance: 0.197823, category: 'Performance', rank: 2 },
      { feature: 'HostType_1', importance: 0.171703, category: 'Hardware', rank: 3 },
      { feature: 'ReasonForResetNULL', importance: 0.072278, category: 'Operational', rank: 4 },
      { feature: 'Max_TodayInServiceDuration', importance: 0.035754, category: 'Service', rank: 5 },
      { feature: 'OperatingMode_4', importance: 0.020753, category: 'Configuration', rank: 6 },
      { feature: 'Max_TodayOutOfServiceDuration', importance: 0.014863, category: 'Service', rank: 7 },
      { feature: 'EMVProcessedSinceLastOSR', importance: 0.014694, category: 'Payment', rank: 8 },
      { feature: 'MinutesCardAcceptingToday', importance: 0.008348, category: 'Service', rank: 9 },
      { feature: 'Temperature_2m_max', importance: 0.007951, category: 'Environmental', rank: 10 }
    ],
    catboost: [
      { feature: 'ResetsSinceEOD', importance: 21.151630, category: 'Operational', rank: 1 },
      { feature: 'ResetDuration', importance: 13.341538, category: 'Performance', rank: 2 },
      { feature: 'ReasonForResetNULL', importance: 11.959860, category: 'Operational', rank: 3 },
      { feature: 'HostType_1', importance: 9.279066, category: 'Hardware', rank: 4 },
      { feature: 'Max_TodayInServiceDuration', importance: 6.471201, category: 'Service', rank: 5 },
      { feature: 'Temperature_2m_max', importance: 5.960753, category: 'Environmental', rank: 6 },
      { feature: 'Max_TodayInServiceNIVDuration', importance: 2.976163, category: 'Service', rank: 7 },
      { feature: 'EMVProcessedSinceLastOSR', importance: 2.608465, category: 'Payment', rank: 8 },
      { feature: 'Pressure_msl_max', importance: 2.485037, category: 'Environmental', rank: 9 },
      { feature: 'HostType_2', importance: 2.332514, category: 'Hardware', rank: 10 }
    ]
  },
  faultPatterns: [
    { hour: 0, fc111: 5, fc37: 2, fc40: 1, fc118: 3, total: 11 },
    { hour: 4, fc111: 8, fc37: 3, fc40: 2, fc118: 4, total: 17 },
    { hour: 8, fc111: 15, fc37: 7, fc40: 5, fc118: 8, total: 35 },
    { hour: 12, fc111: 22, fc37: 12, fc40: 8, fc118: 15, total: 57 },
    { hour: 16, fc111: 18, fc37: 9, fc40: 6, fc118: 12, total: 45 },
    { hour: 20, fc111: 12, fc37: 5, fc40: 3, fc118: 7, total: 27 }
  ],
  clusterAnalysis: [
    { cluster: 'High-Volume', stations: 2, avgDevices: 29, avgPassengers: 45750, avgMTBF: 529, avgRisk: 0.635, characteristics: 'Heavy traffic, frequent faults, high maintenance' },
    { cluster: 'Critical', stations: 2, avgDevices: 31.5, avgPassengers: 53500, avgMTBF: 428, avgRisk: 0.75, characteristics: 'Highest risk, immediate attention needed' },
    { cluster: 'Stable', stations: 3, avgDevices: 26, avgPassengers: 33667, avgMTBF: 741, avgRisk: 0.426, characteristics: 'Consistent performance, low maintenance' },
    { cluster: 'Efficient', stations: 2, avgDevices: 24, avgPassengers: 23250, avgMTBF: 889, avgRisk: 0.30, characteristics: 'Optimal performance, minimal interventions' },
    { cluster: 'Moderate', stations: 2, avgDevices: 27.5, avgPassengers: 35250, avgMTBF: 623, avgRisk: 0.50, characteristics: 'Balanced load, moderate maintenance' }
  ],
  associationRules: [
    { antecedent: 'FC_111', consequent: 'FC_37', support: 0.45, confidence: 0.78, lift: 2.34, conviction: 3.12 },
    { antecedent: 'FC_118', consequent: 'FC_40', support: 0.32, confidence: 0.65, lift: 1.87, conviction: 2.45 },
    { antecedent: 'FC_37 + FC_40', consequent: 'FC_111', support: 0.28, confidence: 0.72, lift: 2.15, conviction: 2.89 },
    { antecedent: 'FC_19', consequent: 'FC_27', support: 0.23, confidence: 0.58, lift: 1.65, conviction: 1.98 },
    { antecedent: 'FC_15', consequent: 'FC_111', support: 0.19, confidence: 0.52, lift: 1.45, conviction: 1.76 }
  ],
  recommendations: [
    { id: 1, type: 'Critical', title: 'Immediate Maintenance Required', description: 'Device 19060 predicted to fail within 8.5 days (FC_111)', priority: 'High', eta: '2 hours', impact: 'Service disruption prevention' },
    { id: 2, type: 'Critical', title: 'High Risk Device Alert', description: 'Device 7758 showing 12.2 days RUL with 85% confidence', priority: 'High', eta: '1 day', impact: 'Preventive intervention' },
    { id: 3, type: 'Preventive', title: 'Scheduled Inspection Due', description: 'EUSTON station devices approaching maintenance window', priority: 'Medium', eta: '1 week', impact: 'MTBF improvement' },
    { id: 4, type: 'Optimization', title: 'Energy Efficiency Opportunity', description: 'GOSPEL OAK showing potential for 15% energy reduction', priority: 'Low', eta: '2 weeks', impact: 'Cost savings' }
  ],
  coxRegressionResults: [
    { faultCode: 'FC_111', coef: 3.51, expCoef: 33.56, seCoef: 0.01, coefLower: 3.49, coefUpper: 3.54, expCoefLower: 32.73, expCoefUpper: 34.40, zValue: 276.81, pValue: 0.001, significance: 'Critical' },
    { faultCode: 'FC_118', coef: 1.23, expCoef: 3.44, seCoef: 0.02, coefLower: 1.20, coefUpper: 1.26, expCoefLower: 3.33, expCoefUpper: 3.54, zValue: 78.42, pValue: 0.001, significance: 'High' },
    { faultCode: 'FC_38', coef: 2.17, expCoef: 8.74, seCoef: 0.09, coefLower: 1.99, coefUpper: 2.35, expCoefLower: 7.32, expCoefUpper: 10.44, zValue: 23.97, pValue: 0.001, significance: 'High' },
    { faultCode: 'FC_19', coef: 1.36, expCoef: 3.91, seCoef: 0.33, coefLower: 0.71, coefUpper: 2.02, expCoefLower: 2.03, expCoefUpper: 7.52, zValue: 4.09, pValue: 0.001, significance: 'Medium' },
    { faultCode: 'FC_40', coef: 0.65, expCoef: 1.91, seCoef: 0.01, coefLower: 0.62, coefUpper: 0.67, expCoefLower: 1.86, expCoefUpper: 1.96, zValue: 51.26, pValue: 0.001, significance: 'Medium' },
    { faultCode: 'FC_37', coef: 1.13, expCoef: 3.09, seCoef: 0.01, coefLower: 1.10, coefUpper: 1.15, expCoefLower: 3.02, expCoefUpper: 3.16, zValue: 91.65, pValue: 0.001, significance: 'High' },
    { faultCode: 'FC_27', coef: -0.92, expCoef: 0.40, seCoef: 0.03, coefLower: -0.97, coefUpper: -0.87, expCoefLower: 0.38, expCoefUpper: 0.42, zValue: -36.78, pValue: 0.001, significance: 'Protective' },
    { faultCode: 'FC_15', coef: -1.44, expCoef: 0.24, seCoef: 0.09, coefLower: -1.61, coefUpper: -1.27, expCoefLower: 0.20, expCoefUpper: 0.28, zValue: -16.62, pValue: 0.001, significance: 'Protective' }
  ],
  weibullAnalysis: [
    { faultCode: 111, shape: 0.64, scale: 47.80, medianLifetime: 26.88, failures: 272206, failureType: 'Infant Mortality', r2: 0.94 },
    { faultCode: 37, shape: 0.69, scale: 1574.73, medianLifetime: 926.55, failures: 86504, failureType: 'Infant Mortality', r2: 0.91 },
    { faultCode: 40, shape: 1.06, scale: 3572.95, medianLifetime: 2525.43, failures: 51600, failureType: 'Wear-out', r2: 0.89 },
    { faultCode: 10, shape: 0.68, scale: 8592.28, medianLifetime: 5027.90, failures: 13078, failureType: 'Infant Mortality', r2: 0.87 },
    { faultCode: 118, shape: 0.63, scale: 1386.47, medianLifetime: 772.45, failures: 9319, failureType: 'Early-life', r2: 0.93 },
    { faultCode: 3, shape: 0.63, scale: 8015.00, medianLifetime: 4494.17, failures: 7543, failureType: 'Infant Mortality', r2: 0.85 },
    { faultCode: 5, shape: 0.63, scale: 8054.72, medianLifetime: 4519.97, failures: 7535, failureType: 'Infant Mortality', r2: 0.86 },
    { faultCode: 8, shape: 0.69, scale: 11154.99, medianLifetime: 6570.94, failures: 5738, failureType: 'Infant Mortality', r2: 0.88 }
  ],
  survivalCurves: [
    { time: 0, fc111: 1.0, fc37: 1.0, fc40: 1.0, fc118: 1.0, fc10: 1.0, baseline: 1.0 },
    { time: 50, fc111: 0.65, fc37: 0.95, fc40: 0.98, fc118: 0.88, fc10: 0.92, baseline: 0.85 },
    { time: 100, fc111: 0.45, fc37: 0.88, fc40: 0.96, fc118: 0.75, fc10: 0.85, baseline: 0.72 },
    { time: 300, fc111: 0.25, fc37: 0.75, fc40: 0.92, fc118: 0.52, fc10: 0.75, baseline: 0.58 },
    { time: 600, fc111: 0.15, fc37: 0.65, fc40: 0.88, fc118: 0.35, fc10: 0.65, baseline: 0.45 },
    { time: 1200, fc111: 0.08, fc37: 0.45, fc40: 0.82, fc118: 0.25, fc10: 0.55, baseline: 0.32 },
    { time: 2400, fc111: 0.03, fc37: 0.25, fc40: 0.75, fc118: 0.15, fc10: 0.45, baseline: 0.22 },
    { time: 4800, fc111: 0.01, fc37: 0.12, fc40: 0.65, fc118: 0.08, fc10: 0.35, baseline: 0.15 }
  ],
  baselineHazard: [
    { time: 0, hazard: 0.001, smoothed: 0.001 },
    { time: 100, hazard: 0.012, smoothed: 0.010 },
    { time: 500, hazard: 0.008, smoothed: 0.009 },
    { time: 1000, hazard: 0.006, smoothed: 0.007 },
    { time: 2000, hazard: 0.004, smoothed: 0.005 },
    { time: 3000, hazard: 0.007, smoothed: 0.006 },
    { time: 4000, hazard: 0.012, smoothed: 0.010 },
    { time: 5000, hazard: 0.018, smoothed: 0.015 }
  ],
  causationInsights: [
    { category: 'Temporal vs Static', insight: 'Temporal metrics (ResetsSinceEOD, ResetDuration) show higher predictive power than static configuration features', impact: 'High' },
    { category: 'Error Types', insight: 'Activation errors are more predictive than invalid transactions, suggesting fundamental system issues', impact: 'High' },
    { category: 'Entry vs Exit', insight: 'Entry-related metrics rank higher than exit-related ones, indicating cascade effects', impact: 'Medium' },
    { category: 'Processing Time', insight: 'Worst-case processing times are more predictive than averages', impact: 'Medium' },
    { category: 'Environmental', insight: 'Temperature extremes stress systems, suggesting non-linear relationships', impact: 'Medium' },
    { category: 'EMV Sensitivity', insight: 'EMV processing metrics rank higher than Oyster/ITSO, indicating higher sensitivity', impact: 'Low' }
  ]
};

// Utility functions
const formatNumber = n => n?.toLocaleString() || '0';
const formatPercent = n => `${((n || 0) * 100).toFixed(1)}%`;
const getColor = (type, key) => COLORS[type]?.[key] || '#6b7280';

// Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-red-200 max-w-md text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-600 mb-2">Dashboard Error</h2>
            <p className="text-slate-600 mb-4">An error occurred. Please refresh the page.</p>
            <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading Component
const Loading = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Chart Wrapper
const Chart = memo(({ children, title }) => (
  <div role="img" aria-label={title || "Chart"}>{children}</div>
));

// Custom Tooltips
const CoxTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white p-3 border rounded-lg shadow-lg text-sm">
      <p className="font-semibold">{d.faultCode}</p>
      <p>Hazard Ratio: {d.expCoef?.toFixed(2)}</p>
      <p>Coefficient: {d.coef?.toFixed(3)}</p>
      <p>95% CI: [{d.expCoefLower?.toFixed(2)}, {d.expCoefUpper?.toFixed(2)}]</p>
      <p className="font-medium" style={{ color: getColor('significance', d.significance) }}>
        {d.significance}
      </p>
    </div>
  );
};

const FeatureTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white p-3 border rounded-lg shadow-lg text-sm">
      <p className="font-semibold">{d.feature}</p>
      <p>Importance: {d.importance > 1 ? d.importance.toFixed(2) : formatPercent(d.importance)}</p>
      <p>Category: {d.category}</p>
      <p>Rank: #{d.rank}</p>
    </div>
  );
};

// Station Card Component
const StationCard = memo(({ station }) => {
  const statusColor = station.riskScore >= 0.7 ? 'red' : station.riskScore >= 0.5 ? 'orange' : station.riskScore >= 0.3 ? 'yellow' : 'green';
  const Icon = station.riskScore >= 0.7 ? XCircle : station.riskScore >= 0.5 ? AlertCircle : station.riskScore >= 0.3 ? AlertTriangle : CheckCircle;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold">{station.name}</h4>
          <p className="text-sm text-slate-600">{station.id}</p>
        </div>
        <div className={`p-2 rounded-lg bg-${statusColor}-50`}>
          <Icon className={`h-5 w-5 text-${statusColor}-600`} />
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Risk:</span>
          <span className={`font-medium text-${statusColor}-600`}>{formatPercent(station.riskScore)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Devices:</span>
          <span className="font-medium">{station.devices}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Critical:</span>
          <span className="font-medium text-red-600">{station.critical}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">MTBF:</span>
          <span className="font-medium">{station.mtbf.toFixed(0)}h</span>
        </div>
      </div>
    </div>
  );
});

// Tab Components
const OverviewTab = memo(() => {
  const metrics = useMemo(() => ({
    totalDevices: 302,
    totalStations: 11,
    totalCritical: DATA.stations.reduce((sum, s) => sum + s.critical, 0),
    avgAvailability: DATA.stations.reduce((sum, s) => sum + s.availability, 0) / DATA.stations.length,
    avgMTBF: DATA.stations.reduce((sum, s) => sum + s.mtbf, 0) / DATA.stations.length
  }), []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Devices', value: metrics.totalDevices, icon: Server, color: 'blue' },
          { label: 'Active Stations', value: metrics.totalStations, icon: MapPin, color: 'green' },
          { label: 'Critical Issues', value: metrics.totalCritical, icon: AlertTriangle, color: 'red' },
          { label: 'Availability', value: `${metrics.avgAvailability.toFixed(1)}%`, icon: Activity, color: 'purple' },
          { label: 'Avg MTBF', value: `${metrics.avgMTBF.toFixed(0)}h`, icon: Clock, color: 'orange' }
        ].map((item, i) => (
          <div key={i} className={`bg-${item.color}-50 border border-${item.color}-200 rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-medium text-${item.color}-800`}>{item.label}</p>
                <p className={`text-xl font-bold text-${item.color}-900`}>{item.value}</p>
              </div>
              <item.icon className={`h-6 w-6 text-${item.color}-600`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          Station Health Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DATA.stations.map(station => <StationCard key={station.id} station={station} />)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-bold mb-4">Risk vs MTBF Analysis</h3>
          <Chart title="Risk vs MTBF">
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={DATA.stations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mtbf" label={{ value: 'MTBF (hours)', position: 'insideBottom', offset: -5 }} />
                <YAxis dataKey="riskScore" label={{ value: 'Risk Score', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Scatter dataKey="riskScore" fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </Chart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-bold mb-4">Network Distribution</h3>
          <Chart title="Network Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={DATA.clusterAnalysis} cx="50%" cy="50%" outerRadius={100} dataKey="stations" label={({cluster, stations}) => `${cluster} (${stations})`}>
                  {DATA.clusterAnalysis.map((entry, i) => (
                    <Cell key={i} fill={getColor('cluster', entry.cluster)} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Chart>
        </div>
      </div>
    </div>
  );
});

const RealTimeTab = memo(() => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { label: 'Operational', count: 2, icon: CheckCircle, color: 'green' },
        { label: 'Warning', count: 1, icon: AlertTriangle, color: 'yellow' },
        { label: 'Critical', count: 3, icon: XCircle, color: 'red' }
      ].map((item, i) => (
        <div key={i} className={`bg-${item.color}-50 border border-${item.color}-200 rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium text-${item.color}-800`}>{item.label}</p>
              <p className={`text-2xl font-bold text-${item.color}-900`}>{item.count}</p>
            </div>
            <item.icon className={`h-6 w-6 text-${item.color}-600`} />
          </div>
        </div>
      ))}
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-bold mb-4">Real-time Metrics</h3>
      <Chart title="Real-time Metrics">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={DATA.realTimeMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="activeDevices" stroke="#3b82f6" name="Active Devices" />
            <Line type="monotone" dataKey="faults" stroke="#dc2626" name="Faults" />
            <Line type="monotone" dataKey="criticalRulDevices" stroke="#f59e0b" name="Critical Devices" />
          </LineChart>
        </ResponsiveContainer>
      </Chart>
    </div>

    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-bold">Critical Device Monitoring</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">Device</th>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">Fault Code</th>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">RUL (Days)</th>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">Priority</th>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {DATA.rulPredictions.slice(0, 5).map((pred, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-3 font-medium">{pred.deviceId}</td>
                <td className="p-3">{pred.faultCode}</td>
                <td className="p-3 font-bold text-red-600">{pred.rulDays}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    pred.priority === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {pred.priority}
                  </span>
                </td>
                <td className="p-3">{formatPercent(pred.confidence)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
));

const MLAnalyticsTab = memo(() => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-bold mb-4">Model Performance</h3>
      <Chart title="Model Performance">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={DATA.mlModelResults}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="model" angle={-45} textAnchor="end" height={80} />
            <YAxis domain={[0.9, 1]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy" />
            <Bar dataKey="precision" fill="#22c55e" name="Precision" />
            <Bar dataKey="recall" fill="#f59e0b" name="Recall" />
          </BarChart>
        </ResponsiveContainer>
      </Chart>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4">XGBoost Feature Importance</h3>
        <Chart title="XGBoost Features">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={DATA.featureImportance.xgboost} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="feature" type="category" width={120} tick={{fontSize: 11}} />
              <Tooltip content={<FeatureTooltip />} />
              <Bar dataKey="importance">
                {DATA.featureImportance.xgboost.map((entry, i) => (
                  <Cell key={i} fill={getColor('category', entry.category)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4">CatBoost Feature Importance</h3>
        <Chart title="CatBoost Features">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={DATA.featureImportance.catboost} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="feature" type="category" width={120} tick={{fontSize: 11}} />
              <Tooltip content={<FeatureTooltip />} />
              <Bar dataKey="importance">
                {DATA.featureImportance.catboost.map((entry, i) => (
                  <Cell key={i} fill={getColor('category', entry.category)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </div>
    </div>
  </div>
));

const SurvivalAnalysisTab = memo(() => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-bold mb-4">Survival Curves by Fault Code</h3>
      <Chart title="Survival Curves">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={DATA.survivalCurves}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Survival Probability', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="fc111" stroke="#dc2626" strokeWidth={2} name="FC 111" />
            <Line type="monotone" dataKey="fc37" stroke="#f59e0b" strokeWidth={2} name="FC 37" />
            <Line type="monotone" dataKey="fc40" stroke="#22c55e" strokeWidth={2} name="FC 40" />
            <Line type="monotone" dataKey="fc118" stroke="#3b82f6" strokeWidth={2} name="FC 118" />
            <Line type="monotone" dataKey="baseline" stroke="#6b7280" strokeWidth={1} strokeDasharray="5 5" name="Baseline" />
          </LineChart>
        </ResponsiveContainer>
      </Chart>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Weibull Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3">Fault Code</th>
                <th className="text-left p-3">Shape (β)</th>
                <th className="text-left p-3">Scale (η)</th>
                <th className="text-left p-3">Median Life</th>
                <th className="text-left p-3">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {DATA.weibullAnalysis.slice(0, 5).map((item, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-3 font-medium">FC {item.faultCode}</td>
                  <td className="p-3">{item.shape.toFixed(2)}</td>
                  <td className="p-3">{item.scale.toFixed(1)}</td>
                  <td className="p-3">{item.medianLifetime.toFixed(0)} min</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.failureType === 'Infant Mortality' ? 'bg-red-100 text-red-800' :
                      item.failureType === 'Wear-out' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.failureType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Failure Distribution</h3>
        <Chart title="Failure Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Infant Mortality', value: 6, color: '#dc2626' },
                  { name: 'Wear-out', value: 1, color: '#ea580c' },
                  { name: 'Early-life', value: 1, color: '#eab308' }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({name, value}) => `${name} (${value})`}
              >
                {[{ color: '#dc2626' }, { color: '#ea580c' }, { color: '#eab308' }].map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Chart>
      </div>
    </div>
  </div>
));

const HazardModelsTab = memo(() => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-bold mb-4">Cox Regression Hazard Ratios</h3>
      <Chart title="Hazard Ratios">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={DATA.coxRegressionResults} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="faultCode" type="category" width={60} />
            <Tooltip content={<CoxTooltip />} />
            <Bar dataKey="expCoef" name="Hazard Ratio">
              {DATA.coxRegressionResults.map((entry, i) => (
                <Cell key={i} fill={getColor('significance', entry.significance)} />
              ))}
            </Bar>
            <ReferenceLine x={1} stroke="#6b7280" strokeDasharray="3 3" />
          </BarChart>
        </ResponsiveContainer>
      </Chart>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Baseline Hazard Function</h3>
        <Chart title="Baseline Hazard">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={DATA.baselineHazard}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hazard" stroke="#dc2626" strokeWidth={1} dot={false} name="Hazard" />
              <Line type="monotone" dataKey="smoothed" stroke="#3b82f6" strokeWidth={2} name="Smoothed" />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Model Statistics</h3>
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-600">Concordance Score</span>
              <span className="text-lg font-bold">0.76</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '76%' }}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Observations</p>
              <p className="text-xl font-bold">505,551</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Events</p>
              <p className="text-xl font-bold">505,551</p>
            </div>
          </div>

          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800 mb-1">Top Risk Factors</p>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• FC_111: 33.56x hazard ratio</li>
              <li>• FC_38: 8.74x hazard ratio</li>
              <li>• FC_118: 3.44x hazard ratio</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
));

const RULPredictionTab = memo(() => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-bold">Device RUL Predictions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">Device</th>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">Fault Code</th>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">RUL (Days)</th>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">Confidence</th>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">Priority</th>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">Timeframe</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {DATA.rulPredictions.map((pred, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-3 font-medium">{pred.deviceId}</td>
                <td className="p-3">FC {pred.faultCode}</td>
                <td className="p-3">
                  <span className="font-bold">{pred.rulDays}</span>
                  <span className="text-xs text-slate-500 ml-1">({pred.lowerCI}-{pred.upperCI})</span>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 bg-slate-200 rounded-full h-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${pred.confidence * 100}%` }}></div>
                    </div>
                    <span className="text-sm">{formatPercent(pred.confidence)}</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    pred.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                    pred.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                    pred.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {pred.priority}
                  </span>
                </td>
                <td className="p-3 text-sm">{pred.failureTimeframe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Next 5 Days', count: 2, color: 'red' },
        { label: '6-10 Days', count: 1, color: 'orange' },
        { label: '11-15 Days', count: 2, color: 'yellow' },
        { label: '15+ Days', count: 1, color: 'green' }
      ].map((item, i) => (
        <div key={i} className={`text-center p-4 bg-${item.color}-50 rounded-lg border border-${item.color}-200`}>
          <div className={`text-2xl font-bold text-${item.color}-600`}>{item.count}</div>
          <div className={`text-sm text-${item.color}-700`}>{item.label}</div>
        </div>
      ))}
    </div>
  </div>
));

const FaultPatternsTab = memo(() => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-bold mb-4">Hourly Fault Pattern Analysis</h3>
      <Chart title="Fault Patterns">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={DATA.faultPatterns}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Fault Count', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="fc111" stackId="1" stroke="#dc2626" fill="#dc2626" name="FC 111" />
            <Area type="monotone" dataKey="fc37" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="FC 37" />
            <Area type="monotone" dataKey="fc40" stackId="1" stroke="#22c55e" fill="#22c55e" name="FC 40" />
            <Area type="monotone" dataKey="fc118" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="FC 118" />
          </AreaChart>
        </ResponsiveContainer>
      </Chart>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
          Top Fault Codes
        </h3>
        <div className="space-y-3">
          {[
            { code: 111, count: 272206, percentage: 58.2 },
            { code: 37, count: 86504, percentage: 18.5 },
            { code: 40, count: 51600, percentage: 11.0 },
            { code: 10, count: 13078, percentage: 2.8 }
          ].map((fault, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <span className="font-semibold">FC {fault.code}</span>
                <span className="text-sm text-slate-600 ml-2">{formatNumber(fault.count)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-slate-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: `${fault.percentage}%` }}></div>
                </div>
                <span className="text-sm font-medium w-10 text-right">{fault.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          Peak Failure Times
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-red-800">Peak Hour</span>
              <span className="font-bold text-red-900">12:00 PM</span>
            </div>
            <p className="text-xs text-red-700">57 avg failures/hour</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-orange-800">Secondary Peak</span>
              <span className="font-bold text-orange-900">4:00 PM</span>
            </div>
            <p className="text-xs text-orange-700">45 avg failures/hour</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-green-800">Low Activity</span>
              <span className="font-bold text-green-900">12:00 AM</span>
            </div>
            <p className="text-xs text-green-700">11 avg failures/hour</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Failure Trends
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Morning Rush</span>
            </div>
            <span className="text-sm text-red-600">+65%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Evening Peak</span>
            </div>
            <span className="text-sm text-orange-600">+45%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Night Hours</span>
            </div>
            <span className="text-sm text-green-600">-70%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
));

const ClusteringTab = memo(() => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-bold mb-4">Station Cluster Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {DATA.clusterAnalysis.map((cluster, i) => (
          <div key={i} className="p-4 rounded-lg border-2" style={{
            borderColor: getColor('cluster', cluster.cluster),
            backgroundColor: `${getColor('cluster', cluster.cluster)}10`
          }}>
            <h4 className="font-semibold mb-2" style={{ color: getColor('cluster', cluster.cluster) }}>
              {cluster.cluster}
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Stations:</span>
                <span className="font-medium">{cluster.stations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Avg MTBF:</span>
                <span className="font-medium">{cluster.avgMTBF}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Risk:</span>
                <span className="font-medium">{formatPercent(cluster.avgRisk)}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2 pt-2 border-t">{cluster.characteristics}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Cluster Performance</h3>
        <Chart title="Cluster Performance">
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={DATA.clusterAnalysis}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="cluster" />
              <PolarRadiusAxis angle={90} domain={[0, 1000]} />
              <Radar name="MTBF" dataKey="avgMTBF" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Radar name="Risk" dataKey={d => d.avgRisk * 1000} stroke="#dc2626" fill="#dc2626" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </Chart>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Station Distribution</h3>
        <div className="space-y-3">
          {DATA.clusterAnalysis.map((cluster, i) => {
            const stations = DATA.stations.filter(s => s.cluster === cluster.cluster);
            return (
              <div key={i} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getColor('cluster', cluster.cluster) }}></div>
                    {cluster.cluster}
                  </h4>
                  <span className="text-sm text-slate-600">{stations.length} stations</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {stations.map((station, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-white rounded border" style={{
                      borderColor: getColor('cluster', cluster.cluster)
                    }}>
                      {station.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
));

const AssociationRulesTab = memo(() => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-bold">Fault Code Association Rules</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">Antecedent</th>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">Consequent</th>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">Support</th>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">Confidence</th>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">Lift</th>
              <th className="text-left p-3 text-xs font-medium text-slate-600 uppercase">Strength</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {DATA.associationRules.map((rule, i) => {
              const strength = rule.lift > 2 ? 'Strong' : rule.lift > 1.5 ? 'Moderate' : 'Weak';
              const color = strength === 'Strong' ? 'green' : strength === 'Moderate' ? 'yellow' : 'red';
              
              return (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-3 font-medium">{rule.antecedent}</td>
                  <td className="p-3">→ {rule.consequent}</td>
                  <td className="p-3">{formatPercent(rule.support)}</td>
                  <td className="p-3">{formatPercent(rule.confidence)}</td>
                  <td className="p-3">{rule.lift.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`font-medium text-${color}-600`}>{strength}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Rule Lift Distribution</h3>
        <Chart title="Rule Lift">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={DATA.associationRules}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="antecedent" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="lift" fill="#3b82f6" name="Lift Value">
                {DATA.associationRules.map((entry, i) => (
                  <Cell key={i} fill={entry.lift > 2 ? '#22c55e' : entry.lift > 1.5 ? '#f59e0b' : '#dc2626'} />
                ))}
              </Bar>
              <ReferenceLine y={1} stroke="#6b7280" strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Key Insights</h3>
        <div className="space-y-3">
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-800 mb-1">Strong Association</h4>
            <p className="text-sm text-red-700">FC_111 → FC_37 with 78% confidence</p>
            <p className="text-xs text-red-600 mt-1">2.34x more likely to occur together</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-800 mb-1">Combined Patterns</h4>
            <p className="text-sm text-orange-700">FC_37 + FC_40 → FC_111 (72%)</p>
            <p className="text-xs text-orange-600 mt-1">Multiple faults predict cascading failures</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-1">Recommendation</h4>
            <p className="text-sm text-blue-700">Monitor FC_111 devices for cascading failures</p>
          </div>
        </div>
      </div>
    </div>
  </div>
));

const ReliabilityMetricsTab = memo(() => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Average MTBF', value: '574.5 hrs', trend: '↑ 5.2%', icon: Clock, color: 'blue' },
        { label: 'Average MTTR', value: '38.3 hrs', trend: '↓ 8.1%', icon: Wrench, color: 'green' },
        { label: 'Availability', value: '95.4%', trend: 'Target: 95%', icon: Activity, color: 'purple' },
        { label: 'Total Failures', value: '468', trend: 'This month', icon: AlertTriangle, color: 'orange' }
      ].map((item, i) => (
        <div key={i} className={`bg-${item.color}-50 border border-${item.color}-200 rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-medium text-${item.color}-800`}>{item.label}</p>
              <p className={`text-xl font-bold text-${item.color}-900`}>{item.value}</p>
              <p className={`text-xs text-${item.color}-700`}>{item.trend}</p>
            </div>
            <item.icon className={`h-6 w-6 text-${item.color}-600`} />
          </div>
        </div>
      ))}
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-bold mb-4">Reliability Trends (6 Months)</h3>
      <Chart title="Reliability Trends">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={DATA.reliabilityTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="mtbf" fill="#3b82f6" name="MTBF (hours)" />
            <Bar yAxisId="left" dataKey="mttr" fill="#dc2626" name="MTTR (hours)" />
            <Line yAxisId="right" type="monotone" dataKey="availability" stroke="#22c55e" strokeWidth={2} name="Availability (%)" />
          </ComposedChart>
        </ResponsiveContainer>
      </Chart>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Device Reliability Distribution</h3>
        <Chart title="Reliability Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <Treemap
              data={[
                { name: 'High (>800h)', size: 45, fill: '#22c55e' },
                { name: 'Good (600-800h)', size: 30, fill: '#3b82f6' },
                { name: 'Fair (400-600h)', size: 15, fill: '#f59e0b' },
                { name: 'Poor (<400h)', size: 10, fill: '#dc2626' }
              ]}
              dataKey="size"
              aspectRatio={4/3}
              stroke="#fff"
            />
          </ResponsiveContainer>
        </Chart>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Reliability KPIs</h3>
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-slate-600">System Reliability</span>
              <span className="text-lg font-bold">94.7%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '94.7%' }}></div>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Mean Time To Detect</span>
              <span className="text-lg font-bold">12.5 min</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">First Time Fix Rate</span>
              <span className="text-lg font-bold">87.3%</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Preventive Maintenance</span>
              <span className="text-lg font-bold">68.5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));

const RecommendationsTab = memo(() => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { label: 'Critical Actions', count: 2, desc: 'Immediate attention', icon: AlertTriangle, color: 'red' },
        { label: 'Preventive Actions', count: 1, desc: 'Scheduled maintenance', icon: Shield, color: 'yellow' },
        { label: 'Optimizations', count: 1, desc: 'Performance improvements', icon: TrendingUp, color: 'green' }
      ].map((item, i) => (
        <div key={i} className={`bg-${item.color}-50 border border-${item.color}-200 rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium text-${item.color}-800`}>{item.label}</p>
              <p className={`text-2xl font-bold text-${item.color}-900`}>{item.count}</p>
              <p className={`text-xs text-${item.color}-700`}>{item.desc}</p>
            </div>
            <item.icon className={`h-6 w-6 text-${item.color}-600`} />
          </div>
        </div>
      ))}
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-bold mb-4">Action Recommendations</h3>
      <div className="space-y-4">
        {DATA.recommendations.map((rec, i) => {
          const typeColor = rec.type === 'Critical' ? 'red' : rec.type === 'Preventive' ? 'yellow' : 'green';
          const priorityColor = rec.priority === 'High' ? 'red' : rec.priority === 'Medium' ? 'yellow' : 'green';
          const Icon = rec.type === 'Critical' ? AlertTriangle : rec.type === 'Preventive' ? Shield : TrendingUp;
          
          return (
            <div key={i} className={`p-4 rounded-lg border-2 bg-${typeColor}-50 border-${typeColor}-200`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Icon className={`h-5 w-5 mt-1 text-${typeColor}-600`} />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{rec.title}</h4>
                    <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
                    <div className="flex items-center space-x-4 text-xs">
                      <span className={`px-2 py-1 rounded bg-${priorityColor}-100 text-${priorityColor}-800 font-medium`}>
                        {rec.priority} Priority
                      </span>
                      <span className="text-slate-500">ETA: {rec.eta}</span>
                      <span className="text-slate-500">Impact: {rec.impact}</span>
                    </div>
                  </div>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium">
                  Take Action
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Process Improvements</h3>
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-1">Monitoring Strategy</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Monitor reset patterns frequency</li>
              <li>• Track service durations continuously</li>
              <li>• Consider environmental impact</li>
            </ul>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-800 mb-1">Preventive Maintenance</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• HostType_2 devices need more checks</li>
              <li>• Focus on entry-point components</li>
              <li>• Systems with reset patterns need intervention</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Key Findings</h3>
        <div className="space-y-3">
          {DATA.causationInsights.slice(0, 4).map((insight, i) => (
            <div key={i} className="flex items-start space-x-2">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                insight.impact === 'High' ? 'bg-red-500' :
                insight.impact === 'Medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}></div>
              <div>
                <p className="font-medium text-sm">{insight.category}</p>
                <p className="text-xs text-slate-600">{insight.insight}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
));

// Main Dashboard Component
export default function TfLDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdate] = useState(new Date());
  const [realTimeMode, setRealTimeMode] = useState(true);

  const renderTab = () => {
    switch(activeTab) {
      case 'overview': return <OverviewTab />;
      case 'realtime': return <RealTimeTab />;
      case 'ml-analytics': return <MLAnalyticsTab />;
      case 'survival': return <SurvivalAnalysisTab />;
      case 'hazard': return <HazardModelsTab />;
      case 'rul': return <RULPredictionTab />;
      case 'fault-patterns': return <FaultPatternsTab />;
      case 'clustering': return <ClusteringTab />;
      case 'association': return <AssociationRulesTab />;
      case 'reliability': return <ReliabilityMetricsTab />;
      case 'recommendations': return <RecommendationsTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-[1920px] mx-auto p-4 lg:p-6">
          <header className="bg-slate-900 text-white p-6 rounded-lg mb-6 shadow-lg">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                  TfL Advanced Reliability Analytics Dashboard
                </h1>
                <p className="text-slate-300 mb-3">AI-Powered Predictive Maintenance & Reliability Engineering</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs bg-blue-600 px-3 py-1.5 rounded-md font-medium flex items-center">
                    <Server className="h-3.5 w-3.5 mr-1.5" />
                    302 Devices
                  </span>
                  <span className="text-xs bg-blue-700 px-3 py-1.5 rounded-md font-medium flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1.5" />
                    11 Stations
                  </span>
                  <span className="text-xs bg-green-600 px-3 py-1.5 rounded-md font-medium flex items-center">
                    <Brain className="h-3.5 w-3.5 mr-1.5" />
                    98.7% Accuracy
                  </span>
                </div>
              </div>
              <div className="text-left lg:text-right">
                <button
                  onClick={() => setRealTimeMode(!realTimeMode)}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 mb-2 ${
                    realTimeMode ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${realTimeMode ? 'bg-white animate-pulse' : 'bg-slate-400'}`}></div>
                  <span>{realTimeMode ? 'Live' : 'Static'}</span>
                </button>
                <p className="text-xs text-slate-300">Last Updated: {lastUpdate.toLocaleTimeString()}</p>
              </div>
            </div>
          </header>

          <nav className="flex flex-wrap gap-2 mb-6 bg-white p-3 rounded-lg shadow-sm border overflow-x-auto">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 lg:px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-all text-sm whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <main>
            <Suspense fallback={<Loading />}>
              {renderTab()}
            </Suspense>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

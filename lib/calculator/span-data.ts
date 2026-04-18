// Complete Span Tables from 40 05 19.01
// Project Confluence D3730500

import { PipeMaterial, Service } from './types';

interface SpanEntry {
  material: PipeMaterial;
  service: Service;
  pipeSize: string;
  temperature: number;
  maxSpan: number;
  sourceTable: string;
}

// PVC Schedule 40 - Vapor Service (Table 1.10)
const PVC_SCH40_VAPOR: SpanEntry[] = [
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1/2"', temperature: 68, maxSpan: 4.1, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1/2"', temperature: 80, maxSpan: 4.0, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1/2"', temperature: 100, maxSpan: 3.8, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1/2"', temperature: 120, maxSpan: 3.4, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1/2"', temperature: 140, maxSpan: 2.8, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '3/4"', temperature: 68, maxSpan: 4.6, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '3/4"', temperature: 80, maxSpan: 4.5, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '3/4"', temperature: 100, maxSpan: 4.3, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '3/4"', temperature: 120, maxSpan: 3.9, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '3/4"', temperature: 140, maxSpan: 3.2, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1"', temperature: 68, maxSpan: 5.2, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1"', temperature: 80, maxSpan: 5.1, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1"', temperature: 100, maxSpan: 4.8, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1"', temperature: 120, maxSpan: 4.4, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1"', temperature: 140, maxSpan: 3.6, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1-1/4"', temperature: 68, maxSpan: 5.9, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1-1/4"', temperature: 80, maxSpan: 5.7, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1-1/4"', temperature: 100, maxSpan: 5.5, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1-1/4"', temperature: 120, maxSpan: 5.0, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1-1/4"', temperature: 140, maxSpan: 4.1, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1-1/2"', temperature: 68, maxSpan: 6.3, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1-1/2"', temperature: 80, maxSpan: 6.2, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1-1/2"', temperature: 100, maxSpan: 5.9, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1-1/2"', temperature: 120, maxSpan: 5.3, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '1-1/2"', temperature: 140, maxSpan: 4.4, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '2"', temperature: 68, maxSpan: 7.1, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '2"', temperature: 80, maxSpan: 7.0, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '2"', temperature: 100, maxSpan: 6.6, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '2"', temperature: 120, maxSpan: 6.0, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '2"', temperature: 140, maxSpan: 4.9, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '2-1/2"', temperature: 68, maxSpan: 7.8, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '2-1/2"', temperature: 80, maxSpan: 7.6, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '2-1/2"', temperature: 100, maxSpan: 7.3, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '2-1/2"', temperature: 120, maxSpan: 6.6, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '2-1/2"', temperature: 140, maxSpan: 5.4, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '3"', temperature: 68, maxSpan: 8.7, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '3"', temperature: 80, maxSpan: 8.5, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '3"', temperature: 100, maxSpan: 8.1, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '3"', temperature: 120, maxSpan: 7.3, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '3"', temperature: 140, maxSpan: 6.0, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '4"', temperature: 68, maxSpan: 9.9, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '4"', temperature: 80, maxSpan: 9.6, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '4"', temperature: 100, maxSpan: 9.2, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '4"', temperature: 120, maxSpan: 8.3, sourceTable: 'Table 1.10' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '4"', temperature: 140, maxSpan: 6.8, sourceTable: 'Table 1.10' },
];

// PVC Schedule 40 - Water Service (Table 1.11)
const PVC_SCH40_WATER: SpanEntry[] = [
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1/2"', temperature: 68, maxSpan: 2.4, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1/2"', temperature: 80, maxSpan: 2.3, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1/2"', temperature: 100, maxSpan: 1.9, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1/2"', temperature: 120, maxSpan: 1.6, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1/2"', temperature: 140, maxSpan: 1.2, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '3/4"', temperature: 68, maxSpan: 2.8, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '3/4"', temperature: 80, maxSpan: 2.7, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '3/4"', temperature: 100, maxSpan: 2.3, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '3/4"', temperature: 120, maxSpan: 1.9, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '3/4"', temperature: 140, maxSpan: 1.5, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1"', temperature: 68, maxSpan: 3.4, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1"', temperature: 80, maxSpan: 3.3, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1"', temperature: 100, maxSpan: 2.9, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1"', temperature: 120, maxSpan: 2.4, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1"', temperature: 140, maxSpan: 1.8, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1-1/4"', temperature: 68, maxSpan: 3.9, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1-1/4"', temperature: 80, maxSpan: 3.8, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1-1/4"', temperature: 100, maxSpan: 3.4, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1-1/4"', temperature: 120, maxSpan: 2.8, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1-1/4"', temperature: 140, maxSpan: 2.1, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1-1/2"', temperature: 68, maxSpan: 4.2, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1-1/2"', temperature: 80, maxSpan: 4.1, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1-1/2"', temperature: 100, maxSpan: 3.7, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1-1/2"', temperature: 120, maxSpan: 3.1, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '1-1/2"', temperature: 140, maxSpan: 2.3, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '2"', temperature: 68, maxSpan: 4.7, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '2"', temperature: 80, maxSpan: 4.6, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '2"', temperature: 100, maxSpan: 4.2, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '2"', temperature: 120, maxSpan: 3.5, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '2"', temperature: 140, maxSpan: 2.6, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '2-1/2"', temperature: 68, maxSpan: 5.4, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '2-1/2"', temperature: 80, maxSpan: 5.2, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '2-1/2"', temperature: 100, maxSpan: 5.0, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '2-1/2"', temperature: 120, maxSpan: 4.1, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '2-1/2"', temperature: 140, maxSpan: 3.1, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '3"', temperature: 68, maxSpan: 5.9, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '3"', temperature: 80, maxSpan: 5.8, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '3"', temperature: 100, maxSpan: 5.5, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '3"', temperature: 120, maxSpan: 4.5, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '3"', temperature: 140, maxSpan: 3.4, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '4"', temperature: 68, maxSpan: 6.6, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '4"', temperature: 80, maxSpan: 6.5, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '4"', temperature: 100, maxSpan: 6.1, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '4"', temperature: 120, maxSpan: 5.0, sourceTable: 'Table 1.11' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '4"', temperature: 140, maxSpan: 3.8, sourceTable: 'Table 1.11' },
];

// PVC Schedule 80 - Vapor Service (Table 1.12)
const PVC_SCH80_VAPOR: SpanEntry[] = [
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1/2"', temperature: 68, maxSpan: 4.5, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1/2"', temperature: 80, maxSpan: 4.4, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1/2"', temperature: 100, maxSpan: 4.2, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1/2"', temperature: 120, maxSpan: 3.8, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1/2"', temperature: 140, maxSpan: 3.1, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '3/4"', temperature: 68, maxSpan: 5.0, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '3/4"', temperature: 80, maxSpan: 4.9, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '3/4"', temperature: 100, maxSpan: 4.7, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '3/4"', temperature: 120, maxSpan: 4.2, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '3/4"', temperature: 140, maxSpan: 3.5, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1"', temperature: 68, maxSpan: 5.7, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1"', temperature: 80, maxSpan: 5.5, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1"', temperature: 100, maxSpan: 5.3, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1"', temperature: 120, maxSpan: 4.8, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1"', temperature: 140, maxSpan: 3.9, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1-1/4"', temperature: 68, maxSpan: 6.4, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1-1/4"', temperature: 80, maxSpan: 6.2, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1-1/4"', temperature: 100, maxSpan: 6.0, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1-1/4"', temperature: 120, maxSpan: 5.4, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1-1/4"', temperature: 140, maxSpan: 4.4, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1-1/2"', temperature: 68, maxSpan: 6.8, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1-1/2"', temperature: 80, maxSpan: 6.6, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1-1/2"', temperature: 100, maxSpan: 6.4, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1-1/2"', temperature: 120, maxSpan: 5.8, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '1-1/2"', temperature: 140, maxSpan: 4.7, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '2"', temperature: 68, maxSpan: 7.7, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '2"', temperature: 80, maxSpan: 7.5, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '2"', temperature: 100, maxSpan: 7.2, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '2"', temperature: 120, maxSpan: 6.5, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '2"', temperature: 140, maxSpan: 5.3, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '2-1/2"', temperature: 68, maxSpan: 8.4, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '2-1/2"', temperature: 80, maxSpan: 8.2, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '2-1/2"', temperature: 100, maxSpan: 7.9, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '2-1/2"', temperature: 120, maxSpan: 7.1, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '2-1/2"', temperature: 140, maxSpan: 5.8, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '3"', temperature: 68, maxSpan: 9.3, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '3"', temperature: 80, maxSpan: 9.1, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '3"', temperature: 100, maxSpan: 8.7, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '3"', temperature: 120, maxSpan: 7.8, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '3"', temperature: 140, maxSpan: 6.4, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '4"', temperature: 68, maxSpan: 10.5, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '4"', temperature: 80, maxSpan: 10.2, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '4"', temperature: 100, maxSpan: 9.8, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '4"', temperature: 120, maxSpan: 8.9, sourceTable: 'Table 1.12' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '4"', temperature: 140, maxSpan: 7.3, sourceTable: 'Table 1.12' },
];

// PVC Schedule 80 - Water Service (Table 1.13)
const PVC_SCH80_WATER: SpanEntry[] = [
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1/2"', temperature: 68, maxSpan: 2.6, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1/2"', temperature: 80, maxSpan: 2.5, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1/2"', temperature: 100, maxSpan: 2.1, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1/2"', temperature: 120, maxSpan: 1.7, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1/2"', temperature: 140, maxSpan: 1.3, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '3/4"', temperature: 68, maxSpan: 3.0, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '3/4"', temperature: 80, maxSpan: 2.9, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '3/4"', temperature: 100, maxSpan: 2.5, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '3/4"', temperature: 120, maxSpan: 2.1, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '3/4"', temperature: 140, maxSpan: 1.6, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1"', temperature: 68, maxSpan: 3.6, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1"', temperature: 80, maxSpan: 3.5, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1"', temperature: 100, maxSpan: 3.1, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1"', temperature: 120, maxSpan: 2.6, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1"', temperature: 140, maxSpan: 2.0, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1-1/4"', temperature: 68, maxSpan: 4.2, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1-1/4"', temperature: 80, maxSpan: 4.1, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1-1/4"', temperature: 100, maxSpan: 3.6, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1-1/4"', temperature: 120, maxSpan: 3.0, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1-1/4"', temperature: 140, maxSpan: 2.3, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1-1/2"', temperature: 68, maxSpan: 4.5, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1-1/2"', temperature: 80, maxSpan: 4.4, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1-1/2"', temperature: 100, maxSpan: 4.0, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1-1/2"', temperature: 120, maxSpan: 3.3, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '1-1/2"', temperature: 140, maxSpan: 2.5, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '2"', temperature: 68, maxSpan: 5.1, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '2"', temperature: 80, maxSpan: 5.0, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '2"', temperature: 100, maxSpan: 4.5, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '2"', temperature: 120, maxSpan: 3.8, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '2"', temperature: 140, maxSpan: 2.8, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '2-1/2"', temperature: 68, maxSpan: 5.8, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '2-1/2"', temperature: 80, maxSpan: 5.6, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '2-1/2"', temperature: 100, maxSpan: 5.4, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '2-1/2"', temperature: 120, maxSpan: 4.5, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '2-1/2"', temperature: 140, maxSpan: 3.4, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '3"', temperature: 68, maxSpan: 6.4, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '3"', temperature: 80, maxSpan: 6.2, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '3"', temperature: 100, maxSpan: 5.9, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '3"', temperature: 120, maxSpan: 4.9, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '3"', temperature: 140, maxSpan: 3.7, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '4"', temperature: 68, maxSpan: 7.1, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '4"', temperature: 80, maxSpan: 6.9, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '4"', temperature: 100, maxSpan: 6.6, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '4"', temperature: 120, maxSpan: 5.4, sourceTable: 'Table 1.13' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '4"', temperature: 140, maxSpan: 4.1, sourceTable: 'Table 1.13' },
];

// Carbon Steel (Table 1.50) - Not temperature dependent
const CARBON_STEEL: SpanEntry[] = [
  { material: 'Carbon Steel', service: 'water', pipeSize: '1/2"', temperature: 68, maxSpan: 7.0, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'vapor', pipeSize: '1/2"', temperature: 68, maxSpan: 8.5, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'water', pipeSize: '3/4"', temperature: 68, maxSpan: 8.5, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'vapor', pipeSize: '3/4"', temperature: 68, maxSpan: 9.5, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'water', pipeSize: '1"', temperature: 68, maxSpan: 10.0, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'vapor', pipeSize: '1"', temperature: 68, maxSpan: 11.0, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'water', pipeSize: '1-1/4"', temperature: 68, maxSpan: 11.0, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'vapor', pipeSize: '1-1/4"', temperature: 68, maxSpan: 12.5, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'water', pipeSize: '1-1/2"', temperature: 68, maxSpan: 12.0, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'vapor', pipeSize: '1-1/2"', temperature: 68, maxSpan: 13.5, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'water', pipeSize: '2"', temperature: 68, maxSpan: 13.5, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'vapor', pipeSize: '2"', temperature: 68, maxSpan: 15.0, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'water', pipeSize: '2-1/2"', temperature: 68, maxSpan: 15.0, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'vapor', pipeSize: '2-1/2"', temperature: 68, maxSpan: 17.0, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'water', pipeSize: '3"', temperature: 68, maxSpan: 17.0, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'vapor', pipeSize: '3"', temperature: 68, maxSpan: 18.5, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'water', pipeSize: '4"', temperature: 68, maxSpan: 19.0, sourceTable: 'Table 1.50' },
  { material: 'Carbon Steel', service: 'vapor', pipeSize: '4"', temperature: 68, maxSpan: 21.5, sourceTable: 'Table 1.50' },
];

// Stainless Steel (Table 1.60)
const STAINLESS_STEEL: SpanEntry[] = [
  { material: 'Stainless Steel', service: 'water', pipeSize: '1/2"', temperature: 68, maxSpan: 6.5, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'vapor', pipeSize: '1/2"', temperature: 68, maxSpan: 8.5, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'water', pipeSize: '3/4"', temperature: 68, maxSpan: 7.5, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'vapor', pipeSize: '3/4"', temperature: 68, maxSpan: 9.5, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'water', pipeSize: '1"', temperature: 68, maxSpan: 9.0, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'vapor', pipeSize: '1"', temperature: 68, maxSpan: 10.5, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'water', pipeSize: '1-1/4"', temperature: 68, maxSpan: 10.5, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'vapor', pipeSize: '1-1/4"', temperature: 68, maxSpan: 12.0, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'water', pipeSize: '1-1/2"', temperature: 68, maxSpan: 11.5, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'vapor', pipeSize: '1-1/2"', temperature: 68, maxSpan: 13.0, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'water', pipeSize: '2"', temperature: 68, maxSpan: 12.0, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'vapor', pipeSize: '2"', temperature: 68, maxSpan: 15.0, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'water', pipeSize: '2-1/2"', temperature: 68, maxSpan: 13.5, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'vapor', pipeSize: '2-1/2"', temperature: 68, maxSpan: 16.5, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'water', pipeSize: '3"', temperature: 68, maxSpan: 14.5, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'vapor', pipeSize: '3"', temperature: 68, maxSpan: 18.5, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'water', pipeSize: '4"', temperature: 68, maxSpan: 15.5, sourceTable: 'Table 1.60' },
  { material: 'Stainless Steel', service: 'vapor', pipeSize: '4"', temperature: 68, maxSpan: 21.0, sourceTable: 'Table 1.60' },
];

// Copper Tubing Type L (Table 1.71)
const COPPER: SpanEntry[] = [
  { material: 'Copper', service: 'water', pipeSize: '1/2"', temperature: 68, maxSpan: 3.0, sourceTable: 'Table 1.71' },
  { material: 'Copper', service: 'vapor', pipeSize: '1/2"', temperature: 68, maxSpan: 5.0, sourceTable: 'Table 1.71' },
  { material: 'Copper', service: 'water', pipeSize: '3/4"', temperature: 68, maxSpan: 4.5, sourceTable: 'Table 1.71' },
  { material: 'Copper', service: 'vapor', pipeSize: '3/4"', temperature: 68, maxSpan: 6.0, sourceTable: 'Table 1.71' },
  { material: 'Copper', service: 'water', pipeSize: '1"', temperature: 68, maxSpan: 5.0, sourceTable: 'Table 1.71' },
  { material: 'Copper', service: 'vapor', pipeSize: '1"', temperature: 68, maxSpan: 7.5, sourceTable: 'Table 1.71' },
  { material: 'Copper', service: 'water', pipeSize: '1-1/2"', temperature: 68, maxSpan: 6.5, sourceTable: 'Table 1.71' },
  { material: 'Copper', service: 'vapor', pipeSize: '1-1/2"', temperature: 68, maxSpan: 9.5, sourceTable: 'Table 1.71' },
  { material: 'Copper', service: 'water', pipeSize: '2"', temperature: 68, maxSpan: 8.0, sourceTable: 'Table 1.71' },
  { material: 'Copper', service: 'vapor', pipeSize: '2"', temperature: 68, maxSpan: 11.0, sourceTable: 'Table 1.71' },
  { material: 'Copper', service: 'water', pipeSize: '3"', temperature: 68, maxSpan: 10.0, sourceTable: 'Table 1.71' },
  { material: 'Copper', service: 'vapor', pipeSize: '3"', temperature: 68, maxSpan: 14.0, sourceTable: 'Table 1.71' },
  { material: 'Copper', service: 'water', pipeSize: '4"', temperature: 68, maxSpan: 11.5, sourceTable: 'Table 1.71' },
  { material: 'Copper', service: 'vapor', pipeSize: '4"', temperature: 68, maxSpan: 16.5, sourceTable: 'Table 1.71' },
];

// SS Tubing (Table 1.70) - Vapor and Water
const SS_TUBING: SpanEntry[] = [
  { material: 'SS Tubing', service: 'vapor', pipeSize: '1/4"', temperature: 250, maxSpan: 3.0, sourceTable: 'Table 1.70' },
  { material: 'SS Tubing', service: 'vapor', pipeSize: '3/8"', temperature: 250, maxSpan: 4.0, sourceTable: 'Table 1.70' },
  { material: 'SS Tubing', service: 'vapor', pipeSize: '1/2"', temperature: 250, maxSpan: 5.5, sourceTable: 'Table 1.70' },
  { material: 'SS Tubing', service: 'vapor', pipeSize: '3/4"', temperature: 250, maxSpan: 7.5, sourceTable: 'Table 1.70' },
  { material: 'SS Tubing', service: 'vapor', pipeSize: '1"', temperature: 250, maxSpan: 9.0, sourceTable: 'Table 1.70' },
  { material: 'SS Tubing', service: 'vapor', pipeSize: '1-1/2"', temperature: 250, maxSpan: 11.5, sourceTable: 'Table 1.70' },
  { material: 'SS Tubing', service: 'vapor', pipeSize: '2"', temperature: 250, maxSpan: 13.5, sourceTable: 'Table 1.70' },
  { material: 'SS Tubing', service: 'vapor', pipeSize: '3"', temperature: 250, maxSpan: 16.5, sourceTable: 'Table 1.70' },
  { material: 'SS Tubing', service: 'vapor', pipeSize: '4"', temperature: 250, maxSpan: 19.5, sourceTable: 'Table 1.70' },
  // SS Tubing - Water Service (derived from vapor with ~70% ratio per tubing weight increase)
  { material: 'SS Tubing', service: 'water', pipeSize: '1/4"', temperature: 250, maxSpan: 2.5, sourceTable: 'Table 1.70 (water)' },
  { material: 'SS Tubing', service: 'water', pipeSize: '3/8"', temperature: 250, maxSpan: 3.0, sourceTable: 'Table 1.70 (water)' },
  { material: 'SS Tubing', service: 'water', pipeSize: '1/2"', temperature: 250, maxSpan: 4.0, sourceTable: 'Table 1.70 (water)' },
  { material: 'SS Tubing', service: 'water', pipeSize: '3/4"', temperature: 250, maxSpan: 5.5, sourceTable: 'Table 1.70 (water)' },
  { material: 'SS Tubing', service: 'water', pipeSize: '1"', temperature: 250, maxSpan: 6.5, sourceTable: 'Table 1.70 (water)' },
  { material: 'SS Tubing', service: 'water', pipeSize: '1-1/2"', temperature: 250, maxSpan: 8.5, sourceTable: 'Table 1.70 (water)' },
  { material: 'SS Tubing', service: 'water', pipeSize: '2"', temperature: 250, maxSpan: 10.0, sourceTable: 'Table 1.70 (water)' },
  { material: 'SS Tubing', service: 'water', pipeSize: '3"', temperature: 250, maxSpan: 12.5, sourceTable: 'Table 1.70 (water)' },
  { material: 'SS Tubing', service: 'water', pipeSize: '4"', temperature: 250, maxSpan: 14.5, sourceTable: 'Table 1.70 (water)' },
];

// Copper Tubing Type L (Table 1.72) - Same OD/material as Copper pipe but tubing wall thickness
const COPPER_TUBING: SpanEntry[] = [
  { material: 'Copper Tubing', service: 'water', pipeSize: '1/2"', temperature: 68, maxSpan: 3.0, sourceTable: 'Table 1.72' },
  { material: 'Copper Tubing', service: 'vapor', pipeSize: '1/2"', temperature: 68, maxSpan: 5.0, sourceTable: 'Table 1.72' },
  { material: 'Copper Tubing', service: 'water', pipeSize: '3/4"', temperature: 68, maxSpan: 4.5, sourceTable: 'Table 1.72' },
  { material: 'Copper Tubing', service: 'vapor', pipeSize: '3/4"', temperature: 68, maxSpan: 6.0, sourceTable: 'Table 1.72' },
  { material: 'Copper Tubing', service: 'water', pipeSize: '1"', temperature: 68, maxSpan: 5.0, sourceTable: 'Table 1.72' },
  { material: 'Copper Tubing', service: 'vapor', pipeSize: '1"', temperature: 68, maxSpan: 7.5, sourceTable: 'Table 1.72' },
  { material: 'Copper Tubing', service: 'water', pipeSize: '1-1/2"', temperature: 68, maxSpan: 6.5, sourceTable: 'Table 1.72' },
  { material: 'Copper Tubing', service: 'vapor', pipeSize: '1-1/2"', temperature: 68, maxSpan: 9.5, sourceTable: 'Table 1.72' },
  { material: 'Copper Tubing', service: 'water', pipeSize: '2"', temperature: 68, maxSpan: 8.0, sourceTable: 'Table 1.72' },
  { material: 'Copper Tubing', service: 'vapor', pipeSize: '2"', temperature: 68, maxSpan: 11.0, sourceTable: 'Table 1.72' },
  { material: 'Copper Tubing', service: 'water', pipeSize: '3"', temperature: 68, maxSpan: 10.0, sourceTable: 'Table 1.72' },
  { material: 'Copper Tubing', service: 'vapor', pipeSize: '3"', temperature: 68, maxSpan: 14.0, sourceTable: 'Table 1.72' },
  { material: 'Copper Tubing', service: 'water', pipeSize: '4"', temperature: 68, maxSpan: 11.5, sourceTable: 'Table 1.72' },
  { material: 'Copper Tubing', service: 'vapor', pipeSize: '4"', temperature: 68, maxSpan: 16.5, sourceTable: 'Table 1.72' },
];

// CPVC - Based on manufacturer data (Georg Fischer)
// Similar properties to PVC but rated for higher temperatures
const CPVC_VAPOR: SpanEntry[] = [
  { material: 'CPVC', service: 'vapor', pipeSize: '1/2"', temperature: 73, maxSpan: 4.5, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '1/2"', temperature: 100, maxSpan: 4.2, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '1/2"', temperature: 140, maxSpan: 3.5, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '1/2"', temperature: 180, maxSpan: 2.8, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '3/4"', temperature: 73, maxSpan: 5.0, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '3/4"', temperature: 100, maxSpan: 4.7, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '3/4"', temperature: 140, maxSpan: 3.9, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '3/4"', temperature: 180, maxSpan: 3.1, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '1"', temperature: 73, maxSpan: 5.7, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '1"', temperature: 100, maxSpan: 5.3, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '1"', temperature: 140, maxSpan: 4.4, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '1"', temperature: 180, maxSpan: 3.5, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '1-1/4"', temperature: 73, maxSpan: 6.3, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '1-1/4"', temperature: 100, maxSpan: 5.9, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '1-1/4"', temperature: 140, maxSpan: 4.9, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '1-1/4"', temperature: 180, maxSpan: 3.9, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '1-1/2"', temperature: 73, maxSpan: 6.8, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '1-1/2"', temperature: 100, maxSpan: 6.4, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '1-1/2"', temperature: 140, maxSpan: 5.3, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '1-1/2"', temperature: 180, maxSpan: 4.2, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '2"', temperature: 73, maxSpan: 7.7, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '2"', temperature: 100, maxSpan: 7.2, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '2"', temperature: 140, maxSpan: 6.0, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '2"', temperature: 180, maxSpan: 4.8, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '3"', temperature: 73, maxSpan: 9.3, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '3"', temperature: 100, maxSpan: 8.7, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '3"', temperature: 140, maxSpan: 7.2, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '3"', temperature: 180, maxSpan: 5.8, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '4"', temperature: 73, maxSpan: 10.5, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '4"', temperature: 100, maxSpan: 9.8, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '4"', temperature: 140, maxSpan: 8.2, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'vapor', pipeSize: '4"', temperature: 180, maxSpan: 6.5, sourceTable: 'CPVC Table' },
];

const CPVC_WATER: SpanEntry[] = [
  { material: 'CPVC', service: 'water', pipeSize: '1/2"', temperature: 73, maxSpan: 2.6, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '1/2"', temperature: 100, maxSpan: 2.3, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '1/2"', temperature: 140, maxSpan: 1.8, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '1/2"', temperature: 180, maxSpan: 1.4, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '3/4"', temperature: 73, maxSpan: 3.0, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '3/4"', temperature: 100, maxSpan: 2.7, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '3/4"', temperature: 140, maxSpan: 2.2, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '3/4"', temperature: 180, maxSpan: 1.7, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '1"', temperature: 73, maxSpan: 3.6, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '1"', temperature: 100, maxSpan: 3.2, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '1"', temperature: 140, maxSpan: 2.6, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '1"', temperature: 180, maxSpan: 2.1, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '1-1/4"', temperature: 73, maxSpan: 4.2, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '1-1/4"', temperature: 100, maxSpan: 3.8, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '1-1/4"', temperature: 140, maxSpan: 3.1, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '1-1/4"', temperature: 180, maxSpan: 2.4, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '1-1/2"', temperature: 73, maxSpan: 4.5, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '1-1/2"', temperature: 100, maxSpan: 4.1, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '1-1/2"', temperature: 140, maxSpan: 3.3, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '1-1/2"', temperature: 180, maxSpan: 2.6, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '2"', temperature: 73, maxSpan: 5.1, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '2"', temperature: 100, maxSpan: 4.6, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '2"', temperature: 140, maxSpan: 3.8, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '2"', temperature: 180, maxSpan: 3.0, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '3"', temperature: 73, maxSpan: 6.4, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '3"', temperature: 100, maxSpan: 5.8, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '3"', temperature: 140, maxSpan: 4.7, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '3"', temperature: 180, maxSpan: 3.8, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '4"', temperature: 73, maxSpan: 7.1, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '4"', temperature: 100, maxSpan: 6.5, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '4"', temperature: 140, maxSpan: 5.3, sourceTable: 'CPVC Table' },
  { material: 'CPVC', service: 'water', pipeSize: '4"', temperature: 180, maxSpan: 4.2, sourceTable: 'CPVC Table' },
];

// PP (Polypropylene) - Based on Georg Fischer PP-H data
const PP_VAPOR: SpanEntry[] = [
  { material: 'PP', service: 'vapor', pipeSize: '1/2"', temperature: 68, maxSpan: 3.3, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '1/2"', temperature: 100, maxSpan: 3.0, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '1/2"', temperature: 140, maxSpan: 2.5, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '1/2"', temperature: 176, maxSpan: 2.0, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '3/4"', temperature: 68, maxSpan: 3.9, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '3/4"', temperature: 100, maxSpan: 3.5, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '3/4"', temperature: 140, maxSpan: 2.9, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '3/4"', temperature: 176, maxSpan: 2.4, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '1"', temperature: 68, maxSpan: 4.6, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '1"', temperature: 100, maxSpan: 4.2, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '1"', temperature: 140, maxSpan: 3.5, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '1"', temperature: 176, maxSpan: 2.8, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '1-1/4"', temperature: 68, maxSpan: 5.2, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '1-1/4"', temperature: 100, maxSpan: 4.7, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '1-1/4"', temperature: 140, maxSpan: 3.9, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '1-1/4"', temperature: 176, maxSpan: 3.2, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '1-1/2"', temperature: 68, maxSpan: 5.6, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '1-1/2"', temperature: 100, maxSpan: 5.1, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '1-1/2"', temperature: 140, maxSpan: 4.2, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '1-1/2"', temperature: 176, maxSpan: 3.4, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '2"', temperature: 68, maxSpan: 6.4, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '2"', temperature: 100, maxSpan: 5.8, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '2"', temperature: 140, maxSpan: 4.8, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '2"', temperature: 176, maxSpan: 3.9, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '3"', temperature: 68, maxSpan: 7.7, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '3"', temperature: 100, maxSpan: 7.0, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '3"', temperature: 140, maxSpan: 5.8, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '3"', temperature: 176, maxSpan: 4.7, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '4"', temperature: 68, maxSpan: 8.7, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '4"', temperature: 100, maxSpan: 7.9, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '4"', temperature: 140, maxSpan: 6.6, sourceTable: 'PP Table' },
  { material: 'PP', service: 'vapor', pipeSize: '4"', temperature: 176, maxSpan: 5.3, sourceTable: 'PP Table' },
];

const PP_WATER: SpanEntry[] = [
  { material: 'PP', service: 'water', pipeSize: '1/2"', temperature: 68, maxSpan: 2.0, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '1/2"', temperature: 100, maxSpan: 1.7, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '1/2"', temperature: 140, maxSpan: 1.4, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '1/2"', temperature: 176, maxSpan: 1.1, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '3/4"', temperature: 68, maxSpan: 2.4, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '3/4"', temperature: 100, maxSpan: 2.1, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '3/4"', temperature: 140, maxSpan: 1.7, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '3/4"', temperature: 176, maxSpan: 1.3, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '1"', temperature: 68, maxSpan: 3.0, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '1"', temperature: 100, maxSpan: 2.6, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '1"', temperature: 140, maxSpan: 2.1, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '1"', temperature: 176, maxSpan: 1.7, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '1-1/4"', temperature: 68, maxSpan: 3.5, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '1-1/4"', temperature: 100, maxSpan: 3.0, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '1-1/4"', temperature: 140, maxSpan: 2.5, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '1-1/4"', temperature: 176, maxSpan: 2.0, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '1-1/2"', temperature: 68, maxSpan: 3.8, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '1-1/2"', temperature: 100, maxSpan: 3.3, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '1-1/2"', temperature: 140, maxSpan: 2.7, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '1-1/2"', temperature: 176, maxSpan: 2.2, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '2"', temperature: 68, maxSpan: 4.3, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '2"', temperature: 100, maxSpan: 3.7, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '2"', temperature: 140, maxSpan: 3.1, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '2"', temperature: 176, maxSpan: 2.5, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '3"', temperature: 68, maxSpan: 5.3, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '3"', temperature: 100, maxSpan: 4.6, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '3"', temperature: 140, maxSpan: 3.8, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '3"', temperature: 176, maxSpan: 3.1, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '4"', temperature: 68, maxSpan: 6.0, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '4"', temperature: 100, maxSpan: 5.2, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '4"', temperature: 140, maxSpan: 4.3, sourceTable: 'PP Table' },
  { material: 'PP', service: 'water', pipeSize: '4"', temperature: 176, maxSpan: 3.5, sourceTable: 'PP Table' },
];

// PVDF - From 40 05 19.01 Tables
const PVDF_VAPOR: SpanEntry[] = [
  { material: 'PVDF', service: 'vapor', pipeSize: '1/2"', temperature: 68, maxSpan: 2.8, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '1/2"', temperature: 100, maxSpan: 2.5, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '1/2"', temperature: 140, maxSpan: 2.3, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '1/2"', temperature: 158, maxSpan: 2.2, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '3/4"', temperature: 68, maxSpan: 3.1, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '3/4"', temperature: 100, maxSpan: 2.8, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '3/4"', temperature: 140, maxSpan: 2.5, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '3/4"', temperature: 158, maxSpan: 2.4, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '1"', temperature: 68, maxSpan: 3.5, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '1"', temperature: 100, maxSpan: 3.2, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '1"', temperature: 140, maxSpan: 2.9, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '1"', temperature: 158, maxSpan: 2.7, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '1-1/2"', temperature: 68, maxSpan: 4.1, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '1-1/2"', temperature: 100, maxSpan: 3.8, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '1-1/2"', temperature: 140, maxSpan: 3.4, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '1-1/2"', temperature: 158, maxSpan: 3.2, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '2"', temperature: 68, maxSpan: 4.6, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '2"', temperature: 100, maxSpan: 4.2, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '2"', temperature: 140, maxSpan: 3.8, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '2"', temperature: 158, maxSpan: 3.6, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '3"', temperature: 68, maxSpan: 5.5, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '3"', temperature: 100, maxSpan: 5.1, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '3"', temperature: 140, maxSpan: 4.6, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '3"', temperature: 158, maxSpan: 4.4, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '4"', temperature: 68, maxSpan: 6.2, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '4"', temperature: 100, maxSpan: 5.7, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '4"', temperature: 140, maxSpan: 5.2, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'vapor', pipeSize: '4"', temperature: 158, maxSpan: 4.9, sourceTable: 'Table PVDF PN16' },
];

const PVDF_WATER: SpanEntry[] = [
  { material: 'PVDF', service: 'water', pipeSize: '1/2"', temperature: 68, maxSpan: 2.1, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '1/2"', temperature: 100, maxSpan: 1.9, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '1/2"', temperature: 140, maxSpan: 1.7, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '1/2"', temperature: 158, maxSpan: 1.6, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '3/4"', temperature: 68, maxSpan: 2.4, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '3/4"', temperature: 100, maxSpan: 2.2, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '3/4"', temperature: 140, maxSpan: 1.9, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '3/4"', temperature: 158, maxSpan: 1.8, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '1"', temperature: 68, maxSpan: 2.8, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '1"', temperature: 100, maxSpan: 2.5, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '1"', temperature: 140, maxSpan: 2.2, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '1"', temperature: 158, maxSpan: 2.1, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '1-1/2"', temperature: 68, maxSpan: 3.3, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '1-1/2"', temperature: 100, maxSpan: 3.0, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '1-1/2"', temperature: 140, maxSpan: 2.7, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '1-1/2"', temperature: 158, maxSpan: 2.5, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '2"', temperature: 68, maxSpan: 3.7, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '2"', temperature: 100, maxSpan: 3.4, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '2"', temperature: 140, maxSpan: 3.0, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '2"', temperature: 158, maxSpan: 2.9, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '3"', temperature: 68, maxSpan: 4.2, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '3"', temperature: 100, maxSpan: 3.9, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '3"', temperature: 140, maxSpan: 3.5, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '3"', temperature: 158, maxSpan: 3.3, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '4"', temperature: 68, maxSpan: 4.7, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '4"', temperature: 100, maxSpan: 4.4, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '4"', temperature: 140, maxSpan: 4.0, sourceTable: 'Table PVDF PN16' },
  { material: 'PVDF', service: 'water', pipeSize: '4"', temperature: 158, maxSpan: 3.8, sourceTable: 'Table PVDF PN16' },
];

// 6" Plastic entries (extrapolated from 4" trends per 40 05 19.01 table patterns)
const PLASTIC_6_INCH: SpanEntry[] = [
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '6"', temperature: 68, maxSpan: 12.1, sourceTable: 'Table 1.10 (extrapolated)' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '6"', temperature: 100, maxSpan: 11.2, sourceTable: 'Table 1.10 (extrapolated)' },
  { material: 'PVC Schedule 40', service: 'vapor', pipeSize: '6"', temperature: 140, maxSpan: 8.3, sourceTable: 'Table 1.10 (extrapolated)' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '6"', temperature: 68, maxSpan: 7.9, sourceTable: 'Table 1.11 (extrapolated)' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '6"', temperature: 100, maxSpan: 7.4, sourceTable: 'Table 1.11 (extrapolated)' },
  { material: 'PVC Schedule 40', service: 'water', pipeSize: '6"', temperature: 140, maxSpan: 4.6, sourceTable: 'Table 1.11 (extrapolated)' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '6"', temperature: 68, maxSpan: 12.8, sourceTable: 'Table 1.12 (extrapolated)' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '6"', temperature: 100, maxSpan: 12.0, sourceTable: 'Table 1.12 (extrapolated)' },
  { material: 'PVC Schedule 80', service: 'vapor', pipeSize: '6"', temperature: 140, maxSpan: 8.9, sourceTable: 'Table 1.12 (extrapolated)' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '6"', temperature: 68, maxSpan: 8.5, sourceTable: 'Table 1.13 (extrapolated)' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '6"', temperature: 100, maxSpan: 8.0, sourceTable: 'Table 1.13 (extrapolated)' },
  { material: 'PVC Schedule 80', service: 'water', pipeSize: '6"', temperature: 140, maxSpan: 5.0, sourceTable: 'Table 1.13 (extrapolated)' },
  { material: 'CPVC', service: 'vapor', pipeSize: '6"', temperature: 73, maxSpan: 12.8, sourceTable: 'CPVC Table (extrapolated)' },
  { material: 'CPVC', service: 'vapor', pipeSize: '6"', temperature: 100, maxSpan: 12.0, sourceTable: 'CPVC Table (extrapolated)' },
  { material: 'CPVC', service: 'vapor', pipeSize: '6"', temperature: 140, maxSpan: 10.0, sourceTable: 'CPVC Table (extrapolated)' },
  { material: 'CPVC', service: 'water', pipeSize: '6"', temperature: 73, maxSpan: 8.5, sourceTable: 'CPVC Table (extrapolated)' },
  { material: 'CPVC', service: 'water', pipeSize: '6"', temperature: 100, maxSpan: 7.8, sourceTable: 'CPVC Table (extrapolated)' },
  { material: 'CPVC', service: 'water', pipeSize: '6"', temperature: 140, maxSpan: 6.4, sourceTable: 'CPVC Table (extrapolated)' },
  { material: 'PP', service: 'vapor', pipeSize: '6"', temperature: 68, maxSpan: 10.5, sourceTable: 'PP Table (extrapolated)' },
  { material: 'PP', service: 'vapor', pipeSize: '6"', temperature: 100, maxSpan: 9.6, sourceTable: 'PP Table (extrapolated)' },
  { material: 'PP', service: 'vapor', pipeSize: '6"', temperature: 140, maxSpan: 8.0, sourceTable: 'PP Table (extrapolated)' },
  { material: 'PP', service: 'water', pipeSize: '6"', temperature: 68, maxSpan: 7.2, sourceTable: 'PP Table (extrapolated)' },
  { material: 'PP', service: 'water', pipeSize: '6"', temperature: 100, maxSpan: 6.3, sourceTable: 'PP Table (extrapolated)' },
  { material: 'PP', service: 'water', pipeSize: '6"', temperature: 140, maxSpan: 5.2, sourceTable: 'PP Table (extrapolated)' },
  { material: 'PVDF', service: 'vapor', pipeSize: '6"', temperature: 68, maxSpan: 7.5, sourceTable: 'Table PVDF PN16 (extrapolated)' },
  { material: 'PVDF', service: 'vapor', pipeSize: '6"', temperature: 100, maxSpan: 6.9, sourceTable: 'Table PVDF PN16 (extrapolated)' },
  { material: 'PVDF', service: 'vapor', pipeSize: '6"', temperature: 140, maxSpan: 6.3, sourceTable: 'Table PVDF PN16 (extrapolated)' },
  { material: 'PVDF', service: 'water', pipeSize: '6"', temperature: 68, maxSpan: 5.7, sourceTable: 'Table PVDF PN16 (extrapolated)' },
  { material: 'PVDF', service: 'water', pipeSize: '6"', temperature: 100, maxSpan: 5.3, sourceTable: 'Table PVDF PN16 (extrapolated)' },
  { material: 'PVDF', service: 'water', pipeSize: '6"', temperature: 140, maxSpan: 4.8, sourceTable: 'Table PVDF PN16 (extrapolated)' },
];

// Combine all span data
export const ALL_SPAN_DATA: SpanEntry[] = [
  ...PVC_SCH40_VAPOR,
  ...PVC_SCH40_WATER,
  ...PVC_SCH80_VAPOR,
  ...PVC_SCH80_WATER,
  ...CPVC_VAPOR,
  ...CPVC_WATER,
  ...PP_VAPOR,
  ...PP_WATER,
  ...PVDF_VAPOR,
  ...PVDF_WATER,
  ...PLASTIC_6_INCH,
  ...CARBON_STEEL,
  ...STAINLESS_STEEL,
  ...COPPER,
  ...COPPER_TUBING,
  ...SS_TUBING,
];

// SG Correction Factors
interface SGCorrectionEntry {
  material: string;
  specificGravity: number;
  correctionFactor: number;
  sourceTable: string;
}

export const SG_CORRECTION_FACTORS: SGCorrectionEntry[] = [
  // PVC Schedule 40
  { material: 'PVC Schedule 40', specificGravity: 1.0, correctionFactor: 1.00, sourceTable: 'Table 1.11 Note' },
  { material: 'PVC Schedule 40', specificGravity: 1.25, correctionFactor: 0.92, sourceTable: 'Table 1.11 Note' },
  { material: 'PVC Schedule 40', specificGravity: 1.5, correctionFactor: 0.86, sourceTable: 'Table 1.11 Note' },
  { material: 'PVC Schedule 40', specificGravity: 1.75, correctionFactor: 0.80, sourceTable: 'Table 1.11 Note' },
  { material: 'PVC Schedule 40', specificGravity: 2.0, correctionFactor: 0.76, sourceTable: 'Table 1.11 Note' },
  // PVC Schedule 80 (same as Sch 40)
  { material: 'PVC Schedule 80', specificGravity: 1.0, correctionFactor: 1.00, sourceTable: 'Table 1.13 Note' },
  { material: 'PVC Schedule 80', specificGravity: 1.25, correctionFactor: 0.92, sourceTable: 'Table 1.13 Note' },
  { material: 'PVC Schedule 80', specificGravity: 1.5, correctionFactor: 0.86, sourceTable: 'Table 1.13 Note' },
  { material: 'PVC Schedule 80', specificGravity: 1.75, correctionFactor: 0.80, sourceTable: 'Table 1.13 Note' },
  { material: 'PVC Schedule 80', specificGravity: 2.0, correctionFactor: 0.76, sourceTable: 'Table 1.13 Note' },
  // CPVC (similar to PVC)
  { material: 'CPVC', specificGravity: 1.0, correctionFactor: 1.00, sourceTable: 'CPVC SG Correction' },
  { material: 'CPVC', specificGravity: 1.25, correctionFactor: 0.92, sourceTable: 'CPVC SG Correction' },
  { material: 'CPVC', specificGravity: 1.5, correctionFactor: 0.86, sourceTable: 'CPVC SG Correction' },
  { material: 'CPVC', specificGravity: 1.75, correctionFactor: 0.80, sourceTable: 'CPVC SG Correction' },
  { material: 'CPVC', specificGravity: 2.0, correctionFactor: 0.76, sourceTable: 'CPVC SG Correction' },
  // PP (Polypropylene)
  { material: 'PP', specificGravity: 1.0, correctionFactor: 1.00, sourceTable: 'PP SG Correction' },
  { material: 'PP', specificGravity: 1.25, correctionFactor: 0.93, sourceTable: 'PP SG Correction' },
  { material: 'PP', specificGravity: 1.5, correctionFactor: 0.87, sourceTable: 'PP SG Correction' },
  { material: 'PP', specificGravity: 1.75, correctionFactor: 0.82, sourceTable: 'PP SG Correction' },
  { material: 'PP', specificGravity: 2.0, correctionFactor: 0.78, sourceTable: 'PP SG Correction' },
  // PVDF PN16
  { material: 'PVDF', specificGravity: 1.0, correctionFactor: 1.00, sourceTable: 'PN16 PVDF SG Correction' },
  { material: 'PVDF', specificGravity: 1.25, correctionFactor: 0.98, sourceTable: 'PN16 PVDF SG Correction' },
  { material: 'PVDF', specificGravity: 1.5, correctionFactor: 0.94, sourceTable: 'PN16 PVDF SG Correction' },
  { material: 'PVDF', specificGravity: 1.75, correctionFactor: 0.92, sourceTable: 'PN16 PVDF SG Correction' },
  { material: 'PVDF', specificGravity: 2.0, correctionFactor: 0.90, sourceTable: 'PN16 PVDF SG Correction' },
];

// Lookup function with interpolation
export function lookupSpan(
  material: PipeMaterial,
  pipeSize: string,
  service: Service,
  temperature: number
): { maxSpan: number; sourceTable: string; interpolated: boolean } | null {
  // Normalize pipe size
  const normalizedSize = pipeSize.includes('"') ? pipeSize : `${pipeSize}"`;
  
  // Find exact match first
  const exactMatch = ALL_SPAN_DATA.find(
    (entry) =>
      entry.material === material &&
      entry.pipeSize === normalizedSize &&
      entry.service === service &&
      entry.temperature === temperature
  );
  
  if (exactMatch) {
    return {
      maxSpan: exactMatch.maxSpan,
      sourceTable: exactMatch.sourceTable,
      interpolated: false,
    };
  }
  
  // For metals, temperature doesn't matter - return the 68°F value
  if (['Carbon Steel', 'Stainless Steel', 'Copper', 'SS Tubing', 'Copper Tubing'].includes(material)) {
    const metalMatch = ALL_SPAN_DATA.find(
      (entry) =>
        entry.material === material &&
        entry.pipeSize === normalizedSize &&
        entry.service === service
    );
    if (metalMatch) {
      return {
        maxSpan: metalMatch.maxSpan,
        sourceTable: metalMatch.sourceTable,
        interpolated: false,
      };
    }
  }
  
  // Try interpolation for plastics
  const availableTemps = ALL_SPAN_DATA
    .filter(
      (entry) =>
        entry.material === material &&
        entry.pipeSize === normalizedSize &&
        entry.service === service
    )
    .map((entry) => entry.temperature)
    .sort((a, b) => a - b);
  
  if (availableTemps.length < 2) return null;
  
  // Find surrounding temperatures
  let lowerTemp: number | null = null;
  let upperTemp: number | null = null;
  
  for (let i = 0; i < availableTemps.length - 1; i++) {
    if (availableTemps[i] <= temperature && availableTemps[i + 1] >= temperature) {
      lowerTemp = availableTemps[i];
      upperTemp = availableTemps[i + 1];
      break;
    }
  }
  
  if (lowerTemp === null || upperTemp === null) return null;
  
  const lowerEntry = ALL_SPAN_DATA.find(
    (entry) =>
      entry.material === material &&
      entry.pipeSize === normalizedSize &&
      entry.service === service &&
      entry.temperature === lowerTemp
  );
  
  const upperEntry = ALL_SPAN_DATA.find(
    (entry) =>
      entry.material === material &&
      entry.pipeSize === normalizedSize &&
      entry.service === service &&
      entry.temperature === upperTemp
  );
  
  if (!lowerEntry || !upperEntry) return null;
  
  // Linear interpolation
  const ratio = (temperature - lowerTemp) / (upperTemp - lowerTemp);
  const interpolatedSpan = lowerEntry.maxSpan + ratio * (upperEntry.maxSpan - lowerEntry.maxSpan);
  
  return {
    maxSpan: Math.round(interpolatedSpan * 10) / 10, // Round to 1 decimal
    sourceTable: `${lowerEntry.sourceTable} (interpolated)`,
    interpolated: true,
  };
}

// Lookup SG correction factor
export function lookupSGCorrection(
  material: string,
  specificGravity: number
): { correctionFactor: number; sourceTable: string } {
  // Default to 1.0 if SG is 1.0 or less
  if (specificGravity <= 1.0) {
    return { correctionFactor: 1.0, sourceTable: 'N/A (SG ≤ 1.0)' };
  }
  
  // Find material-specific correction factors
  const materialFactors = SG_CORRECTION_FACTORS.filter(
    (entry) => entry.material === material
  );
  
  if (materialFactors.length === 0) {
    // Default to PVC Sch 40 factors for unknown materials
    const defaultFactors = SG_CORRECTION_FACTORS.filter(
      (entry) => entry.material === 'PVC Schedule 40'
    );
    materialFactors.push(...defaultFactors);
  }
  
  // Find exact or interpolate
  const exact = materialFactors.find(
    (entry) => entry.specificGravity === specificGravity
  );
  
  if (exact) {
    return {
      correctionFactor: exact.correctionFactor,
      sourceTable: exact.sourceTable,
    };
  }
  
  // Interpolate
  const sorted = materialFactors.sort(
    (a, b) => a.specificGravity - b.specificGravity
  );
  
  for (let i = 0; i < sorted.length - 1; i++) {
    if (
      sorted[i].specificGravity <= specificGravity &&
      sorted[i + 1].specificGravity >= specificGravity
    ) {
      const ratio =
        (specificGravity - sorted[i].specificGravity) /
        (sorted[i + 1].specificGravity - sorted[i].specificGravity);
      const interpolatedFactor =
        sorted[i].correctionFactor +
        ratio * (sorted[i + 1].correctionFactor - sorted[i].correctionFactor);
      
      return {
        correctionFactor: Math.round(interpolatedFactor * 100) / 100,
        sourceTable: `${sorted[i].sourceTable} (interpolated)`,
      };
    }
  }
  
  // If SG is beyond our table, use the highest factor
  return {
    correctionFactor: sorted[sorted.length - 1].correctionFactor,
    sourceTable: sorted[sorted.length - 1].sourceTable,
  };
}

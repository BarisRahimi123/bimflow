import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug: Log configuration on server startup
if (typeof window === 'undefined') {
  console.log('Supabase Config:', {
    url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET',
    keySet: supabaseKey ? 'YES' : 'NO',
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE CONFIGURATION MISSING!');
  console.error('Please add to .env.local:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=https://pouzlstzxpggjpgutmvd.supabase.co');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions for PIDFlow tables
export interface PidflowProject {
  id: string;
  name: string;
  description?: string;
  client_name?: string;
  project_number?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PidflowDrawing {
  id: string;
  project_id: string;
  filename: string;
  original_url?: string;
  processed_url?: string;
  status: string;
  drawing_number?: string;
  revision?: string;
  extracted_data?: any;
  confidence_score?: number;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PidflowExtractedLine {
  id: string;
  drawing_id: string;
  line_number: string;
  line_class?: string;
  material?: string;
  pipe_size?: string;
  service?: string;
  from_equipment?: string;
  to_equipment?: string;
  insulation_type?: string;
  temperature?: number;
  pressure?: number;
  confidence_score?: number;
  verification_status: string;
  verified_by?: string;
  verified_at?: string;
  raw_extraction?: any;
  created_at: string;
}

export interface PidflowSupportCalculation {
  id: string;
  extracted_line_id?: string;
  material: string;
  pipe_size: string;
  service: string;
  temperature?: number;
  specific_gravity?: number;
  pipe_length?: number;
  orientation?: string;
  mounting_method?: string;
  max_span?: number;
  guide_spacing?: number;
  number_of_supports?: number;
  support_types?: any;
  hardware_recommendations?: any;
  warnings?: string[];
  citations?: any;
  created_at: string;
}

export interface PidflowVendorProduct {
  id: string;
  vendor: string;
  product_name: string;
  part_number?: string;
  category?: string;
  material_type?: string;
  pipe_size_range?: string;
  product_url?: string;
  image_url?: string;
  datasheet_url?: string;
  specifications?: any;
  cached_at: string;
  expires_at: string;
}

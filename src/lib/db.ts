import { createClient } from '@supabase/supabase-js';
import { Medicine } from '@/types';
import seedData from '@/data/seed-medicines.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Retrieves all verified medicines from Supabase DB or seed JSON fallback.
 */
export async function getVerifiedMedicines(): Promise<Medicine[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .eq('verified', true);
      
      if (!error && data && data.length > 0) {
        return data as Medicine[];
      }
    } catch (err) {
      console.warn('Supabase query failed, falling back to seed database JSON', err);
    }
  }

  return seedData as Medicine[];
}

/**
 * Fetch medicine by ID
 */
export async function getMedicineById(id: string): Promise<Medicine | null> {
  const medicines = await getVerifiedMedicines();
  return medicines.find(m => m.id === id) || null;
}

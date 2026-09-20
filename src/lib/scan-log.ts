import { createClient } from '@supabase/supabase-js';
import { Language, MatchStatus, ScanLog } from '@/types';

type RuntimeScanStore = typeof globalThis & {
  __medora_scan_logs__?: ScanLog[];
};

const runtimeStore = globalThis as RuntimeScanStore;

if (!runtimeStore.__medora_scan_logs__) {
  runtimeStore.__medora_scan_logs__ = [];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function logScanEvent({
  match_status,
  confidence,
  medicine_id,
  language
}: {
  match_status: MatchStatus;
  confidence: number;
  medicine_id?: string;
  language: Language;
}): Promise<ScanLog | null> {
  const logEntry: ScanLog = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    timestamp: new Date().toISOString(),
    match_status,
    confidence,
    medicine_id,
    language
  };

  if (supabase) {
    try {
      const { error } = await supabase.from('scan_logs').insert({
        id: logEntry.id,
        timestamp: logEntry.timestamp,
        match_status: logEntry.match_status,
        confidence: logEntry.confidence,
        medicine_id: logEntry.medicine_id || null,
        language: logEntry.language
      });

      if (!error) {
        runtimeStore.__medora_scan_logs__ = [logEntry, ...(runtimeStore.__medora_scan_logs__ || [])].slice(0, 50);
        return logEntry;
      }
    } catch (error) {
      console.warn('Supabase scan log insert failed; using in-memory fallback.', error);
    }
  }

  runtimeStore.__medora_scan_logs__ = [logEntry, ...(runtimeStore.__medora_scan_logs__ || [])].slice(0, 50);
  return logEntry;
}

export async function getScanLogs(limit: number = 25): Promise<ScanLog[]> {
  const inMemoryLogs = (runtimeStore.__medora_scan_logs__ || []).slice(0, limit);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('scan_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data as ScanLog[];
      }
    } catch (error) {
      console.warn('Supabase scan log fetch failed; using in-memory fallback.', error);
    }
  }

  return inMemoryLogs;
}

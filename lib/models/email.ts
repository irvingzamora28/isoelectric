// Email model interface and exports for provider use only
// NOTE: Use centralized constants from lib/constants.ts for DB and schema paths if needed.

export type Email = { id: number; email: string; created_at: string }

export interface IEmailModel {
  getAll(): Promise<Email[]>
  insert(email: string): Promise<void>
  getCount(): Promise<number>
}

export { SQLiteEmailModel } from '../providers/sqlite/emailModel'
export { SupabaseEmailModel } from '../providers/supabase/emailModel'

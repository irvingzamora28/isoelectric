export interface ContactSubmission {
  id: number
  name: string
  email: string
  message: string
  created_at: string
}

export interface IContactModel {
  getAll(): Promise<ContactSubmission[]>
  insert(data: Omit<ContactSubmission, 'id' | 'created_at'>): Promise<void>
}

export { SQLiteContactModel } from '../providers/sqlite/contactModel'
export { SupabaseContactModel } from '../providers/supabase/contactModel'

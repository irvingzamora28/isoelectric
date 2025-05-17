import type { SupabaseClient } from '@supabase/supabase-js'
import type { ContactSubmission, IContactModel } from '../../models/contact'
import { CONTACT_SUBMISSIONS_TABLE } from '../../constants'

export class SupabaseContactModel implements IContactModel {
  constructor(private supabase: SupabaseClient) {}

  async getAll(): Promise<ContactSubmission[]> {
    const { data, error } = await this.supabase
      .from(CONTACT_SUBMISSIONS_TABLE)
      .select('id, name, email, message, created_at')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  }

  async insert(data: Omit<ContactSubmission, 'id' | 'created_at'>): Promise<void> {
    const { error } = await this.supabase.from(CONTACT_SUBMISSIONS_TABLE).insert([data])
    if (error) throw error
  }
}

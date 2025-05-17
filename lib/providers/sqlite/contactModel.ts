import type Database from 'better-sqlite3'
import type { ContactSubmission, IContactModel } from '../../models/contact'
import { CONTACT_SUBMISSIONS_TABLE } from '../../constants'

export class SQLiteContactModel implements IContactModel {
  constructor(private db: Database) {}

  async getAll(): Promise<ContactSubmission[]> {
    return this.db
      .prepare(
        `SELECT id, name, email, message, created_at FROM ${CONTACT_SUBMISSIONS_TABLE} ORDER BY created_at DESC`
      )
      .all()
  }

  async insert(data: Omit<ContactSubmission, 'id' | 'created_at'>): Promise<void> {
    this.db
      .prepare(`INSERT INTO ${CONTACT_SUBMISSIONS_TABLE} (name, email, message) VALUES (?, ?, ?)`)
      .run(data.name, data.email, data.message)
  }
}

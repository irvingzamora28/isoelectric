import Database from 'better-sqlite3'
import fs from 'fs'
import { IDatabaseProvider } from '../dbProvider'
import { SQLiteEmailModel } from './sqlite/emailModel'
import { SQLITE_DB_PATH, SQLITE_SCHEMA_FILE } from '../constants'
import { ContactSubmission, SQLiteContactModel } from '../models/contact'

type Email = { id: number; email: string; created_at: string }

export class SQLiteProvider implements IDatabaseProvider {
  private db: Database.Database
  private emailModel: SQLiteEmailModel
  private contactModel: SQLiteContactModel

  constructor(dbPath: string = SQLITE_DB_PATH, schemaPath: string = SQLITE_SCHEMA_FILE) {
    this.db = new Database(dbPath)
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    this.db.exec(schema)
    this.emailModel = new SQLiteEmailModel(this.db)
    this.contactModel = new SQLiteContactModel(this.db)
  }

  async getAllEmails(): Promise<Email[]> {
    return this.emailModel.getAll()
  }
  async insertEmail(email: string): Promise<void> {
    this.emailModel.insert(email)
  }
  async getSubscriptionCount(): Promise<number> {
    return this.emailModel.getCount()
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return this.contactModel.getAll()
  }

  async insertContactSubmission(data: Omit<ContactSubmission, 'id' | 'created_at'>): Promise<void> {
    this.contactModel.insert(data)
  }
}

import { IDatabaseProvider } from './dbProvider'
import { SQLiteProvider } from './providers/sqliteProvider'
import { SupabaseProvider } from './providers/supabaseProvider'
import { SQLITE_DB_PATH, SQLITE_SCHEMA_FILE } from './constants'

const provider = process.env.DB_PROVIDER || 'sqlite'

let db: IDatabaseProvider
if (provider === 'supabase') {
  db = new SupabaseProvider()
} else {
  db = new SQLiteProvider(SQLITE_DB_PATH, SQLITE_SCHEMA_FILE)
}

export default db

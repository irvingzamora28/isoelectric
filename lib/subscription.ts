import db from './db'

export async function getSubscriptionCount(): Promise<number> {
  try {
    return await db.getSubscriptionCount()
  } catch {
    return 0
  }
}

export async function getAllEmails() {
  return db.getAllEmails()
}

export async function insertEmail(email: string) {
  return db.insertEmail(email)
}

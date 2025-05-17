// Database provider interface for scalable, swappable DB backends
export interface IDatabaseProvider {
  getAllEmails(): Promise<{ id: number; email: string; created_at: string }[]>
  insertEmail(email: string): Promise<void>
  getSubscriptionCount(): Promise<number>

  getAllContactSubmissions(): Promise<
    { id: number; name: string; email: string; message: string; created_at: string }[]
  >
  insertContactSubmission(
    data: Omit<{ name: string; email: string; message: string }, 'id' | 'created_at'>
  ): Promise<void>
}

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          user_id: string
          role: string
        }
        Insert: {
          user_id: string
          role: string
        }
        Update: {
          user_id?: string
          role?: string
        }
      }
    }
  }
}

export interface Comment {
  id: string
  post_id: string
  name: string
  email: string
  content: string
  created_at: string
  status: "pending" | "approved" | "rejected"
  parent_id?: string
  replies?: Comment[]
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  published: boolean
  published_at?: string
  created_at: string
  updated_at?: string
  category_id?: string
  author_id?: string
  image_path?: string
  meta_title?: string
  meta_description?: string
  view_count: number
  blog_categories?: {
    id: string
    name: string
    slug: string
  }
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at?: string
}

export interface BlogPostTag {
  post_id: string
  tag_id: string
  blog_tags?: BlogTag
}

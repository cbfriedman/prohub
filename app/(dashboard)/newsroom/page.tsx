import { createClient } from '@/lib/supabase/server'
import { NewsroomClient } from './newsroom-client'

export default async function NewsroomPage() {
  const supabase = await createClient()
  
  // Fetch all published newsroom posts
  const { data: posts } = await supabase
    .from('newsroom_posts')
    .select('*')
    .order('published_at', { ascending: false })
  
  return <NewsroomClient posts={posts || []} />
}

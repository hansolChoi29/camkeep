export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  photos?: string | null;
  user: {
    nickname: string;
    profile: string | null;
  } | null;
}

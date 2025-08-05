// User and Profile Types
export interface User {
  username?: string;
  avatar_url?: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  daily_images?: string[];
  tasks?: string[];
}

export interface UpdateProfileData {
  username?: string;
  name?: string;
  avatar?: string;
}

// Post Types
export interface Post {
  id: string;
  image: string;
  user_id: string;
  completed: boolean;
  public: boolean;
  created_at: string;
  user?: User;
}

export interface PostData {
  image: string;
  user_id: string;
  completed: boolean;
}

// Task Types
export interface Task {
  title: string;
}

export interface GridConfiguration {
  rows: number;
  cols: number;
  taskCount: number;
}

// Component Props Types
export interface PostListProps {
  post: Post;
}

export interface PostsGridProps {
  postData: Post[];
}

export interface GridProps {
  rows: number;
  cols: number;
}

export interface TaskItemProps {
  task: string;
  onDelete: () => void;
}

export interface UserProfileProps {
  name: string;
  username: string | null;
  avatarUrl: string | null;
  bio?: string;
  following: number;
  followers: number;
}

// Utility Types
export interface ReactNativeAsset {
  uri: string;
  type: string;
  name?: string;
}

// Navigation Types
export type NavigationSection = 'public' | 'completed' | 'all';

export type RootStackParamList = {
  TaskListScreen: undefined;
};

// Auth Types
export interface AuthData {
  session: any; // Session type from Supabase
  loading: boolean;
}
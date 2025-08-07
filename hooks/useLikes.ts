import { supabase } from "@/lib/supabase";

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

// Check if user has liked a post
export const checkUserLike = async (userId: string, postId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking user like:', error);
    return false;
  }
};

// Like a post
export const likePost = async (userId: string, postId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('likes')
      .insert([{ user_id: userId, post_id: postId }]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error liking post:', error);
    return false;
  }
};

// Unlike a post
export const unlikePost = async (userId: string, postId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error unliking post:', error);
    return false;
  }
};

// Get like count for a post
export const getLikeCount = async (postId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (error) {
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
};

// Get likes for multiple posts (efficient for feed)
export const getLikesForPosts = async (postIds: string[]): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('post_id')
      .in('post_id', postIds);

    if (error) {
      throw error;
    }

    // Count likes per post
    const likeCounts: Record<string, number> = {};
    postIds.forEach(id => likeCounts[id] = 0);
    
    data?.forEach(like => {
      likeCounts[like.post_id] = (likeCounts[like.post_id] || 0) + 1;
    });

    return likeCounts;
  } catch (error) {
    console.error('Error getting likes for posts:', error);
    return {};
  }
};

// Get user's liked posts
export const getUserLikedPosts = async (userId: string, postIds: string[]): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('post_id')
      .eq('user_id', userId)
      .in('post_id', postIds);

    if (error) {
      throw error;
    }

    return data?.map(like => like.post_id) || [];
  } catch (error) {
    console.error('Error getting user liked posts:', error);
    return [];
  }
};
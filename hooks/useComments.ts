import { supabase } from "@/lib/supabase";

export interface Comment {
    id: string;
    user_id: string;
    post_id: string;
    content: string;
    created_at: string;
    updated_at: string;
    user?: {
        username: string;
        avatar_url: string;
    };
}

// Get comments for a post
export interface Comment {
    id: string;
    user_id: string;
    post_id: string;
    content: string;
    created_at: string;
    updated_at: string;
    user?: { username: string; avatar_url: string; };
}

export const getCommentsForPost = async (postId: string): Promise<Comment[]> => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select(`
        id,
        user_id,
        post_id,
        content,
        created_at,
        updated_at,
        user:profiles(username, avatar_url)
      `)
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) {
            throw error;
        }

        // Map the data to ensure it matches the Comment type
        const comments: Comment[] = (data || []).map(comment => ({
            ...comment,
            user: comment.user[0], // Assuming user is an array, take the first object
        }));

        return comments;
    } catch (error) {
        console.error('Error getting comments:', error);
        return [];
    }
};

// Add a comment to a post
export const addComment = async (userId: string, postId: string, content: string): Promise<Comment | null> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ user_id: userId, post_id: postId, content }])
      .select(`
        id,
        user_id,
        post_id,
        content,
        created_at,
        updated_at,
        user:profiles(username, avatar_url)
      `)
      .single();

    if (error) {
      throw error;
    }

    // Map the data to ensure it matches the Comment type
    if (data) {
      return {
        ...data,
        user: data.user ? data.user[0] : undefined, // Ensure user is a single object
      } as Comment;
    }

    return null;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
};

// Update a comment
export const updateComment = async (commentId: string, content: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('comments')
            .update({ content, updated_at: new Date().toISOString() })
            .eq('id', commentId);

        if (error) {
            throw error;
        }

        return true;
    } catch (error) {
        console.error('Error updating comment:', error);
        return false;
    }
};

// Delete a comment
export const deleteComment = async (commentId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (error) {
            throw error;
        }

        return true;
    } catch (error) {
        console.error('Error deleting comment:', error);
        return false;
    }
};

// Get comment count for a post
export const getCommentCount = async (postId: string): Promise<number> => {
    try {
        const { count, error } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', postId);

        if (error) {
            throw error;
        }

        return count || 0;
    } catch (error) {
        console.error('Error getting comment count:', error);
        return 0;
    }
};

// Get comment counts for multiple posts (efficient for feed)
export const getCommentCountsForPosts = async (postIds: string[]): Promise<Record<string, number>> => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('post_id')
            .in('post_id', postIds);

        if (error) {
            throw error;
        }

        // Count comments per post
        const commentCounts: Record<string, number> = {};
        postIds.forEach(id => commentCounts[id] = 0);

        data?.forEach(comment => {
            commentCounts[comment.post_id] = (commentCounts[comment.post_id] || 0) + 1;
        });

        return commentCounts;
    } catch (error) {
        console.error('Error getting comment counts for posts:', error);
        return {};
    }
};
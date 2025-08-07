import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Alert } from "react-native";
import { UserProfile, PostData, UpdateProfileData } from "@/types";
import { USERNAME_SUFFIX_LENGTH, USERNAME_CHARACTERS } from "@/constants/AppConstants";

/**
 * Gets the current user's email from Supabase auth
 * @returns User email or null if not authenticated
 */
const getUserEmail = async (): Promise<string | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user email:', error);
      return null;
    }
    return user?.email || null;
  } catch (error) {
    console.error('Error getting user email:', error);
    return null;
  }
};

/**
 * Gets the current user's ID from Supabase auth
 * @returns User ID or null if not authenticated
 */
export const getUserId = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    return data.user?.id || null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

/**
 * Updates user's daily images in the database
 * @param userId - The user's ID
 * @param images - Array of image URLs
 */
export const updateImages = async (userId: string, images: (string | null)[]): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ daily_images: images })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to update images: ${error.message}`);
    }
  } catch (error) {
    console.error('Error updating user images:', error);
    throw error;
  }
};

/**
 * Retrieves user's daily images from the database
 * @param userId - The user's ID
 * @returns Array of image URLs or empty array if none found
 */
export const getUserImages = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('daily_images')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch user images: ${error.message}`);
    }
    
    return data?.daily_images || [];
  } catch (error) {
    console.error('Error fetching user images:', error);
    return [];
  }
};

/**
 * Inserts a new post into the database
 * @param userId - The user's ID
 * @param imageUrl - URL of the post image
 * @param isCompleted - Whether the post represents a completed grid
 */
export const insertPost = async (userId: string, imageUrl: string, isCompleted: boolean): Promise<void> => {
  try {
    const postData: PostData = {
      image: imageUrl,
      user_id: userId,
      completed: isCompleted
    };

    const { error } = await supabase
      .from('posts')
      .insert([postData]);

    if (error) {
      throw new Error(`Failed to insert post: ${error.message}`);
    }
  } catch (error) {
    console.error('Error inserting post:', error);
    throw error;
  }
};

/**
 * Retrieves all public posts with user information
 * @returns Array of posts with user data or empty array
 */
export const getPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
            *,
            user:profiles(*),
            likes:likes(count),
            comments:comments(count)
        `)
      .order('created_at', { ascending: false })
      .eq('public', true);

    if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

/**
 * Retrieves user's tasks from the database
 * @param userId - The user's ID
 * @returns Array of task strings or empty array
 */
export const getUserTasks = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('tasks')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch user tasks: ${error.message}`);
    }
    
    return data?.tasks || [];
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    return [];
  }
};

/**
 * Updates user's tasks in the database
 * @param userId - The user's ID
 * @param tasks - Array of task strings
 */
export const updateTasks = async (userId: string, tasks: string[]): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ tasks })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to update tasks: ${error.message}`);
    }
  } catch (error) {
    console.error('Error updating user tasks:', error);
    throw error;
  }
};

/**
 * Retrieves user's avatar URL from the database
 * @param userId - The user's ID
 * @returns Avatar URL or null if not found
 */
export const getAvatar = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch avatar: ${error.message}`);
    }
    
    return data?.avatar_url || null;
  } catch (error) {
    console.error('Error fetching avatar:', error);
    return null;
  }
};

/**
 * Retrieves complete user profile from the database
 * @param userId - The user's ID
 * @returns User profile data or null if not found
 */
export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to fetch profile');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    Alert.alert('Error', 'Failed to fetch profile');
    return null;
  }
};

/**
 * Retrieves user's username from the database
 * @param userId - The user's ID
 * @returns Username or null if not found
 */
export const getUsername = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch username: ${error.message}`);
    }
    
    return data?.username || null;
  } catch (error) {
    console.error('Error fetching username:', error);
    return null;
  }
};

/**
 * Generates a random username for new users based on their email
 * This should be called when a user first signs up
 */
export const generateUsername = async (): Promise<void> => {
  const { session } = useAuth();
  
  if (!session?.user?.id || !session?.user?.email) {
    console.error('No valid session found for username generation');
    return;
  }

  try {
    const existingUsername = await getUsername(session.user.id);
    if (existingUsername) {
      console.log('User already has a username');
      return;
    }

    // Generate username from email
    const emailPrefix = session.user.email.split('@')[0];
    const randomSuffix = Array.from({ length: USERNAME_SUFFIX_LENGTH }, () => {
      return USERNAME_CHARACTERS.charAt(Math.floor(Math.random() * USERNAME_CHARACTERS.length));
    }).join('');

    const generatedUsername = `${emailPrefix}_${randomSuffix}`;

    // Update both username and full_name in a single transaction would be better,
    // but for now we'll do them separately
    await Promise.all([
      supabase
        .from('profiles')
        .update({ username: generatedUsername })
        .eq('id', session.user.id),
      supabase
        .from('profiles')
        .update({ full_name: emailPrefix })
        .eq('id', session.user.id)
    ]);

    console.log('Generated username:', generatedUsername);
  } catch (error) {
    console.error('Error generating username:', error);
    throw error;
  }
};

/**
 * Updates user profile information
 * @param userId - The user's ID
 * @param profileData - Object containing profile fields to update
 */
export const updateProfile = async (userId: string, profileData: UpdateProfileData): Promise<void> => {
  try {
    const updateData: Partial<UserProfile> = {};
    
    if (profileData.username) updateData.username = profileData.username;
    if (profileData.name) updateData.full_name = profileData.name;
    if (profileData.avatar) updateData.avatar_url = profileData.avatar;

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export default getUserEmail;

export const updatePostPrivacy = async (postId: string, isPublic: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('posts')
      .update({ public: isPublic })
      .eq('id', postId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('Error updating post privacy:', error);
    return false;
  }
};

/**
 * Deletes a post from the database
 * @param postId - The post's ID
 * @returns Success status
 */
export const deletePostById = async (postId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
};

/**
 * Retrieves a single post by ID
 * @param postId - The post's ID
 * @returns Post data or null if not found
 */
export const getPostById = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};

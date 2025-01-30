import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Uuid } from "@uploadcare/upload-client";
import { Alert } from "react-native";

const getUserEmail = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
        return user.email;
    }
    return null
}

export const getUserId = async () => {
    const { data, error } = await supabase.auth.getUser(); // Get the current user

    if (error) {
        console.error('Error fetching user:', error);
        return null;
    }
    //console.log("id ", data.user.id)
    return data.user ? data.user.id : null; // Return user ID or null if not authenticated
};

export const updateImages = async (userId: any, images: any) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update({ daily_images: images })
            .eq('id', userId)
            .select()

        if (error) {
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error updating user images:', error);
    }
}

export const getUserImages = async (userId: string): Promise<string[] | null> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('daily_images')
            .eq('id', userId)
            .single();

        if (error) {
            throw new Error(error.message);
        }
        return data ? data.daily_images : null;

    } catch (error) {
        console.error('Error fetching user images:', error);
        return [];
    }
}

export const insertPost = async (userId: string, image: string, completed: boolean) => {
    const { data, error } = await supabase
        .from('posts')
        .insert([{ image: image, user_id: userId, completed: completed }])
        .select()
}

export const getPosts = async () => {
    const { data, error } = await supabase
        .from('posts')
        .select('*, user:profiles(*)')
        .order('created_at', { ascending: false })
    //.eq('id')

    return data
}

export const getUserTasks = async (userId: string): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('tasks')
            .eq('id', userId)
            .single();

        if (error) {
            throw new Error(error.message);
        }
        return data ? data.tasks : null;

    } catch (error) {
        console.error('Error fetching user tasks:', error);
        return [];
    }
}

export const updateTasks = async (userId: any, tasks: any) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update({ tasks: tasks })
            .eq('id', userId)
            .select()

        if (error) {
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error updating user tasks:', error);
    }
}

export const getAvatar = async (userId: any) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data ? data.avatar_url : null;

}

export const getProfile = async (userId: any) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        Alert.alert('Failed to fetch profile');
    }

    return data
}

export const getUsername = async (userId: any) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data ? data.username : null;

}


export const generateUsername = async () => {
    const { session } = useAuth();
    const username = await getUsername(session?.user.id + '')
    if (!username) {
        const email = session?.user.email + ''
        const usernamePart = email.split('@')[0];
        const randomSuffix = Array.from({ length: 4 }, () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            return characters.charAt(Math.floor(Math.random() * characters.length));
        }).join('');

        const randomUsername = `${usernamePart}_${randomSuffix}`;

        // update username and name
        if (session) {
            const { data, error } = await supabase
                .from('profiles')
                .update({ username: randomUsername })
                .eq('id', session.user.id)
                .select()

            if (error) {
                throw new Error(error.message);
            }
        }
        if (session) {
            const { data, error } = await supabase
                .from('profiles')
                .update({ full_name: usernamePart })
                .eq('id', session.user.id)
                .select()

            if (error) {
                throw new Error(error.message);
            }
        }

    }
}

export const updateProfile = async (userId: any, profileData: any) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update({ 
                username: profileData.username, 
                full_name: profileData.name,
                avatar_url: profileData.avatar,
            })
            .eq('id', userId)
            .select()

        if (error) {
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error updating user tasks:', error);
    }
}


export default getUserEmail
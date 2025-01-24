import { supabase } from "@/lib/supabase";
import { Uuid } from "@uploadcare/upload-client";

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

export const getUserImages = async (userId: string):Promise<string[]> => {
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

export const insertPost = async (userId: string, image: string) => {
    const {data, error} = await supabase
        .from('posts')
        .insert([{ image: image, user_id: userId}])
        .select()
}


export const getUserTasks = async (userId: string):Promise<string[]> => {
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

const getAvatar = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
        return user.id;
    }
    return null
}

export default getUserEmail
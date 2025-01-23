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
    console.log("id ", data.user.id)
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

export const getUserImages = async (userId: string) => {
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

const getAvatar = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
        return user.id;
    }
    return null
}

export default getUserEmail
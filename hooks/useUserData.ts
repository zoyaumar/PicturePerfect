import { supabase } from "@/lib/supabase";

const getUserEmail = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
        return user.email;
    }
    return null
}

const getAvatar = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
        return user.id;
    }
    return null
}

export default getUserEmail
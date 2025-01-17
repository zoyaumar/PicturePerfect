import { useAuth } from "@/providers/AuthProvider"
import { Link, Redirect } from "expo-router"
import { ActivityIndicator, Button, View } from "react-native"

export default function index() {
    const {session, loading} = useAuth()

    if(loading) {
        return <ActivityIndicator />
    }
    
    if(!session){
        return <Redirect href={'/(auth)/sign-in'} />
    }

    return (
        <Redirect href={'/(tabs)/picture'} />
        // <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
        //     <Link href={'/sign-in'} asChild>
        //         <Button title="Sign in" />
        //     </Link>
        // </View> 
    )
}
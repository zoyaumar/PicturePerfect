import { StyleSheet, Image, Platform, Button, ScrollView, StatusBar } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Redirect } from 'expo-router';
import Profile from '@/components/Profile';
import getUserEmail from '@/hooks/useUserData';
import { useEffect, useState } from 'react';

export default function TabTwoScreen() {
  const { session } = useAuth();
  const [email, setEmail] = useState<string | null>(null)

  useEffect(()=> {
    const fetchEmail = async () => {
      const fetchedEmail = await getUserEmail();
      setEmail(fetchedEmail || null)
    }
    fetchEmail()
  }, [])


  if (!session) {
    return <Redirect href={'/sign-in'} />;
  }
  return (

    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Profile</ThemedText>
      </ThemedView>
      <Profile
        name="Bob"
        email= {email}
        avatarUrl='https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Transparent-Clip-Art-PNG.png' 
        following= {0}
        followers={0} >
      </Profile>
      <Button onPress={() => supabase.auth.signOut()} title="Sign Out" />
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    justifyContent: 'center'
  },
  scrollView: {
    paddingTop: StatusBar.currentHeight,
  }
});

import { StyleSheet, Image, Platform, Button, ScrollView, StatusBar } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Redirect } from 'expo-router';
import Profile from '@/components/Profile';
import getUserEmail, { getAvatar, getProfile } from '@/hooks/useUserData';
import { useEffect, useState } from 'react';

export default function TabTwoScreen() {
  const { session } = useAuth();
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState('');
  const [username, setUsername] = useState('user');
  const [name, setName] = useState('user');


  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getProfile(session?.user.id);
      setEmail(session?.user.email+'')
      setAvatar(fetchedData.avatar_url)
      setUsername(fetchedData.username)
      setName(fetchedData.full_name)
    }
    fetchData()
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
        name={name}
        username={username}
        avatarUrl= { avatar }
        following={0}
        followers={0} >
      </Profile>
      <Button onPress={() => supabase.auth.signOut()} title="Sign Out" />
    </ScrollView >
  );
}

const styles = StyleSheet.create({
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

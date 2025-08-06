import { Image, StyleSheet, Platform } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect, useState } from 'react';
import { getProfile } from '@/hooks/useUserData';
import UserProfile from '@/components/Profile';
import PostNav from '@/components/TopBarNav';
import { Link, router, useGlobalSearchParams } from 'expo-router';

export default function TabTwoScreen() {
  const { session } = useAuth();
  const params = useGlobalSearchParams<{ userId: string }>();
  
  // State with proper initial values
  const [email, setEmail] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [username, setUsername] = useState<string>('user');
  const [name, setName] = useState<string>('user');
  const [id, setId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if session exists and has required data
        if (!session?.user?.id) {
          setError('No user session found');
          return;
        }

        // Fetch user profile data
        const fetchedData = await getProfile(session.user.id);
        
        if (!fetchedData) {
          setError('Failed to fetch user profile');
          return;
        }

        // Set data with proper null checks
        setEmail(session.user.email || '');
        setAvatar(fetchedData.avatar_url || '');
        setUsername(fetchedData.username || 'user');
        setName(fetchedData.full_name || 'user');
        
        // Handle userId from params
        const userIdFromParams = params.userId;
        if (userIdFromParams) {
          setId(userIdFromParams);
          router.setParams({ userId: userIdFromParams });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.id, params.userId]);

  // Loading state
  if (isLoading) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Loading...</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  // Error state
  if (error) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Error</ThemedText>
          <ThemedText>{error}</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  // No session state
  if (!session) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Not Authenticated</ThemedText>
          <ThemedText>Please log in to view your profile.</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Profile</ThemedText>
        <HelloWave />
      </ThemedView>
      
      <UserProfile 
        name={name} 
        username={username} 
        avatarUrl={avatar} 
        following={0} 
        followers={0} 
      />
      
      <PostNav />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

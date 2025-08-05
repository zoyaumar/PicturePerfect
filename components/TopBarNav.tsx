// screens/MainScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { PostsGrid } from './Posts';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Colors } from '@/constants/Colors';
import { Post, NavigationSection } from '@/types';

/**
 * Navigation component for filtering and displaying user posts
 * Provides tabs for Public, Completed, and All Posts
 */
const PostNav: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<NavigationSection>('public');
  const { session } = useAuth();
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [publicPosts, setPublicPosts] = useState<Post[]>([]);
  const [completedPosts, setCompletedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchAllPostTypes = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchAllPosts(),
          fetchPublicPosts(),  
          fetchCompletedPosts()
        ]);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPostTypes();
  }, [session?.user?.id]);

  /**
   * Fetches all posts for the current user
   */
  const fetchAllPosts = async (): Promise<void> => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all posts:', error);
      return;
    }

    setAllPosts(data || []);
  };

  /**
   * Fetches public posts for the current user
   */
  const fetchPublicPosts = async (): Promise<void> => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching public posts:', error);
      return;
    }

    setPublicPosts(data || []);
  };

  /**
   * Fetches completed posts for the current user
   */
  const fetchCompletedPosts = async (): Promise<void> => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('completed', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching completed posts:', error);
      return;
    }

    setCompletedPosts(data || []);
  };

  /**
   * Gets the appropriate posts based on current section
   */
  const getCurrentPosts = (): Post[] => {
    switch (currentSection) {
      case 'public':
        return publicPosts;
      case 'completed':
        return completedPosts;
      case 'all':
        return allPosts;
      default:
        return [];
    }
  };

  /**
   * Gets the appropriate button color based on selection state
   */
  const getButtonColor = (section: NavigationSection): string => {
    return currentSection === section ? Colors.light.tint : '#CCCCCC';
  };

  const currentPosts = getCurrentPosts();

  return (
    <View style={styles.container}>
      {/* Navigation buttons */}
      <View style={styles.navigationBar}>
        <View style={styles.navigationButton}>
          <Button
            title="Public"
            onPress={() => setCurrentSection('public')}
            color={getButtonColor('public')}
          />
        </View>
        <View style={styles.navigationButton}>
          <Button
            title="Completed"
            onPress={() => setCurrentSection('completed')}
            color={getButtonColor('completed')}
          />
        </View>
        <View style={styles.navigationButton}>
          <Button
            title="All Posts"
            onPress={() => setCurrentSection('all')}
            color={getButtonColor('all')}
          />
        </View>
      </View>

      {/* Content section */}
      <View style={styles.contentSection}>
        {isLoading ? (
          <Text style={styles.statusText}>Loading posts...</Text>
        ) : currentPosts.length > 0 ? (
          <PostsGrid postData={currentPosts} />
        ) : (
          <Text style={styles.statusText}>
            No {currentSection === 'all' ? '' : currentSection + ' '}posts yet
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    width: '100%'
  },
  navigationBar: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  navigationButton: {
    flex: 1,
    marginHorizontal: 2,
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default PostNav;
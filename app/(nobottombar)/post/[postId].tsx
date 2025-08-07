import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import Comments from '@/components/Comments';

import { updatePostPrivacy, getPostById, deletePostById} from '@/hooks/useUserData';

interface Post {
  id: string;
  user_id: string;
  image: string;
  completed: boolean;
  public: boolean;
  caption?: string;
  created_at: string;
  updated_at: string;
}

export default function PostDetailScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { session } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const data = await getPostById(postId!);

      if (!data) {
        Alert.alert('Error', 'Post not found');
        router.back();
        return;
      }

      // Check if user owns this post
      if (data.user_id !== session?.user?.id) {
        Alert.alert('Access Denied', 'You can only view your own posts here.');
        router.back();
        return;
      }

      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      Alert.alert('Error', 'Failed to load post');
      router.back();
    } finally {
      setLoading(false);
    }
  };

   const togglePrivacy = async (isPublic: boolean) => {
    if (!post || updating) return;

    setUpdating(true);
    try {
      const success = await updatePostPrivacy(post.id, isPublic);

      if (!success) {
        throw new Error('Failed to update privacy');
      }

      setPost(prev => prev ? { ...prev, public: isPublic } : null);
      
      Alert.alert(
        'Privacy Updated',
        `Post is now ${isPublic ? 'public' : 'private'}`
      );
    } catch (error) {
      console.error('Error updating privacy:', error);
      Alert.alert('Error', 'Failed to update privacy setting');
    } finally {
      setUpdating(false);
    }
  };

  const deletePost = async () => {
    if (!post) return;

    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deletePostById(post.id);

              if (!success) {
                throw new Error('Failed to delete post');
              }

              Alert.alert('Success', 'Post deleted successfully');
              router.back();
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!post) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>Post not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Post Details</ThemedText>
        <TouchableOpacity onPress={deletePost} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#ff4444" />
        </TouchableOpacity>
      </ThemedView>

      {/* Post Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: post.image }} style={styles.image} />
      </View>

      {/* Post Info */}
      <ThemedView style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Date Posted:</ThemedText>
          <ThemedText style={styles.value}>{formatDate(post.created_at)}</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Status:</ThemedText>
          <ThemedText style={[styles.value, { color: post.completed ? 'green' : 'orange' }]}>
            {post.completed ? 'Completed' : 'In Progress'}
          </ThemedText>
        </View>

        {/* Privacy Toggle */}
        <View style={styles.privacyContainer}>
          <View style={styles.privacyInfo}>
            <ThemedText style={styles.label}>Visibility:</ThemedText>
            <ThemedText style={[styles.value, { color: post.public ? 'blue' : 'gray' }]}>
              {post.public ? 'Public' : 'Private'}
            </ThemedText>
          </View>
          <Switch
            value={post.public}
            onValueChange={togglePrivacy}
            disabled={updating}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={post.public ? '#007BFF' : '#f4f3f4'}
          />
        </View>
          <View style={styles.privacyDescription}>
          <ThemedText style={styles.descriptionText}>
            {post.public 
              ? 'This post is visible to all users in the public feed' 
              : 'This post is only visible to you'}
          </ThemedText>
        </View>

        {/* Caption if exists */}
        {post.caption && (
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Caption:</ThemedText>
            <ThemedText style={styles.value}>{post.caption}</ThemedText>
          </View>
        )}
      </ThemedView>

      {/* Comments Section */}
      <ThemedView style={styles.commentsSection}>
        <TouchableOpacity 
          style={styles.commentsToggle}
          onPress={() => setShowComments(!showComments)}
        >
          <ThemedText style={styles.commentsToggleText}>
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </ThemedText>
          <Ionicons 
            name={showComments ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#007BFF" 
          />
        </TouchableOpacity>

        {showComments && (
          <View style={styles.commentsContainer}>
            <Comments postId={post.id} />
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
  },
  imageContainer: {
    aspectRatio: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
   privacyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privacyDescription: {
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  commentsSection: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  commentsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  commentsToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007BFF',
  },
  commentsContainer: {
    marginTop: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
    marginTop: 50,
  },
});
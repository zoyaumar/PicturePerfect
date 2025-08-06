import { Image, StyleSheet, Platform, View, StatusBar, FlatList, Text, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import React, { useEffect, useState } from 'react';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors';
import { Link, router, useGlobalSearchParams } from 'expo-router';
import { User, Post, PostListProps, PostsGridProps } from '@/types';
import { DEFAULT_AVATAR_URL, POSTS_GRID_COLUMNS, AVATAR_SIZE, AVATAR_BORDER_RADIUS } from '@/constants/AppConstants';

/**
 * Individual post component that displays user info and post image
 */
export default function PostList({ post }: PostListProps) {
  const [username, setUsername] = useState<string>('user');
  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_AVATAR_URL);
  const [userId, setUserId] = useState<string>(post.user_id);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Extract user data from the post
        const userUsername = post.user?.username || 'user';
        const userAvatarUrl = post.user?.avatar_url || DEFAULT_AVATAR_URL;
        
        setUsername(userUsername);
        setAvatarUrl(userAvatarUrl);
      } catch (error) {
        console.error('Error loading user data for post:', error);
        // Keep default values on error
      }
    };

    loadUserData();
  }, [post.user]);

  const handleProfileNavigation = () => {
    router.setParams({ userId: useGlobalSearchParams<{ userId: string }>().userId });
  };

  return (
    <ThemedView lightColor="white" style={styles.postContainer}>
      {/* User info section */}
      <View style={styles.userInfoSection}>
        <Link 
          href={{
            pathname: '/(tabs)/profile/[userId]',
            params: { userId }
          }}
          onPress={handleProfileNavigation}
        >
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
        </Link>
        <ThemedText type="defaultSemiBold"> {username} </ThemedText>
      </View>

      {/* Post image section */}
      <ThemedView style={styles.imageContainer}>
        <Image source={{ uri: post.image }} style={styles.postImage} />
      </ThemedView>

      {/* Action icons section */}
      <View style={styles.actionIconsSection}>
        <AntDesign
          name="hearto"
          size={30}
          // TODO: Implement like functionality
          // color={isLiked ? 'crimson' : 'black'}
        />
        <Ionicons name="chatbubble-outline" size={30} />
        {/* TODO: Implement share functionality */}
        {/* <Feather name="send" size={30} /> */}
      </View>
    </ThemedView>
  );
}

/**
 * Grid component for displaying multiple posts in a 3-column layout
 */
export const PostsGrid: React.FC<PostsGridProps> = ({ postData }) => {
  const [posts, setPosts] = useState<Post[]>(postData || []);
  const screenWidth = Dimensions.get('window').width;
  const columnWidth = screenWidth / POSTS_GRID_COLUMNS;

  useEffect(() => {
    setPosts(postData || []);
    console.log('Posts loaded:', postData?.length || 0);
  }, [postData]);

  const handlePostPress = (post: Post) => {
    // TODO: Implement post detail navigation
    console.log('Post pressed:', post.user_id);
  };

  return (
    <View style={styles.grid}>
      {posts.map((post, index) => (
        <TouchableOpacity
          key={`${post.user_id}-${index}`} // Better key using user_id and index
          style={[styles.gridItem, { width: '33%', height: columnWidth }]}
          onPress={() => handlePostPress(post)}
        >
          {post?.image ? (
            <Image source={{ uri: post.image }} style={styles.gridItemImage} />
          ) : (
            <View style={styles.placeholderItem} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  // PostList styles
  postImage: {
    width: '100%',
    height: '100%'
  },
  imageContainer: {
    flex: 1,
    aspectRatio: 1,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    margin: 5,
    marginLeft: 10,
    borderRadius: AVATAR_BORDER_RADIUS,
    padding: 2
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionIconsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: 5,
    marginLeft: 7
  },
  postContainer: {
    marginBottom: 5,
    marginTop: 10
  },

  // PostsGrid styles
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    margin: 8,
    padding: 3,
    justifyContent: 'flex-start',
    gap: 3
  },
  gridItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
  },
  gridItemImage: {
    width: '100%',
    height: '100%',
  },
  placeholderItem: {
    backgroundColor: '#eee',
    width: '100%',
    height: '100%',
  },
});
import { Image, StyleSheet, Platform, View, StatusBar, FlatList } from 'react-native';
import posts from '../../assets/posts.json'
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import PostList from '../../components/Posts';
import { getPosts } from '@/hooks/useUserData';


export default function HomeScreen() {
  const [posts, setPosts] = useState<any[] | null>(['']);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    getData()
  }, []);

  const getData = async () => {
    setLoading(true);
    const data = await getPosts()
    console.log(data?data[0].user.username:'hi')
    setPosts(data)
    setLoading(false);
  }

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">For You</ThemedText>
      </ThemedView>

      <FlatList
        data={posts}
        renderItem={({ item }) => <PostList post={item} />}
        showsVerticalScrollIndicator={false}
        onRefresh={getData}
        refreshing={loading}
      />

    </ScrollView>

  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: StatusBar.currentHeight,

  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    justifyContent: 'center',
  },

});

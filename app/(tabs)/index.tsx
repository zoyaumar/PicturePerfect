import { Image, StyleSheet, Platform, View, StatusBar, FlatList } from 'react-native';
import posts from '../../assets/posts.json'
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ScrollView } from 'react-native';
import React from 'react';
import PostList from '../../components/Posts';


export default function HomeScreen() {

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">For You</ThemedText>
      </ThemedView>
      
      <FlatList 
        data={posts}
        renderItem={({item}) => <PostList post={item} />}
        showsVerticalScrollIndicator={false}
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

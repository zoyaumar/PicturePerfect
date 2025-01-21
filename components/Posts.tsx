import { Image, StyleSheet, Platform, View, StatusBar } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import posts from '../assets/posts.json'

import { Ionicons, Feather, AntDesign } from '@expo/vector-icons'

export default function PostList({post}:{post:any}) {
    console.log(post)
    return (
        <ThemedView lightColor='white' style={styles.gap}>
            <View style={styles.username}>
                <Image source={{ uri: post.user.image_url }} style={styles.avatar} />
                <ThemedText type='defaultSemiBold'> {post.user.username} </ThemedText>
            </View>
            <ThemedView style={styles.imageContainer}>
                <Image source={{ uri: post.image_url }} style={styles.img} />
            </ThemedView>
            <View style={styles.icons}>
                <AntDesign
                    name={'hearto'}
                    size={30}
                // color={isLiked ? 'crimson' : 'black'}
                />
                <Ionicons name="chatbubble-outline" size={30} />
                {/* <Feather name="send" size={30} /> */}
            </View>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    img: {
        width: '100%',
        height: '100%'
    },
    imageContainer: {
        flex: 1,
        aspectRatio: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        margin: 5,
        marginLeft: 10,
        borderRadius: 100
    },
    username: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        padding: 5,
        marginLeft: 7
    },
    gap:{
        marginBottom:5,
        marginTop:10
    }
});
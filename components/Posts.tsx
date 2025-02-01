import { Image, StyleSheet, Platform, View, StatusBar, FlatList, Text, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import React, { useEffect, useState } from 'react';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors';
import { Link, router, useGlobalSearchParams } from 'expo-router';

export default function PostList({ post }: { post: any }) {
    const [username, setUser] = useState('user');
    const [avatar, setAvatar] = useState('https://ucarecdn.com/372dbec8-6008-4d2c-917a-b6c0da1b346b/-/scale_crop/300x300/');
    const [userId, setId] = useState(post.user_id)

    useEffect(() => {
        const getData = async () => {
            let username = await post.user.username
            setUser(username)
            let avatar = await post.user.avatar_url
            setAvatar(avatar)
        }
        getData()
    }, [])

    const updateParams= () =>{
        router.setParams({userId:useGlobalSearchParams<{ userId: string }>().userId})
    }

    return (
        <ThemedView lightColor='white' style={styles.gap}>
            <View style={styles.username}>
                <Link href={{
                    pathname: '/(tabs)/profile/[userId]',
                    params: {userId}
                }}
                onPress={()=>updateParams}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                </Link>
                {username ? (
                    <ThemedText type='defaultSemiBold'> {username} </ThemedText>
                ) : (
                    <ThemedText type='defaultSemiBold'> user </ThemedText>
                )}
            </View>

            <ThemedView style={styles.imageContainer}>
                <Image source={{ uri: post.image }} style={styles.img} />
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


export const PostsGrid = ({ postData }: any) => {
    const [posts, setPosts] = useState(postData)
    const columnWidth = (Dimensions.get('window').width) / 3
    useEffect(() => {
        setPosts(postData)
        console.log('posts', postData)
    }, [])

    return (
        <View style={styles.grid}>
            {posts && posts.map((post: any, index: number) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.gridItem, { width: '33%' }, { height: columnWidth }]}
                    onPress={() => ''}
                >
                    {post ? (<Image source={{ uri: post.image }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholder}>
                        </View>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};


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
    gap: {
        marginBottom: 5,
        marginTop: 10
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        //aspectRatio: 1,
        margin: 8,
        padding: 3,
        justifyContent: 'flex-start',
        gap: 3
    },
    gridItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        // alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        backgroundColor: '#eee',
        width: '100%',
        height: '100%',
    },
});
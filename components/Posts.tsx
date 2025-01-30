import { Image, StyleSheet, Platform, View, StatusBar, FlatList, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import React, { useEffect, useState } from 'react';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons'

export default function PostList({ post }: { post: any }) {
    const [username, setUser] = useState('user');
    const [avatar, setAvatar] = useState('https://ucarecdn.com/372dbec8-6008-4d2c-917a-b6c0da1b346b/-/scale_crop/300x300/');

    useEffect(() => {
        const getData = async () => {
            let username = await post.user.username
            setUser(username)
            let avatar = await post.user.avatar_url
            console.log(avatar)
            setAvatar(avatar)
        }
        getData()
    }, [])

    return (
        <ThemedView lightColor='white' style={styles.gap}>
            <View style={styles.username}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
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




export const PostsGrid = ({posts}:any) => {
    console.log('posts', posts)
    const renderItem = ({ item }: { item: { id: string; image: string } }) => (
        //<Text>{item.image} {item.id}</Text>
        <View style={styles.gridItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={3} // Set the number of columns for the grid
                columnWrapperStyle={styles.row} // Style for each row
            />
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
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#0009',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    gridItem: {
        flex: 1,
        margin: 5,
        aspectRatio: 1, 
    },
    image: {
        width: '100%',
        height: '100%',
    },
    row: {
        justifyContent: 'space-between',
    },
});
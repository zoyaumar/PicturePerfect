import { Image, StyleSheet, Platform, View, StatusBar, FlatList, Text, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import React, { useEffect, useState } from 'react';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors';
import { Link, router, useGlobalSearchParams } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { likePost, unlikePost, checkUserLike, getLikeCount } from '@/hooks/useLikes';
import { getCommentCount } from '@/hooks/useComments';
import Comments from './Comments';

export default function PostList({ post }: { post: any }) {
    const { session } = useAuth();
    const [username, setUser] = useState('user');
    const [avatar, setAvatar] = useState('https://ucarecdn.com/372dbec8-6008-4d2c-917a-b6c0da1b346b/-/scale_crop/300x300/');
    const [userId, setId] = useState(post.user_id);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [likingInProgress, setLikingInProgress] = useState(false);

    useEffect(() => {
        const getData = async () => {
            let username = await post.user.username
            setUser(username)
            let avatar = await post.user.avatar_url
            setAvatar(avatar)
            
            // Load like and comment counts
            const [likes, comments] = await Promise.all([
                getLikeCount(post.id),
                getCommentCount(post.id)
            ]);
            setLikeCount(likes);
            setCommentCount(comments);
            
            // Check if current user liked this post
            if (session?.user?.id) {
                const userLiked = await checkUserLike(session.user.id, post.id);
                setIsLiked(userLiked);
            }
        }
        getData()
    }, [session?.user?.id])

    const updateParams= () =>{
        router.setParams({userId:useGlobalSearchParams<{ userId: string }>().userId})
    }

    const handleLike = async () => {
        if (!session?.user?.id || likingInProgress) return;
        
        setLikingInProgress(true);
        try {
            if (isLiked) {
                const success = await unlikePost(session.user.id, post.id);
                if (success) {
                    setIsLiked(false);
                    setLikeCount(prev => prev - 1);
                }
            } else {
                const success = await likePost(session.user.id, post.id);
                if (success) {
                    setIsLiked(true);
                    setLikeCount(prev => prev + 1);
                }
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setLikingInProgress(false);
        }
    };

    const handleCommentCountChange = (newCount: number) => {
        setCommentCount(newCount);
    };

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
                <TouchableOpacity 
                    style={styles.iconButton} 
                    onPress={handleLike}
                    disabled={likingInProgress}
                >
                    <AntDesign
                        name={isLiked ? 'heart' : 'hearto'}
                        size={30}
                        color={isLiked ? 'crimson' : 'black'}
                    />
                    {likeCount > 0 && <ThemedText style={styles.iconText}>{likeCount}</ThemedText>}
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.iconButton} 
                    onPress={() => setShowComments(true)}
                >
                    <Ionicons name="chatbubble-outline" size={30} />
                    {commentCount > 0 && <ThemedText style={styles.iconText}>{commentCount}</ThemedText>}
                </TouchableOpacity>
            </View>
            
            {/* Comments Modal */}
            <Modal
                visible={showComments}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <ThemedText style={styles.modalTitle}>Comments</ThemedText>
                        <TouchableOpacity 
                            onPress={() => setShowComments(false)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} />
                        </TouchableOpacity>
                    </View>
                    <Comments 
                        postId={post.id} 
                        onCommentCountChange={handleCommentCountChange}
                    />
                </View>
            </Modal>
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
        borderRadius: 100,
        padding: 2
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
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    iconText: {
        fontSize: 14,
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
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
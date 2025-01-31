// screens/MainScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { PostsGrid } from './Posts';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const PostNav = () => {
    const [currentSection, setCurrentSection] = useState<'A' | 'B' | 'C'>('A');
    const { session } = useAuth();
    const [allPosts, setAllPosts] = useState<any[] | null>()
    const [publicPosts, setPublicPosts] = useState<any[] | null>()
    const [completedPosts, setCompletedPosts] = useState<any[] | null>()

    useEffect(() => {
        const getAllPosts = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', session?.user.id)
                .order('created_at', { ascending: false })
            //console.log('data', data)
            setAllPosts(data)
        }
        const getPublicPosts = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', session?.user.id)
                .eq('public', true)
                .order('created_at', { ascending: false })
            //console.log('data', data)
            setPublicPosts(data)
        }
        const getCompletedPosts = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', session?.user.id)
                .eq('completed', true)
                .order('created_at', { ascending: false })
            //console.log('data', data)
            setCompletedPosts(data)
        }
        getAllPosts()
        getPublicPosts()
        getCompletedPosts()
    }, [])
    

    return (
        <View style={styles.container}>
            <View style={styles.nav}>
                <View style={styles.button}>
                    <Button
                        title="Public"
                        onPress={() => setCurrentSection('A')}
                        color={currentSection === 'A' ? '#007BFF' : '#CCCCCC'}
                    />
                </View>
                <View style={styles.button}>
                    <Button
                        title="Completed"
                        onPress={() => setCurrentSection('B')}
                        color={currentSection === 'B' ? '#007BFF' : '#CCCCCC'}
                    />
                </View>
                <View style={styles.button}>
                    <Button
                        title="All Posts"
                        onPress={() => setCurrentSection('C')}
                        color={currentSection === 'C' ? '#007BFF' : '#CCCCCC'}
                    />
                </View>
            </View>

            {currentSection === 'A' && (
                <>
                {/* <PostsGrid postData={allPosts}></PostsGrid> */}
                    {allPosts ? (<PostsGrid postData={publicPosts}></PostsGrid>):(<Text style={styles.title}>No Posts Yet</Text>)}
                </>
            )}

            {currentSection === 'B' && (
                <>
                {/* <PostsGrid postData={allPosts}></PostsGrid> */}
                    {allPosts ? (<PostsGrid postData={completedPosts}></PostsGrid>):(<Text style={styles.title}>No Posts Yet</Text>)}
                </>
            )}

            {currentSection === 'C' && (
                <>
                {/* <PostsGrid postData={allPosts}></PostsGrid> */}
                    {allPosts ? (<PostsGrid postData={allPosts}></PostsGrid>):(<Text style={styles.title}>No Posts Yet</Text>)}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.dark.tint,
        color:Colors.dark.tint,
        width:'100%'
    },
    nav: {
        flexDirection: 'row',
        marginBottom: 5,
        //width:"33%"
    },
    button: {
        flex: 1
    },
    section: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
});

export default PostNav;
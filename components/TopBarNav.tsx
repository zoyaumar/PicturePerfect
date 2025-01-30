// screens/MainScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { PostsGrid } from './Posts';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

const PostNav = () => {
    const [currentSection, setCurrentSection] = useState<'A' | 'B' | 'C'>('A');
    const { session } = useAuth();
    const [allPosts, setAllPosts] = useState<any[] | null>()

    useEffect(() => {
        const getAllPosts = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', session?.user.id)
                .order('created_at', { ascending: false })
            console.log('data', data)
            setAllPosts(data)
        }
        getAllPosts()
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
                <View style={styles.section}>
                    <Text style={styles.title}>This is Section A</Text>
                    <PostsGrid posts={allPosts}></PostsGrid>
                </View>
            )}

            {currentSection === 'B' && (
                <View style={styles.section}>
                    <Text style={styles.title}>This is Section B</Text>
                    <PostsGrid posts={allPosts}></PostsGrid>
                </View>
            )}

            {currentSection === 'C' && (
                <View style={styles.section}>
                    <Text style={styles.title}>This is Section C</Text>
                    <PostsGrid posts={allPosts}></PostsGrid>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nav: {
        flexDirection: 'row',
        marginBottom: 20,
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
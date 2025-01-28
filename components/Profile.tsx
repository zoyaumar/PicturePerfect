import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { styles } from '@/assets/tasks/styles';

interface UserProfileProps {
    name: string;
    username: string | null;
    avatarUrl: string | null;
    bio?: string;
    following: number;
    followers: number;
}
const UserProfile: React.FC<UserProfileProps> = ({ name, username, avatarUrl, following, followers, bio }) => {
    const avatar = "https://ucarecdn.com/372dbec8-6008-4d2c-917a-b6c0da1b346b/-/scale_crop/300x300/"
    return (
        <View style={style.container}>
            <Image source={{ uri: avatarUrl ? avatarUrl:avatar }} style={style.avatar} />
            <Text style={style.name}>{name}</Text>
            <Text >{username}</Text>
            <ThemedView style={style.titleContainer}>
                <ThemedText type='defaultSemiBold'>Following: {following}</ThemedText>
                <ThemedText type='defaultSemiBold'>Followers: {followers}</ThemedText>
            </ThemedView>
            {bio && <Text style={style.bio}>{bio}</Text>}
            <ThemedView style={style.titleContainer}>
                <Button title={'Add Friends'}></Button>
                <Button title={'Edit Profile'}></Button>
            </ThemedView>

        </View>
    );
};

const style = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
        padding: 10,
        justifyContent: 'center'
    },
    container: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#888',
        marginBottom: 10,
    },
    bio: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});

export default UserProfile;

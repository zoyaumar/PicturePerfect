import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface UserProfileProps {
    name: string;
    email: string;
    avatarUrl: string;
    bio?: string;
    following: number;
    followers: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, email, avatarUrl, following, followers, bio }) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            <Text style={styles.name}>{name}</Text>
            <Text >{email}</Text>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type='defaultSemiBold'>Following: {following}</ThemedText>
                <ThemedText type='defaultSemiBold'>Followers: {followers}</ThemedText>
            </ThemedView>
            
            {bio && <Text style={styles.bio}>{bio}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
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

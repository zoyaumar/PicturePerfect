import { getProfile, updateProfile } from '@/hooks/useUserData';
import { useAuth } from '@/providers/AuthProvider';
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { uploadFile } from '@uploadcare/upload-client';

const ProfileScreen: React.FC = () => {
    const { session } = useAuth();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('………………');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState("https://ucarecdn.com/372dbec8-6008-4d2c-917a-b6c0da1b346b/-/scale_crop/300x300/");

    useEffect(() => {
        const fetchData = async () => {
            // Only fetch profile if session and user.id exist
            if (session?.user?.id) {
                const fetchedData = await getProfile(session.user.id);
                setEmail(session.user.email || '')
                
                // Handle potentially null fetchedData
                if (fetchedData) {
                    setAvatar(fetchedData.avatar_url ? fetchedData.avatar_url : avatar)
                    setUsername(fetchedData.username || '')
                    setName(fetchedData.full_name || '')
                }
            }
        }
        fetchData()
    }, [])

    const handleDeleteAccount = () => {
        // Handle delete account logic here
        console.log('Account deletion requested');
    };

    const handleSaveProfile = () => {
        // Handle save profile logic here
        const profileData = {
            name,
            username,
            password,
            email,
            avatar,
        };
        updateProfile(session?.user.id, profileData)
        console.log('Profile saved:', profileData);
        Alert.alert('Success', 'Profile saved successfully!');
    };

    const handleEditAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
            });
        
            if (!result.canceled) {
              type ReactNativeAsset = {
                uri: string;
                type: string;
                name?: string;
              };
              const assets: ReactNativeAsset = {
                uri: result.assets[0].uri,
                name: result.assets[0].fileName + '',
                type: 'image/jpeg',
              };

              uploadFile(assets, { publicKey: 'ad7300aff23461f09657' }).then((file) => {
                const newAvatar= file.cdnUrl + file.name
                setAvatar(newAvatar);
              })
            }
    };



    return (
        <ScrollView style={styles.container}>
            {/* <Text style={styles.header}>Edit Profile</Text> */}

            <View style={styles.avatarContainer}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <TouchableOpacity style={styles.editAvatarButton} onPress={handleEditAvatar}>
                    <Text style={styles.editAvatarButtonText}>Edit Image</Text>
                </TouchableOpacity>
            </View>



            <View style={styles.section}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>SAVE PROFILE</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                <Text style={styles.deleteButtonText}>DELETE ACCOUNT</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
    },
    editAvatarButton: {
        padding: 8,
        backgroundColor: '#6200ee',
        borderRadius: 8,
    },
    editAvatarButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },

    section: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        fontSize: 18,
        color: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
    },
    deleteButton: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#ff4444',
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButton: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    deleteButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;

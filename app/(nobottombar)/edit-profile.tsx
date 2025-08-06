import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/providers/AuthProvider';
import { getProfile, updateProfile } from '@/hooks/useUserData';
import { Colors } from '@/constants/Colors';
import { DEFAULT_AVATAR_URL } from '@/constants/AppConstants';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile } from '@uploadcare/upload-client';
import { UPLOADCARE_PUBLIC_KEY } from '@/constants/AppConstants';

export default function EditProfile() {
    const { session } = useAuth();
    
    // State with proper TypeScript types
    const [name, setName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('………………');
    const [email, setEmail] = useState<string>('');
    const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR_URL);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Check if session exists and has required data
                if (!session?.user?.id) {
                    setError('No user session found');
                    return;
                }

                // Fetch user profile data
                const fetchedData = await getProfile(session.user.id);
                
                if (!fetchedData) {
                    setError('Failed to fetch user profile');
                    return;
                }

                // Set data with proper null checks
                setEmail(session.user.email || '');
                setAvatar(fetchedData.avatar_url || DEFAULT_AVATAR_URL);
                setUsername(fetchedData.username || '');
                setName(fetchedData.full_name || '');
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load user data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [session?.user?.id]);

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => {
                    // Handle delete account logic here
                    console.log('Account deletion requested');
                }}
            ]
        );
    };

    const handleImagePicker = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const selectedImage = result.assets[0];
                const asset = {
                    uri: selectedImage.uri,
                    name: selectedImage.fileName || 'avatar.jpg',
                    type: 'image/jpeg',
                };

                // Upload to Uploadcare
                const uploadedFile = await uploadFile(asset, { publicKey: UPLOADCARE_PUBLIC_KEY });
                const imageUrl = uploadedFile.cdnUrl + uploadedFile.name;
                setAvatar(imageUrl);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Failed to upload image');
        }
    };

    const handleSave = async () => {
        if (!session?.user?.id) {
            Alert.alert('Error', 'No user session found');
            return;
        }

        if (!username.trim()) {
            Alert.alert('Error', 'Username is required');
            return;
        }

        try {
            setIsSaving(true);
            const profileData = {
                username: username.trim(),
                name: name.trim(),
                avatar: avatar,
            };

            await updateProfile(session.user.id, profileData);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedView style={styles.loadingContainer}>
                    <ThemedText type="title">Loading...</ThemedText>
                </ThemedView>
            </ScrollView>
        );
    }

    // Error state
    if (error) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedView style={styles.errorContainer}>
                    <ThemedText type="title">Error</ThemedText>
                    <ThemedText>{error}</ThemedText>
                </ThemedView>
            </ScrollView>
        );
    }

    // No session state
    if (!session) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedView style={styles.errorContainer}>
                    <ThemedText type="title">Not Authenticated</ThemedText>
                    <ThemedText>Please log in to edit your profile.</ThemedText>
                </ThemedView>
            </ScrollView>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ThemedView style={styles.header}>
                <ThemedText type="title">Edit Profile</ThemedText>
            </ThemedView>

            {/* Avatar Section */}
            <View style={styles.avatarSection}>
                <TouchableOpacity onPress={handleImagePicker} style={styles.avatarContainer}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    <View style={styles.avatarOverlay}>
                        <Text style={styles.avatarOverlayText}>Change Photo</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your full name"
                        autoCapitalize="words"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Enter your username"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={email}
                        editable={false}
                        placeholder="Email address"
                    />
                    <Text style={styles.helperText}>Email cannot be changed</Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={password}
                        editable={false}
                        secureTextEntry
                    />
                    <Text style={styles.helperText}>Use Supabase auth to change password</Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.saveButton, isSaving && styles.disabledButton]} 
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    <Text style={styles.saveButtonText}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.deleteButton} 
                    onPress={handleDeleteAccount}
                >
                    <Text style={styles.deleteButtonText}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: Colors.light.background,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.light.tabIconDefault,
    },
    avatarOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingVertical: 8,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
        alignItems: 'center',
    },
    avatarOverlayText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    formContainer: {
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.light.tabIconDefault,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: Colors.light.background,
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#888',
    },
    helperText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    buttonContainer: {
        gap: 15,
    },
    saveButton: {
        backgroundColor: Colors.light.tint,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.5,
    },
    deleteButton: {
        backgroundColor: '#ff4444',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

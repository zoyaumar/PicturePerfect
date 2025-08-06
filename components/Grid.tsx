import React, { useEffect, useRef, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, Dimensions, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UploadClient, uploadFile } from '@uploadcare/upload-client';
import { getUserImages, getUserTasks, insertPost, updateImages } from '@/hooks/useUserData';
import { ThemedText } from './ThemedText';
import ViewShot, { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import { useAuth } from '@/providers/AuthProvider';
import { GridProps, ReactNativeAsset } from '@/types';
import { UPLOADCARE_PUBLIC_KEY, IMAGE_QUALITY, IMAGE_TYPE } from '@/constants/AppConstants';

/**
 * Grid component for displaying and managing user images and tasks
 * Allows users to upload images to grid cells and save the grid as a collage
 */
const Grid: React.FC<GridProps> = ({ rows, cols }) => {
  const { session } = useAuth();
  const [gridImages, setGridImages] = useState<(string | null)[]>(Array(rows * cols).fill(null));
  const [userTasks, setUserTasks] = useState<string[]>(['']);
  const viewRef = useRef<ViewShot>(null);

  const totalGridCells = rows * cols;
  const screenWidth = Dimensions.get('window').width;
  const cellWidth = screenWidth / cols;
  const cellHeight = screenWidth / rows;

  useEffect(() => {
    const loadUserData = async () => {
      if (!session?.user?.id) return;

      try {
        // Load user images
        const fetchedImages = await getUserImages(session.user.id);
        const imageArray = Array(totalGridCells).fill(null);
        
        if (fetchedImages) {
          for (let i = 0; i < Math.min(fetchedImages.length, imageArray.length); i++) {
            imageArray[i] = fetchedImages[i];
          }
        }

        setGridImages(imageArray);
        
        // Load user tasks
        const fetchedTasks = await getUserTasks(session.user.id);
        setUserTasks(fetchedTasks);
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      }
    };

    loadUserData();
  }, [session?.user?.id, totalGridCells]);

  /**
   * Handles image selection and upload for a specific grid cell
   */
  const handleImageSelection = async (cellIndex: number) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled || !session?.user?.id) return;

      const selectedImage = result.assets[0];
      const asset: ReactNativeAsset = {
        uri: selectedImage.uri,
        name: selectedImage.fileName || 'image.jpg',
        type: IMAGE_TYPE,
      };

      // Upload image to Uploadcare
      const uploadedFile = await uploadFile(asset, { publicKey: UPLOADCARE_PUBLIC_KEY });
      const imageUrl = uploadedFile.cdnUrl + uploadedFile.name;

      // Update grid images
      const updatedImages = [...gridImages];
      updatedImages[cellIndex] = imageUrl;
      const trimmedImages = updatedImages.slice(0, totalGridCells);
      
      setGridImages(trimmedImages);
      await updateImages(session.user.id, trimmedImages);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  /**
   * Captures the grid as an image and saves it as a post
   */
  const saveGridAsCollage = async () => {
    if (!viewRef.current || !session?.user?.id) return;

    try {
      // Capture the grid view
      const capturedImageUri = await captureRef(viewRef.current, {
        format: 'jpg',
        quality: IMAGE_QUALITY,
      });

      // Save to device storage
      const filePath = `${RNFS.ExternalDirectoryPath}/collage.jpg`;
      await RNFS.copyFile(capturedImageUri, filePath);
      console.log('Collage saved to:', filePath);

      // Upload collage to Uploadcare
      const asset: ReactNativeAsset = {
        uri: capturedImageUri,
        type: IMAGE_TYPE,
      };

      const uploadedFile = await uploadFile(asset, { publicKey: UPLOADCARE_PUBLIC_KEY });
      const collageUrl = uploadedFile.cdnUrl + uploadedFile.name;
      
      // Check if grid is completed (all cells have images)
      const filledCells = gridImages.filter(image => image !== null).length;
      const isCompleted = filledCells === totalGridCells;

      // Save as post
      await insertPost(session.user.id, collageUrl, isCompleted);

      // Reset grid
      const emptyGrid = Array(totalGridCells).fill(null);
      setGridImages(emptyGrid);
      await updateImages(session.user.id, emptyGrid);

      Alert.alert('Success', 'Grid saved as collage!');
      
    } catch (error) {
      console.error('Error saving collage:', error);
      Alert.alert('Error', 'Failed to save collage');
    }
  };

  return (
    <View>
      <ViewShot ref={viewRef} style={styles.grid}>
        {gridImages.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.gridCell,
              { width: cellWidth, height: cellHeight }
            ]}
            onPress={() => handleImageSelection(index)}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.cellImage} />
            ) : (
              <View style={styles.placeholderCell}>
                {userTasks[index] ? (
                  <ThemedText type="subtitle" style={styles.taskText}>
                    {userTasks[index]}
                  </ThemedText>
                ) : (
                  <ThemedText type="subtitle">
                    No task found at this index.
                  </ThemedText>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ViewShot>
      <Button title="Save Grid as Image" onPress={saveGridAsCollage} />
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
  },
  gridCell: {
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCell: {
    backgroundColor: '#eee',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  taskText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
  },
});

export default Grid;






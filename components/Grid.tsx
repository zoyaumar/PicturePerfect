import React, { useEffect, useRef, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, Dimensions, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UploadClient, uploadFile } from '@uploadcare/upload-client';
import { getUserId, getUserImages, getUserTasks, insertPost, updateImages } from '@/hooks/useUserData';
import { ThemedText } from './ThemedText';
import ViewShot, { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import { useAuth } from '@/providers/AuthProvider';


const Grid = ({ rows, cols }: { rows: number, cols: number }) => {

  const { session } = useAuth();
  const [images, setImages] = useState(Array(rows * cols).fill(null));
  const [fetchedTasks, setTasks] = useState(['']);

  //  const { user } = useAuth();
  //  user.id

  useEffect(() => {
    const getData = async () => {
      const fetchedImages = await getUserImages(session?.user.id + '');
      const arr = Array(rows * cols).fill(null)
      if (fetchedImages) {
        for (let i = 0; i < fetchedImages.length && i < arr.length; i++) {
          arr[i] = fetchedImages[i]
        }
      }

      setImages(arr)
      setTasks(await getUserTasks(session?.user.id + ''))
    };
    getData()

  }, [])


  const pickImage = async (index: number) => {
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


      let newImages = [...images];
      uploadFile(assets, { publicKey: 'ad7300aff23461f09657' }).then((file) => {
        newImages[index] = file.cdnUrl + file.name
        newImages = newImages.slice(0, rows * cols)
        setImages(newImages);
        console.log(newImages)
        updateImages(session?.user.id, newImages)
      })

    }
  };


  const columnWidth = (Dimensions.get('window').width) / cols
  const columnHeight = (Dimensions.get('window').width) / rows

  const viewRef = useRef<ViewShot>(null);


  const saveCollage = async () => {
    if (viewRef.current) {
      try {
        const uri = await captureRef(viewRef.current, {
          format: 'jpg',
          quality: 0.8,
        });

        const path = `${RNFS.ExternalDirectoryPath}/collage.jpg`;
        await RNFS.copyFile(uri, path);
        console.log('Image saved to', path);

        type ReactNativeAsset = {
          uri: string;
          type: string;
          name?: string;
        };
        const assets: ReactNativeAsset = {
          uri: uri,
          type: 'image/jpeg',
        };

        const imageCount = images.filter(item => item !== null).length;

        uploadFile(assets, { publicKey: 'ad7300aff23461f09657' }).then((file) => {
          const imgUrl = file.cdnUrl + file.name
          insertPost(session?.user.id + '', imgUrl, (images.length==imageCount))
        })

        setImages(Array(rows * cols).fill(null))
        updateImages(session?.user.id, Array(rows * cols).fill(null))


      } catch (error) {
        console.error('Error capturing view:', error);
      }
    } else {
      console.error('View reference is undefined');
    }
  };


  return (
    <View>
      <ViewShot ref={viewRef} style={styles.grid}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.gridItem, { width: columnWidth }, { height: columnHeight }]}
            onPress={() => pickImage(index)}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (

              <View style={styles.placeholder}>
                {fetchedTasks[index] ? (
                  <ThemedText type='subtitle' style={styles.text}>{fetchedTasks[index]}</ThemedText>
                ) : (
                  <ThemedText type='subtitle' >No task found at this index.</ThemedText>
                )}
              </View>

            )}
          </TouchableOpacity>
        ))}
      </ViewShot>
      <Button title="Save Grid as Image" onPress={saveCollage} />
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center'
  },
  gridItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
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
  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    justifyContent: 'center'
  }
});


export default Grid;






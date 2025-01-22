import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Grid = ({ rows = 3, cols = 3 }) => {
  const [images, setImages] = useState(Array(rows * cols).fill(null));

  const pickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  const columnWidth = (Dimensions.get('window').width)/cols
  const columnHeight = (Dimensions.get('window').width)/rows

  return (
    <View style={styles.grid}>
      {images.map((image, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.gridItem, {width:columnWidth}, {height:columnHeight}]}
          onPress={() => pickImage(index)}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    aspectRatio:1,
    justifyContent:'center'
  },
  gridItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent:'center',
    alignItems:'center',
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

export default Grid;

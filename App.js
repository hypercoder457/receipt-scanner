import { useState } from 'react';
import { StyleSheet, Button, View, Image, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import Tesseract from "tesseract.js";

export default function App() {
  const [pickedImgUrl, setPickedImgUrl] = useState("");
  const [textInvisible, setTextInvisible] = useState(true);
  const [textFromImg, setTextFromImg] = useState("");
  const [progress, setProgress] = useState(0);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });

    if (!result.cancelled) {
      setPickedImgUrl(result.uri);
    };
  };

  const doOCR = () => {
    Tesseract.recognize(
      pickedImgUrl,
      'eng', // recognize english language
      {
        logger: m => {
          setProgress(m.progress);
        }
      }
    )
      .then(({ data: { text } }) => {
        setTextFromImg(text); // load text from image
        setTextInvisible(false); // text invisible: false
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Select an image with text" onPress={pickImage} />
      </View>
      <View style={styles.imageContainer}>
        {
          pickedImgUrl !== '' && <Image source={{ uri: pickedImgUrl }} style={styles.image} />
        }
      </View>
      <Button title="Scan image" onPress={doOCR} disabled={!pickedImgUrl} />
      <Progress.Bar progress={progress} style={{ marginTop: 40 }} />
      {
        !textInvisible && (
          <>
            <Text>Extracted text from image:</Text>
            <Text>{textFromImg}</Text>
          </>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: 400,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  imageContainer: {
    padding: 30
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: 'cover'
  }
});

import * as ImagePicker
  from "expo-image-picker";

import {
  ref,
  uploadBytes,
} from "firebase/storage";

import { storage }
  from "../firebase";

export async function
uploadExperimentImage() {

  try {

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {

      alert(
        "Permission required"
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({

        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        quality: 0.7,
      });

    if (result.canceled)
      return;

    const image =
      result.assets[0];

    const response =
      await fetch(
        image.uri
      );

    const blob =
      await response.blob();

    const imageRef =
      ref(

        storage,

        `experiments/${Date.now()}.jpg`
      );

    await uploadBytes(
      imageRef,
      blob
    );

    alert(
      "Upload successful ☁"
    );

  } catch (error) {

    console.log(error);
  }
}

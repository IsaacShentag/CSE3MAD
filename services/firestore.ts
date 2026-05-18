import {
  collection,
  addDoc,
} from "firebase/firestore";

import { db }
  from "../firebase";

export async function
saveExperiment(
  activity: string,
  score: number
) {

  try {

    await addDoc(

      collection(
        db,
        "experiments"
      ),

      {
        activity,
        score,

        createdAt:
          Date.now(),
      }
    );

    console.log(
      "Experiment uploaded"
    );

  } catch (error) {

    console.log(error);
  }
}


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkI6aRu4l3RsrSRhHPwZHZ0iJZCNKnGeo",
  authDomain: "syn2-459704.firebaseapp.com",
  projectId: "syn2-459704",
  storageBucket: "syn2-459704.firebasestorage.app",
  messagingSenderId: "54390780190",
  appId: "1:54390780190:web:3d1d5fdd32f23dd92cd90f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;

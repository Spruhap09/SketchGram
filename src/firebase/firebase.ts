import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfig  from "@/firebase/config";
import { getStorage } from "firebase/storage";

export default function initFirebaseConfig() {
    const app = initializeApp(firebaseConfig); // Initialize Firebase Auth
    const db = getFirestore(app); // Initialize Firebase Firestore
    const storage = getStorage(app); // Initialize Firebase Storage
}
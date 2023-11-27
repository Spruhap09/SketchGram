import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfig  from "@/firebase/config";

export default function initFirebaseConfig() {
    const app = initializeApp(firebaseConfig); // Initialize Firebase Auth
    const db = getFirestore(app); // Initialize Firebase Firestore
}
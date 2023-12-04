import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import firebaseConfig  from "@/firebase/config";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { getAuth, connectAuthEmulator} from "firebase/auth";

export default function initFirebaseConfig() {
    const app = initializeApp(firebaseConfig); // Initialize Firebase App

    const db = getFirestore(app); // Initialize Firebase Firestore
    const storage = getStorage(app); // Initialize Firebase Storage
    const auth = getAuth(app); // Initialize Firebase Auth
    
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectStorageEmulator(storage, '127.0.0.1', 9199)
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
}
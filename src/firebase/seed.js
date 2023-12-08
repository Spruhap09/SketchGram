
const {getFirestore, addDoc, collection, connectFirestoreEmulator} = require('firebase/firestore');
const {getAuth, signOut, connectAuthEmulator, createUserWithEmailAndPassword, updateProfile} = require('firebase/auth');
const {initializeApp} = require('firebase/app');
const { exit } = require('process');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUsers = [
    {
        "displayName": "Thomas",
        "email": "tbyrnes@stevens.edu",
    },
    {
        "displayName": "Josh",
        "email": "jmeharg1@stevens.edu",
    },
    {
        "displayName": "Francesca",
        "email": "fseverin@stevens.edu",
    },
    {
        "displayName": "Spruha",
        "email": "sparadka@stevens.edu",
    },
    {
        "displayName": "Stephanie",
        "email": "smartin7@stevens.edu",
    },
]

// Sleep for 30 seconds to give the firebase emulators time to start
sleep(30000).then(async () => {
    console.log('Initializing firebase in seed script...');
    const app = initializeApp({
        apiKey: "AIzaSyDm96LImbk8Am24NVCWE_oj8uk-89pct8I",
        authDomain: "cs554-final-project-8094e.firebaseapp.com",
        projectId: "cs554-final-project-8094e",
        storageBucket: "cs554-final-project-8094e.appspot.com",
        messagingSenderId: "1021371625874",
        appId: "1:1021371625874:web:63f4258c45f893b2c0d14b",
    })
    
    const db = getFirestore(app);
    if(!db) {
        console.log('Seeding Error: db is null');
        exit();
    }
    const auth = getAuth(app);
    if(!auth) {
        console.log('Seeding Error: auth is null');
        exit();
    }

    console.log('Connecting to firebase emulators...')
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');

    for(const user of mockUsers)  {
        console.log('Seeding user: ', user)
        await createUserWithEmailAndPassword(auth, user.email, "password");
        if(!auth.currentUser) {
            console.log('Seeding Error: auth.currentUser is null');
            exit();
        }
        await updateProfile(auth.currentUser, { displayName: user.displayName });

        const docRef = await addDoc(collection(db, "users"), {
            uid: auth.currentUser.uid,
            displayName: user.displayName,
            email: user.email,
            followers: [],
            following: [],
            posts: [],
            drafts: [],
            profile_img: "empty-profile.png"
        })
    
        await signOut(auth);
    }
    console.log('Finished seeding');
})
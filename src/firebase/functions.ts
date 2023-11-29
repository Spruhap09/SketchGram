import { FirebaseError } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
  Auth,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";

// Create user with email and password
// Called from signup page
async function signUpWithEmailAndPassword(
  email: string,
  password: string,
  displayName: string
) {
  try {
    // Get Firebase Auth
    const auth = getAuth();
    if (!auth) {
      throw "Auth is not initialized";
    }

    // Create user
    await createUserWithEmailAndPassword(auth, email, password);
    if (!auth.currentUser) throw "User unable to be created";

    // Update user profile
    await updateProfile(auth.currentUser, { displayName: displayName });

    // Add user to databse
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "users"), {
      uid: auth.currentUser.uid,
      displayName,
      email,
      followers: [],
      following: [],
      posts: [],
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

// Change user password
// Not implemented anywhere yet
async function changePassword(
  email: string,
  oldPassword: string,
  newPassword: string
) {
  try{
    // Get Firebase Auth
    const auth = getAuth();
    if (!auth) throw "Auth is not initialized";
    if (!auth.currentUser) throw "No user is logged in";
  
    // Reauthenticate user
    let credential = EmailAuthProvider.credential(email, oldPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);
  
    // Change password
    await updatePassword(auth.currentUser, newPassword);
    await logOutUser();
  }
  catch(e){ 
    console.error("Error changing password: ", e);
    throw e;
  }
}

// Sign in with email and password
// Called from login page
async function logInWithEmailAndPassword(email: string, password: string) {
  try {
    // Get Firebase Auth
    const auth = getAuth();
    if (!auth) throw "Auth is not initialized";

    // Log in
    const credential = await signInWithEmailAndPassword(auth, email, password);
    if(!credential.user) throw "User unable to be created";
  }
  catch(e) {
    console.error("Error logging in: ", e);
    throw e;
  }
}

// Sign-up/Log-in with Google
// Called from login/signup page
async function doGoogleSignIn() {
  try {
    // Get Firebase Auth
    let auth = getAuth();
    if (!auth) throw "Auth is not initialized";
    
    // Sign in with Google
    let googleProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, googleProvider);
    if (!auth.currentUser) throw new Error("User unable to be created");

    // Get Firebase Firestore
    const db = getFirestore();
    const usersCollectionRef = collection(db, "users"); // https://firebase.google.com/docs/reference/js/v8/firebase.firestore.CollectionReference

    // Check if user already exists in database 
    const q = query(usersCollectionRef, where("email", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(q); // https://firebase.google.com/docs/reference/js/v8/firebase.firestore.QuerySnapshot
    // If user exists don't add to database (logging in)
    if (!querySnapshot.empty) {
      await updateProfile(auth.currentUser, querySnapshot.docs[0].data());
    }
    // User doesn't exist so add to database (signing up)
    else {
      const docRef = await addDoc(usersCollectionRef, {
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
      }); // https://firebase.google.com/docs/reference/js/v8/firebase.firestore.DocumentReference
      if(!docRef) throw "User unable to be created";
    }
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

// Extracts user's canvas and creates a post out of it
// Called from PostButton component
async function postCanvasToProfile(
  canvas: HTMLCanvasElement,
  description: string
) {
  try {
    // Get Firebase Authentication
    const auth = getAuth();
    if (!auth.currentUser || !auth.currentUser.uid)
      throw new Error("User not logged in");
  
    // Get Firebase Firestore
    const db = getFirestore();
    if (!db) throw "Database is null";
  
    // Get Firebase Cloud Storage
    const storage = getStorage();
    if (!storage) throw "Storage is null";

    // TODO: Maybe add check to see if canvas is blank and prevent user from posting
  
    //Wrap in new Promise to synchronize operation
    await new Promise<void>((resolve, reject) => {
      // Convert canvas to blob
      canvas.toBlob(async (blob) => { // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
        try {
          // Ensure blob was created
          if (!blob) throw new Error("Blob is null");
  
          // Store canvas blob in Firebase Storage
          const storageRef = ref(
            storage,
            `images/${auth.currentUser?.uid}/${Date.now()}`
          );
          const snapshot = await uploadBytes(storageRef, blob);
          if (!snapshot) throw new Error("Snapshot is null");
  
          // Get path to image in storage bucket
          const path = snapshot.ref.fullPath;
  
          // Add post to database
          const postsColRef = collection(db, "posts");
          const postRef = await addDoc(postsColRef, {
            description: description,
            tags: description.split(" "), // Change to actual tags later
            userid: auth?.currentUser?.uid, //We're storing the user's authentication id (different from their database id)
            comments: [],
            imageURL: path,
            likes: [],
          });
  
          // Find user in database
          const q = query(
            collection(db, "users"),
            where("uid", "==", auth?.currentUser?.uid)
          );
          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty)
            throw "User does not exist in database";
          const userRef = doc(db, "users", querySnapshot.docs[0].id);
  
          // Add post to user's posts array
          await updateDoc(userRef, {
            posts: arrayUnion(postRef.id),
          });
  
          // Resolve the promise to indicate completion
          resolve();
        } catch (error) {
          // Reject the promise in case of an error
          reject(error);
        }
      });
    });
  }catch(e) {
    console.error("Error posting canvas: ", e);
    throw e;
  }

}

// Reset user password
// Not implemented anywhere yet
async function resetPassword(email: string) {
  try {
    // Get Firebase Auth
    const auth: Auth = getAuth();
    if (!auth) throw "Auth is not initialized";

    // Send password reset email
    await sendPasswordResetEmail(auth, email);
  }
  catch(e) {
    console.error("Error resetting password: ", e);
    throw e;
  }
}

// Sign out user
// Called from canvas page
async function logOutUser() {
  try {
    // Get Firebase Auth
    const auth: Auth = getAuth();
    if(!auth) throw "Auth is not initialized";

    // Sign out
    await signOut(auth);
  }
  catch(e) {
    console.error("Error logging out: ", e);
    throw e;
  }
}

// Get user's posts array
// Called from profile page
async function getUserPosts(uid: string) {
  try {
    // Get Firebase Firestore
    const db = getFirestore();
    if (!db) throw "Database is null";

    // Find user in database
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw "User does not exist in database";
    const userRef = doc(db, "users", querySnapshot.docs[0].id);

    // Get user's posts array
    const docSnapshot = await getDoc(userRef);
    const posts = docSnapshot.data()?.posts;
    if (!posts) throw "User has no posts";
    return posts;

  } catch (e) {
    console.error("Error getting user posts:", e);
    throw e;
  }
}

// Get post from database
// Called from post component
async function getPost(postId: string) {
  try{
    // Get Firebase Firestore
    const db = getFirestore();
    if (!db) throw "Database is null";
  
    // Get post from database
    const postRef = doc(db, "posts", postId);
    const post = await getDoc(postRef);
    if (!post || !post.data()) throw "Post does not exist in database";
    return post.data();
  }
  catch(e) {
    console.error("Error getting post: ", e);
    throw e;
  }
}

async function getImageFromUrl(imageUrl: string) {
  try{
    // Get Firebase Cloud Storage
    const storage = getStorage();
    if (!storage) throw "Storage is null";

    // Get image from storage
    const storageRef = ref(storage, imageUrl);
    const url = await getDownloadURL(storageRef);
    if (!url) throw "Image does not exist in storage";
    return url;
  }
  catch(e) {
    console.error("Error getting image: ", e);
    throw e;
  }
}

export {
  signUpWithEmailAndPassword,
  doGoogleSignIn,
  logInWithEmailAndPassword,
  resetPassword,
  logOutUser,
  changePassword,
  postCanvasToProfile,
  getUserPosts,
  getPost,
  getImageFromUrl,
};

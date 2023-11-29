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
  const auth = getAuth();
  if (!auth) {
    throw new Error("Auth is not initialized");
  }
  // Create user
  await createUserWithEmailAndPassword(auth, email, password);
  if (!auth.currentUser) throw new Error("User unable to be created");

  // Update user profile
  await updateProfile(auth.currentUser, { displayName: displayName });

  // Add user to databse
  try {
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
  const auth = getAuth();
  if (!auth) throw new Error("Auth is not initialized");
  if (!auth.currentUser) throw new Error("No user is logged in");

  let credential = EmailAuthProvider.credential(email, oldPassword);
  await reauthenticateWithCredential(auth.currentUser, credential);

  await updatePassword(auth.currentUser, newPassword);
  await logOutUser();
}

// Sign in with email and password
// Called from login page
async function logInWithEmailAndPassword(email: string, password: string) {
  let auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

// Sign-up/Log-in with Google
// Called from login/signup page
async function doGoogleSignIn() {
  let auth = getAuth();
  let googleProvider = new GoogleAuthProvider();
  await signInWithPopup(auth, googleProvider);
  if (!auth.currentUser) throw new Error("User unable to be created");

  try {
    const db = getFirestore();
    const usersRef = collection(db, "users");

    // Check if user already exists in database (logging in)
    const q = query(usersRef, where("email", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(q);
    // If user exists don't add to database
    if (!querySnapshot.empty) {
      await updateProfile(auth.currentUser, querySnapshot.docs[0].data());
    }
    // User doesn't exist so add to database (signing up)
    else {
      const insert = await addDoc(usersRef, {
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
      });
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
  // Firebase Authentication
  const auth = getAuth();
  if (!auth.currentUser || !auth.currentUser.uid)
    throw new Error("User not logged in");

  // Firebase Firestore
  const db = getFirestore();
  if (!db) throw "Database is null";

  // Firebase Cloud Storage
  const storage = getStorage();
  if (!storage) throw "Storage is null";

  //Wrap in new Promise to synchronize operation
  await new Promise<void>((resolve, reject) => {
    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
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
          userid: auth?.currentUser?.uid,
          comments: [],
          imageURL: path,
          likes: [],
        });

        // Find user in database
        const usersColRef = collection(db, "users");
        const q = query(
          usersColRef,
          where("uid", "==", auth?.currentUser?.uid)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty)
          throw new Error("User does not exist in database");
        const userRef = doc(db, "users", querySnapshot.docs[0].id);

        // Add post to user's posts array
        const ret = await updateDoc(userRef, {
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

}

// Reset user password
// Not implemented anywhere yet
async function resetPassword(email: string) {
  let auth: Auth = getAuth();
  await sendPasswordResetEmail(auth, email);
}

// Sign out user
// Called from canvas page
async function logOutUser() {
  let auth: Auth = getAuth();
  await signOut(auth);
}

async function getUserPosts(uid: string) {
  const db = getFirestore();
  if (!db) throw "Database is null";

  const collectionRef = collection(db, "users");
  const q = query(collectionRef, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) throw "User does not exist in database";
  const userRef = doc(db, "users", querySnapshot.docs[0].id);

  try {
    const ret = await getDoc(userRef);
    return ret?.data()?.posts;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

async function getPost(postId: string) {
  const db = getFirestore();
  if (!db) throw "Database is null";

  const postRef = doc(db, "posts", postId);
  const post = await getDoc(postRef);
  if (!post || !post.data()) throw "Post does not exist in database";
  return post.data();
}

async function getImageFromUrl(imageUrl: string) {
  const storage = getStorage();
  const storageRef = ref(storage, imageUrl);
  const url = await getDownloadURL(storageRef);
  return url;
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

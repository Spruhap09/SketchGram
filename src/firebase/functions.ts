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
} from "firebase/firestore";

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
      posts: []
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
  if (!auth) 
    throw new Error("Auth is not initialized");
  if(!auth.currentUser)
    throw new Error("No user is logged in");

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
    // Check if user already exists in database (logging in)
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(q);

    // If user exists don't add to database
    if (!querySnapshot.empty) {
      console.log("User already exists in database");
      await updateProfile(auth.currentUser, querySnapshot.docs[0].data());
    }
    // User doesn't exist so add to database (signing up)
    else {
      console.log("Creating user in database");
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

export {
  signUpWithEmailAndPassword,
  doGoogleSignIn,
  logInWithEmailAndPassword,
  resetPassword,
  logOutUser,
  changePassword,
};

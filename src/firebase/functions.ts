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
import { addDoc, collection, getFirestore } from "firebase/firestore";

async function doCreateUserWithEmailAndPassword(
  email: string,
  password: string,
  displayName: string
) {
  const auth: Auth = getAuth();
  if (!auth) {
    throw new Error("Auth is not initialized");
  }
  // Create user
  await createUserWithEmailAndPassword(auth, email, password);
  if(!auth.currentUser)
    throw new Error("User unable to be created");

  // Update user profile
  await updateProfile(auth.currentUser, { displayName: displayName });
  
  // (testing) Add user to databse
  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "users"), {displayName, email, uid: auth.currentUser.uid});
    console.log("Document written with ID: ", docRef.id)
    console.log("docRef", docRef, typeof docRef)
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

async function doChangePassword(
  email: string,
  oldPassword: string,
  newPassword: string
) {
  const auth: Auth = getAuth();
  if (!auth || !auth.currentUser) {
    throw new Error("Auth is not initialized");
  }
  let credential = EmailAuthProvider.credential(email, oldPassword);
  console.log(credential);
  await reauthenticateWithCredential(auth.currentUser, credential);

  await updatePassword(auth.currentUser, newPassword);
  await doSignOut();
}

async function doSignInWithEmailAndPassword(email: string, password: string) {
  let auth: Auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

async function doGoogleSignIn() {
  let auth: Auth = getAuth();
  let socialProvider = new GoogleAuthProvider();
  await signInWithPopup(auth, socialProvider);
  if(!auth.currentUser)
    throw new Error("User unable to be created");

  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "users"), {displayName: auth?.currentUser?.displayName, email: auth?.currentUser?.email, uid: auth?.currentUser?.uid});
    console.log("SSO Document written with ID: ", docRef.id)
    console.log("docRef", docRef, typeof docRef)
  } catch (e) {
    console.error("SSO Error adding document: ", e);
    throw e;
  }
}

async function doPasswordReset(email: string) {
  let auth: Auth = getAuth();
  await sendPasswordResetEmail(auth, email);
}

async function doSignOut() {
  let auth: Auth = getAuth();
  await signOut(auth);
}

export {
  doCreateUserWithEmailAndPassword,
  doGoogleSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doSignOut,
  doChangePassword,
};

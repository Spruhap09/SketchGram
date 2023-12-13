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
  or,
  orderBy,
  getDocs,
  getDoc,
  arrayUnion,
  updateDoc,
  limit,
  deleteDoc,
} from "firebase/firestore";
import { ref, getStorage, uploadBytes, getDownloadURL, deleteObject, getBytes, getBlob } from "firebase/storage";
import initFirebaseConfig from "./firebase";

// Create user with email and password
// Called from signup page
async function signUpWithEmailAndPassword(
  email: string,
  password: string,
  displayName: string
) {
  try {
    // Get Firebase Auth
    const {db, auth} = initFirebaseConfig();

    // Create user
    await createUserWithEmailAndPassword(auth, email, password);
    if (!auth.currentUser) throw "User unable to be created";

    // Update user profile
    await updateProfile(auth.currentUser, { displayName: displayName });

    // Add user to databse
    const docRef = await addDoc(collection(db, "users"), {
      uid: auth.currentUser.uid,
      displayName,
      email,
      followers: [],
      following: [],
      posts: [],
      drafts: [],
      profile_img: "empty-profile.png"
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

async function updateDisplayName(newDisplayName: string){
  
  try{
    const {db, auth} = initFirebaseConfig();
    if (!auth.currentUser) {
      throw "No user is logged in";
    }


    //get the user collection reference
    const usersCollectionRef = collection(db, "users"); // https://firebase.google.com/docs/reference/js/v8/firebase.firestore.CollectionReference

    // Check if user already exists in database 
    const q = query(usersCollectionRef, where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q); // https://firebase.google.com/docs/reference/js/v8/firebase.firestore.QuerySnapshot
    
    // If user exists then update the details
    if (!querySnapshot.empty) {

      const userDocRef = querySnapshot.docs[0].ref;
      //update the profile for auth
      await updateProfile(auth.currentUser, { displayName: newDisplayName });
      //update the db for the collection
      await updateDoc (userDocRef, {displayName: newDisplayName});

    }
    else {
      throw "This user does not exist";
    }
    
  }
  catch(e){
    console.error("Error updating the display name: ", e);
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
    const {auth} = initFirebaseConfig();
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
    const {auth} = initFirebaseConfig();

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
    const {db, auth} = initFirebaseConfig();

    // Sign in with Google
    let googleProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, googleProvider);
    if (!auth.currentUser) throw new Error("User unable to be created");


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
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        followers: [],
        following: [],
        posts: [],
        drafts: []
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
    const {db, auth, storage} = initFirebaseConfig();
    if (!auth.currentUser || !auth.currentUser.uid)
      throw new Error("User not logged in");

    // TODO: Maybe add check to see if canvas is blank and prevent user from posting
  
    //Wrap in new Promise to synchronize operation
    await new Promise<void>((resolve, reject) => {
      // Convert canvas to blob
      canvas.toBlob(async (blob) => { // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
        try {
          // Ensure blob was created
          if (!blob) throw new Error("Blob is null")
  
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
            timestamp: new Date().toISOString()
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
    const {auth} = initFirebaseConfig();

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
    const {db} = initFirebaseConfig();

    // Find user in database
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw "User does not exist in database";
    const userRef = doc(db, "users", querySnapshot.docs[0].id);

    // Get user's posts array
    const docSnapshot = await getDoc(userRef);
    const posts = querySnapshot.docs.map((doc) => {
      let ret = doc.data();
      ret.post_id = doc.id
      return ret
    });

    if (!posts) throw "User has no posts";
    return posts;

  } catch (e) {
    console.error("Error getting user posts:", e);
    throw e;
  }
}

//getUserPosts iwth limit option
async function getUserPostsLimit(uid: string, limitValue: number | null = null) {
  try {
    const {db} = initFirebaseConfig();

    let q;
    // Find posts in database
    if (!limitValue) q = query(collection(db, "posts"), where("userid", "==", uid));
    else q = query(collection(db, "posts"), where("userid", "==", uid), limit(limitValue));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw "No posts exist in database";
    const posts = querySnapshot.docs.map((doc) => {
      //console.log(JSON.stringify(doc));
      let ret = doc.data();
      ret.post_id = doc.id
      return ret
    });
    //console.log(posts)
    if (!posts) throw "User has no posts";
    return posts;
  } catch (error) {
    console.log("Error getting user posts:", error);
    return []
    //throw error;
  }
}


// Get post from database
// Called from post component
async function getPost(postId: string) {
  try {
    // Get Firebase Firestore
    const {db} = initFirebaseConfig();

    // Get post from database
    const postRef = doc(db, "posts", postId);
    const post = await getDoc(postRef);
    if (!post || !post.data()) throw "Post does not exist in database";
    const ret = post.data();
    if (!ret) throw "Post data is undefined";
    ret.post_id = postId;
    return ret;
  }
  catch(e) {
    console.error("Error getting post: ", e);
    throw e;
  }
}

async function deletePost(postId: string) {
  try {
    // Get Firebase Cloud Storage
    const {db, storage} = initFirebaseConfig();

    // Delete photo from storage
    const postData = await getPost(postId);
    const photoRef = ref(storage, postData?.imageURL);
    await deleteObject(photoRef);

    // Remove postId from user's posts array
    const q = query(collection(db, "users"), where("uid", "==", postData?.userid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw "User does not exist in database";
    const userRef = doc(db, "users", querySnapshot.docs[0].id);
    const docSnapshot = await getDoc(userRef);
    const newPosts = docSnapshot.data()?.posts.filter((id: string) => id !== postId);
    await updateDoc(userRef, {posts: newPosts});

    // Delete post from database
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);

    return newPosts;
  }
  catch(e) {
    console.log("Error deleting post: ", e);
    throw e;
  }
}

async function deleteDraft(draftUrl: string, userid: string) {
  try {
    // Get Firebase Cloud Storage
    const {db, storage} = initFirebaseConfig();

    // Delete photo from storage
    const draftRef = ref(storage, draftUrl);
    await deleteObject(draftRef);

    //Get user from database
    const q = query(collection(db, "users"), where("uid", "==", userid), where("drafts", "array-contains", draftUrl));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw "User does not exist in database";
    const userRef = doc(db, "users", querySnapshot.docs[0].id);
    const docSnapshot = await getDoc(userRef);

    // Remove draft from user's drafts array
    const newDrafts = docSnapshot.data()?.drafts.filter((draft: string) => draft !== draftUrl);
    if(!newDrafts) throw "User has no drafts";
    await updateDoc(userRef, {drafts: newDrafts});

    return newDrafts
  }
  catch(e) {
    console.log("Error deleting post: ", e);
    throw e;
  }
}

async function getImageFromUrl(imageUrl: string) {
  try{
    // Get Firebase Cloud Storage
    const {storage} = initFirebaseConfig();

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

async function getDraftUrl(draftId: string) {
  try{
    // Get Firebase Cloud Storage
    const {storage} = initFirebaseConfig();

    // Get image from storage
    const storageRef = ref(storage, `drafts/${draftId}`);
    const url = await getDownloadURL(storageRef);
    if (!url) throw "Image does not exist in storage";
    return url;
  }
  catch(e) {
    console.error("Error getting image: ", e);
    throw e;
  }
}

async function saveDraft(canvas: HTMLCanvasElement) {
  try {
    // Get Firebase Auth
    const {db, auth, storage} = initFirebaseConfig();
    if (!auth.currentUser || !auth.currentUser.uid)
      throw new Error("User not logged in");
  
    let path;
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
            `drafts/${auth.currentUser?.uid}/${Date.now()}`
            );
            const snapshot = await uploadBytes(storageRef, blob);
            if (!snapshot) throw new Error("Snapshot is null");
            
            // Get path to image in storage bucket
            path = snapshot.ref.fullPath;
            
            // Find user in database
            const q = query(
              collection(db, "users"),
              where("uid", "==", auth?.currentUser?.uid)
              );
              const querySnapshot = await getDocs(q);
              if (querySnapshot.empty)
              throw "User does not exist in database";
            const userRef = doc(db, "users", querySnapshot.docs[0].id);
            
            // Add draft to user's draft array
            await updateDoc(userRef, {
              drafts: arrayUnion(path),
            });
            
            // Resolve the promise to indicate completion
          resolve();
        } catch (error) {
          // Reject the promise in case of an error
          reject(error);
        }
      });
    });
    return path;
  }
  catch(e) {
    console.error("Error posting draft: ", e);
    throw e;
  }
}

async function getUserDrafts(uid: string) {
  try {
    // Get Firebase Firestore
    const {db} = initFirebaseConfig();

    // Find user in database
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw "User does not exist in database";
    const userRef = doc(db, "users", querySnapshot.docs[0].id);

    // Get user's drafts array
    const docSnapshot = await getDoc(userRef);
    const drafts = docSnapshot.data()?.drafts;

    if (!drafts) throw "User has no drafts";
    return drafts;
  }
  catch(e) {
    console.error("Error getting user drafts: ", e);
    throw e;
  }
}

async function getBytesFromUrl(url: string) {
  try {
    // Get Firebase Cloud Storage
    const {storage} = initFirebaseConfig();

    // Get image from storage
    const storageRef = ref(storage, url);
    const bytes = await getBytes(storageRef);
    if (!bytes) throw "Image does not exist in storage";
    return bytes;
  }
  catch(e) {
    console.error("Error getting image: ", e);
    throw e;
  }
}

async function getUserStats(uid: string){
  try{
    // Get Firebase Firestore
    const {db} = initFirebaseConfig();

    // Find user in database
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw "User does not exist in database";
    const userRef = doc(db, "users", querySnapshot.docs[0].id);

    // Get user's stat details
    const docSnapshot = await getDoc(userRef);

    const drafts = docSnapshot.data()?.drafts
    const followers = docSnapshot.data()?.followers
    const following = docSnapshot.data()?.following
    const posts = docSnapshot.data()?.posts
    const data = {
      drafts: drafts,
      followers: followers,
      following: following,
      posts: posts,
    }
    return data;
  }
  catch(e) {
    console.error("Error getting user drafts: ", e);
    throw e;
  }
}

async function updatePostLikes(postId: string, userUid: string, likerUid: string){
  try{
    // Get Firebase Firestore
    const {db} = initFirebaseConfig();

    //get the post id from the database and update it
    const q = query(collection(db, "posts"), where ("userid", "==", userUid));
    //this will be all the posts for this user id
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw "User does not exist in database";

    //gets the particular doc that matches the post id
    let postRef;
    for (let doc of querySnapshot.docs){
      if (doc.id === postId){
        postRef = doc
        break;
      }
    }
    //if present, the reference is updates with a new like
    if (postRef){
      //if the user has already liked the post, then we remove the like
      if (postRef.data()?.likes.includes(likerUid)){
        const oldLikes = postRef.data()?.likes
        const newLikes = oldLikes.filter((myUid: string) => myUid !== likerUid);
        await updateDoc(postRef.ref, {likes: newLikes})
      }
      else{
        const oldLikes = postRef.data()?.likes
        const newLikes = [...oldLikes, likerUid];
        await updateDoc(postRef.ref, {likes: newLikes})
      }

    }
    else{
      throw 'Post not found'
    }
  }
  catch(e){
    console.error("Error getting the post for the user: ", e);
    throw e;
  }
}



async function getUserbyUid(uid: string){
  try{
    // Get Firebase Firestore
    const {db} = initFirebaseConfig();

    // Find user in database
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw "User does not exist in database";
    const userRef = doc(db, "users", querySnapshot.docs[0].id);

    // Get user's stat details
    const docSnapshot = await getDoc(userRef);

    return docSnapshot.data();
  }
  catch(e) {
    console.error("Error getting user drafts: ", e);
    throw e;
  }
}

async function searchUsers(searchTerm: string) {
  try {

    // Get Firebase Firestore
    const {db} = initFirebaseConfig();

    const searchArray = searchTerm.split("");

    let users: any = [] // todo figure out proper typescript

    // Find users by display name
    const nameQ = query(
      collection(db, "users"),
      where("displayName", ">=", searchTerm),
      where("displayName", "<=", searchTerm + "\uf8ff"),
      orderBy("displayName")
    );    
    const nameSnapshot = await getDocs(nameQ);
    nameSnapshot.forEach((doc) => {
      users.push(doc.data());
    });

    // Find users by email
    const emailQ = query(
      collection(db, "users"),
      where("email", ">=", searchTerm),
      where("email", "<=", searchTerm + "\uf8ff"),
      orderBy("email")
    );
    const emailSnapshot = (await getDocs(emailQ));

    emailSnapshot.forEach((snapshot) => {
      let data = snapshot.data();
      if (!users.some((user: any) => user.uid === data.uid)) users.push(data);
    })
    
    return users;
  }
  catch (e) {
    console.error("Error searching for users: ", e);
    throw e;
  }
}

async function updatePostComments(postId: string, comment: string, userUid: string) {
  try {
    // Get Firebase Firestore
    const {db} = initFirebaseConfig();

    const postRef = doc(collection(db, "posts"), postId);
    const q = query(collection(db, "users"), where("uid", "==", userUid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw "User does not exist in database";

      // // Get post from database
      // const postRef = doc(db, "posts", postId);
      // const post = await getDoc(postRef);
      // if (!post || !post.data()) throw "Post does not exist in database";
      // const ret = post.data();

    console.log(postRef);
    const postDoc = await getDoc(postRef);
    console.log("from updatepost " + postDoc.data())

    if (postDoc.exists()) {
      const oldComments = postDoc.data()?.comments || [];
      const newComments = [...oldComments, comment];
      await updateDoc(postDoc.ref, { comments: newComments });
    } else {
      throw 'Post not found';
    }
  } catch (e) {
    console.error("Error updating post comments: ", e);
    throw e;
  }
}

async function getAllPosts(){
  try {
    // Get Firebase Firestore
    const {db} = initFirebaseConfig();

    // Find posts in database
    const q = query(collection(db, "posts"));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw "No posts exist in database";
    const posts = querySnapshot.docs.map((doc) => {
      let ret = doc.data();
      ret.post_id = doc.id
      return ret
    });
    if (!posts) throw "User has no posts";
    return posts;
  } catch (error) {
    console.log("Error getting user posts:", error);
    return []
    //throw error;
  }
}

async function followUser(otherUid: string, userUid: string){
  try{
    const {db, auth} = initFirebaseConfig();
    if (!auth.currentUser) {
      throw "No user is logged in";
    }

    //get the user collection reference
    const usersCollectionRef = collection(db, "users"); // https://firebase.google.com/docs/reference/js/v8/firebase.firestore.CollectionReference

    // Check if user already exists in database 
    const q = query(usersCollectionRef, where("uid", "==", userUid));
    const querySnapshot = await getDocs(q); // https://firebase.google.com/docs/reference/js/v8/firebase.firestore.QuerySnapshot
    
    // If user exists then update the details
    if (!querySnapshot.empty) {

      const userDocRef = querySnapshot.docs[0].ref;
      const userDoc = await getDoc(userDocRef);

      //update the db for the collection
      const oldFollowing = userDoc.data()?.following
      const newFollowing = [...oldFollowing, otherUid];
      await updateDoc (userDocRef, {following: newFollowing});

    }
    else {
      throw "This user does not exist";
    }


    //doing the same thing, but adding for following

    // Check if user already exists in database 
    const q1 = query(usersCollectionRef, where("uid", "==", otherUid));
    const querySnapshot1 = await getDocs(q1); // https://firebase.google.com/docs/reference/js/v8/firebase.firestore.QuerySnapshot
    
    // If user exists then update the details
    if (!querySnapshot1.empty) {

      const userDocRef = querySnapshot1.docs[0].ref;
      const userDoc = await getDoc(userDocRef);

      //update the db for the collection
      const oldFollowers = userDoc.data()?.followers
      const newFollowers = [...oldFollowers, userUid];
      await updateDoc (userDocRef, {followers: newFollowers});
      
    }

    else {
      throw "This user does not exist";
    }
    
  }
  catch(e){
    console.error("Error updating the follower count: ", e);
    throw e;
  }
}

async function unfollowUser(otherUid: string, userUid: string){
  try{

    const {db, auth} = initFirebaseConfig();
    if (!auth.currentUser) {
      throw "No user is logged in";
    }

    //get the user collection reference
    const usersCollectionRef = collection(db, "users"); // https://firebase.google.com/docs/reference/js/v8/firebase.firestore.CollectionReference

    // Check if user already exists in database 
    const q = query(usersCollectionRef, where("uid", "==", userUid));
    const querySnapshot = await getDocs(q); // https://firebase.google.com/docs/reference/js/v8/firebase.firestore.QuerySnapshot
    
    // If user exists then update the details
    if (!querySnapshot.empty) {

      const userDocRef = querySnapshot.docs[0].ref;
      const userDoc = await getDoc(userDocRef);

      //update the db for the collection
      const oldFollowing = userDoc.data()?.following
      const newFollowing = oldFollowing.filter((myUid: string) => myUid !== otherUid);
      await updateDoc (userDocRef, {following: newFollowing});
      
    }
    else {
      throw "This user does not exist";
    }

    //doing the same thing, but adding for following

    // Check if user already exists in database 
    const q1 = query(usersCollectionRef, where("uid", "==", otherUid));
    const querySnapshot1 = await getDocs(q1); // https://firebase.google.com/docs/reference/js/v8/firebase.firestore.QuerySnapshot
    
    // If user exists then update the details
    if (!querySnapshot1.empty) {

      const userDocRef = querySnapshot1.docs[0].ref;
      const userDoc = await getDoc(userDocRef);
     
      //update the db for the collection
      const oldFollowers = userDoc.data()?.followers
      const newFollowers = oldFollowers.filter((myUid: string) => myUid !== userUid);
      await updateDoc (userDocRef, {followers: newFollowers});
    }

  }
  catch(e){
    console.error("Error updating the follower count: ", e);
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
  getUserPostsLimit,
  getPost,
  getImageFromUrl,
  updateDisplayName,
  deletePost,
  getDraftUrl,
  saveDraft,
  getUserDrafts,
  getBytesFromUrl,
  deleteDraft, 
  getUserStats,
  updatePostLikes, 
  searchUsers,
  updatePostComments,
  getUserbyUid,
  getAllPosts, 
  followUser,
  unfollowUser
};

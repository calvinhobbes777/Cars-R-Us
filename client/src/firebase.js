import firebase from "firebase";

const config = {
  apiKey: "AIzaSyC_wFVuv9t3ZQaWdT2xPZt-NSr9UJmdoOU",
  authDomain: "cars-r-us-images.firebaseapp.com",
  databaseURL: "https://cars-r-us-images.firebaseio.com",
  projectId: "cars-r-us-images",
  storageBucket: "cars-r-us-images.appspot.com",
  messagingSenderId: "639865068363"
};
export default firebase.initializeApp(config);

const imageStorageRef = firebase.storage().ref();

export { imageStorageRef };

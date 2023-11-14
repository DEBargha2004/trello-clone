import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyA27wxt-eejeGYVVMoWImBQUBX28w_EGp8',
  authDomain: 'trello-a9333.firebaseapp.com',
  projectId: 'trello-a9333',
  storageBucket: 'trello-a9333.appspot.com',
  messagingSenderId: '146273815486',
  appId: '1:146273815486:web:30012acef1304585ff47ef',
  measurementId: 'G-6DNY0QC6Y2'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestoreDB = getFirestore(app)

export { firestoreDB }

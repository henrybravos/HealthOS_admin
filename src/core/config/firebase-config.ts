import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app"
import {
  Auth,
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  initializeAuth
} from "firebase/auth"
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore
} from "firebase/firestore"

const ENV = import.meta.env
const firebaseConfig = {
  apiKey: ENV.VITE_FIREBASE_API_KEY,
  authDomain: ENV.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: ENV.VITE_FIREBASE_PROJECT_ID,
  storageBucket: ENV.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.VITE_FIREBASE_APP_ID,
  measurementId: ENV.VITE_FIREBASE_MEASUREMENT_ID
}

let app: FirebaseApp | undefined, auth: Auth | undefined, db: Firestore | undefined

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig)
    auth = initializeAuth(app, {
      persistence: browserLocalPersistence
    })
    db = initializeFirestore(app, { ignoreUndefinedProperties: true })
  } catch (error) {
    console.log("Error initializing app: " + error)
  }
} else {
  app = getApp()
  auth = getAuth(app)
  db = getFirestore(app)
}
if (ENV.DEV) {
  connectAuthEmulator(auth!, "http://localhost:9099")
  connectFirestoreEmulator(db!, "localhost", 8080)
} else {
  console.log("Production mode")
}

export { app, auth, db, getApp, getAuth, getFirestore }

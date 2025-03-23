import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDMbCYgiB13yaPIlEIHCUMJ8Ts6DtqbPHI",
  authDomain: "esp32mini-d487f.firebaseapp.com",
  projectId: "esp32mini-d487f",
  storageBucket: "esp32mini-d487f.firebasestorage.app",
  messagingSenderId: "317415195110",
  appId: "1:317415195110:web:159cf584e868f9ab5f1627"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 
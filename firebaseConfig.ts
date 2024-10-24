import {initializeApp} from 'firebase/app';

//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';

import { initializeAuth } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDF38ml8chma1RuWnp_dy1kyAWLL7Skias",
    authDomain: "vet-app-expo.firebaseapp.com",
    projectId: "vet-app-expo",
    storageBucket: "vet-app-expo.appspot.com",
    messagingSenderId: "508060611143",
    appId: "1:508060611143:web:146c6dfcd378296dcd7762"
  };

const app = initializeApp(firebaseConfig);


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
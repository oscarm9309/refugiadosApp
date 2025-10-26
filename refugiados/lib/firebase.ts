// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics"; // Importá getAnalytics y isSupported
import { collection, addDoc } from "firebase/firestore"; // Añadí collection y addDoc

// ... (tu configuración existente)

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtnCVkOuXRgi2WGMS-97ZoRIKkv35w97g",
  authDomain: "refugiados-d57b6.firebaseapp.com",
  projectId: "refugiados-d57b6",
  storageBucket: "refugiados-d57b6.firebasestorage.app",
  messagingSenderId: "17063141585",
  appId: "1:17063141585:web:81e71946d0dbada38d65f0",
  measurementId: "G-MB7ZD9LCPC"
};

// Inicializa Firebase de forma segura
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Estos servicios son seguros para inicializar en ambos entornos (servidor y cliente)
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- SOLUCIÓN PARA ANALYTICS ---
// Creamos una función que solo inicializa Analytics en el cliente
export const getAnalyticsInstance = () => {
  // `typeof window` es la forma segura de comprobar si estamos en el navegador
  if (typeof window !== 'undefined') {
    // isSupported() comprueba si el navegador actual es compatible con Analytics
    return isSupported().then(yes => {
      return yes ? getAnalytics(app) : null;
    });
  }
  // Si estamos en el servidor, devolvemos null
  return Promise.resolve(null);
};



// ESTA ES LA FUNCIÓN CLAVE
export const addHabitante = (habitanteData: any) => {
  // 1. Apunta a la colección 'habitantes'. Si no existe, Firebase la crea en el primer guardado.
  const habitantesCollection = collection(db, 'habitantes');
  
  // 2. Añade un nuevo documento a esa colección con los datos del formulario.
  // Firebase genera un ID único para el documento automáticamente.
  return addDoc(habitantesCollection, habitanteData);
};
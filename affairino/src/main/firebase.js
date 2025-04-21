import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAJBmlkcIgQ3DbfxsqhOf8Am4gEAwWYHTw",
    authDomain: "affairino-4e282.firebaseapp.com",
    projectId: "affairino-4e282",
    storageBucket: "affairino-4e282.appspot.com",
    messagingSenderId: "887544776355",
    appId: "1:887544776355:web:f4809a06d5bf21fde7e116"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



export { app, auth };

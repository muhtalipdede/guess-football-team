import { getFirestore } from "firebase/firestore";
import firebaseApp from "./init";

const db = getFirestore(firebaseApp);
export default db;
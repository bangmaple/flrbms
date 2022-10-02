import * as admin from "firebase-admin";
import {environment} from "../../environments/environment";

const firebaseServiceAccount = environment.firebase.service_account;

export const initializeFirebaseApp = () => {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: firebaseServiceAccount.project_id,
      clientEmail: firebaseServiceAccount.client_email,
      privateKey: firebaseServiceAccount.private_key.replace(/\\n/g, '\n'),
    } as Partial<admin.ServiceAccount>)
  });
  return firebaseServiceAccount.project_id;
};

export default admin;

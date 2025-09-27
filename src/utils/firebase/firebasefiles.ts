import { db } from "./FirebaseClient";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  // updateDoc,
//   getDoc,
  deleteDoc,
} from "firebase/firestore";
import { getCurrentUID } from "./FirebaseClient";
import { UploadedFile, AttachedFile } from '../../types';

export const saveUploadedFile = async (file: UploadedFile) => {
  try {
    const uid = getCurrentUID();
    const ref = doc(db, `users/${uid}/uploadedFiles/${file.id}`);
    setDoc(ref, file)
    .then(() => {
      console.log("File metadata saved successfully!");
    })
    .catch((error) => {
      console.error("Error during setDoc");
      throw error;
    });
  } catch (error) {
    console.log(error);
  }
};

export const fetchUploadedFiles = async (): Promise<UploadedFile[]> => {
  try {
    const uid = getCurrentUID();
    const colRef = collection(db, `users/${uid}/uploadedFiles`);
    // const snapshot = getDocs(colRef)
    return getDocs(colRef)
    .then((snapshot) => {
      console.log("Fetched uploaded files successfully!");
      return snapshot.docs.map(doc => doc.data() as UploadedFile);
    })
    .catch((error) => {
      console.error("Error fetching uploaded files");
      throw error;
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

// export const updateUploadedFiles = async (id: string, updates: Partial<UploadedFile>) => {
//   try {
//     const uid = getCurrentUID();
//     await updateDoc(doc(db, `users/${uid}/uploadedFiles/${id}`), updates);
//   } catch (error) {
//     console.error(error);
//   }
// }

export const deleteUploadedFiles = async (id: string) => {
  try {
    const uid = getCurrentUID();
    deleteDoc(doc(db, `users/${uid}/uploadedFiles/${id}`))
    .then(() => {
      console.log("File deleted successfully!");
    })
    .catch((error) => {
      console.error("Error deleting file");
      throw error;
    });
  } catch (error) {
    console.error(error);
  }
}

// ------------------- Files Attached to Chats ----------------------

export const saveAttachedFile = async (chatId: string, file: AttachedFile) => {
  try {
    const uid = getCurrentUID();
    const ref = doc(db, `users/${uid}/chats/${chatId}/attachedFiles/${file.id}`);
    setDoc(ref, file)
    .then(() => {
      console.log("Attached file saved successfully!");
    })
    .catch((error) => {
      throw error;
    })
  } catch (error) {
    console.error("Error saving attached file:", error);
  }
};

export const fetchAttachedFiles = async (chatId: string): Promise<AttachedFile[]> => {
  try {
    const uid = getCurrentUID();
    const colRef = collection(db, `users/${uid}/chats/${chatId}/attachedFiles`);
    return getDocs(colRef)
    .then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data() as AttachedFile);
    })
    .catch((error) => {
      throw error;
    });
  } catch (error) {
    console.error("Error fetching attached files:", error);
    return [];
  }
};

export const deleteAttachedFile = async (chatId: string, fileId: string) => {
  try {
    const uid = getCurrentUID();
    deleteDoc(doc(db, `users/${uid}/chats/${chatId}/attachedFiles/${fileId}`))
    .then(() => {
      console.log("Attached file deleted successfully!");
    })
    .catch((error) => {
      throw error;
    })
  } catch (error) {
    console.error("Error deleting attached file:", error);
  }
};



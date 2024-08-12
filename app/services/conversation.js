import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, where, doc, setDoc, updateDoc, orderBy } from 'firebase/firestore';

export async function fetchConversations(userId) {
  try {
    const conversationsQuery = query(
      collection(db, "users", userId, "conversations"),
      orderBy("timestamp", "desc")  // Order by timestamp in descending order
    );
    const querySnapshot = await getDocs(conversationsQuery);
    const conversations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return conversations;
  } catch (e) {
    console.error("Error fetching conversations for User ID:", userId, e);
    throw e;
  }
}

export async function saveConversation(conversation, userId, title) {
  try {
    console.log("Saving Conversation with Title:", title);  // Debugging: Log the title
    const docRef = await addDoc(collection(db, "users", userId, "conversations"), {
      messages: conversation,
      timestamp: new Date(),
      title,  // Storing the title
    });
    return docRef;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export async function updateConversation(conversationId, conversation, userId) {
  try {
    const conversationRef = doc(db, "users", userId, "conversations", conversationId);
    
    // Update the messages and timestamp without changing the title
    await updateDoc(conversationRef, {
      messages: conversation,
      timestamp: new Date(),
    });
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
}

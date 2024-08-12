import { saveConversation, updateConversation } from './conversation';

export async function sendMessage({
  message,
  messages,
  selectedConversation,
  setMessages,
  setMessage,
  setSelectedConversation,
  userId,
  isNewConversation,  // receive the new conversation status
}) {
  const userMessage = { role: "user", content: message };
  const updatedMessages = [...messages, userMessage];

  setMessages(updatedMessages);
  setMessage('');

  // Include an extra prompt for title generation if the conversation is new
  const queryData = isNewConversation 
    ? { query: message, generate_title: true } 
    : { query: message };

  // Simulate sending the message to an AI API
  const response = await fetch('http://localhost:3005/api/rag', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(queryData),
  });
  
  if (!response.ok) {
    console.error("Error from AI API:", await response.json());
    return;
  }
  
  const data = await response.json();
  const assistantMessage = { role: "assistant", content: data.answer };
  const finalMessages = [...updatedMessages, assistantMessage];
  
  setMessages(finalMessages);
  
  let newConversation = null;
  if (isNewConversation) {
    const title = data.title || "Untitled";  // Use the title returned from the AI API
    const docRef = await saveConversation(finalMessages, userId, title);
    if (docRef) {
      newConversation = { id: docRef.id, messages: finalMessages, title };
      setSelectedConversation(newConversation);
    } else {
      console.error("Failed to save conversation: docRef is null or undefined");
    }
  } else if (selectedConversation) {
    await updateConversation(selectedConversation.id, finalMessages, userId);
  }

  // Return the new conversation if created
  return { newConversation };
}

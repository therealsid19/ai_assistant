'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { fetchConversations } from '../services/conversation';
import { sendMessage } from '../services/sendMessage';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { SignedIn, UserButton, useAuth, useUser } from '@clerk/nextjs';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi I'm the Headstarter Support Agent, how can I assist you today?`,
    },
  ]);
  const [message, setMessage] = useState('');
  const [previousConversations, setPreviousConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [newConversationId, setNewConversationId] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state
  const messageEndRef = useRef(null);
  const { isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const signInToFirebase = async () => {
      try {
        if (isLoaded && user) {
          const token = await getToken({ template: "integration_firebase" }); 

          if (token) {
            await signInWithCustomToken(auth, token);
            console.log('Signed in to Firebase');
          } else {
            console.error('No token received');
            return;
          }
          const userId = user.id;
          const conversations = await fetchConversations(userId);
          setPreviousConversations(conversations);
        }
      } catch (error) {
        console.error('Error signing in to Firebase:', error);
      }
    };

    signInToFirebase();
  }, [isLoaded, user]);

  const handleSendMessage = async () => {
    if (!user || !user.id) {
      console.error("User ID is undefined");
      return;
    }

    setLoading(true); // Start loading

    const isNewConversation = !selectedConversation;
    console.log("Is New Conversation:", isNewConversation);
  
    const response = await sendMessage({
      message,
      messages,
      selectedConversation,
      setMessages,
      setMessage,
      setSelectedConversation,
      userId: user.id,
      isNewConversation,
    });

    setLoading(false); // End loading
  
    if (response.newConversation) {
      setNewConversationId(response.newConversation.id); // Set the new conversation ID
      setPreviousConversations((prev) => [response.newConversation, ...prev]);
    }
  
    scrollToBottom();
  };

  useEffect(() => {
    // Clear the new conversation ID after the sidebar renders
    if (newConversationId) {
      setTimeout(() => {
        setNewConversationId(null);
      }, 500);
    }
  }, [newConversationId]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(conversation.messages);
  };

  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const deleteConversation = async (conversationId) => {
    if (!user || !user.id) {
      console.error("User ID is undefined");
      return;
    }

    try {
      await deleteDoc(doc(db, "users", user.id, "conversations", conversationId));
      setPreviousConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
      if (selectedConversation && selectedConversation.id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  return (
    <SignedIn>
    <Box
      sx={{
        backgroundImage: `url('chatbot-page.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        '@media (max-width: 600px)': {
          height: '100%',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          width: '100%',
          boxShadow: 'none',
          height: '8vh',
          '@media (max-width: 600px)': {
            height: '12vh',
            padding: '8px',
          },
        }}
      >
        <Box
          sx={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            pl: '16px',
            pb: '5px',
            borderBottom: '2px solid transparent',
            cursor: 'pointer',
            '@media (max-width: 600px)': {
              fontSize: '20px',
            },
          }}
          onClick={() => router.push('/')}
        >
          AI Assistant
        </Box>
        <Box
          sx={{
            '@media (max-width: 600px)': {
              fontSize: '16px',
            },
          }}
        >
          <UserButton />
        </Box>
      </Box>

      <Box
        height="calc(100vh - 8vh)"
        display="flex"
        flexDirection="row"
        width="100%"
        overflow="hidden"
      >
        <Sidebar
          previousConversations={previousConversations}
          selectConversation={selectConversation}
          setMessages={setMessages}
          setMessage={setMessage}
          setSelectedConversation={setSelectedConversation}
          newConversationId={newConversationId}
          deleteConversation={deleteConversation} // Pass the delete function here
        />

        {!isSidebarCollapsed && (
          <ChatArea
            messages={messages}
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            messageEndRef={messageEndRef}
            loading={loading} // Pass the loading state
          />
        )}
      </Box>
    </Box>
    </SignedIn>
  );
}

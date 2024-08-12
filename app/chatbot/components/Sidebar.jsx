import { useState } from 'react';
import { Box, Button, IconButton, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';

export default function Sidebar({ previousConversations = [], selectConversation, setMessages, setMessage, setSelectedConversation, newConversationId, deleteConversation }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: isCollapsed ? '50px' : { xs: '100%', sm: '20vw' },
        transition: 'width 0.3s ease-in-out',
        height: 'calc(100vh - 8vh)',
        p: isCollapsed ? '0 5px' : 2,
        className: "bg-gray-800 bg-opacity-20 backdrop-blur-lg rounded-md text-white",
        overflowY: 'auto',
        overflowX: 'hidden', // Ensure no horizontal scroll
        '@media (max-width: 600px)': {
          width: isCollapsed ? '50px' : '100%',
          height: 'calc(100vh - 8vh)',
        },
        '&::-webkit-scrollbar': {
          width: '5px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          alignItems: 'center',
          mb: 2,
          borderRadius: '8px',
          p: 0,
          '@media (max-width: 600px)': {
            overflow: 'hidden', // Prevents small scrollbars on mobile
          },
        }}
      >
        {!isCollapsed && (
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: 'transparent',
              border: '2px solid transparent',
              color: 'white',
              fontWeight: 'bold',
              width: '100%',
              maxWidth: '300px',
              transition: 'box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.9)',
                backgroundColor: 'rgba(70, 70, 70, 0.9)',
                borderRadius: '8px',
              },
            }}
            onClick={() => {
              setSelectedConversation(null);
              setMessages([
                {
                  role: 'assistant',
                  content: `Hi I'm the Headstarter Support Agent, how can I assist you today?`,
                },
              ]);
              setMessage('');
            }}
          >
            + New Chat
          </Button>
        )}
        <IconButton
          onClick={toggleCollapse}
          sx={{
            color: 'white',
            alignSelf: 'center',
            borderRadius: '8px',
            transition: 'box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.6)',
              backgroundColor: 'rgba(70, 70, 70, 0.9)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Divider to separate buttons from the conversation list */}
      <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }} />

      {!isCollapsed && (
        <Box
          sx={{
            height: 'calc(100% - 80px)',
            overflowY: 'auto',
            overflowX: 'hidden', // Ensure no horizontal scroll
            display: 'flex',
            flexDirection: 'column',
            '&::-webkit-scrollbar': {
              width: '5px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        >
          <ul style={{ padding: 0, margin: 0 }}>
            {previousConversations.map((conv, index) => (
              <motion.li
                key={index}
                initial={newConversationId === conv.id ? { opacity: 0, y: -10 } : { opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <Box onClick={() => selectConversation(conv)} flexGrow={1}>
                  {(conv.title || `Conversation ${index + 1}`).replace(/['"]+/g, '')}
                </Box>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteConversation(conv.id)}
                  sx={{
                    color: 'gray', // Make icon gray
                    fontSize: 'small', // Smaller icon
                    '&:hover': {
                      color: 'lightgray', // Change to a lighter gray on hover
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </motion.li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import { Typewriter } from 'react-simple-typewriter';
import { SignIn, SignedOut, SignedIn, UserButton } from '@clerk/nextjs';

export default function Home() {
  const router = useRouter();
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Update cursor position when the mouse moves
  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    // Add event listener to track mouse movement
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      // Remove event listener on cleanup
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <Box
      sx={{
        backgroundImage: `url('homepage.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100%',
        overflowY: 'auto', // Allow vertical scrolling when necessary
        position: 'relative',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
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
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <Box
          sx={{
            fontSize: { xs: '18px', sm: '24px' }, // Adjust font size based on screen size
            fontWeight: 'bold',
            color: 'white',
            borderBottom: '2px solid transparent',
            paddingLeft: '16px',
          }}
          onClick={() => router.push('/')} 
        >
          AI Assistant
        </Box>

        <SignedOut>          
        </SignedOut>
        <SignedIn>
          <Box sx={{ paddingRight: '16px' }}>
            <UserButton />
          </Box>
        </SignedIn>
      </Box>

      <Box color={'white'} textAlign={'center'} mb={4} mt={8}>
        <Typography
          variant="h2"
          sx={{
            marginBottom: '20px',
            fontWeight: 'bold',
            color: '#1E90FF',
            fontSize: { xs: '32px', sm: '48px' },
          }}
        >
          Your No. 1 AI Assistant
        </Typography>

        <Typography
          variant="h4"
          sx={{
            marginBottom: '20px',
            fontSize: { xs: '20px', sm: '28px' },
          }}
        >
          <Typewriter
            words={['Get Instant Support', 'Ask Anything, Anytime']}
            loop={false}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </Typography>

        <Typography
          variant="h5"
          sx={{
            marginTop: '50px',
            color: 'white',
            fontSize: { xs: '16px', sm: '20px' },
          }}
        >
          Powered by cutting-edge AI to assist you with any query.
        </Typography>
      </Box>

      <SignedOut>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: '300px',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <SignIn
            routing="hash"
            redirectUrl="/chatbot"
            appearance={{
              variables: {
                colorPrimary: "#1E90FF",
                colorText: "#ffffff",
                colorBackground: "#1e1e2d",
                colorInputText: "#ffffff",
              },
              elements: {
                card: 'shadow-2xl bg-gray-800',
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                socialButtons: 'bg-blue-600 hover:bg-blue-700 shadow-lg rounded-md',
                formFieldInput: 'bg-gray-700',
              },
            }}
          />
        </Box>
      </SignedOut>
      <SignedIn>
        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 4,
            fontSize: { xs: '14px', sm: '16px' },
          }}
          onClick={() => router.push('/chatbot')}
        >
          Go to Chatbot
        </Button>
      </SignedIn>
    </Box>
  );
}

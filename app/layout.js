import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs';
import './globals.css';

export const metadata = {
  title: "AI Assistant",
  description: "Powered by cutting-edge AI to assist you with any query.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

import React from 'react';
import { Helmet } from 'react-helmet';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';

const LoginScreen = () => {
  return (
    <>
      <Helmet>
        <title>Sign In - CollabDocs</title>
        <meta name="description" content="Sign in to CollabDocs for real-time collaborative document editing with your team." />
        <meta name="keywords" content="login, sign in, collaborative editing, document sharing" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Login Card */}
            <div className="bg-card border border-border rounded-2xl shadow-elevated p-8">
              <LoginHeader />
              <LoginForm />
              <TrustSignals />
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-xs text-muted-foreground">
                © {new Date()?.getFullYear()} CollabDocs. All rights reserved.
              </p>
              <div className="flex items-center justify-center space-x-4 mt-2">
                <a 
                  href="#" 
                  className="text-xs text-muted-foreground hover:text-foreground collaborative-transition"
                >
                  Privacy Policy
                </a>
                <span className="text-xs text-muted-foreground">•</span>
                <a 
                  href="#" 
                  className="text-xs text-muted-foreground hover:text-foreground collaborative-transition"
                >
                  Terms of Service
                </a>
                <span className="text-xs text-muted-foreground">•</span>
                <a 
                  href="#" 
                  className="text-xs text-muted-foreground hover:text-foreground collaborative-transition"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginScreen;
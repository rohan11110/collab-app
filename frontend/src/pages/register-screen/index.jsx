import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthHeader from './components/AuthHeader';
import RegistrationForm from './components/RegistrationForm';
import SuccessMessage from './components/SuccessMessage';
import ErrorMessage from './components/ErrorMessage';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/authSlice";
import API from '../../api';

const RegisterScreen = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch();
  const [registrationState, setRegistrationState] = useState('form'); 
  const [registrationData, setRegistrationData] = useState(null);
  const [error, setError] = useState(null);

const handleRegistration = async (formData) => {
    setRegistrationState("loading");
    setRegistrationData(formData);

    try {
      // Call backend API
      const response = await API.post("/api/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // ✅ Show success toast
      toast.success("🎉 Registration successful! Please check your email for verification.");
      dispatch(setUser(response.data));
      navigate("/");
      // If success, set state
      if (response.data) {
        setRegistrationState("success");
      }
    } catch (err) {
      let errorType = "general";
      let errorMessage = "Registration failed. Please try again.";

      if (err.response?.status === 400 && err.response?.data?.message?.includes("exists")) {
        errorType = "duplicate";
        errorMessage = "An account with this email address already exists.";
      } else if (err.response?.status >= 500) {
        errorType = "server";
        errorMessage = "Server error occurred. Please try again later.";
      } else if (err.message === "Network Error") {
        errorType = "network";
        errorMessage = "Network connection failed. Please check your internet connection.";
      }

      setError({
        type: errorType,
        message: errorMessage,
        details: err.response?.data || null,
      });
      setRegistrationState("error");

      // ✅ Show error toast
      toast.error(errorMessage);
    }
  };


  const handleRetry = () => {
    setError(null);
    setRegistrationState('form');
  };

  const handleGoBack = () => {
    setError(null);
    setRegistrationState('form');
  };

  const handleSuccessContinue = () => {
    // In a real app, this would either:
    // 1. Open email app for verification
    // 2. Navigate to dashboard if auto-authenticated
    navigate('/document-dashboard');
  };

  const handleResendVerification = async () => {
    // Mock resend verification
    console.log('Resending verification email to:', registrationData?.email);
    // Show success toast or message
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthHeader showBackButton={registrationState !== 'form'} />
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-8">
          
          {/* Registration Form State */}
          {registrationState === 'form' && (
            <>
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
                <p className="text-muted-foreground">
                  Join thousands of teams collaborating on documents
                </p>
              </div>

              {/* Registration Form */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <RegistrationForm 
                  onSubmit={handleRegistration}
                  isLoading={false}
                />
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    onClick={() => navigate('/login-screen')}
                    className="p-0 h-auto font-medium"
                  >
                    Sign In
                  </Button>
                </p>
              </div>
            </>
          )}

          {/* Loading State */}
          {registrationState === 'loading' && (
            <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <div className="animate-spin">
                    <Icon name="Loader2" size={32} className="text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Creating Your Account
                  </h2>
                  <p className="text-muted-foreground">
                    Please wait while we set up your CollabDocs account...
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Setting up your workspace...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {/* {registrationState === 'success' && (
            <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
              <SuccessMessage
                email={registrationData?.email}
                onContinue={handleSuccessContinue}
                onResendVerification={handleResendVerification}
                showVerificationStep={true}
              />
            </div>
          )} */}

          {/* Error State */}
          {/* {registrationState === 'error' && (
            <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
              <ErrorMessage
                error={error}
                onRetry={handleRetry}
                onGoBack={handleGoBack}
                showRetryButton={true}
              />
            </div>
          )} */}

          {/* Features Preview */}
          {registrationState === 'form' && (
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                What you'll get with CollabDocs:
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <Icon name="Users" size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Real-time Collaboration</p>
                    <p className="text-xs text-muted-foreground">Work together with your team in real-time</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="MessageSquare" size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Live Chat & Comments</p>
                    <p className="text-xs text-muted-foreground">Communicate directly within documents</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                    <Icon name="Shield" size={16} className="text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Secure & Private</p>
                    <p className="text-xs text-muted-foreground">Enterprise-grade security for your documents</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <a href="/terms" className="hover:text-foreground collaborative-transition">
                Terms of Service
              </a>
              <span>•</span>
              <a href="/privacy" className="hover:text-foreground collaborative-transition">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="/support" className="hover:text-foreground collaborative-transition">
                Support
              </a>
            </div>
            <div className="text-xs text-muted-foreground">
              © {new Date()?.getFullYear()} CollabDocs. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegisterScreen;
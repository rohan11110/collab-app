import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ErrorMessage = ({ 
  error, 
  onRetry, 
  onGoBack,
  showRetryButton = true 
}) => {
  const getErrorIcon = (errorType) => {
    switch (errorType) {
      case 'network':
        return 'WifiOff';
      case 'validation':
        return 'AlertTriangle';
      case 'server':
        return 'ServerCrash';
      case 'duplicate':
        return 'UserX';
      default:
        return 'AlertCircle';
    }
  };

  const getErrorTitle = (errorType) => {
    switch (errorType) {
      case 'network':
        return 'Connection Error';
      case 'validation':
        return 'Validation Error';
      case 'server':
        return 'Server Error';
      case 'duplicate':
        return 'Account Already Exists';
      default:
        return 'Registration Failed';
    }
  };

  const getErrorDescription = (errorType) => {
    switch (errorType) {
      case 'network':
        return 'Unable to connect to our servers. Please check your internet connection and try again.';
      case 'validation':
        return 'Please check your information and ensure all fields are filled correctly.';
      case 'server':
        return 'Our servers are experiencing issues. Please try again in a few moments.';
      case 'duplicate':
        return 'An account with this email address already exists. Please sign in instead.';
      default:
        return 'Something went wrong while creating your account. Please try again.';
    }
  };

  return (
    <div className="text-center space-y-6">
      {/* Error Icon */}
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
        <Icon name={getErrorIcon(error?.type)} size={32} className="text-error" />
      </div>
      {/* Error Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          {getErrorTitle(error?.type)}
        </h2>
        <p className="text-muted-foreground">
          {error?.message || getErrorDescription(error?.type)}
        </p>
      </div>
      {/* Error Details */}
      {error?.details && (
        <div className="bg-error/5 border border-error/20 rounded-lg p-4">
          <p className="text-sm text-error font-mono">
            {error?.details}
          </p>
        </div>
      )}
      {/* Action Buttons */}
      <div className="space-y-3">
        {showRetryButton && (
          <Button
            variant="default"
            size="lg"
            fullWidth
            onClick={onRetry}
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={20}
            className="btn-press"
          >
            Try Again
          </Button>
        )}
        
        {error?.type === 'duplicate' ? (
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => window.location.href = '/login-screen'}
            iconName="LogIn"
            iconPosition="left"
            iconSize={16}
            className="btn-press"
          >
            Sign In Instead
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={onGoBack}
            iconName="ArrowLeft"
            iconPosition="left"
            iconSize={16}
            className="btn-press"
          >
            Go Back
          </Button>
        )}
      </div>
      {/* Help Text */}
      <div className="text-xs text-muted-foreground">
        <p>
          Still having trouble?{' '}
          <a href="/support" className="text-primary hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;
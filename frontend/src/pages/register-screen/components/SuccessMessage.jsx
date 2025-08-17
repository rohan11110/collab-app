import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SuccessMessage = ({ 
  email, 
  onContinue, 
  onResendVerification,
  showVerificationStep = true 
}) => {
  return (
    <div className="text-center space-y-6">
      {/* Success Icon */}
      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
        <Icon name="CheckCircle" size={32} className="text-success" />
      </div>

      {/* Success Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Account Created Successfully!
        </h2>
        {showVerificationStep ? (
          <div className="space-y-3">
            <p className="text-muted-foreground">
              We've sent a verification email to:
            </p>
            <p className="text-foreground font-medium bg-muted px-4 py-2 rounded-lg">
              {email}
            </p>
            <p className="text-sm text-muted-foreground">
              Please check your inbox and click the verification link to activate your account.
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">
            You can now start collaborating on documents with your team.
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {showVerificationStep ? (
          <>
            <Button
              variant="default"
              size="lg"
              fullWidth
              onClick={onContinue}
              iconName="Mail"
              iconPosition="left"
              iconSize={20}
              className="btn-press"
            >
              Open Email App
            </Button>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={onResendVerification}
              iconName="RefreshCw"
              iconPosition="left"
              iconSize={16}
              className="btn-press"
            >
              Resend Verification Email
            </Button>
          </>
        ) : (
          <Button
            variant="default"
            size="lg"
            fullWidth
            onClick={onContinue}
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={20}
            className="btn-press"
          >
            Continue to Dashboard
          </Button>
        )}
      </div>

      {/* Help Text */}
      <div className="text-xs text-muted-foreground space-y-2">
        {showVerificationStep && (
          <>
            <p>Didn't receive the email? Check your spam folder.</p>
            <p>
              Need help?{' '}
              <a href="/support" className="text-primary hover:underline">
                Contact Support
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AuthHeader = ({ showBackButton = false }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Side - Back Button or Logo */}
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="btn-press"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
          )}
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">CollabDocs</span>
          </div>
        </div>

        {/* Right Side - Sign In Link */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/login-screen')}
            iconName="LogIn"
            iconPosition="left"
            iconSize={16}
            className="btn-press"
          >
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Icon name="FileText" size={28} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground">CollabDocs</h1>
            <p className="text-sm text-muted-foreground">Real-time collaboration</p>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Welcome back
        </h2>
        <p className="text-muted-foreground">
          Sign in to your account to continue collaborating
        </p>
      </div>

      {/* Demo Credentials Info */}
      {/* <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-accent mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <h4 className="text-sm font-medium text-foreground mb-1">Demo Access</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Use these credentials to explore the platform:
            </p>
            <div className="space-y-1 text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Email:</span>
                <span className="text-foreground bg-muted px-2 py-1 rounded">admin@collabdocs.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Password:</span>
                <span className="text-foreground bg-muted px-2 py-1 rounded">admin123</span>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default LoginHeader;
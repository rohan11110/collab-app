import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: 'Your data is protected with 256-bit SSL encryption'
    },
    {
      icon: 'Lock',
      title: 'Secure Authentication',
      description: 'JWT-based authentication with industry standards'
    },
    {
      icon: 'Users',
      title: 'Trusted by Teams',
      description: 'Join thousands of teams collaborating securely'
    }
  ];

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trustFeatures?.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg mb-2">
              <Icon name={feature?.icon} size={20} className="text-success" />
            </div>
            <h4 className="text-sm font-medium text-foreground mb-1">
              {feature?.title}
            </h4>
            <p className="text-xs text-muted-foreground">
              {feature?.description}
            </p>
          </div>
        ))}
      </div>
      {/* Security Badges */}
      <div className="flex items-center justify-center space-x-4 mt-6">
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Icon name="Shield" size={14} className="text-success" />
          <span>SOC 2 Compliant</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Icon name="Lock" size={14} className="text-success" />
          <span>GDPR Ready</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Icon name="CheckCircle" size={14} className="text-success" />
          <span>99.9% Uptime</span>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;
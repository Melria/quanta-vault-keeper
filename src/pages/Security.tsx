
import React from 'react';
import SecurityDashboard from '@/components/security/SecurityDashboard';

const Security: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <p className="text-muted-foreground">Monitor and improve your password security</p>
      </div>
      
      <SecurityDashboard />
    </div>
  );
};

export default Security;

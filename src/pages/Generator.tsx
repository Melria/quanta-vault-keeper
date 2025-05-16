
import React from 'react';
import PasswordGenerator from '@/components/generator/PasswordGenerator';

const Generator: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Password Generator</h1>
        <p className="text-muted-foreground">Create strong and secure passwords</p>
      </div>
      
      <PasswordGenerator />
    </div>
  );
};

export default Generator;

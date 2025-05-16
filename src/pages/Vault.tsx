
import React from 'react';
import PasswordList from '@/components/vault/PasswordList';

const Vault: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Password Vault</h1>
        <p className="text-muted-foreground">Securely manage and organize your passwords</p>
      </div>
      
      <PasswordList />
    </div>
  );
};

export default Vault;

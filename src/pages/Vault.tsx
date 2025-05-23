
import React, { useEffect, useState } from 'react';
import PasswordList from '@/components/vault/PasswordList';
import { useLocation } from 'react-router-dom';
import { eventBus, EVENTS } from '@/lib/eventBus';
import { Dialog } from '@/components/ui/dialog';

const Vault: React.FC = () => {
  const [addPasswordDialogOpen, setAddPasswordDialogOpen] = useState(false);
  const [selectedPasswordId, setSelectedPasswordId] = useState<string | null>(null);
  const location = useLocation();
  
  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    
    if (id) {
      setSelectedPasswordId(id);
    }
    
    // Listen for custom event to open add password dialog
    const handleAddPasswordEvent = () => {
      setAddPasswordDialogOpen(true);
    };
    
    document.addEventListener('open-add-password-dialog', handleAddPasswordEvent);
    
    // Subscribe to event bus
    const unsubscribe = eventBus.subscribe(EVENTS.ADD_PASSWORD, () => {
      setAddPasswordDialogOpen(true);
    });
    
    return () => {
      document.removeEventListener('open-add-password-dialog', handleAddPasswordEvent);
      unsubscribe();
    };
  }, [location]);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Password Vault</h1>
        <p className="text-muted-foreground">Securely manage and organize your passwords</p>
      </div>
      
      <PasswordList 
        addPasswordDialogOpen={addPasswordDialogOpen} 
        setAddPasswordDialogOpen={setAddPasswordDialogOpen}
        selectedPasswordId={selectedPasswordId}
        setSelectedPasswordId={setSelectedPasswordId}
      />
    </div>
  );
};

export default Vault;

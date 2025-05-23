
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Star, SortAsc, SortDesc } from 'lucide-react';
import PasswordCard from './PasswordCard';
import { PasswordEntry } from '@/types/password';
import PasswordDetail from './PasswordDetail';
import { passwordService } from '@/services/passwordService';
import { useQuery } from '@tanstack/react-query';
import AddPasswordForm from './AddPasswordForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PasswordListProps {
  addPasswordDialogOpen?: boolean;
  setAddPasswordDialogOpen?: (open: boolean) => void;
  selectedPasswordId?: string | null;
  setSelectedPasswordId?: (id: string | null) => void;
}

const PasswordList: React.FC<PasswordListProps> = ({ 
  addPasswordDialogOpen = false, 
  setAddPasswordDialogOpen = () => {}, 
  selectedPasswordId = null,
  setSelectedPasswordId = () => {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const { data: passwords = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['passwords'],
    queryFn: passwordService.getAll,
  });
  
  useEffect(() => {
    if (selectedPasswordId) {
      const password = passwords.find(p => p.id === selectedPasswordId);
      if (!password && passwords.length > 0 && !isLoading) {
        // If the selected password is not found, reset selection
        setSelectedPasswordId(null);
        toast.error("The selected password was not found");
      }
    }
  }, [selectedPasswordId, passwords, isLoading, setSelectedPasswordId]);
  
  const handleViewPassword = (id: string) => {
    setSelectedPasswordId(id);
  };
  
  const handleCloseDetail = () => {
    setSelectedPasswordId(null);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  const handlePasswordAdded = async () => {
    toast.success('Password added successfully');
    setAddPasswordDialogOpen(false);
    await refetch();
  };
  
  const handlePasswordDeleted = async () => {
    toast.success('Password deleted successfully');
    setSelectedPasswordId(null);
    await refetch();
  };
  
  const handlePasswordUpdated = async () => {
    toast.success('Password updated successfully');
    await refetch();
  };
  
  const filterPasswords = (passwords: PasswordEntry[]) => {
    // First, filter by search term
    let filtered = passwords.filter(password => 
      password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (password.url && password.url.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Then, filter by category
    if (activeCategory !== 'all') {
      if (activeCategory === 'favorites') {
        filtered = filtered.filter(password => password.favorite);
      } else {
        filtered = filtered.filter(password => password.category === activeCategory);
      }
    }
    
    // Finally, sort
    return filtered.sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
  };
  
  const filteredPasswords = passwords ? filterPasswords(passwords) : [];
  const selectedPassword = selectedPasswordId 
    ? passwords.find(p => p.id === selectedPasswordId) 
    : null;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quantablue-dark"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-2">Error loading passwords</h2>
        <p className="text-muted-foreground mb-4">There was a problem loading your passwords.</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col md:flex-row">
      <div className={`flex-1 flex flex-col ${selectedPassword ? 'md:border-r md:pr-4 md:max-w-[40%] max-h-80 md:max-h-full overflow-y-auto' : ''}`}>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortDirection}
            className="shrink-0"
          >
            {sortDirection === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
          </Button>
          <Dialog open={addPasswordDialogOpen} onOpenChange={setAddPasswordDialogOpen}>
            <Button 
              className="shrink-0 bg-quantablue-dark hover:bg-quantablue-medium"
              onClick={() => setAddPasswordDialogOpen(true)}
            >
              <Plus size={18} className="mr-1" />
              New
            </Button>
            <DialogContent className="max-w-md">
              <AddPasswordForm onSuccess={handlePasswordAdded} onCancel={() => setAddPasswordDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs 
          defaultValue="all" 
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="mb-4"
        >
          <TabsList className="w-full overflow-x-auto justify-start">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center">
              <Star size={14} className="mr-1" /> Favorites
            </TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {filteredPasswords.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1">
            {filteredPasswords.map((password) => (
              <PasswordCard 
                key={password.id} 
                password={password} 
                onView={handleViewPassword}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 p-8">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-1">No passwords found</h2>
            <p className="text-muted-foreground text-center">
              {searchTerm 
                ? `No results for "${searchTerm}"`
                : "There are no passwords in this category yet."}
            </p>
            <Button 
              onClick={() => setAddPasswordDialogOpen(true)} 
              className="mt-4 bg-quantablue-dark hover:bg-quantablue-medium"
            >
              <Plus size={16} className="mr-1" />
              Add Password
            </Button>
          </div>
        )}
      </div>
      
      {selectedPassword && (
        <div className="flex-1 md:pl-4 mt-4 md:mt-0">
          <PasswordDetail 
            password={selectedPassword} 
            onClose={handleCloseDetail} 
            onDelete={handlePasswordDeleted}
            onUpdate={handlePasswordUpdated}
          />
        </div>
      )}
    </div>
  );
};

export default PasswordList;

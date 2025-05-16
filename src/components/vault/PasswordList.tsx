
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Star, SortAsc, SortDesc } from 'lucide-react';
import PasswordCard from './PasswordCard';
import { PasswordEntry, mockPasswords } from '@/lib/mockData';
import PasswordDetail from './PasswordDetail';

const PasswordList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedPasswordId, setSelectedPasswordId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const handleViewPassword = (id: string) => {
    setSelectedPasswordId(id);
  };
  
  const handleCloseDetail = () => {
    setSelectedPasswordId(null);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
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
  
  const filteredPasswords = filterPasswords(mockPasswords);
  const selectedPassword = selectedPasswordId 
    ? mockPasswords.find(p => p.id === selectedPasswordId) 
    : null;
  
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
          <Button className="shrink-0 bg-quantablue-dark hover:bg-quantablue-medium">
            <Plus size={18} className="mr-1" />
            New
          </Button>
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
          </div>
        )}
      </div>
      
      {selectedPassword && (
        <div className="flex-1 md:pl-4 mt-4 md:mt-0">
          <PasswordDetail password={selectedPassword} onClose={handleCloseDetail} />
        </div>
      )}
    </div>
  );
};

export default PasswordList;

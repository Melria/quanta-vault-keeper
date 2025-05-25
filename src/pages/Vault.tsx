
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { passwordService } from '@/services/passwordService';
import { useAuth } from '@/contexts/AuthContext';
import PasswordList from '@/components/vault/PasswordList';
import AddPasswordForm from '@/components/vault/AddPasswordForm';
import ImportPasswordsDialog from '@/components/vault/ImportPasswordsDialog';
import { PasswordEntry } from '@/types/password';
import { Search, Plus, Download, Upload, Shield, Star, Globe, Mail, CreditCard, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Vault: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const { data: passwords = [], isLoading, error, refetch } = useQuery({
    queryKey: ['passwords', user?.id],
    queryFn: () => passwordService.getAll(user!.id),
    enabled: !!user,
  });

  const filteredPasswords = passwords.filter((password: PasswordEntry) => {
    const matchesSearch = searchTerm === '' || 
      password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (password.url && password.url.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || password.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categoryCounts = passwords.reduce((acc: Record<string, number>, password: PasswordEntry) => {
    acc[password.category] = (acc[password.category] || 0) + 1;
    return acc;
  }, {});

  const favoriteCount = passwords.filter((p: PasswordEntry) => p.favorite).length;
  const weakPasswords = passwords.filter((p: PasswordEntry) => p.strength_score < 50).length;

  const categories = [
    { id: 'all', label: 'All', icon: Globe, count: passwords.length },
    { id: 'favorites', label: 'Favorites', icon: Star, count: favoriteCount },
    { id: 'weak', label: 'Weak Passwords', icon: Shield, count: weakPasswords },
    { id: 'social', label: 'Social Media', icon: Globe, count: categoryCounts.social || 0 },
    { id: 'email', label: 'Email', icon: Mail, count: categoryCounts.email || 0 },
    { id: 'banking', label: 'Banking', icon: CreditCard, count: categoryCounts.banking || 0 },
    { id: 'work', label: 'Work', icon: Wifi, count: categoryCounts.work || 0 },
    { id: 'personal', label: 'Personal', icon: Globe, count: categoryCounts.personal || 0 },
    { id: 'imported', label: 'Imported', icon: Download, count: categoryCounts.imported || 0 },
  ];

  const handleAddSuccess = () => {
    setShowAddForm(false);
    refetch();
    toast({
      title: "Success",
      description: "Password added successfully",
    });
  };

  const handleImportSuccess = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading passwords: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Password Vault</h1>
          <p className="text-muted-foreground">Manage your passwords securely</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowImportDialog(true)}
            className="flex items-center gap-2"
          >
            <Upload size={18} />
            Import Passwords
          </Button>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-quantablue-dark hover:bg-quantablue-medium flex items-center gap-2"
          >
            <Plus size={18} />
            Add Password
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-md text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-quantablue-light text-quantablue-darkest'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon size={16} />
                      <span className="text-sm">{category.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          {showAddForm ? (
            <Card>
              <CardContent className="pt-6">
                <AddPasswordForm
                  onSuccess={handleAddSuccess}
                  onCancel={() => setShowAddForm(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Search passwords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <PasswordList
                passwords={filteredPasswords}
                isLoading={isLoading}
                onUpdate={refetch}
                selectedCategory={selectedCategory}
              />
            </div>
          )}
        </div>
      </div>

      <ImportPasswordsDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
};

export default Vault;

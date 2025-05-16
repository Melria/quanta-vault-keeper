
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PasswordEntry } from '@/lib/mockData';
import { getSecurityLevel } from '@/lib/passwordUtils';
import { X, Copy, Eye, EyeOff, Edit, Trash, Clock, Globe, Star } from 'lucide-react';
import { toast } from 'sonner';

interface PasswordDetailProps {
  password: PasswordEntry;
  onClose: () => void;
}

const PasswordDetail: React.FC<PasswordDetailProps> = ({ password, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedPassword, setEditedPassword] = useState({ ...password });
  
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getSecurityLevelLabel = () => {
    const level = getSecurityLevel(password.strengthScore);
    return {
      high: { label: 'Strong', class: 'bg-green-500' },
      medium: { label: 'Medium', class: 'bg-yellow-500' },
      low: { label: 'Weak', class: 'bg-red-500' },
    }[level];
  };
  
  const securityLevel = getSecurityLevelLabel();
  
  const handleSave = () => {
    toast.success("Password updated successfully");
    setEditMode(false);
    // In a real app, this would update the actual data
  };
  
  const handleDelete = () => {
    toast.success("Password deleted successfully");
    onClose();
    // In a real app, this would delete the actual data
  };
  
  const renderContent = () => {
    if (editMode) {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={editedPassword.title} 
              onChange={(e) => setEditedPassword({...editedPassword, title: e.target.value})}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              value={editedPassword.username} 
              onChange={(e) => setEditedPassword({...editedPassword, username: e.target.value})}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"}
                value={editedPassword.password} 
                onChange={(e) => setEditedPassword({...editedPassword, password: e.target.value})}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="url">Website URL</Label>
            <Input 
              id="url" 
              value={editedPassword.url || ''} 
              onChange={(e) => setEditedPassword({...editedPassword, url: e.target.value})}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              value={editedPassword.notes || ''} 
              onChange={(e) => setEditedPassword({...editedPassword, notes: e.target.value})}
              className="mt-1"
              rows={3}
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              className="flex-1 bg-quantablue-dark hover:bg-quantablue-medium" 
              onClick={handleSave}
            >
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Username</h3>
          <div className="flex items-center justify-between mt-1">
            <p className="font-medium">{password.username}</p>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              onClick={() => handleCopy(password.username, "Username")}
            >
              <Copy size={14} className="mr-1" /> Copy
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Password</h3>
          <div className="flex items-center justify-between mt-1">
            <div className="font-mono">
              {showPassword ? password.password : '•'.repeat(password.password.length)}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={14} className="mr-1" /> : <Eye size={14} className="mr-1" />} 
                {showPassword ? 'Hide' : 'Show'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={() => handleCopy(password.password, "Password")}
              >
                <Copy size={14} className="mr-1" /> Copy
              </Button>
            </div>
          </div>
        </div>
        
        {password.url && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center">
                <Globe size={14} className="mr-2" />
                <a 
                  href={password.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-quantablue-medium hover:text-quantablue-dark hover:underline truncate"
                >
                  {password.url}
                </a>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 shrink-0 ml-2"
                onClick={() => handleCopy(password.url!, "URL")}
              >
                <Copy size={14} />
              </Button>
            </div>
          </div>
        )}
        
        {password.notes && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
            <p className="text-sm mt-1 whitespace-pre-wrap">{password.notes}</p>
          </div>
        )}
        
        <div className="pt-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>Last updated: {formatDate(password.lastUpdated)}</span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setEditMode(true)}
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="bg-quantablue-lightest flex flex-row items-center justify-between pb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <CardTitle>
              {password.title}
              {password.favorite && (
                <Star size={16} className="inline ml-2" fill="#FFD700" stroke="#FFD700" />
              )}
            </CardTitle>
            <Badge className={securityLevel?.class}>{securityLevel?.label}</Badge>
          </div>
          <CardDescription>{password.category.charAt(0).toUpperCase() + password.category.slice(1)}</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X size={18} />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pt-4">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default PasswordDetail;

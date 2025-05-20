
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PasswordEntry, UpdatePasswordDto } from '@/types/password';
import { getSecurityLevel } from '@/lib/passwordUtils';
import { X, Copy, Eye, EyeOff, Edit, Trash, Clock, Globe, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { passwordService } from '@/services/passwordService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface PasswordDetailProps {
  password: PasswordEntry;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: () => void;
}

const PasswordDetail: React.FC<PasswordDetailProps> = ({ password, onClose, onDelete, onUpdate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
    const level = getSecurityLevel(password.strength_score);
    return {
      high: { label: 'Strong', class: 'bg-green-500' },
      medium: { label: 'Medium', class: 'bg-yellow-500' },
      low: { label: 'Weak', class: 'bg-red-500' },
    }[level];
  };
  
  const securityLevel = getSecurityLevelLabel();
  
  const handleToggleFavorite = async () => {
    try {
      await passwordService.toggleFavorite(password.id, password.favorite);
      onUpdate();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite status");
    }
  };
  
  const handleSave = async () => {
    try {
      setIsUpdating(true);
      
      const updateData: UpdatePasswordDto = {
        title: editedPassword.title,
        username: editedPassword.username,
        password: editedPassword.password,
        url: editedPassword.url || null,
        notes: editedPassword.notes || null,
        category: editedPassword.category,
        favorite: editedPassword.favorite,
      };
      
      await passwordService.update(password.id, updateData);
      setEditMode(false);
      onUpdate();
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await passwordService.delete(password.id);
      onDelete();
    } catch (error) {
      toast.error("Failed to delete password");
    } finally {
      setIsDeleting(false);
    }
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
            <Label htmlFor="category">Category</Label>
            <Select 
              value={editedPassword.category}
              onValueChange={(value) => setEditedPassword({...editedPassword, category: value})}
            >
              <SelectTrigger id="category" className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
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
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="favorite" className="cursor-pointer">Mark as Favorite</Label>
            <Switch 
              id="favorite"
              checked={editedPassword.favorite}
              onCheckedChange={(checked) => setEditedPassword({...editedPassword, favorite: checked})}
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              className="flex-1 bg-quantablue-dark hover:bg-quantablue-medium" 
              onClick={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setEditMode(false)}
              disabled={isUpdating}
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
              {showPassword ? password.password : '•'.repeat(Math.min(password.password.length, 12))}
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
                <Globe size={14} className="mr-2 shrink-0" />
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
              <span>Last updated: {formatDate(password.last_updated)}</span>
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash size={16} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Password</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this password? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
                    >
                      {isDeleting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Deleting...
                        </>
                      ) : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className="ml-1 h-5 w-5 p-0 rounded-full"
              >
                <Star 
                  size={16} 
                  className={password.favorite ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-400"}
                />
              </Button>
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

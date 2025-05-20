
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Copy, Star } from 'lucide-react';
import { PasswordEntry } from '@/types/password';
import { maskPassword } from '@/lib/passwordUtils';
import { toast } from 'sonner';

interface PasswordCardProps {
  password: PasswordEntry;
  onView: (id: string) => void;
}

const PasswordCard: React.FC<PasswordCardProps> = ({ password, onView }) => {
  const getIconForUrl = (url?: string | null) => {
    if (!url) return null;
    
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };
  
  const handleCopy = (event: React.MouseEvent, text: string, type: 'username' | 'password') => {
    event.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success(`${type === 'username' ? 'Username' : 'Password'} copied to clipboard`);
  };
  
  const getSecurityColor = () => {
    if (password.strength_score >= 80) return 'bg-green-500';
    if (password.strength_score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onView(password.id)}
    >
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <div className="relative h-10 w-10 rounded-md flex items-center justify-center bg-quantablue-dark/10 mr-3 overflow-hidden">
            {getIconForUrl(password.url) ? (
              <img 
                src={getIconForUrl(password.url)!} 
                alt={password.title} 
                className="h-6 w-6 object-contain"
              />
            ) : (
              <div className="text-lg font-bold text-quantablue-dark">
                {password.title.charAt(0).toUpperCase()}
              </div>
            )}
            {password.favorite && (
              <div className="absolute -top-1 -right-1">
                <Star size={14} fill="#FFD700" stroke="#FFD700" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-sm truncate">{password.title}</h3>
              <div className={`h-2 w-2 rounded-full ${getSecurityColor()} ml-2 shrink-0`}></div>
            </div>
            <p className="text-xs text-muted-foreground truncate">{password.username}</p>
          </div>
        </div>
        
        <div className="bg-quantablue-darkest/5 p-3 flex items-center justify-between">
          <div className="font-mono text-sm truncate">{maskPassword(password.password)}</div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={(e) => handleCopy(e, password.username, 'username')}
              title="Copy username"
            >
              <Copy size={14} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onView(password.id);
              }}
              title="View details"
            >
              <Eye size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordCard;

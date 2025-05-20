
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Lock, 
  Shield, 
  Settings, 
  Key, 
  User, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/dashboard', icon: <Shield size={20} />, label: 'Dashboard' },
    { path: '/vault', icon: <Lock size={20} />, label: 'Vault' },
    { path: '/generator', icon: <Key size={20} />, label: 'Generator' },
    { path: '/security', icon: <Shield size={20} />, label: 'Security' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];
  
  return (
    <div className={cn("flex flex-col h-full text-white", className)}>
      <div className="p-4 mb-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="bg-quantablue-medium h-10 w-10 rounded-full flex items-center justify-center">
            <Lock size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold">QuantaVault</h1>
            <p className="text-xs text-quantablue-light/70">Password Manager</p>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive(item.path)
                    ? "bg-quantablue-dark text-white"
                    : "text-quantablue-light hover:bg-quantablue-dark/50 hover:text-white"
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto p-4 border-t border-quantablue-dark">
        <div className="flex items-center space-x-3 mb-4 px-2 py-2">
          <div className="bg-quantablue-dark h-8 w-8 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <div>
            <p className="text-sm font-medium">{user?.user_metadata?.full_name || 'User'}</p>
            <p className="text-xs text-quantablue-light/70">{user?.email}</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full border-quantablue-dark text-quantablue-light hover:bg-quantablue-dark hover:text-white"
          onClick={() => signOut()}
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navigation;

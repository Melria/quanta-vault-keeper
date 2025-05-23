
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Key, AlertTriangle, Plus, Lock, Shield, Settings, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { passwordService } from '@/services/passwordService';
import { securityService } from '@/services/securityService';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { PasswordEntry } from '@/types/password';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: passwords = [], isLoading, error } = useQuery({
    queryKey: ['passwords'],
    queryFn: passwordService.getAll,
  });
  
  const [securityIssues, setSecurityIssues] = useState<number>(0);
  
  useEffect(() => {
    if (passwords && passwords.length > 0) {
      const checks = securityService.runSecurityCheck(passwords);
      const criticalIssues = checks.filter(check => check.severity === 'critical').length;
      setSecurityIssues(criticalIssues);
    }
  }, [passwords]);
  
  // Quick stats
  const totalPasswords = passwords.length;
  const favoritePasswords = passwords.filter(p => p.favorite).length;
  const weakPasswords = passwords.filter(p => p.strength_score < 50).length;
  
  // Recent passwords
  const recentPasswords = [...passwords]
    .sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime())
    .slice(0, 3);
  
  const handleAddNewPassword = () => {
    navigate('/vault');
    // The dialog to add a new password will be opened via URL parameter
    setTimeout(() => {
      const addPasswordEvent = new CustomEvent('open-add-password-dialog');
      document.dispatchEvent(addPasswordEvent);
    }, 100);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quantablue-dark"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-600 mb-4">There was a problem loading your data.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}</h1>
          <p className="text-muted-foreground">Here's an overview of your password vault</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="hover:bg-quantablue-dark/10"
            onClick={() => navigate('/vault')}
          >
            <Search className="mr-2" size={16} />
            Find Password
          </Button>
          <Button 
            className="bg-quantablue-dark hover:bg-quantablue-medium"
            onClick={handleAddNewPassword}
          >
            <Plus className="mr-2" size={16} />
            New Password
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-quantablue-light/10 h-10 w-10 rounded-full flex items-center justify-center">
                <Lock size={20} className="text-quantablue-medium" />
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <Link to="/vault">
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
            <div className="text-2xl font-bold">{totalPasswords}</div>
            <p className="text-muted-foreground text-sm">Total Passwords</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-50 h-10 w-10 rounded-full flex items-center justify-center">
                <Star size={20} className="text-blue-500" />
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <Link to="/vault?category=favorites">
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
            <div className="text-2xl font-bold">{favoritePasswords}</div>
            <p className="text-muted-foreground text-sm">Favorite Items</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-yellow-50 h-10 w-10 rounded-full flex items-center justify-center">
                <Key size={20} className="text-yellow-500" />
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <Link to="/security">
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
            <div className="text-2xl font-bold">{weakPasswords}</div>
            <p className="text-muted-foreground text-sm">Weak Passwords</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-red-50 h-10 w-10 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <Link to="/security">
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
            <div className="text-2xl font-bold">{securityIssues}</div>
            <p className="text-muted-foreground text-sm">Critical Alerts</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recently Updated</CardTitle>
            <CardDescription>Your most recently changed passwords</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPasswords.length > 0 ? (
              <div className="space-y-4">
                {recentPasswords.map(password => (
                  <div key={password.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-quantablue-dark/10 flex items-center justify-center mr-3">
                        <div className="text-lg font-bold text-quantablue-dark">
                          {password.title.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">{password.title}</h4>
                        <p className="text-sm text-muted-foreground">{password.username}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/vault?id=${password.id}`)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No passwords added yet.</p>
                <Button 
                  variant="link" 
                  className="mt-2" 
                  onClick={handleAddNewPassword}
                >
                  Add your first password
                </Button>
              </div>
            )}
            
            {recentPasswords.length > 0 && (
              <Button variant="link" className="mt-4 text-quantablue-medium w-full" asChild>
                <Link to="/vault">View All Passwords</Link>
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/generator">
                <Key size={16} className="mr-2" />
                Generate Password
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleAddNewPassword}
            >
              <Plus size={16} className="mr-2" />
              Add New Password
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/security">
                <Shield size={16} className="mr-2" />
                Run Security Audit
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/settings">
                <Settings size={16} className="mr-2" />
                Adjust Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

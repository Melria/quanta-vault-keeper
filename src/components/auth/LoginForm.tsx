
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    
    try {
      await signIn(email, password);
      // No need to navigate - the auth context will handle it
    } catch (error) {
      // Error is already handled in the signIn function
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleLogin} className="space-y-6 w-full max-w-md">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/10 backdrop-blur-sm border-quantablue-light/20"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Master Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white/10 backdrop-blur-sm border-quantablue-light/20 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(!!checked)}
          />
          <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
            Remember me
          </Label>
        </div>
        
        <Button 
          variant="link" 
          className="p-0 h-auto text-sm text-quantablue-medium hover:text-quantablue-light"
          onClick={() => navigate('/forgot-password')}
          type="button"
        >
          Forgot password?
        </Button>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-quantablue-dark hover:bg-quantablue-medium"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
            Logging in...
          </div>
        ) : (
          <div className="flex items-center">
            <Lock className="mr-2" size={16} />
            Login Securely
          </div>
        )}
      </Button>
      
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account?</span>{' '}
        <Button 
          variant="link" 
          className="p-0 h-auto text-sm text-quantablue-medium hover:text-quantablue-light"
          onClick={() => navigate('/register')}
          type="button"
        >
          Create an account
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;

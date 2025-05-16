
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield } from "lucide-react";
import { toast } from 'sonner';
import { calculatePasswordStrength, getSecurityLevel } from '@/lib/passwordUtils';
import { Progress } from "@/components/ui/progress";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const passwordStrength = calculatePasswordStrength(password);
  const securityLevel = getSecurityLevel(passwordStrength);
  
  // Define colors based on strength
  const getStrengthColor = () => {
    if (securityLevel === 'high') return 'bg-green-500';
    if (securityLevel === 'medium') return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (passwordStrength < 50) {
      toast.error("Please use a stronger password");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        toast.success("Account created successfully");
        navigate('/dashboard');
      } else {
        toast.error("Please fill all required fields");
      }
      setLoading(false);
    }, 1000);
  };
  
  return (
    <form onSubmit={handleRegister} className="space-y-6 w-full max-w-md">
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
        
        {password && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span>Password Strength</span>
              <span className={`font-medium security-${securityLevel}`}>
                {securityLevel === 'high' && 'Strong'}
                {securityLevel === 'medium' && 'Medium'}
                {securityLevel === 'low' && 'Weak'}
              </span>
            </div>
            <Progress value={passwordStrength} className="h-1.5" indicatorClassName={getStrengthColor()} />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-white/10 backdrop-blur-sm border-quantablue-light/20 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        
        {password && confirmPassword && (
          <p className={`text-xs mt-1 ${password === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
            {password === confirmPassword ? 'Passwords match' : 'Passwords don\'t match'}
          </p>
        )}
      </div>
      
      <div className="p-3 bg-quantablue-darkest/30 rounded-md text-sm">
        <p className="font-medium mb-2 flex items-center">
          <Shield size={14} className="mr-1" /> Important:
        </p>
        <p className="text-muted-foreground text-xs">
          Your master password cannot be recovered if lost. Make sure to remember it or store it in a safe place.
        </p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-quantablue-dark hover:bg-quantablue-medium"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
            Creating account...
          </div>
        ) : (
          "Create Account"
        )}
      </Button>
      
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>{' '}
        <Button 
          variant="link" 
          className="p-0 h-auto text-sm text-quantablue-medium hover:text-quantablue-light"
          onClick={() => navigate('/login')}
          type="button"
        >
          Login
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;

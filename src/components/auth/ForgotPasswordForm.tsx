
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      setSent(true);
      toast.success("Password reset instructions have been sent to your email");
    } catch (error: any) {
      console.error("Error sending password reset:", error);
      toast.error(error.message || "Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  };
  
  if (sent) {
    return (
      <div className="space-y-6">
        <Alert className="bg-white/10 border-quantablue-light/20 text-white">
          <AlertCircle className="h-4 w-4 text-quantablue-lightest" />
          <AlertDescription className="text-gray-300">
            Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
          </AlertDescription>
        </Alert>
        
        <div className="text-center">
          <Button 
            variant="link" 
            className="p-0 h-auto text-sm text-quantablue-lightest hover:text-white"
            onClick={() => navigate('/login')}
          >
            <ArrowLeft className="mr-2" size={16} />
            Return to login
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/10 backdrop-blur-sm border-quantablue-light/20 text-white placeholder:text-gray-300"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-quantablue-dark hover:bg-quantablue-medium"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
            Sending...
          </div>
        ) : (
          <div className="flex items-center">
            <Mail className="mr-2" size={16} />
            Send Reset Instructions
          </div>
        )}
      </Button>
      
      <div className="text-center">
        <Button 
          variant="link" 
          className="p-0 h-auto text-sm text-quantablue-lightest hover:text-white"
          onClick={() => navigate('/login')}
          type="button"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to login
        </Button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;


import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Lock } from 'lucide-react';

const ResetPassword: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-quantablue-darkest to-quantablue-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-white/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">QuantaVault</h1>
          <p className="text-quantablue-light/80">Secure Password Management</p>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Set New Password</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm />
          </CardContent>
        </Card>
        
        <p className="text-center mt-6 text-sm text-quantablue-light/70">
          Secured with end-to-end encryption
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;

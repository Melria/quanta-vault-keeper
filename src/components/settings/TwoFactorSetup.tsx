
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { QrCode, Smartphone, Shield, Copy } from 'lucide-react';

interface TwoFactorSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnable: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ open, onOpenChange, onEnable }) => {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Mock secret key - in real app this would come from backend
  const secretKey = 'JBSWY3DPEHPK3PXP';
  const qrCodeUrl = `otpauth://totp/QuantaVault?secret=${secretKey}&issuer=QuantaVault`;

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    toast.success('Secret key copied to clipboard');
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a 6-digit verification code');
      return;
    }

    setIsVerifying(true);
    
    try {
      // Simulate verification - in real app this would verify with backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, accept any 6-digit code
      if (verificationCode.length === 6) {
        toast.success('Two-factor authentication enabled successfully!');
        onEnable();
        onOpenChange(false);
        resetDialog();
      } else {
        toast.error('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      toast.error('Failed to verify code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const resetDialog = () => {
    setStep('setup');
    setVerificationCode('');
    setIsVerifying(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetDialog();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="mr-2" size={20} />
            Set Up Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            Add an extra layer of security to your account
          </DialogDescription>
        </DialogHeader>
        
        {step === 'setup' && (
          <div className="space-y-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Step 1: Install an Authenticator App</CardTitle>
                <CardDescription>
                  Download an app like Google Authenticator, Authy, or Microsoft Authenticator
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Step 2: Scan QR Code</CardTitle>
                <CardDescription>
                  Scan this QR code with your authenticator app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg border">
                    <QrCode size={120} className="text-gray-800" />
                    <p className="text-xs text-center mt-2 text-gray-600">QR Code Placeholder</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Or enter this key manually:</Label>
                  <div className="flex space-x-2">
                    <Input 
                      value={secretKey} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleCopySecret}
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button 
                onClick={() => setStep('verify')}
                className="bg-quantablue-dark hover:bg-quantablue-medium"
              >
                <Smartphone size={16} className="mr-2" />
                Continue to Verification
              </Button>
            </div>
          </div>
        )}
        
        {step === 'verify' && (
          <div className="space-y-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Step 3: Verify Setup</CardTitle>
                <CardDescription>
                  Enter the 6-digit code from your authenticator app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Verification Code</Label>
                    <Input
                      id="verification-code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="text-center text-lg tracking-widest font-mono"
                      maxLength={6}
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-blue-800 text-sm">
                      <strong>Tip:</strong> The code changes every 30 seconds. If it doesn't work, wait for the next code.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {step === 'setup' ? (
            <Button variant="outline" onClick={() => setStep('verify')}>
              Skip to Verification
            </Button>
          ) : (
            <Button
              onClick={handleVerify}
              disabled={isVerifying || verificationCode.length !== 6}
              className="bg-quantablue-dark hover:bg-quantablue-medium"
            >
              {isVerifying ? 'Verifying...' : 'Enable 2FA'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorSetup;

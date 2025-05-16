
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { generatePassword, calculatePasswordStrength, getSecurityLevel } from '@/lib/passwordUtils';
import { Progress } from '@/components/ui/progress';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { toast } from 'sonner';

const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(16);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);
  
  const passwordStrength = calculatePasswordStrength(generatedPassword);
  const securityLevel = getSecurityLevel(passwordStrength);
  
  // Generate a password on component mount and when options change
  useEffect(() => {
    handleGeneratePassword();
  }, [length, includeLowercase, includeUppercase, includeNumbers, includeSymbols]);
  
  const handleGeneratePassword = () => {
    // Ensure at least one character type is selected
    if (!includeLowercase && !includeUppercase && !includeNumbers && !includeSymbols) {
      setIncludeLowercase(true);
      return;
    }
    
    const password = generatePassword(length, {
      lowercase: includeLowercase,
      uppercase: includeUppercase,
      numbers: includeNumbers,
      symbols: includeSymbols,
    });
    
    setGeneratedPassword(password);
    setCopied(false);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    toast.success("Password copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  
  const getStrengthColor = () => {
    if (securityLevel === 'high') return 'bg-green-500';
    if (securityLevel === 'medium') return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Password Generator</CardTitle>
        <CardDescription>Create secure, random passwords</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-quantablue-darkest/5 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="font-mono text-xl break-all">{generatedPassword}</div>
            <div className="flex items-center space-x-2 shrink-0 ml-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGeneratePassword}
                className="h-9 w-9 p-0"
              >
                <RefreshCw size={16} />
              </Button>
              <Button 
                onClick={handleCopy}
                className="bg-quantablue-dark hover:bg-quantablue-medium h-9 px-3"
                disabled={copied}
              >
                {copied ? (
                  <>
                    <Check size={16} className="mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between items-center text-sm">
              <span>Password Strength</span>
              <span className={`font-medium security-${securityLevel}`}>
                {securityLevel === 'high' && 'Strong'}
                {securityLevel === 'medium' && 'Medium'}
                {securityLevel === 'low' && 'Weak'}
              </span>
            </div>
            <Progress value={passwordStrength} className="h-2 mt-1" indicatorClassName={getStrengthColor()} />
          </div>
        </div>
        
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Password Length: {length}</Label>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">8</span>
              <Slider
                defaultValue={[16]}
                min={8}
                max={32}
                step={1}
                value={[length]}
                onValueChange={(vals) => setLength(vals[0])}
                className="flex-1"
              />
              <span className="text-sm">32</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase" className="cursor-pointer">Include Lowercase Letters</Label>
              <Switch
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={setIncludeLowercase}
                disabled={!includeUppercase && !includeNumbers && !includeSymbols}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase" className="cursor-pointer">Include Uppercase Letters</Label>
              <Switch
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={setIncludeUppercase}
                disabled={!includeLowercase && !includeNumbers && !includeSymbols}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="numbers" className="cursor-pointer">Include Numbers</Label>
              <Switch
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
                disabled={!includeLowercase && !includeUppercase && !includeSymbols}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="symbols" className="cursor-pointer">Include Symbols</Label>
              <Switch
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={setIncludeSymbols}
                disabled={!includeLowercase && !includeUppercase && !includeNumbers}
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            className="w-full bg-quantablue-dark hover:bg-quantablue-medium"
            onClick={handleGeneratePassword}
          >
            <RefreshCw size={16} className="mr-2" />
            Generate New Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordGenerator;

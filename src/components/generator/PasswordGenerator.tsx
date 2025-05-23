
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, RefreshCw, Check, Save } from 'lucide-react';
import { PasswordOptions, generatorService } from '@/services/generatorService';
import { calculatePasswordStrength, getSecurityLevel } from '@/lib/passwordUtils';
import { toast } from 'sonner';
import { passwordService } from '@/services/passwordService';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const PasswordGenerator: React.FC = () => {
  const { user } = useAuth();
  const [passwordType, setPasswordType] = useState<'random' | 'passphrase'>('random');
  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('personal');
  
  // Options for random password
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilarChars: false
  });
  
  // Options for passphrase
  const [wordCount, setWordCount] = useState<number>(4);
  const [separator, setSeparator] = useState<string>('-');
  
  // Strength calculation
  const strength = calculatePasswordStrength(password);
  const securityLevel = getSecurityLevel(strength);
  
  const generateRandomPassword = () => {
    const newPassword = generatorService.generatePassword(options);
    setPassword(newPassword);
    setCopied(false);
  };
  
  const generatePassphrase = () => {
    const newPassphrase = generatorService.generatePassphrase(wordCount, separator);
    setPassword(newPassphrase);
    setCopied(false);
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success('Password copied to clipboard');
    
    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSavePassword = async () => {
    if (!title || !username || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!user) {
      toast.error('You must be logged in to save passwords');
      return;
    }
    
    try {
      await passwordService.create({
        title,
        username,
        password,
        url: url || undefined,
        category,
        strength_score: strength,
        user_id: user.id
      });
      
      toast.success('Password saved successfully');
      setSaveDialogOpen(false);
      
      // Reset form fields
      setTitle('');
      setUsername('');
      setUrl('');
      
    } catch (error) {
      console.error('Error saving password:', error);
      toast.error('Failed to save password');
    }
  };
  
  // Generate a password on initial render
  React.useEffect(() => {
    generateRandomPassword();
  }, []);
  
  const getStrengthColor = () => {
    if (securityLevel === 'high') return 'bg-green-500';
    if (securityLevel === 'medium') return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password Generator</CardTitle>
          <CardDescription>Create strong and secure passwords</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={passwordType} onValueChange={(value) => setPasswordType(value as 'random' | 'passphrase')}>
            <TabsList className="mb-6">
              <TabsTrigger value="random">Random Password</TabsTrigger>
              <TabsTrigger value="passphrase">Passphrase</TabsTrigger>
            </TabsList>
            
            <div className="mb-6">
              <div className="relative">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-24 font-mono text-lg h-12"
                />
                <div className="absolute right-2 top-2 flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={passwordType === 'random' ? generateRandomPassword : generatePassphrase}
                    className="h-8 w-8"
                  >
                    <RefreshCw size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyToClipboard}
                    className="h-8 w-8"
                  >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">Password Strength</span>
                <span className="text-sm font-medium">
                  {securityLevel === 'high' && 'Strong'}
                  {securityLevel === 'medium' && 'Medium'}
                  {securityLevel === 'low' && 'Weak'}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div
                  className={`h-full ${getStrengthColor()}`}
                  style={{ width: `${strength}%` }}
                ></div>
              </div>
            </div>
            
            <TabsContent value="random" className="mt-0">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Password Length: {options.length}</Label>
                  </div>
                  <Slider
                    value={[options.length]}
                    min={8}
                    max={64}
                    step={1}
                    onValueChange={(value) => {
                      setOptions({ ...options, length: value[0] });
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="uppercase">Include Uppercase</Label>
                    <Switch
                      id="uppercase"
                      checked={options.includeUppercase}
                      onCheckedChange={(checked) => setOptions({ ...options, includeUppercase: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="lowercase">Include Lowercase</Label>
                    <Switch
                      id="lowercase"
                      checked={options.includeLowercase}
                      onCheckedChange={(checked) => setOptions({ ...options, includeLowercase: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="numbers">Include Numbers</Label>
                    <Switch
                      id="numbers"
                      checked={options.includeNumbers}
                      onCheckedChange={(checked) => setOptions({ ...options, includeNumbers: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="symbols">Include Symbols</Label>
                    <Switch
                      id="symbols"
                      checked={options.includeSymbols}
                      onCheckedChange={(checked) => setOptions({ ...options, includeSymbols: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between sm:col-span-2">
                    <Label htmlFor="similar">Exclude Similar Characters (i, l, 1, L, o, 0, O)</Label>
                    <Switch
                      id="similar"
                      checked={options.excludeSimilarChars}
                      onCheckedChange={(checked) => setOptions({ ...options, excludeSimilarChars: checked })}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={generateRandomPassword}
                  className="w-full bg-quantablue-dark hover:bg-quantablue-medium"
                >
                  Generate Password
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="passphrase" className="mt-0">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Number of Words: {wordCount}</Label>
                  </div>
                  <Slider
                    value={[wordCount]}
                    min={3}
                    max={8}
                    step={1}
                    onValueChange={(value) => setWordCount(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Separator</Label>
                  <Select 
                    value={separator}
                    onValueChange={setSeparator}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">Hyphen (-)</SelectItem>
                      <SelectItem value=".">Period (.)</SelectItem>
                      <SelectItem value="_">Underscore (_)</SelectItem>
                      <SelectItem value=" ">Space</SelectItem>
                      <SelectItem value=",">Comma (,)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={generatePassphrase}
                  className="w-full bg-quantablue-dark hover:bg-quantablue-medium"
                >
                  Generate Passphrase
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              className="flex-1 mr-2"
            >
              {copied ? <Check size={16} className="mr-2 text-green-500" /> : <Copy size={16} className="mr-2" />}
              {copied ? 'Copied' : 'Copy to Clipboard'}
            </Button>
            
            <Button
              onClick={() => setSaveDialogOpen(true)}
              className="flex-1 ml-2 bg-quantablue-dark hover:bg-quantablue-medium"
            >
              <Save size={16} className="mr-2" />
              Save to Vault
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Password</DialogTitle>
            <DialogDescription>
              Add this password to your vault
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. Gmail Account"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="e.g. john.doe@gmail.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">Website URL (optional)</Label>
              <Input 
                id="url" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="e.g. https://gmail.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePassword} className="bg-quantablue-dark hover:bg-quantablue-medium">
              Save to Vault
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PasswordGenerator;

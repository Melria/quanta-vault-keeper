
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const [autoLockTime, setAutoLockTime] = useState('5');
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [clipboardClearTime, setClipboardClearTime] = useState('30');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [language, setLanguage] = useState('en');
  
  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };
  
  const handleExportData = () => {
    toast.success('Data exported successfully');
  };
  
  const handleResetSettings = () => {
    // Reset state variables to defaults
    setAutoLockTime('5');
    setBiometricEnabled(true);
    setDarkMode(false);
    setClipboardClearTime('30');
    setTwoFAEnabled(false);
    setLanguage('en');
    
    toast.success('Settings reset to defaults');
  };
  
  const handleChangePassword = () => {
    toast.success('Password changed successfully');
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-4 max-w-lg">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your application preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable dark theme for the application
                    </p>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Auto-lock after inactivity (minutes)</Label>
                  <Select value={autoLockTime} onValueChange={setAutoLockTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Clear clipboard after (seconds)</Label>
                  <Select value={clipboardClearTime} onValueChange={setClipboardClearTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">60 seconds</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  className="bg-quantablue-dark hover:bg-quantablue-medium"
                  onClick={handleSaveSettings}
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleResetSettings}
                >
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security options for your vault</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Biometric Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Use fingerprint or face recognition to unlock your vault
                    </p>
                  </div>
                  <Switch
                    checked={biometricEnabled}
                    onCheckedChange={setBiometricEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={twoFAEnabled}
                    onCheckedChange={setTwoFAEnabled}
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleChangePassword}
                  >
                    Change Master Password
                  </Button>
                </div>
              </div>
              
              <Button 
                className="bg-quantablue-dark hover:bg-quantablue-medium"
                onClick={handleSaveSettings}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Sync</CardTitle>
              <CardDescription>Manage your data backup and synchronization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Automatic Sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync data across your devices
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="rounded-md border bg-muted/20 p-4">
                  <h3 className="font-medium mb-2">Last Backup</h3>
                  <p className="text-sm text-muted-foreground">May 15, 2024 at 10:35 AM</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleExportData}
                  >
                    Export Data
                  </Button>
                  <Button 
                    variant="outline"
                  >
                    Import Data
                  </Button>
                </div>
                
                <div className="p-3 bg-amber-50 text-amber-800 rounded-md text-sm">
                  <h4 className="font-medium mb-1">Important:</h4>
                  <p>
                    Exported data contains sensitive information. Store it in a secure location.
                  </p>
                </div>
              </div>
              
              <Button 
                className="bg-quantablue-dark hover:bg-quantablue-medium"
                onClick={handleSaveSettings}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your personal account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input 
                    type="email" 
                    defaultValue="user@example.com" 
                    readOnly 
                  />
                  <p className="text-xs text-muted-foreground">
                    To change your email, please contact support
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input 
                    defaultValue="User Name" 
                  />
                </div>
                
                <div className="pt-4 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                  >
                    Delete Account
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    This action is permanent and cannot be undone
                  </p>
                </div>
              </div>
              
              <Button 
                className="bg-quantablue-dark hover:bg-quantablue-medium"
                onClick={handleSaveSettings}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

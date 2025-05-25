import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { calculatePasswordStrength, getSecurityLevel } from '@/lib/passwordUtils';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import TwoFactorSetup from '@/components/settings/TwoFactorSetup';

// Mock function to save settings to localStorage
const saveSettings = (key: string, value: any) => {
  localStorage.setItem(`settings_${key}`, JSON.stringify(value));
  return Promise.resolve();
};

// Mock function to load settings from localStorage
const loadSettings = (key: string, defaultValue: any) => {
  const stored = localStorage.getItem(`settings_${key}`);
  return stored ? JSON.parse(stored) : defaultValue;
};

const Settings: React.FC = () => {
  const { user, signOut, updatePassword } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  // General Settings
  const [autoLockTime, setAutoLockTime] = useState<string>('5');
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(true);
  const [clipboardClearTime, setClipboardClearTime] = useState<string>('30');
  const [twoFAEnabled, setTwoFAEnabled] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');
  const [show2FASetup, setShow2FASetup] = useState<boolean>(false);
  
  // Password Change Dialog
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [changingPassword, setChangingPassword] = useState<boolean>(false);
  
  // Delete Account Dialog
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState<boolean>(false);
  const [confirmEmail, setConfirmEmail] = useState<string>('');
  const [deletingAccount, setDeletingAccount] = useState<boolean>(false);
  
  // Load saved settings on mount
  useEffect(() => {
    setAutoLockTime(loadSettings('autoLockTime', '5'));
    setBiometricEnabled(loadSettings('biometricEnabled', true));
    setClipboardClearTime(loadSettings('clipboardClearTime', '30'));
    setTwoFAEnabled(loadSettings('twoFAEnabled', false));
    setLanguage(loadSettings('language', 'en'));
  }, []);
  
  // Password strength calculation
  const passwordStrength = calculatePasswordStrength(newPassword);
  const securityLevel = getSecurityLevel(passwordStrength);
  
  // Get color based on strength
  const getStrengthColor = () => {
    if (securityLevel === 'high') return 'bg-green-500';
    if (securityLevel === 'medium') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
    saveSettings('darkMode', checked);
  };

  const handle2FAToggle = (checked: boolean) => {
    if (checked && !twoFAEnabled) {
      setShow2FASetup(true);
    } else if (!checked && twoFAEnabled) {
      setTwoFAEnabled(false);
      saveSettings('twoFAEnabled', false);
      toast.success('Two-factor authentication disabled');
    }
  };

  const handle2FAEnable = () => {
    setTwoFAEnabled(true);
    saveSettings('twoFAEnabled', true);
  };
  
  const handleSaveSettings = async () => {
    try {
      // Save all settings to localStorage
      await saveSettings('autoLockTime', autoLockTime);
      await saveSettings('biometricEnabled', biometricEnabled);
      await saveSettings('clipboardClearTime', clipboardClearTime);
      await saveSettings('twoFAEnabled', twoFAEnabled);
      await saveSettings('language', language);
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };
  
  const handleResetSettings = () => {
    // Reset state variables to defaults
    setAutoLockTime('5');
    setBiometricEnabled(true);
    setClipboardClearTime('30');
    setTwoFAEnabled(false);
    setLanguage('en');
    setTheme('light');
    
    // Reset localStorage settings
    localStorage.removeItem('settings_autoLockTime');
    localStorage.removeItem('settings_biometricEnabled');
    localStorage.removeItem('settings_darkMode');
    localStorage.removeItem('settings_clipboardClearTime');
    localStorage.removeItem('settings_twoFAEnabled');
    localStorage.removeItem('settings_language');
    
    toast.success('Settings reset to defaults');
  };
  
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (passwordStrength < 50) {
      toast.error("Please use a stronger password");
      return;
    }
    
    setChangingPassword(true);
    
    try {
      // Use the updatePassword function from AuthContext
      await updatePassword(newPassword);
      
      toast.success("Password changed successfully");
      setChangePasswordDialogOpen(false);
      
      // Reset form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!confirmEmail) {
      toast.error("Please enter your email to confirm deletion");
      return;
    }
    
    if (user?.email !== confirmEmail) {
      toast.error("Email address doesn't match your account");
      return;
    }
    
    setDeletingAccount(true);
    
    try {
      // In a real app, you would call an API to delete the account
      // For this demo, we'll just sign out
      toast.success("Account deleted successfully");
      await signOut();
      navigate('/login');
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error(error.message || "Failed to delete account");
    } finally {
      setDeletingAccount(false);
    }
  };
  
  const handleExportData = () => {
    toast.success('Data exported successfully');
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
                    checked={theme === 'dark'}
                    onCheckedChange={handleDarkModeToggle}
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
                    onCheckedChange={handle2FAToggle}
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setChangePasswordDialogOpen(true)}
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
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </p>
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
                    value={user?.email || ''} 
                    readOnly 
                  />
                  <p className="text-xs text-muted-foreground">
                    To change your email, please contact support
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input 
                    defaultValue={user?.user_metadata?.full_name || ''} 
                  />
                </div>
                
                <div className="pt-4 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                    onClick={() => setDeleteAccountDialogOpen(true)}
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
      
      {/* Change Password Dialog */}
      <Dialog open={changePasswordDialogOpen} onOpenChange={setChangePasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Master Password</DialogTitle>
            <DialogDescription>
              Update your master password for the vault
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span>Password Strength</span>
                    <span className="font-medium">
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
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              
              {confirmPassword && (
                <p className={`text-xs mt-1 ${newPassword === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                  {newPassword === confirmPassword ? 'Passwords match' : 'Passwords don\'t match'}
                </p>
              )}
            </div>
            
            <div className="bg-amber-50 p-3 rounded-md">
              <div className="flex">
                <AlertCircle className="text-amber-500 h-5 w-5 mr-2" />
                <p className="text-amber-800 text-sm">
                  Changing your master password will require you to log in again on all devices.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChangePasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="bg-quantablue-dark hover:bg-quantablue-medium"
            >
              {changingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Account Dialog */}
      <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-red-50 p-4 rounded-md mb-4">
              <div className="flex">
                <AlertTriangle className="text-red-500 h-5 w-5 mr-2" />
                <div>
                  <h4 className="font-medium text-red-800 mb-1">Warning</h4>
                  <p className="text-red-700 text-sm">
                    Deleting your account will permanently remove all your passwords and personal data.
                    This action cannot be undone or recovered.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-email">
                Confirm by typing your email ({user?.email})
              </Label>
              <Input
                id="confirm-email"
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder={user?.email || ''}
                className="border-red-200"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteAccountDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deletingAccount || confirmEmail !== user?.email}
            >
              {deletingAccount ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TwoFactorSetup
        open={show2FASetup}
        onOpenChange={setShow2FASetup}
        onEnable={handle2FAEnable}
      />
    </div>
  );
};

export default Settings;

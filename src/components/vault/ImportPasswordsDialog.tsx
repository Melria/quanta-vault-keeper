import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { passwordService } from '@/services/passwordService';
import { calculatePasswordStrength } from '@/lib/passwordUtils';

import { Filesystem } from '@capacitor/filesystem';
import { FilePicker } from '@capawesome/capacitor-file-picker';

interface ImportPasswordsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ParsedPassword {
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

const ImportPasswordsDialog: React.FC<ImportPasswordsDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<string>('');
  const [importing, setImporting] = useState(false);
  const [previewData, setPreviewData] = useState<ParsedPassword[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const supportedFormats = [
    { value: 'google', label: 'Google Password Manager' },
    { value: 'chrome', label: 'Chrome Passwords' },
    { value: 'firefox', label: 'Firefox' },
    { value: 'safari', label: 'Safari' },
    { value: 'lastpass', label: 'LastPass' },
    { value: 'bitwarden', label: 'Bitwarden' },
    { value: 'generic', label: 'Generic CSV' },
  ];

  const parseCSV = (csvText: string, format: string): ParsedPassword[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
    const data: ParsedPassword[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      let parsed: ParsedPassword | null = null;

      switch (format) {
        case 'google':
        case 'chrome':
          if (values.length >= 4) {
            parsed = {
              title: values[0] || values[1] || 'Imported Password',
              url: values[1],
              username: values[2],
              password: values[3],
              notes: values[4] || '',
            };
          }
          break;
        case 'firefox':
          if (values.length >= 3) {
            parsed = {
              title: values[0] || 'Firefox Password',
              url: values[0],
              username: values[1],
              password: values[2],
            };
          }
          break;
        case 'lastpass':
          if (values.length >= 5) {
            parsed = {
              title: values[4] || values[0] || 'LastPass Password',
              url: values[0],
              username: values[1],
              password: values[2],
              notes: values[3],
            };
          }
          break;
        case 'bitwarden':
          if (values.length >= 10) {
            parsed = {
              title: values[3] || 'Bitwarden Password',
              url: values[7],
              username: values[8],
              password: values[9],
              notes: values[4],
            };
          }
          break;
        default: {
          const titleIndex = headers.findIndex(h => h.includes('name') || h.includes('title') || h.includes('site'));
          const urlIndex = headers.findIndex(h => h.includes('url') || h.includes('website') || h.includes('site'));
          const usernameIndex = headers.findIndex(h => h.includes('username') || h.includes('email') || h.includes('login'));
          const passwordIndex = headers.findIndex(h => h.includes('password'));
          const notesIndex = headers.findIndex(h => h.includes('note') || h.includes('comment'));

          if (passwordIndex >= 0 && passwordIndex < values.length) {
            parsed = {
              title: (titleIndex >= 0 ? values[titleIndex] : '') || (urlIndex >= 0 ? values[urlIndex] : '') || 'Imported Password',
              url: urlIndex >= 0 ? values[urlIndex] : '',
              username: usernameIndex >= 0 ? values[usernameIndex] : '',
              password: values[passwordIndex],
              notes: notesIndex >= 0 ? values[notesIndex] : '',
            };
          }
          break;
        }
      }

      if (parsed && parsed.password) {
        data.push(parsed);
      }
    }

    return data;
  };

  async function requestStoragePermission(): Promise<boolean> {
    const check = await Filesystem.checkPermissions();
    if (check.publicStorage === 'granted') return true;
    const request = await Filesystem.requestPermissions();
    return request.publicStorage === 'granted';
  }

  async function openNativeFilePicker() {
    try {
      const result = await FilePicker.pickFiles({
        types: ['application/csv', 'text/csv'],
      });

      if (result.files && result.files.length > 0) {
        const file = result.files[0];
        const blob = await fetch(file.path!).then(res => res.blob());
        const text = await blob.text();
        const parsed = parseCSV(text, importType);

        if (parsed.length === 0) {
          toast.error('No valid passwords found in the file');
          return;
        }

        setPreviewData(parsed);
        setShowPreview(true);
        toast.success(`Found ${parsed.length} passwords to import`);
      }
    } catch (err) {
      console.error('File picking failed:', err);
      toast.error('Could not pick file.');
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setShowPreview(false);
      setPreviewData([]);
    }
  };

  const handlePreview = async () => {
    if (!file || !importType) {
      toast.error('Please select a file and import type');
      return;
    }

    const allowed = await requestStoragePermission();
    if (!allowed) {
      toast.error("Permission denied. Please allow file access.");
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseCSV(text, importType);
      if (parsed.length === 0) {
        toast.error('No valid passwords found in the file');
        return;
      }
      setPreviewData(parsed);
      setShowPreview(true);
      toast.success(`Found ${parsed.length} passwords to import`);
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error('Error reading file. Please check the format.');
    }
  };

  const handleImport = async () => {
    if (!user || previewData.length === 0) {
      toast.error('No data to import');
      return;
    }

    setImporting(true);
    let imported = 0;
    let errors = 0;

    try {
      for (const passwordData of previewData) {
        try {
          const strengthScore = calculatePasswordStrength(passwordData.password);
          await passwordService.create({
            title: passwordData.title,
            username: passwordData.username,
            password: passwordData.password,
            url: passwordData.url || null,
            notes: passwordData.notes || null,
            category: 'imported',
            favorite: false,
            strength_score: strengthScore,
            user_id: user.id,
          });
          imported++;
        } catch (error) {
          console.error('Error importing password:', error);
          errors++;
        }
      }

      if (imported > 0) {
        toast.success(`Successfully imported ${imported} passwords${errors > 0 ? `. ${errors} failed.` : ''}`);
        onSuccess();
        onOpenChange(false);
        resetDialog();
      } else {
        toast.error('Failed to import any passwords');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Error during import process');
    } finally {
      setImporting(false);
    }
  };

  const resetDialog = () => {
    setFile(null);
    setImportType('');
    setPreviewData([]);
    setShowPreview(false);
    setImporting(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetDialog();
  };

  const isMobileApp = () => typeof window !== 'undefined' && !!window.Capacitor && window.Capacitor.isNativePlatform?.();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Passwords</DialogTitle>
          <DialogDescription>
            Import passwords from other password managers using CSV files
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Password Manager Type</Label>
              <Select value={importType} onValueChange={setImportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your password manager" />
                </SelectTrigger>
                <SelectContent>
                  {supportedFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              {isMobileApp() ? (
                <Button onClick={openNativeFilePicker} className="w-full">
                  Pick CSV File (Mobile)
                </Button>
              ) : (
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              )}
              <p className="text-xs text-muted-foreground">
                Select a CSV file exported from your password manager
              </p>
            </div>

            {file && importType && !isMobileApp() && (
              <Button
                onClick={handlePreview}
                variant="outline"
                className="w-full"
              >
                <FileText size={16} className="mr-2" />
                Preview Import ({file.name})
              </Button>
            )}
          </div>

          {showPreview && previewData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Preview ({previewData.length} passwords)</CardTitle>
                <CardDescription>
                  Review the passwords that will be imported
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {previewData.slice(0, 5).map((pwd, index) => (
                    <div key={index} className="p-2 border rounded text-sm">
                      <div className="font-medium">{pwd.title}</div>
                      <div className="text-muted-foreground">
                        {pwd.username} • {pwd.url || 'No URL'}
                      </div>
                    </div>
                  ))}
                  {previewData.length > 5 && (
                    <div className="text-xs text-muted-foreground text-center py-2">
                      ... and {previewData.length - 5} more passwords
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-amber-50 p-4 rounded-md">
            <div className="flex">
              <AlertCircle className="text-amber-500 h-5 w-5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800 mb-1">Important Notes:</h4>
                <ul className="text-amber-700 text-sm space-y-1">
                  <li>• All imported passwords will be categorized as "imported"</li>
                  <li>• Duplicate passwords may be created if they already exist</li>
                  <li>• This process cannot be undone</li>
                  <li>• Make sure your CSV file doesn't contain sensitive information in notes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {showPreview && (
            <Button
              onClick={handleImport}
              disabled={importing || previewData.length === 0}
              className="bg-quantablue-dark hover:bg-quantablue-medium"
            >
              {importing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Importing...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Import {previewData.length} Passwords
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportPasswordsDialog;

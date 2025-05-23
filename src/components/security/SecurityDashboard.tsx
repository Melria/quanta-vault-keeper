
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { passwordService } from '@/services/passwordService';
import { SecurityCheck, securityService } from '@/services/securityService';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SecurityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isScanning, setIsScanning] = useState(false);
  
  const { data: passwords = [], isLoading, refetch } = useQuery({
    queryKey: ['passwords'],
    queryFn: passwordService.getAll,
  });
  
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);
  const [securityScore, setSecurityScore] = useState({
    overall: 0,
    breakdown: {
      uniqueness: 0,
      strength: 0,
      age: 0,
      twoFactor: 0
    }
  });
  
  useEffect(() => {
    if (passwords && passwords.length > 0 && !isLoading) {
      runSecurityCheck();
    }
  }, [passwords, isLoading]);
  
  const runSecurityCheck = () => {
    setIsScanning(true);
    
    // Simulate a scan with a short delay
    setTimeout(() => {
      const checks = securityService.runSecurityCheck(passwords);
      setSecurityChecks(checks);
      
      const score = securityService.calculateSecurityScore(passwords);
      setSecurityScore(score);
      
      setIsScanning(false);
    }, 1000);
  };
  
  const handleFixIssue = (issue: SecurityCheck) => {
    if (issue.affectedPasswords && issue.affectedPasswords.length > 0) {
      // Navigate to first affected password
      navigate(`/vault?id=${issue.affectedPasswords[0].id}`);
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  if (isLoading || isScanning) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-quantablue-dark mb-4" />
        <p className="text-lg font-medium">
          {isScanning ? 'Running security analysis...' : 'Loading your passwords...'}
        </p>
      </div>
    );
  }
  
  if (passwords.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="p-6 text-center">
          <div className="rounded-full bg-blue-100 h-12 w-12 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Passwords to Analyze</h3>
          <p className="text-muted-foreground mb-6">
            Add passwords to your vault to see security insights and recommendations.
          </p>
          <Button 
            className="bg-quantablue-dark hover:bg-quantablue-medium"
            onClick={() => navigate('/vault')}
          >
            Go to Password Vault
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Security Overview</TabsTrigger>
          <TabsTrigger value="issues">Security Issues {securityChecks.length > 0 && `(${securityChecks.length})`}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Score</CardTitle>
              <CardDescription>
                Your overall password security rating
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className={`text-5xl font-bold ${getScoreColor(securityScore.overall)}`}>
                      {securityScore.overall}
                    </span>
                    <span className="text-muted-foreground">
                      {getScoreDescription(securityScore.overall)}
                    </span>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="#e9e9e9" 
                      strokeWidth="10" 
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke={securityScore.overall >= 80 ? "#22c55e" : securityScore.overall >= 60 ? "#eab308" : "#ef4444"} 
                      strokeWidth="10" 
                      strokeDasharray={`${securityScore.overall * 2.83} ${283 - securityScore.overall * 2.83}`}
                      strokeDashoffset="70.75" 
                      transform="rotate(-90 50 50)" 
                    />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Password Strength</span>
                    <span className="font-medium">{securityScore.breakdown.strength}%</span>
                  </div>
                  <Progress value={securityScore.breakdown.strength} className="h-2" indicatorClassName={getProgressColor(securityScore.breakdown.strength)} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Password Uniqueness</span>
                    <span className="font-medium">{securityScore.breakdown.uniqueness}%</span>
                  </div>
                  <Progress value={securityScore.breakdown.uniqueness} className="h-2" indicatorClassName={getProgressColor(securityScore.breakdown.uniqueness)} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Password Freshness</span>
                    <span className="font-medium">{securityScore.breakdown.age}%</span>
                  </div>
                  <Progress value={securityScore.breakdown.age} className="h-2" indicatorClassName={getProgressColor(securityScore.breakdown.age)} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Two-Factor Auth</span>
                    <span className="font-medium">{securityScore.breakdown.twoFactor}%</span>
                  </div>
                  <Progress value={securityScore.breakdown.twoFactor} className="h-2" indicatorClassName={getProgressColor(securityScore.breakdown.twoFactor)} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <Button 
                variant="outline" 
                onClick={runSecurityCheck}
                className="w-full sm:w-auto"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Refresh Security Analysis
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Password Stats</CardTitle>
                <CardDescription>Overview of your password vault</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Passwords</span>
                    <span className="font-medium text-lg">{passwords.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Weak Passwords</span>
                    <span className="font-medium text-lg text-red-500">
                      {passwords.filter(p => p.strength_score < 50).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Reused Passwords</span>
                    <span className="font-medium text-lg text-orange-500">
                      {
                        Array.from(
                          new Map(
                            passwords.map(p => [p.password, true])
                          ).keys()
                        ).length < passwords.length 
                          ? passwords.length - Array.from(new Map(passwords.map(p => [p.password, true])).keys()).length 
                          : 0
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Strong Passwords</span>
                    <span className="font-medium text-lg text-green-500">
                      {passwords.filter(p => p.strength_score >= 80).length}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="link" className="w-full justify-center" onClick={() => navigate('/vault')}>
                  View all passwords
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security Tips</CardTitle>
                <CardDescription>Best practices for better security</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p>Use unique passwords for each account</p>
                  </div>
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p>Enable two-factor authentication when available</p>
                  </div>
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p>Change passwords regularly, at least every 90 days</p>
                  </div>
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p>Use a mix of characters, numbers, and symbols</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="link" className="w-full justify-center" onClick={() => navigate('/generator')}>
                  Generate strong passwords
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="issues" className="mt-0">
          <div className="space-y-6">
            {securityChecks.length > 0 ? (
              securityChecks.map((check) => (
                <Card key={check.id} className={`${getSeverityColor(check.severity)} border`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        {getSeverityIcon(check.severity)}
                        <div className="ml-2">
                          <CardTitle className="text-lg">{check.title}</CardTitle>
                          <CardDescription className={check.severity === 'critical' ? 'text-red-800/80' : ''}>
                            {check.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="uppercase text-xs font-bold px-2 py-0.5 rounded bg-white/30">
                        {check.severity}
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      variant={check.severity === 'critical' ? 'default' : 'outline'}
                      className={check.severity === 'critical' ? 'bg-red-600 hover:bg-red-700' : ''}
                      onClick={() => handleFixIssue(check)}
                    >
                      Fix Issue
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mr-4" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-700">No Issues Found</h3>
                      <p className="text-green-600">Your password vault looks secure</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="text-center">
              <Button onClick={runSecurityCheck} variant="outline">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Run Analysis Again
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;

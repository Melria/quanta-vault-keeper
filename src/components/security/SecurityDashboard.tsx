
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Shield, 
  ShieldCheck, 
  Clock, 
  Info,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockPasswords, mockSecurityAlerts } from '@/lib/mockData';
import { getSecurityLevel } from '@/lib/passwordUtils';

const SecurityDashboard: React.FC = () => {
  // Calculate overall security score
  const calculateOverallScore = () => {
    if (mockPasswords.length === 0) return 0;
    
    const totalScore = mockPasswords.reduce((sum, password) => sum + password.strengthScore, 0);
    return Math.round(totalScore / mockPasswords.length);
  };
  
  const overallScore = calculateOverallScore();
  const securityLevel = getSecurityLevel(overallScore);
  
  // Count passwords by security level
  const securityCounts = {
    high: mockPasswords.filter(p => getSecurityLevel(p.strengthScore) === 'high').length,
    medium: mockPasswords.filter(p => getSecurityLevel(p.strengthScore) === 'medium').length,
    low: mockPasswords.filter(p => getSecurityLevel(p.strengthScore) === 'low').length,
  };
  
  const totalPasswords = mockPasswords.length;
  
  // Get color for progress bar
  const getScoreColor = () => {
    if (securityLevel === 'high') return 'bg-green-500';
    if (securityLevel === 'medium') return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="text-red-500" size={18} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={18} />;
      default:
        return <Info className="text-blue-500" size={18} />;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-full md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Security Score</CardTitle>
            <CardDescription>Your overall password security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-36 h-36 mb-4">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="fill-none stroke-gray-200"
                    strokeWidth="4"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`fill-none ${
                      securityLevel === 'high' ? 'stroke-green-500' : 
                      securityLevel === 'medium' ? 'stroke-yellow-500' : 
                      'stroke-red-500'
                    }`}
                    strokeWidth="4"
                    strokeDasharray={`${overallScore}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold">{overallScore}</span>
                  <span className="text-sm text-muted-foreground">out of 100</span>
                </div>
              </div>
              <div className={`font-semibold text-lg security-${securityLevel}`}>
                {securityLevel === 'high' && 'Good Protection'}
                {securityLevel === 'medium' && 'Moderate Protection'}
                {securityLevel === 'low' && 'Weak Protection'}
              </div>
              <p className="text-sm text-muted-foreground mt-1 text-center">
                {securityLevel === 'high' 
                  ? 'Your passwords are generally strong and secure.' 
                  : 'There\'s room for improvement in your password security.'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-full md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Security Alerts</CardTitle>
            <CardDescription>Issues that need your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockSecurityAlerts.length > 0 ? (
              mockSecurityAlerts.map(alert => (
                <Alert key={alert.id} variant="outline" className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <AlertTitle className="mb-0">
                        {alert.message}
                        {alert.severity === 'critical' && (
                          <Badge className="ml-2 bg-red-500">Critical</Badge>
                        )}
                      </AlertTitle>
                      <span className="text-xs text-muted-foreground">{formatDate(alert.date)}</span>
                    </div>
                    <AlertDescription className="mt-1">
                      <Button
                        variant="link"
                        className="h-auto p-0 text-sm text-quantablue-medium flex items-center"
                      >
                        View affected items <ArrowRight className="ml-1" size={14} />
                      </Button>
                    </AlertDescription>
                  </div>
                </Alert>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <ShieldCheck size={48} className="text-green-500 mb-2" />
                <h3 className="text-lg font-medium">All Good!</h3>
                <p className="text-muted-foreground text-center">
                  No security issues were found with your passwords.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Password Health</CardTitle>
            <CardDescription>Status of your {totalPasswords} passwords</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Strong passwords</span>
                <span className="font-medium">{securityCounts.high} of {totalPasswords}</span>
              </div>
              <Progress 
                value={(securityCounts.high / totalPasswords) * 100} 
                className="h-2"
                indicatorClassName="bg-green-500"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Medium-strength passwords</span>
                <span className="font-medium">{securityCounts.medium} of {totalPasswords}</span>
              </div>
              <Progress 
                value={(securityCounts.medium / totalPasswords) * 100} 
                className="h-2"
                indicatorClassName="bg-yellow-500"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weak passwords</span>
                <span className="font-medium">{securityCounts.low} of {totalPasswords}</span>
              </div>
              <Progress 
                value={(securityCounts.low / totalPasswords) * 100} 
                className="h-2"
                indicatorClassName="bg-red-500"
              />
            </div>
            
            <Button className="w-full mt-2 bg-quantablue-dark hover:bg-quantablue-medium">
              Run Security Audit
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest security events</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-quantablue-medium/10 p-2 rounded-full mr-3">
                  <Shield size={16} className="text-quantablue-medium" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">Security scan completed</p>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">No new issues found</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-blue-50 p-2 rounded-full mr-3">
                  <Info size={16} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">Password updated</p>
                    <span className="text-xs text-muted-foreground">Yesterday</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">Company Portal password changed</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-yellow-50 p-2 rounded-full mr-3">
                  <Clock size={16} className="text-yellow-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">Password expiring soon</p>
                    <span className="text-xs text-muted-foreground">3 days ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">Work email password needs rotation</p>
                </div>
              </li>
            </ul>
            
            <Button variant="link" className="w-full mt-2 text-quantablue-medium">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityDashboard;

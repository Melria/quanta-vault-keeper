
import { PasswordEntry } from "@/types/password";

export interface SecurityCheck {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedPasswords?: PasswordEntry[];
}

export interface SecurityScore {
  overall: number; // 0-100
  breakdown: {
    uniqueness: number;
    strength: number;
    age: number;
    twoFactor: number;
  };
}

export const securityService = {
  /**
   * Analyze password entries for security issues
   */
  runSecurityCheck: (passwords: PasswordEntry[]): SecurityCheck[] => {
    const checks: SecurityCheck[] = [];
    
    // Check for weak passwords
    const weakPasswords = passwords.filter(p => p.strength_score < 50);
    if (weakPasswords.length > 0) {
      checks.push({
        id: 'weak-passwords',
        title: 'Weak Passwords Detected',
        description: `${weakPasswords.length} password${weakPasswords.length > 1 ? 's' : ''} ${weakPasswords.length > 1 ? 'have' : 'has'} a low strength score.`,
        severity: weakPasswords.length > 3 ? 'high' : 'medium',
        affectedPasswords: weakPasswords
      });
    }
    
    // Check for reused passwords (simplified for demo)
    const passwordMap = new Map<string, PasswordEntry[]>();
    passwords.forEach(p => {
      if (!passwordMap.has(p.password)) {
        passwordMap.set(p.password, []);
      }
      passwordMap.get(p.password)?.push(p);
    });
    
    const reusedPasswordSets = Array.from(passwordMap.entries())
      .filter(([_, entries]) => entries.length > 1)
      .map(([_, entries]) => entries);
    
    if (reusedPasswordSets.length > 0) {
      const totalReused = reusedPasswordSets.reduce((sum, set) => sum + set.length, 0);
      checks.push({
        id: 'reused-passwords',
        title: 'Password Reuse Detected',
        description: `${totalReused} passwords are being reused across ${reusedPasswordSets.length} different sites.`,
        severity: 'critical',
        affectedPasswords: reusedPasswordSets.flat()
      });
    }
    
    // Check for old passwords (not updated in last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const oldPasswords = passwords.filter(p => {
      const lastUpdated = new Date(p.last_updated);
      return lastUpdated < ninetyDaysAgo;
    });
    
    if (oldPasswords.length > 0) {
      checks.push({
        id: 'old-passwords',
        title: 'Passwords Not Recently Updated',
        description: `${oldPasswords.length} password${oldPasswords.length > 1 ? 's have' : ' has'} not been updated in over 90 days.`,
        severity: 'low',
        affectedPasswords: oldPasswords
      });
    }
    
    return checks;
  },
  
  /**
   * Calculate overall security score
   */
  calculateSecurityScore: (passwords: PasswordEntry[]): SecurityScore => {
    if (passwords.length === 0) {
      return {
        overall: 0,
        breakdown: {
          uniqueness: 0,
          strength: 0,
          age: 0,
          twoFactor: 0
        }
      };
    }

    // Calculate average strength score
    const avgStrength = passwords.reduce((sum, p) => sum + p.strength_score, 0) / passwords.length;
    
    // Calculate uniqueness score
    const uniquePasswords = new Set(passwords.map(p => p.password)).size;
    const uniquenessScore = (uniquePasswords / passwords.length) * 100;
    
    // Calculate age score
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentlyUpdated = passwords.filter(p => {
      const lastUpdated = new Date(p.last_updated);
      return lastUpdated >= thirtyDaysAgo;
    }).length;
    
    const ageScore = (recentlyUpdated / passwords.length) * 100;
    
    // Two-factor is mocked for this demo
    const twoFactorScore = 70;
    
    // Calculate overall score
    const overall = Math.round((avgStrength * 0.4) + (uniquenessScore * 0.3) + (ageScore * 0.2) + (twoFactorScore * 0.1));
    
    return {
      overall,
      breakdown: {
        strength: Math.round(avgStrength),
        uniqueness: Math.round(uniquenessScore),
        age: Math.round(ageScore),
        twoFactor: twoFactorScore
      }
    };
  }
};

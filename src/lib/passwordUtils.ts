/**
 * Password utility functions for QuantaVault
 */

/**
 * Calculate password strength on a scale of 0-100
 */
export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  // Initialize score
  let score = 0;
  
  // Length check
  if (password.length >= 12) {
    score += 30;
  } else if (password.length >= 8) {
    score += 20;
  } else if (password.length >= 6) {
    score += 10;
  }
  
  // Character variety checks
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  
  // Add points for character variety
  if (hasLowercase) score += 10;
  if (hasUppercase) score += 15;
  if (hasNumbers) score += 10;
  if (hasSpecialChars) score += 20;
  
  // Bonus for mixed character types
  let typesCount = 0;
  if (hasLowercase) typesCount++;
  if (hasUppercase) typesCount++;
  if (hasNumbers) typesCount++;
  if (hasSpecialChars) typesCount++;
  
  if (typesCount >= 3) score += 15;
  
  // Cap score at 100
  return Math.min(score, 100);
};

/**
 * Get security level from strength score
 */
export const getSecurityLevel = (strengthScore: number): 'high' | 'medium' | 'low' => {
  if (strengthScore >= 80) return 'high';
  if (strengthScore >= 50) return 'medium';
  return 'low';
};

/**
 * Generate random password based on criteria
 */
export const generatePassword = (
  length: number = 16,
  options: {
    lowercase?: boolean;
    uppercase?: boolean;
    numbers?: boolean;
    symbols?: boolean;
  } = {
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  }
): string => {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+{}[]|:;<>,.?/~';
  
  let validChars = '';
  if (options.lowercase) validChars += lowercaseChars;
  if (options.uppercase) validChars += uppercaseChars;
  if (options.numbers) validChars += numberChars;
  if (options.symbols) validChars += symbolChars;
  
  if (!validChars) validChars = lowercaseChars + uppercaseChars + numberChars;
  
  let password = '';
  const charArray = Array.from(validChars);
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charArray.length);
    password += charArray[randomIndex];
  }
  
  return password;
};

/**
 * Mask a password for display
 */
export const maskPassword = (password: string): string => {
  return '•'.repeat(Math.min(password.length, 12));
};

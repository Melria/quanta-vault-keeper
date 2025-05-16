
/**
 * Password utility functions for QuantaVault
 */

/**
 * Calculate password strength on a scale of 0-100
 */
export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length
  strength += Math.min(password.length * 4, 40);
  
  // Character variety
  if (/[a-z]/.test(password)) strength += 10; // lowercase
  if (/[A-Z]/.test(password)) strength += 10; // uppercase
  if (/\d/.test(password)) strength += 10; // digits
  if (/[^a-zA-Z0-9]/.test(password)) strength += 15; // special characters
  
  // Penalize for common patterns
  if (/(.)\1{2,}/.test(password)) strength -= 10; // repeated characters
  if (/^(123|abc|qwerty|password|admin)/i.test(password)) strength -= 20; // common patterns
  
  return Math.max(0, Math.min(100, strength));
};

/**
 * Get security level from strength score
 */
export const getSecurityLevel = (strength: number): 'high' | 'medium' | 'low' => {
  if (strength >= 80) return 'high';
  if (strength >= 50) return 'medium';
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
  return '•'.repeat(password.length);
};

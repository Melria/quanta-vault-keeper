
export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilarChars: boolean;
}

const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_-+=[]{}|:;"\'<>,.?/~`';
const SIMILAR_CHARS = 'il1LoO0';

export const generatorService = {
  /**
   * Generate a random password based on the provided options
   */
  generatePassword: (options: PasswordOptions): string => {
    let chars = '';
    
    if (options.includeLowercase) chars += LOWERCASE_CHARS;
    if (options.includeUppercase) chars += UPPERCASE_CHARS;
    if (options.includeNumbers) chars += NUMBER_CHARS;
    if (options.includeSymbols) chars += SYMBOL_CHARS;
    
    if (options.excludeSimilarChars) {
      chars = chars.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('');
    }
    
    if (chars.length === 0) {
      // Default to lowercase if nothing selected
      chars = LOWERCASE_CHARS;
    }
    
    let password = '';
    const charArray = chars.split('');
    
    // Ensure we have at least one character from each selected category
    if (options.includeLowercase) {
      password += LOWERCASE_CHARS.charAt(Math.floor(Math.random() * LOWERCASE_CHARS.length));
    }
    
    if (options.includeUppercase) {
      password += UPPERCASE_CHARS.charAt(Math.floor(Math.random() * UPPERCASE_CHARS.length));
    }
    
    if (options.includeNumbers) {
      password += NUMBER_CHARS.charAt(Math.floor(Math.random() * NUMBER_CHARS.length));
    }
    
    if (options.includeSymbols) {
      password += SYMBOL_CHARS.charAt(Math.floor(Math.random() * SYMBOL_CHARS.length));
    }
    
    // Fill the rest randomly
    while (password.length < options.length) {
      const randomIndex = Math.floor(Math.random() * charArray.length);
      password += charArray[randomIndex];
    }
    
    // Shuffle the password to mix the guaranteed characters
    return password.split('').sort(() => Math.random() - 0.5).join('');
  },
  
  /**
   * Generate a memorable passphrase
   */
  generatePassphrase: (wordCount: number = 4, separator: string = '-'): string => {
    // Simple word list for demo purposes
    const words = [
      'apple', 'banana', 'orange', 'grape', 'lemon', 'melon', 'cherry',
      'happy', 'sunny', 'funny', 'silly', 'crazy', 'lucky', 'shiny',
      'blue', 'green', 'red', 'yellow', 'purple', 'orange', 'teal',
      'river', 'ocean', 'mountain', 'forest', 'desert', 'island', 'valley'
    ];
    
    const passphrase: string[] = [];
    
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      let word = words[randomIndex];
      
      // Capitalize some words randomly
      if (Math.random() > 0.5) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      
      passphrase.push(word);
    }
    
    // Add a random number at the end
    const randomNum = Math.floor(Math.random() * 100);
    passphrase.push(randomNum.toString());
    
    return passphrase.join(separator);
  }
};

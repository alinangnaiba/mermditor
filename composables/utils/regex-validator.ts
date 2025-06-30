export interface RegexValidationResult {
  isValid: boolean;
  error?: string;
  errorType?: 'syntax' | 'escape' | 'structure' | 'unsupported';
}

export function validateRegexPattern(pattern: string): RegexValidationResult {
  if (!pattern) {
    return { isValid: true };
  }

  const invalidEscapes = [
    /\\[pP](?![{])/g,
    /\\[pP]\{[^}]*$/g,
    /\\[abefgijklmopqyACEFGIJKLMOPQYZ]/g,
    /\\$/g,
    /\\x(?![0-9a-fA-F]{2})/g,
    /\\u(?![0-9a-fA-F]{4})/g,
  ];

  for (const invalidPattern of invalidEscapes) {
    if (invalidPattern.test(pattern)) {
      return {
        isValid: false,
        error: 'Invalid escape sequence',
        errorType: 'escape'
      };
    }
  }

  if (/\\x[0-9a-fA-F]?(?![0-9a-fA-F])/.test(pattern)) {
    return {
      isValid: false,
      error: 'Invalid hexadecimal escape',
      errorType: 'escape'
    };
  }

  if (/\\u[0-9a-fA-F]{0,3}(?![0-9a-fA-F])/.test(pattern)) {
    return {
      isValid: false,
      error: 'Invalid Unicode escape',
      errorType: 'escape'
    };
  }

  let depth = 0;
  let inCharClass = false;
  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];
    const prevChar = i > 0 ? pattern[i - 1] : '';
    
    if (char === '[' && prevChar !== '\\') inCharClass = true;
    if (char === ']' && prevChar !== '\\') inCharClass = false;
    
    if (!inCharClass) {
      if (char === '(' && prevChar !== '\\') depth++;
      if (char === ')' && prevChar !== '\\') depth--;
      if (depth < 0) {
        return {
          isValid: false,
          error: 'Unmatched closing parenthesis',
          errorType: 'structure'
        };
      }
    }
  }
  
  if (depth > 0) {
    return {
      isValid: false,
      error: 'Unmatched opening parenthesis',
      errorType: 'structure'
    };
  }

  try {
    new RegExp(pattern, 'g');
    new RegExp(pattern, 'gi');
    
    if (/\\[pP]\{/.test(pattern)) {
      new RegExp(pattern, 'gu');
    }
  } catch {
    return {
      isValid: false,
      error: 'Invalid regular expression syntax',
      errorType: 'syntax'
    };
  }

  return { isValid: true };
}

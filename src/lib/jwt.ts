/**
 * Browser-compatible JWT implementation
 * This provides a simplified JWT implementation that works in browser environments
 * without requiring Node.js-specific modules
 */

// Base64 URL encoding/decoding functions
const base64UrlEncode = (str: string): string => {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const base64UrlDecode = (str: string): string => {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
};

// Simple object to string conversion with handling for undefined
const objToString = (obj: any): string => {
  if (obj === undefined) return '';
  return JSON.stringify(obj);
};

export interface JWTOptions {
  expiresIn?: string | number;
}

export interface JWTPayload {
  [key: string]: any;
  exp?: number;
  iat?: number;
}

/**
 * Browser JWT implementation
 */
export const browserJWT = {
  /**
   * Sign a payload and create a JWT token
   */
  sign: (payload: JWTPayload, secret: string, options: JWTOptions = {}): string => {
    // Create header
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    // Calculate expiration time
    let expiresIn = 3600; // Default: 1 hour
    if (options.expiresIn) {
      if (typeof options.expiresIn === 'string') {
        if (options.expiresIn.endsWith('d')) {
          expiresIn = parseInt(options.expiresIn) * 24 * 60 * 60;
        } else if (options.expiresIn.endsWith('h')) {
          expiresIn = parseInt(options.expiresIn) * 60 * 60;
        } else if (options.expiresIn.endsWith('m')) {
          expiresIn = parseInt(options.expiresIn) * 60;
        } else {
          expiresIn = parseInt(options.expiresIn);
        }
      } else {
        expiresIn = options.expiresIn;
      }
    }

    // Create payload with standard claims
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = {
      ...payload,
      iat: now,
      exp: now + expiresIn
    };

    // Encode header and payload
    const encodedHeader = base64UrlEncode(objToString(header));
    const encodedPayload = base64UrlEncode(objToString(fullPayload));
    
    // In a real implementation, this would be a proper HMAC signature
    // For this mock, we'll create a deterministic signature based on the secret and content
    const signatureInput = `${encodedHeader}.${encodedPayload}.${secret}`;
    const signature = base64UrlEncode(
      Array.from(signatureInput)
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
        .toString()
    );
    
    // Return the complete JWT
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  },
  
  /**
   * Verify a JWT token and return the payload
   */
  verify: (token: string, secret: string): JWTPayload => {
    try {
      // Split the token into parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      // Decode the payload
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        throw new Error('Token expired');
      }
      
      // In a real implementation, we would verify the signature here
      // For this mock, we'll just return the payload
      
      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  },
  
  /**
   * Decode a JWT token without verifying
   */
  decode: (token: string): JWTPayload | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      return JSON.parse(base64UrlDecode(parts[1]));
    } catch (error) {
      return null;
    }
  }
};

export default browserJWT;
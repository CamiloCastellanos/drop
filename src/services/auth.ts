import db from '../lib/mysql';
import bcrypt from 'bcryptjs';
import browserJWT from '../lib/jwt';
import crypto from 'crypto';

// Use a direct value instead of process.env
const JWT_SECRET = 'your-secret-key-should-be-long-and-secure';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  countryCode?: string;
  role: 'DROPSHIPPER' | 'PROVIDER';
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData) {
    // Validations
    if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
      throw new Error('El correo es requerido');
    }
    if (!data.password) {
      throw new Error('La contraseña es requerida');
    }
    if (!data.firstName || typeof data.firstName !== 'string' || !data.firstName.trim()) {
      throw new Error('El nombre es requerido');
    }
    if (!data.lastName || typeof data.lastName !== 'string' || !data.lastName.trim()) {
      throw new Error('El apellido es requerido');
    }
    if (!data.phone || typeof data.phone !== 'string' || !data.phone.trim()) {
      throw new Error('El teléfono es requerido');
    }
    if (data.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const email = String(data.email).toLowerCase().trim();
    const firstName = String(data.firstName).trim();
    const lastName = String(data.lastName).trim();
    const phone = String(data.phone).trim();
    const countryCode = data.countryCode || '57';

    try {
      // Check if user already exists
      const existingUser = await db.user.findByEmail(email);
      if (existingUser) {
        throw new Error('El correo electrónico ya está registrado');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);
      
      // Determine account type
      const accountType = data.role === 'DROPSHIPPER' ? 'dropshipper' : 'proveedor';
      
      // Create user in MySQL
      const userId = await db.user.create({
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        phone,
        country_code: countryCode,
        account_type: accountType,
        role_id: data.role === 'DROPSHIPPER' ? 2 : 3
      });

      return { userId };
    } catch (error: any) {
      console.error('Error in registration:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('El correo electrónico o teléfono ya está registrado');
      }
      throw error;
    }
  },

  async login({ email, password }: LoginData) {
    if (!email || typeof email !== 'string' || !email.trim()) {
      throw new Error('El correo es requerido');
    }
    if (!password) {
      throw new Error('La contraseña es requerida');
    }

    try {
      // Find user by email
      const user = await db.user.findByEmail(email.toLowerCase().trim());
      if (!user) {
        throw new Error('Correo o contraseña incorrectos');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Correo o contraseña incorrectos');
      }

      // Generate JWT token
      const token = browserJWT.sign(
        { userId: user.id, role: user.role_id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Update last login and token
      await db.user.updateLastLogin(user.id, token);

      // Return user data and token
      return {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role_id === 1 ? 'ADMIN' : user.role_id === 2 ? 'DROPSHIPPER' : 'PROVIDER'
        },
        token
      };
    } catch (error: any) {
      console.error('Error in login:', error);
      throw error;
    }
  },

  async logout() {
    try {
      // Get user ID from token
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const decoded = browserJWT.verify(token, JWT_SECRET) as { userId: number };
          if (decoded.userId) {
            await db.user.logout(decoded.userId);
          }
        } catch (e) {
          console.error('Invalid token:', e);
        }
      }
      
      // Clear token from localStorage
      localStorage.removeItem('auth_token');
    } catch (error: any) {
      console.error('Error in logout:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      
      try {
        const decoded = browserJWT.verify(token, JWT_SECRET) as { userId: number };
        if (!decoded.userId) return null;
        
        const user = await db.user.findById(decoded.userId);
        if (!user) return null;
        
        return {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role_id === 1 ? 'ADMIN' : user.role_id === 2 ? 'DROPSHIPPER' : 'PROVIDER'
        };
      } catch (e) {
        console.error('Invalid token:', e);
        return null;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    if (!token) return Promise.resolve(false);
    
    try {
      browserJWT.verify(token, JWT_SECRET);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.resolve(false);
    }
  },

  async forgotPassword(email: string) {
    if (!email || typeof email !== 'string' || !email.trim()) {
      throw new Error('El correo es requerido');
    }

    try {
      // Find user by email
      const user = await db.user.findByEmail(email.toLowerCase().trim());
      if (!user) {
        // Don't reveal that the user doesn't exist
        return;
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Store reset token in database
      await db.user.storeResetToken(user.id, resetToken, resetTokenExpiry);

      // In a real application, send an email with the reset link
      console.log(`Reset token for ${email}: ${resetToken}`);
      
      // For demo purposes, we'll just return the token
      return { resetToken };
    } catch (error) {
      console.error('Error in forgot password:', error);
      throw error;
    }
  },

  async resetPassword(token: string, password: string) {
    if (!token) {
      throw new Error('Token inválido');
    }
    if (!password || password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    try {
      // Find user by reset token
      const user = await db.user.findByResetToken(token);
      if (!user) {
        throw new Error('Token inválido o expirado');
      }

      // Check if token is expired
      const now = new Date();
      if (new Date(user.reset_token_expiry) < now) {
        throw new Error('Token expirado');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update password and clear reset token
      await db.user.updatePassword(user.id, hashedPassword);

      return { success: true };
    } catch (error) {
      console.error('Error in reset password:', error);
      throw error;
    }
  }
};
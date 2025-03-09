// This is a mock implementation for the browser environment
// In a real application, you would use an API to communicate with the server

// Mock data for users
const users = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    password: '$2a$12$yQJs6.bDBQw8rnYb/nbEzuEAdp7K5Pj8T2e9wDSCNTOZlH/TEyYIu', // password: password123
    phone: '1234567890',
    country_code: '1',
    account_type: 'dropshipper',
    role_id: 1,
    status: 'OFF',
    token: null
  },
  {
    id: 2,
    first_name: 'Alexander',
    last_name: 'Nieves',
    email: 'alexander@example.com',
    password: '$2a$12$nnCi7FSxG22Nv2Pna8hIzeuSfznb.SohAHDzGIUQzkVmCXWxikNua', // password: password123
    phone: '944918994',
    country_code: '57',
    account_type: 'dropshipper',
    role_id: 2,
    status: 'OFF',
    token: null
  }
];

// Mock data for roles
const roles = [
  { id: 1, name: 'ADMIN' },
  { id: 2, name: 'DROPSHIPPER' },
  { id: 3, name: 'PROVEEDOR / MARCA' }
];

// Mock data for products
const products = [
  {
    id: 1,
    name: 'Cadena Con Clave',
    description: 'Cadena de seguridad con clave numérica',
    provider_id: 3,
    provider_price: 7.70,
    suggested_price: 35.00,
    stock: 300,
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1541873676-a18131494184?w=300&q=80',
    is_active: 1,
    is_private: 0,
    provider_name: 'Terraza'
  },
  {
    id: 2,
    name: 'Audifono Bluetooth F9',
    description: 'Audífonos inalámbricos con tecnología Bluetooth',
    provider_id: 3,
    provider_price: 33.00,
    suggested_price: 50.00,
    stock: 15,
    category_id: 2,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
    is_active: 1,
    is_private: 0,
    provider_name: 'Terraza'
  }
];

// Mock data for orders
const orders = [
  {
    id: 'ORD-001',
    user_id: 2,
    status: 'COMPLETADO',
    total_amount: 85.00,
    shipping_address: 'Calle Principal 123',
    shipping_city: 'Lima',
    shipping_department: 'Lima',
    shipping_country: 'Peru',
    customer_name: 'Cliente Ejemplo',
    customer_email: 'cliente@example.com',
    customer_phone: '987654321',
    carrier_id: 1,
    tracking_number: 'TRK12345',
    notes: 'Entregar en horario de oficina',
    collect_on_delivery: 0
  }
];

// Mock data for order items
const orderItems = [
  {
    id: 1,
    order_id: 'ORD-001',
    product_id: 1,
    quantity: 1,
    price: 35.00,
    product_name: 'Cadena Con Clave',
    image_url: 'https://images.unsplash.com/photo-1541873676-a18131494184?w=300&q=80'
  },
  {
    id: 2,
    order_id: 'ORD-001',
    product_id: 2,
    quantity: 1,
    price: 50.00,
    product_name: 'Audifono Bluetooth F9',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80'
  }
];

// Helper function to simulate database queries
export async function query(sql: string, params?: any[]) {
  console.log('Query:', sql, params);
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Very basic SQL parsing for demonstration
  if (sql.includes('SELECT * FROM users WHERE email =')) {
    const email = params?.[0];
    return users.filter(user => user.email === email);
  }
  
  if (sql.includes('SELECT * FROM users WHERE id =')) {
    const id = params?.[0];
    return users.filter(user => user.id === id);
  }
  
  if (sql.includes('SELECT * FROM roles')) {
    return roles;
  }
  
  if (sql.includes('SELECT p.*, u.first_name as provider_name FROM products p')) {
    if (sql.includes('WHERE p.id =')) {
      const id = params?.[0];
      return products.filter(product => product.id === id);
    }
    return products;
  }
  
  if (sql.includes('SELECT * FROM products WHERE provider_id =')) {
    const providerId = params?.[0];
    return products.filter(product => product.provider_id === providerId);
  }
  
  if (sql.includes('SELECT * FROM orders WHERE user_id =')) {
    const userId = params?.[0];
    return orders.filter(order => order.user_id === userId);
  }
  
  if (sql.includes('SELECT * FROM orders WHERE id =')) {
    const id = params?.[0];
    return orders.filter(order => order.id === id);
  }
  
  if (sql.includes('SELECT oi.*, p.name as product_name, p.image_url FROM order_items oi')) {
    const orderId = params?.[0];
    return orderItems.filter(item => item.order_id === orderId);
  }
  
  // For INSERT, UPDATE, DELETE operations, return a mock result
  if (sql.startsWith('INSERT') || sql.startsWith('UPDATE') || sql.startsWith('DELETE')) {
    return { affectedRows: 1, insertId: Date.now() };
  }
  
  return [];
}

// User-related database functions
export const userDb = {
  async findByEmail(email: string) {
    const results = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    ) as any[];
    return results.length ? results[0] : null;
  },
  
  async findById(id: number) {
    const results = await query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    ) as any[];
    return results.length ? results[0] : null;
  },
  
  async create(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    country_code: string;
    account_type: 'dropshipper' | 'proveedor';
    role_id?: number;
  }) {
    const { first_name, last_name, email, password, phone, country_code, account_type, role_id = 2 } = userData;
    
    const result = await query(
      `INSERT INTO users 
       (first_name, last_name, email, password, phone, country_code, account_type, role_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, password, phone, country_code, account_type, role_id]
    ) as any;
    
    return result.insertId;
  },
  
  async updateLastLogin(id: number, token: string) {
    return query(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP, status = 'ON', token = ? WHERE id = ?`,
      [token, id]
    );
  },
  
  async logout(id: number) {
    return query(
      `UPDATE users SET status = 'OFF', token = NULL WHERE id = ?`,
      [id]
    );
  },

  async storeResetToken(id: number, token: string, expiry: Date) {
    return query(
      `UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?`,
      [token, expiry, id]
    );
  },

  async findByResetToken(token: string) {
    const users = await query(
      'SELECT * FROM users WHERE reset_token = ?',
      [token]
    ) as any[];
    return users.length ? users[0] : null;
  },

  async updatePassword(id: number, password: string) {
    return query(
      `UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?`,
      [password, id]
    );
  }
};

// Role-related database functions
export const roleDb = {
  async getAll() {
    return query('SELECT * FROM roles');
  },
  
  async findById(id: number) {
    const roles = await query(
      'SELECT * FROM roles WHERE id = ?',
      [id]
    ) as any[];
    return roles.length ? roles[0] : null;
  }
};

// Product-related database functions
export const productDb = {
  async getAll(limit = 100, offset = 0) {
    return query(
      `SELECT p.*, u.first_name as provider_name 
       FROM products p
       JOIN users u ON p.provider_id = u.id
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  },
  
  async findById(id: number) {
    const products = await query(
      `SELECT p.*, u.first_name as provider_name 
       FROM products p
       JOIN users u ON p.provider_id = u.id
       WHERE p.id = ?`,
      [id]
    ) as any[];
    return products.length ? products[0] : null;
  },
  
  async getByProvider(providerId: number, limit = 100, offset = 0) {
    return query(
      `SELECT * FROM products WHERE provider_id = ? LIMIT ? OFFSET ?`,
      [providerId, limit, offset]
    );
  },
  
  async search(term: string, limit = 100, offset = 0) {
    const searchTerm = `%${term}%`;
    return query(
      `SELECT p.*, u.first_name as provider_name 
       FROM products p
       JOIN users u ON p.provider_id = u.id
       WHERE p.name LIKE ? OR p.description LIKE ?
       LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, limit, offset]
    );
  }
};

// Order-related database functions
export const orderDb = {
  async getAll(userId: number, limit = 100, offset = 0) {
    return query(
      `SELECT * FROM orders WHERE user_id = ? LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
  },
  
  async findById(id: string) {
    const orders = await query(
      `SELECT * FROM orders WHERE id = ?`,
      [id]
    ) as any[];
    return orders.length ? orders[0] : null;
  },
  
  async getOrderItems(orderId: string) {
    return query(
      `SELECT oi.*, p.name as product_name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
  }
};

export default {
  query,
  user: userDb,
  role: roleDb,
  product: productDb,
  order: orderDb
};
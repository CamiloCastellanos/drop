# Dropi - E-commerce Platform

## Overview
Dropi is a comprehensive e-commerce platform designed for dropshipping and supplier management. The application provides a robust dashboard for managing products, orders, warranties, clients, and more.

## Database Setup with XAMPP

### MySQL Configuration
The application uses MySQL as its database through XAMPP. You can find the complete database schema in `src/db/schema.sql`.

To set up the database:

1. Start XAMPP and ensure MySQL service is running
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Create a new database named `dropi`
4. Import the schema using the Import tab in phpMyAdmin:
   - Select the file `src/db/schema.sql`
   - Click "Go" to import the schema

### Database Structure
The main tables in the database are:

- `roles`: Defines user roles (ADMIN, DROPSHIPPER, PROVIDER)
- `users`: Stores user information and authentication details
- `products`: Product catalog information
- `orders`: Customer orders
- `warranties`: Product warranty management
- And many more tables for comprehensive e-commerce functionality

## Environment Variables
Configure the application by setting the following environment variables in the `.env` file:

```
# MySQL Configuration (XAMPP default settings)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=dropi

# JWT Configuration
JWT_SECRET=your-secret-key-should-be-long-and-secure
```

## Development

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## Features
- User authentication and role-based access control
- Product catalog management
- Order processing and tracking
- Warranty management
- Client management
- Financial reporting and wallet functionality
- Multi-language support
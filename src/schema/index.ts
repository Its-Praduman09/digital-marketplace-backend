// 1. Load the Independent table first
export * from './users.js';

// 2. Load the table that depends on Users
export * from './products.js';

// 3. Load the table that depends on both Users and Products
export * from './orders.js';


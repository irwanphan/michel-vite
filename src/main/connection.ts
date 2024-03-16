import mysql, { createPool, Pool } from 'mysql2/promise'
require('dotenv').config()

const databaseConfig = {
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DB_DATABASE
}
  
export const pool: Pool = createPool({
    host: databaseConfig.HOST,
    port: parseInt(databaseConfig.PORT || '3307'),
    user: databaseConfig.USER,
    password: databaseConfig.PASSWORD,
    database: databaseConfig.DATABASE
})
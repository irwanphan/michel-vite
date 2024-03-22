// import { createPool, Pool } from 'mysql2/promise'
// import ElectronStore from 'electron-store'
// require('dotenv').config()

export type ConfigType = {
    dbHost: string,
    dbPort: string,
    dbUsername: string,
    dbPassword: string,
    dbName: string,
}
// const store = new ElectronStore()
// const config = store.get('config') as ConfigType

// const databaseConfig = {
//     // HOST: process.env.DB_HOST,
//     // PORT: process.env.DB_PORT,
//     // USER: process.env.DB_USER,
//     // PASSWORD: process.env.DB_PASSWORD,
//     // DATABASE: process.env.DB_DATABASE
//     HOST: config.dbHost,
//     PORT: config.dbPort,
//     USER: config.dbUsername,
//     PASSWORD: config.dbPassword,
//     DATABASE: config.dbName
// }
  
// export const pool:Pool = createPool({
//     host: databaseConfig.HOST,
//     port: parseInt(databaseConfig.PORT || '3307'),
//     user: databaseConfig.USER,
//     password: databaseConfig.PASSWORD,
//     database: databaseConfig.DATABASE
// })
import { Sequelize } from 'sequelize-typescript';
import 'dotenv/config'

console.log(
    process.env.DATABASE_HOST,
    process.env.DATABASE,
    process.env.DATABASE_PASS,
    parseInt(process.env.DATABASE_PORT!),
    process.env.DATABASE_USERNAME,
)
const sequelize = new Sequelize({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASS,
    port: parseInt(process.env.DATABASE_PORT!),
    username: process.env.DATABASE_USERNAME,
    dialect: 'mysql', // or 'mysql' for MySQL
    //Specify the path to your models
    // Add each model to the sequelize instance
    models: [__dirname + '/src' + '/models'],
});

export default sequelize;
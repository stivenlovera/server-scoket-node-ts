import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
    host: '194.5.152.146',
    database: 'db_erp',
    password: 'test',
    port: 3306,
    username: 'test',
    dialect: 'mysql', // or 'mysql' for MySQL
    //Specify the path to your models
    // Add each model to the sequelize instance
    models: [__dirname + '/src' + '/models'],
});

export default sequelize;
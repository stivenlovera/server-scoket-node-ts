import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
    host: '159.203.172.137',
    database: 'db_erp',
    password: 'molomix654',
    port: 3306,
    username: 'stivenlovera',
    dialect: 'mysql', // or 'mysql' for MySQL
    //Specify the path to your models
    // Add each model to the sequelize instance
    models: [__dirname + '/src' + '/models'],
});

export default sequelize;
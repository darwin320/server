import { Sequelize } from "sequelize";

const sequelize = new Sequelize('claralia','root','',{
    host: 'localhost',
    dialect: 'mysql',
});


export default sequelize;
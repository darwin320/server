
import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const Api = sequelize.define('Api', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });
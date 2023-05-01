
import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';
export const Action = sequelize.define('Action', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    method: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE(3),
      allowNull: false
    },
    userEmail: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });
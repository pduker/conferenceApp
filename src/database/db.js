import { Sequelize, DataTypes } from 'sequelize'

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './main.db'
})

db.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

// Create tables if they are missing
db.sync()

export default db
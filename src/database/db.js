const { Sequelize, DataTypes } = require('sequelize')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './main.db'
})

const Security = db.define('Security', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

const User = db.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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

module.exports = {
  db,
  User,
  Security
}
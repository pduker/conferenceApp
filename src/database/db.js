const { Sequelize, DataTypes } = require('sequelize')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './main.db'
})

// Define our Security table schema here
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

// Define our Users table schema here
const Users = db.define('Users', {
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

// Sync the database with our schema and create it if they are missing
db.sync()

module.exports = {
  db,
  Users,
  Security
}
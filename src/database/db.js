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

const Papers = db.define('Papers', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  abstract: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

const SuppMaterials = db.define('SuppMaterials', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

const Authors = db.define('Authors', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

Papers.hasMany(SuppMaterials)
SuppMaterials.belongsTo(Papers)

Papers.hasMany(Authors)
Authors.belongsTo(Papers)

const Sessions = db.define('Sessions', {
  sessionsObj: {
    type: DataTypes.JSON,
    allowNull: false
  }
})

// Sync the database with our schema and create it if they are missing
db.sync()

module.exports = {
  db,
  Users,
  Security,
  Papers,
  Sessions,
  SuppMaterials,
  Authors
}
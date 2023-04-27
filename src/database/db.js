const { Sequelize, DataTypes } = require('sequelize')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './main.db',
  logging: false
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
  },
  sessionOrder: {
    type: DataTypes.NUMBER,
    allowNull: true
  },
  titleNameString: {
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

const Days = db.define('Days', {
  weekday: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

const Sessions = db.define('Sessions', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start: {
    type: DataTypes.STRING,
    allowNull: false
  },
  end: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  chair: {
    type: DataTypes.STRING,
    allowNull: false
  },
  room: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

Sessions.hasMany(Papers)
Papers.belongsTo(Sessions)

Days.hasMany(Sessions)
Sessions.belongsTo(Days)

// Sync the database with our schema and create it if they are missing
db.sync()

module.exports = {
  db,
  Users,
  Security,
  SuppMaterials,
  Authors,
  Papers,
  Sessions,
  Days
}
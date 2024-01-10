const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Watchlist extends Model {}

Watchlist.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'movies', key: 'id' }
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'watchlist'
})

module.exports = Watchlist
const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Movie extends Model {}

Movie.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'movie'
})

module.exports = Movie
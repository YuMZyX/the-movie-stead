const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('users', 'role', {
      type: DataTypes.ENUM('user', 'moderator', 'admin'),
      allowNull: false
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('users', 'role', {
      type: DataTypes.ENUM('user', 'moderator'),
      allowNull: false
    })
  }
}
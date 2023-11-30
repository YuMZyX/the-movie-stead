const User = require('./user')
const Movie = require('./movie')
const Review = require('./review')

User.hasMany(Movie)
Movie.belongsTo(User)

User.belongsToMany(Movie, { through: Review, as: 'reviews' })
Movie.belongsToMany(User, { through: Review, as: 'usersMarked' })

module.exports = {
  User, Movie, Review
}
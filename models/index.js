const User = require('./user')
const Movie = require('./movie')
const Review = require('./review')
const Session = require('./session')

User.hasMany(Movie)
Movie.belongsTo(User)

User.belongsToMany(Movie, { through: Review, as: 'user_reviews' })
Movie.belongsToMany(User, { through: Review, as: 'reviewers' })

User.hasMany(Session)
Session.belongsTo(User)

module.exports = {
  User, Movie, Review, Session
}
const { User, Session, Watchlist, Movie, Review } = require('../models')

const usersInDb = async () => {
  const users = await User.findAll()
  return users.map(u => u.toJSON())
}

const sessionsInDb = async () => {
  const sessions = await Session.findAll()
  return sessions.map(s => s.toJSON())
}

const watchlistsInDb = async () => {
  const watchlists = await Watchlist.findAll()
  return watchlists.map(w => w.toJSON())
}

const moviesInDb = async () => {
  const movies = await Movie.findAll()
  return movies.map(m => m.toJSON())
}

const reviewsInDb = async () => {
  const reviews = await Review.findAll()
  return reviews.map(r => r.toJSON())
}

const emptyDbRows = async () => {
  await Session.destroy({ where: {} })
  await Watchlist.destroy({ where: {} })
  await Review.destroy({ where: {} })
  await User.destroy({ where: {} })
  await Movie.destroy({ where: {} })
}

module.exports = {
  usersInDb,
  sessionsInDb,
  watchlistsInDb,
  moviesInDb,
  reviewsInDb,
  emptyDbRows
}
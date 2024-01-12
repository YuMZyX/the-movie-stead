const { User, Session, Watchlist } = require('../models')

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

module.exports = {
  usersInDb,
  sessionsInDb,
  watchlistsInDb
}
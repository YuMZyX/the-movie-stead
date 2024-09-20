const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Review, Watchlist } = require('../models')
const { moderatorExtractor, userExtractor,
  adminExtractor } = require('../utils/middleware')
const { Op } = require('sequelize')

router.get('/', moderatorExtractor, async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    where: {
      role: 'user'
    }
  })
  if (req.user.role === 'moderator' || req.user.role === 'admin') {
    res.json(users)
  }
})

router.get('/admin', adminExtractor, async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    where: {
      role: {
        [Op.or]: ['user', 'moderator']
      }
    }
  })
  if (req.user.role === 'admin') {
    res.json(users)
  }
})

router.get('/:id', userExtractor, async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] }
  })

  if (user &&
    (req.user.id === user.id
      || req.user.role === 'moderator'
      || req.user.role === 'admin'
    )) {
    res.json(user)
  } else {
    return res.status(401).send('Access denied')
  }
})

router.post('/', async (req, res) => {
  const { name, email, password, role, disabled } = req.body

  if (!name || !email || !password) {
    return res.status(400).send('Name, email or password is missing')
  }

  const emailExists = await User.findOne({
    where: {
      email: email
    }
  })
  if (emailExists) {
    return res.status(400).send('Email address already exists, try logging in.')
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({
    name,
    email,
    role,
    password: passwordHash,
    disabled: disabled || false
  })
  res.json(user)
})

router.put('/:id', moderatorExtractor, async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user && (req.user.role === 'moderator' || req.user.role === 'admin')) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    return res.status(404).end()
  }
})

router.put('/:id/admin', adminExtractor, async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user && req.user.role === 'admin') {
    user.disabled = req.body.disabled
    user.role = req.body.role
    await user.save()
    res.json(user)
  } else {
    return res.status(404).end()
  }
})

router.delete('/:id', adminExtractor, async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user && req.user.role === 'admin') {
    await Watchlist.destroy({
      where: {
        userId: user.id
      }
    })
    await Review.destroy({
      where: {
        userId: user.id
      }
    })
    await user.destroy()
    res.status(204).end()
  } else {
    return res.status(404).end()
  }
})

module.exports = router
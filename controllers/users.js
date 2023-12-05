const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User } = require('../models')
const { moderatorExtractor, userExtractor } = require('../utils/middleware')

router.get('/', moderatorExtractor, async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    where: {
      role: 'user'
    }
  })
  res.json(users)
})

router.get('/:id', userExtractor, async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] }
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res) => {
  const { name, email, password, role } = req.body

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
    password: passwordHash
  })
  res.json(user)
})

router.put('/:id', moderatorExtractor, async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    return res.status(404).send('User not found')
  }
})

router.delete('/:id', moderatorExtractor, async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    await user.destroy()
    res.status(204).end()
  } else {
    return res.status(404).send('User not found')
  }
})

module.exports = router
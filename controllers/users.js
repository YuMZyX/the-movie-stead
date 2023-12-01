const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
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

  const emailExists = User.findOne({
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

module.exports = router
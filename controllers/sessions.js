const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const config = require('../utils/config')
const { User } = require('../models')
const { Session } = require('../models')
const { userExtractor } = require('../utils/middleware')

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({
    where:{
      email: email
    }
  })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)

  if(!(user && passwordCorrect)) {
    return res.status(401).send('Invalid username or password')
  }
  if(user.disabled) {
    return res.status(401).send('Account disabled, contact admin/moderator')
  }

  const userForToken = {
    id: user.id,
    email: user.email
  }

  const token = jwt.sign(userForToken, config.JWT_SECRET)
  await Session.create({ token, userId: user.id })

  res.status(200).send({ token, name: user.name, email: user.email, role: user.role, id: user.id })
})

router.delete('/logout', userExtractor, async (req, res) => {
  await Session.destroy({
    where: {
      userId: req.user.id
    }
  })
  res.status(200).send(`${req.user.name} logged out`)
})

module.exports = router
const router = require('express').Router()
const helper = require('../utils/test_helper')

router.post('/reset', async (req, res) => {
  await helper.emptyDbRows()
  res.status(204).end()
})

module.exports = router
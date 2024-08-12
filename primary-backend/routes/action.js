const { Router } = require("express");
const {client} = require('../../db')
const jwt = require('jsonwebtoken')

const router = Router()

router.get('/available', async (req,res) => {
    const actions = await client.availableAction.findMany({})
    res.json({
        availableActions: actions
    })
})

module.exports = {
    actionRouter : router
}
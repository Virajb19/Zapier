const { Router } = require("express");
const {client} = require('../../db')
const jwt = require('jsonwebtoken')

const router = Router()

router.get('/available',async (req,res) => {
     const triggers = await client.availableTrigger.findMany({})
     res.json({
        availableTriggers: triggers
     })
})

module.exports = {
    triggerRouter: router
}
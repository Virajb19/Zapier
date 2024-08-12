const { Router } = require("express");
const { ZapCreateSchema } = require("../src/types/types");
const { client } = require("../../db");
const authMiddleware = require("../src/middleware");


const zapRouter = Router()

zapRouter.post('/',authMiddleware,async (req,res) => {
    const id = req.id
    const parsedData = ZapCreateSchema.safeParse(req.body)

    // console.log(parsedData.data.actions); 

    // console.log(parsedData)

    if(!parsedData.success) return res.status(403).json({msg: "incorrect inputs"})

   const zapId =  await client.$transaction(async tx => {
     const zap = await tx.zap.create({
            data : {
                userId: id,
                triggerId: "",
                actions: {
                    create: parsedData.data.actions.map((x,index) => {
                       return {
                        actionId: x.actionId,
                        sortingOrder: index,
                        metadata: x.actionMetaData
                       }
                    })
                }
            }
        })

      const trigger = await tx.trigger.create({
            data : {
                triggerId: parsedData.data.triggerId,
                zapId: zap.id
            }
        })

        await tx.zap.update({
            where: {id: zap.id },
            data : {triggerId: trigger.id}
        })
        return zap.id
    })

    res.json({zapId})
})

zapRouter.get('/',async (req,res) => {
   const id = req.id
const zaps = await client.zap.findMany({
    where: {
        userId: id
    },
    include: {
        actions: {
              include: {type: true}
        },
        trigger: {include: {type: true}}
    }
})
console.log(zaps)
res.json({zaps})
   
})

zapRouter.get("/:zapId",authMiddleware,async (req,res) => {
    const userId = req.id
    const id = req.params.zapId
    const zap = await client.zap.findFirst({
        where: {id, userId},
        include: {actions: {include: {type: true}}, triggerId: {include: {type: true}}}
    })
    // console.log(zap)
    res.send(zap)
})

module.exports = zapRouter
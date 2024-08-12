const express = require('express')
const {client} = require('../../db')
const app = express();
app.use(express.json())


app.post('/hooks/catch/:userId/:zapId',async (req,res) => {
    const {userId, zapId} = req.params // add type = module in package.json file and log statements for debugging
    const body = req.body

    // console.log(body);
    
   try{
   await client.$transaction(async tx => {
       const run =  await tx.zapRun.create({
            data: {
                zapId,
                metadata: body
            }
        })

        await tx.zapRunOutbox.create({
            data: {zapRunId: run.id}
        })
    })

    res.json({msg: "webhook received"})
   } catch(e){
    console.error(e)
    res.status(500).json({error: "Internal server error"})
   }

})

app.listen(3001, () => {
    console.log("Server is running");
});

const express = require('express');
const userRouter = require('../routes/userrouter');
const zapRouter = require('../routes/zaprouter');
const app = express();
const cors = require('cors');
const { triggerRouter } = require('../routes/trigger');
const { actionRouter } = require('../routes/action');

app.use(cors())
app.use(express.json())

app.use('/api/v1/user',userRouter)
app.use('/api/v1/zap',zapRouter)
app.use('/api/v1/trigger',triggerRouter)
app.use('/api/v1/action',actionRouter)

app.listen(3000, () => {
    console.log("Server is running");
});

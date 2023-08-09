import express from 'express'

const app = express()
const router = express.Router()
app.all('*', (_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
    res.header('Access-Control-Allow-Methods', '*')
    next()
})
router.get('', async (req, res) =>{
    res.write("Hello World")
    res.end()
})
router.post('/log', async (req, res) =>{
    console.log(req.body)
    res.write(JSON.stringify(req.body))
    res.end()
})


app.use('', router)
app.listen(8909, () => globalThis.console.log('Server is running on port 8909'))

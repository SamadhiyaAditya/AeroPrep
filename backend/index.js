const express = require('express')
const app = express()

app.use(express.json())
app.post('/login',(req,res)=>{
    const {email,password} = req.body
    try {
        const 
    } catch (error) {
        console.log(error)
    }
})
app.listen(3000,()=>{
    console.log("server Running")
})
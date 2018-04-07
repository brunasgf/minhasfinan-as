const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(__dirname))

app.listen(8003, ()=>{
    console.log("Listen on http://localhost:8003")
})
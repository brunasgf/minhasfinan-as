const express = require('express')
const path = require('path')

const app = express()

app.use(express.static("templates"))
app.use('/financasModule', express.static(path.join(__dirname, "node_modules")))

app.listen(8003, ()=>{
    console.log("Listen on http://localhost:8003")
})
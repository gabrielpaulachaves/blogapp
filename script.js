//npm install --save express
//npm install --save express-handlebars
//npm install body-parser --save
//npm install --save mongoose

const express = require("express")
const {engine} = require("express-handlebars")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const admin = require("./routes/admin")
const path = require("path")
//configurações
app.engine("handlebars", engine({defaultLayout:"main"}))
app.set("view engine" ,"handlebars")

app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json()) 

//public
app.use(express.static(path.join(__dirname, "public")))  

//rotas
app.use("/admin", admin)

//porta
const port = 3333
app.listen(port, ()=>{
    console.log("Servidor ligado!")
})
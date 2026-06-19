//npm install --save express
//npm install --save express-handlebars
//npm install body-parser --save
//npm install --save mongoose

const express = require("express")
const {engine} = require("express-handlebars")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const app = express()

//configurações
app.engine("hbs", engine({defaultLayout:"main"}))
app.set("view engine" ,"hbs")

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())

//rotas


//porta
const port = 3333
app.listen(port, ()=>{
    console.log("Servidor ligado!")
})
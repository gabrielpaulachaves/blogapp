const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Cat")

const categoria = mongoose.model("categorias")

router.get("/ini", (req, res)=>{
    res.render("adm/index")

})

router.get("/posts", (req, res)=>{
    res.send("pagina de posts")
})



router.get("/cat", (req, res)=>{
    res.render("adm/cat")
})

router.get("/cat/add", (req, res)=>{
    res.render("adm/addcat")
})

router.post("/cat/nova", (req, res)=>{
    const novacategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new categoria(novacategoria).save().then(()=>{console.log("cadastrado")}).catch((err)=>{console.log(err)})
})

module.exports = router
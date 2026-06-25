const { text } = require("body-parser")
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
    
    //criando validaçao manual
    let erros = [ ]
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({ texto: "nome indefinido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "slug indefinido"})
    }
    if(req.body.nome.length <= 5){
       erros.push({texto: "nome muito curto"}) 
    }
    if(erros.length > 0){   //conseguimos passar dados para uma view atraves do render
        res.render("/adm/addcat", {erros: erros})
    }else{

          const novacategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }
        //aqui eu to criando um documento novo para a collection (a collection é como a tabela, e o documento é a linha)
    new categoria(novacategoria).save().then(()=>{
        req.flash("success_msg", "categoria criada com sucesso!") //caso success_msg seja verdadeiro, a mensagem "categoria criada com sucesso!" vai ser o valor da variavel "success_msg"
        res.redirect("/admin/cat")}).catch((err)=>{
            req.flash("error_msg", "erro ao criar categoria :(")
            res.redirect("/admin")})  
        
    }
    



})

module.exports = router
const { text } = require("body-parser")
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Cat")
require("../models/Pos")

const categoria = mongoose.model("categorias")
const postagens = mongoose.model("postagens")

router.get("/ini", (req, res)=>{
    res.render("adm/index")

})

router.get("/post", (req, res)=>{
    res.render("adm/pos")
})

router.get("/post/add", (req, res)=>{
                                //resultado da consulta do find está guardado nesse parametro
    categoria.find().lean().then(categorias =>{
        res.render("adm/addpos", {cat: categorias})
                                    //forma como o parametro será chamado na view
    })  
})


router.get("/cat", (req, res)=>{
            //o .lean() permite que os dados venham em formato objeto em javascript, facilitando a leitura
            //o .sort vai ordenar baseado na linha date da collection
     categoria.find().sort({date: "desc"}).lean().then((categorias) =>{ //o "categorias" dentro do then é o nome do resultado dado após o find(), esse find() retorna uma promise, por isso utilizeei o then, e ali eu nomeei o resultado da busca do find
        res.render("adm/cat", {categorias: categorias})
     }).catch((err)=>{req.flash("error_msg", "Erro ao listar categorias")
        res.redirect("/admin")
     })
    //o find serve para listar todos os documentos que existem
    
})

router.get("/cat/add", (req, res)=>{
    res.render("adm/addcat")
})

router.get("/cat/edit/:id", (req, res)=>{
                 //vai buscar pelo _id que seja igual ao id passado no parametro
    categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render("adm/editcat", {categoria: categoria})
    }).catch((err)=>{
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/cat")
    })
    
})

router.get("/cat/delete/:id", (req, res)=>{
    categoria.findByIdAndDelete(req.params.id).then((categoria)=>{
        req.flash("success_msg", "categoria deletada com sucesso!")
        res.redirect("/admin/cat")
    }).catch((err)=>{
        req.flash("error_msg", "Algum erro ocorreu ao deletar essa categoria")
        res.redirect("/admin/cat")
    })
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
        res.render("adm/addcat", {erros: erros})
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

router.post("/pos/nova", (req, res)=>{

    
})


router.post("/cat/edit", (req, res)=>{
    categoria.findOneAndUpdate({_id:req.body.id}, {nome: req.body.nome, slug: req.body.slug}).then((categoria)=>{
            
                req.flash("success_msg", "Categoria editada com sucesso")
                res.redirect("/admin/cat")
    

    }).catch(err =>{
        req.flash("error_msg", "Erro ao editar categoria")
        res.redirect("/admin/cat")
    })
})
   

module.exports = router
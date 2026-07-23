//essa é a "estrategia" que usaremos para fazer o login (estrategia é um meio para fazer login, pode ser, por exemplo, usando o google)
const local = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

require("../models/user")
const user = mongoose.model("usuario")

module.exports = function(passport){
        //aqui estou dizendo qual será o campo que será analisado (no meu caso, o login do usuario é baseado no email, ou seja, cada usuario possui um email diferente e é ele que permitirá login). Já o done é a resposta para aquela busca
       //aqui nessa linha .use(new local) estou dizendo qual estrategia usaremos para autenticacao 
                                            //names da view                                 //esse done é criado pelo proprio passport, o done é uma funcao para quando terminar a verificacao, ele só "fala" pro passport que terminou
    passport.use(new local({usernameField: "email", passwordField: "senha"}, (email, senha, done)=>{

        user.findOne({email: email}).then(usuario =>{
            //para entender essa linha é o seguinte: se o usuario nao existe, entao vai retornar uma callback com null(no caso, seria os dados que nao existem), o false(para representar se a conta foi autenticada, mas nesse caso nao foi), e no final uma mensagem 
            //ou seja, baiscamente nessas primeiras linhas ele vai buscar no banco de dados e ver se o email passado no login existe, aqui já passamos o codigo de resposta caso nao exista. 
            if(!usuario){
            //null = erro interno? não  //false = usuario? nao existe //{message: "Conta não encontrada"} = toma essa informacao extra ai
                return done(null, false, {message: "Conta não encontrada"})
            }
            //agora, se a conta existe(email), iremos verificar se a senha passada é a mesma do banco de dados
                                                    //primeiro parametro para erro, segundo para acerto
            bcrypt.compare(senha, usuario.senha, (erro, iguais)=>{
                //se as senhas sao iguais
                if(iguais){
                    //null = erro interno? não  //usuario = usuario? aqui
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "senha incorreta"})
                }
            })
        })
    }))


//nesta parte aqui, será o fluxo para manter o usuario logado onde quer que ele vá. Primeiro iremos guardar o id do usuario que fizer o login, o id dele irá para cookies, agora no deserializerUser, com base no id passado no serializer, as outras rotas irão saber quem está logado

    //isso guarda os dados do usuario em uma sessao
    passport.serializeUser((user, done)=>{
        done(null, user.id)
    })
    //aqui faz com que cada rota saiba quem está logado na sessao. O navegador guarda o id que recebeu do serializer e manda pra cá
    passport.deserializeUser((id, done)=>{
        user.findById(id).then(idusuario=>{
            done(null, idusuario)
        }).catch(err=>{
            done(null, false, {message: "erro"})
        })
    })
}
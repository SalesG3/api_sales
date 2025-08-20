require('dotenv').config()

// Autenticação do Token
const auth = function(req, res, next){

    if(req.url.includes('/uploads')){
        next()
        return
    }
    
    if(!req.headers.token || req.headers.token != process.env.TOKEN){
        res.status(401).send({
            auth: "Não Autorizado!"
        })
        return
    }

    if(req.headers.token == process.env.TOKEN && req.method == "POST"){
        console.log("Postagem realizada na rota: " + req.url)
        next()
        return
    }
    else if(req.headers.token == process.env.TOKEN && req.method == "GET"){
        console.log("Consulta realizada na rota: " + req.url)
        next()
        return
    }
    else if(req.headers.token == process.env.TOKEN && req.method == "PUT"){
        console.log("Alteração realizada na rota: " + req.url)
        next()
        return
    }
    else if(req.headers.token == process.env.TOKEN && req.method == "DELETE"){
        console.log("Exclusão realizada na rota: " + req.url)
        next()
        return
    }
}

// Criação do servidor Express
const express = require('express')
const cors = require('cors')
const http = require('http')

const app = express()

app.use(cors({origin: "*"}))
app.use(express.json())
app.use(auth)
app.use("/uploads", express.static("uploads"))

const server = http.createServer(app)

server.listen(process.env.PORT, (err) => {
    if(err) throw err
    console.log("Servidor Express Live!! Porta: ", process.env.PORT)
})

// Conexão com banco de dados Mysql
const mysql = require('mysql2')

const pool = mysql.createPool(process.env.DBURL)

pool.getConnection((err, con) => {
    if(err) throw err
    console.log("Banco de dados conectado!!")
    con.release()
})

// Exporta os módulos

module.exports = {
    app: app,
    pool: pool
}
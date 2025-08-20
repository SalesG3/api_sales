const { app, pool } = require('../server')

app.get('/produtos/:id_entidade/codigo', async(req, res) => {

    let [data] = await pool.promise().execute(
        `SELECT COALESCE(MAX(CD_PRODUTO), 0) +1 AS CD_PRODUTO FROM PRODUTOS WHERE ID_ENTIDADE = ?`,
        [req.params.id_entidade]
    )

    res.status(200).send(data)
})

app.post('/produtos/:id_entidade/insert', async(req, res) => {

    let {
        CD_PRODUTO      ,
        NM_PRODUTO      ,
        DS_PRODUTO      ,
        ID_CATEGORIA    ,
        VL_CUSTO        ,
        VL_PRODUTO      ,
        SN_ATIVO        
    } = req.body

    try{

        let [data] = await pool.promise().execute(
            `CALL INSERT_PRODUTO(?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.params.id_entidade, CD_PRODUTO, NM_PRODUTO,
                DS_PRODUTO, ID_CATEGORIA, VL_CUSTO, VL_PRODUTO, SN_ATIVO
            ]
        )

        res.status(200).send({
            sucesso: true,
            mensagem: "Registro salvo com sucesso!",
            ID_PRODUTO: data[0][0].ID_PRODUTO
        })
    }
    catch(err){
        if(err.code == "ER_DUP_ENTRY"){
            let match = (err.sqlMessage).match(/PRODUTOS\.(\w+)/)

            res.status(200).send({
                sucesso: false,
                mensagem: `Chave Duplicada! (${match[1]})`
            })
            return
        }

        console.log(err)

        res.status(500).send({
            sucesso: false,
            mensagem: "Falha! Erro desconhecido."
        })
    }
})

app.get('/produtos/:id_entidade/grid', async(req, res) => {

    let [data] = await pool.promise().execute(
        `SELECT * FROM GRID_PRODUTO WHERE ID_ENTIDADE = ? ORDER BY CD_PRODUTO`,
        [req.params.id_entidade]
    )

    res.status(200).send(data)
})

app.get('/produtos/:id_produto/consulta', async(req, res) => {

    let [data] = await pool.promise().execute(
        `SELECT * FROM CONSULTA_PRODUTO WHERE ID_PRODUTO = ?`,
        [req.params.id_produto]
    )

    res.status(200).send(data)
})

app.put('/produtos/:id_produto/altera', async(req, res) => {

    let {
        IMG_PRODUTO     ,
        CD_PRODUTO      ,
        NM_PRODUTO      ,
        DS_PRODUTO      ,
        ID_CATEGORIA    ,
        VL_CUSTO        ,
        VL_PRODUTO      ,
        SN_ATIVO        
    } = req.body

    try{
        
        let [data] = await pool.promise().execute(
            `CALL UPDATE_PRODUTO ( ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.params.id_produto, CD_PRODUTO, NM_PRODUTO, DS_PRODUTO,
                ID_CATEGORIA, VL_CUSTO, VL_PRODUTO, SN_ATIVO
            ]
        )

        res.status(200).send({
            sucesso: true,
            mensagem: "Registro atualizado com sucesso!",
            ID_PRODUTO: data[0].ID_PRODUTO
        })
    }
    catch(err){
        if(err.code == "ER_DUP_ENTRY"){
            let match = (err.sqlMessage).match(/PRODUTOS\.(\w+)/)

            res.status(200).send({
                sucesso: false,
                mensagem: `Chave Duplicada! (${match[1]})`
            })
            return
        }

        console.log(err)

        res.status(500).send({
            sucesso: false,
            mensagem: "Falha! Erro desconhecido."
        })
    }
})

const multer = require('multer')
const upload = multer({ dest: 'uploads/'})
const fs = require('fs')

app.post('/produtos/:id_produto/imagem', upload.single('file'), async(req, res) => {
    
    let img_name = req.file.destination + req.params.id_produto + ".jpg"

    fs.renameSync(req.file.path, img_name)

    let img_url = `http://localhost:8083/uploads/${req.params.id_produto}.jpg`

    let [data] = await pool.promise().execute(
        `UPDATE PRODUTOS SET IMG_PRODUTO = ? WHERE ID_PRODUTO = ?`,
        [img_url, req.params.id_produto]
    )

    res.status(200).send({
        sucesso: true
    })
})
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
            `CALL INSERT_PRODUTO(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.params.id_entidade, IMG_PRODUTO, CD_PRODUTO, NM_PRODUTO,
                DS_PRODUTO, ID_CATEGORIA, VL_CUSTO, VL_PRODUTO, SN_ATIVO
            ]
        )

        res.status(200).send({
            sucesso: true,
            mensagem: "Registro salvo com sucesso!"
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
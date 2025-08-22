const { app, pool } = require('../server')

app.get('/entidades/:id_entidade/consulta', async(req, res) => {
    if(!req.params.id_entidade){
        res.status(200).send({
            sucesso: false,
            mensagem: "Não logado!"
        })
        return
    }

    let [data] = await pool.promise().execute(
        `SELECT * FROM ENTIDADES WHERE ID_ENTIDADE = ?`,
        [req.params.id_entidade]
    )

    delete data[0].USER_SENHA

    res.status(200).send(data)
})

app.put('/entidades/:id_entidade/altera', async(req, res) => {

    let {
        NM_ENTIDADE     ,
        DS_ENTIDADE     ,
        TEL_ENTIDADE    ,
        CEL_ENTIDADE    ,
        EMA_ENTIDADE    ,
        END_ENTIDADE    
    } = req.body

    try{
        let [data] = await pool.promise().execute(
            `CALL UPDATE_ENTIDADE ( ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.params.id_entidade, NM_ENTIDADE, DS_ENTIDADE,
                TEL_ENTIDADE, CEL_ENTIDADE, EMA_ENTIDADE, END_ENTIDADE
            ]
        )

        res.status(200).send({
            sucesso: true,
            mensagem: "Registro alterado com sucesso! Atualize a página."
        })
    }
    catch(err){
        console.log(err)
        res.status(500).send({
            sucesso: false,
            mensagem: "Falha! Erro desconhecido."
        })
    }
})
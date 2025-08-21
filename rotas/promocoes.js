const { app, pool } = require('../server')

app.get('/promocoes/:id_entidade/codigo', async(req, res) => {

    let [data] = await pool.promise().execute(
        `SELECT COALESCE(MAX(CD_PROMOCAO), 0) +1 AS CD_PROMOCAO FROM PROMOCOES WHERE ID_ENTIDADE = ?`,
        [req.params.id_entidade]
    )

    res.status(200).send(data)
})

app.post('/promocoes/:id_entidade/insert', async(req, res) => {

    let {
        CD_PROMOCAO ,
        DT_INICIO   ,
        DT_FINAL    ,
        NM_PROMOCAO ,
        DS_PROMOCAO ,
        ITENS       ,
    } = req.body

    let con = await pool.promise().getConnection()

    try{
        await con.beginTransaction()

        let [data] = await con.execute(
            `CALL INSERT_PROMOCAO( ?, ?, ?, ?, ?, ?)`,
            [
                req.params.id_entidade, CD_PROMOCAO, DT_INICIO,
                DT_FINAL, NM_PROMOCAO, DS_PROMOCAO
            ]
        )

        let query = 'INSERT INTO ITENS_PROMOCAO (ID_PROMOCAO, ID_PRODUTO, VL_PRODUTO)' // Continuar aqui
        for(let i = 0; i < ITENS.length; i++){
            query += `` 
        }


    
        con.release()
    }
    catch(err){
        await con.rollback()

        console.log(err)

        res.status(500).send({
            sucesso: false,
            mensagem: "Falha! Erro desconhecido."
        })

        con.release()
    }
})
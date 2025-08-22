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

        let [itens] = await con.execute(
            `CALL INSERT_ITENS ( ?, ?)`,
            [data[0][0].ID_PROMOCAO, JSON.stringify(ITENS)]
        )

        await con.commit()

        res.status(200).send({
            sucesso: true,
            mensagem: "Registro salvo com sucesso!"
        })
    
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

app.get('/promocoes/:id_entidade/grid', async(req, res) => {

    let [data] = await pool.promise().execute(
        `SELECT * FROM GRID_PROMOCAO WHERE ID_ENTIDADE = ?`,
        [req.params.id_entidade]
    )

    res.status(200).send(data)
})

app.delete('/promocoes/:id_promocao/delete', async(req, res) => {

    try{

        let [data] = await pool.promise().execute(
            `CALL DELETE_PROMOCAO ( ? )`,
            [req.params.id_promocao]
        )

        res.status(200).send({
            sucesso: true,
            mensagem: "Registro excluido com sucesso!"
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

app.get('/promocoes/:id_promocao/consulta', async(req, res) => {

    let [registro] = await pool.promise().execute(
        `SELECT * FROM CONSULTA_PROMOCAO WHERE ID_PROMOCAO = ?`,
        [req.params.id_promocao]
    )

    let [itens] = await pool.promise().execute(
        `SELECT * FROM CONSULTA_ITENS WHERE ID_PROMOCAO = ?`,
        [req.params.id_promocao]
    )

    let data = Object.assign(registro[0], {ITENS: itens})

    res.status(200).send(data)
})

app.put('/promocoes/:id_promocao/altera', async(req, res) =>{

    let {
        CD_PROMOCAO ,
        DT_INICIO   ,
        DT_FINAL    ,
        NM_PROMOCAO ,
        DS_PROMOCAO ,
        ITENS       ,
    } = req.body

    try{
        let [data] = await pool.promise().execute(
            `CALL UPDATE_PROMOCAO ( ?, ?, ?, ?, ?, ?)`,
            [
                req.params.id_promocao, CD_PROMOCAO, DT_INICIO,
                DT_FINAL, NM_PROMOCAO, DS_PROMOCAO
            ]
        )

        let [itens] = await pool.promise().execute(
            `CALL UPDATE_ITENS ( ?, ?)`,
            [req.params.id_promocao, JSON.stringify(ITENS)]
        )

        res.status(200).send({
            sucesso: true,
            mensagem: "Registro atualizado com sucesso!"
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
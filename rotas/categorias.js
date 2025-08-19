const { app, pool } = require('../server')

app.get('/categorias/:id_entidade/codigo', async(req, res) => {

    let [data] = await pool.promise().execute(
        `SELECT COALESCE(MAX(CD_CATEGORIA), 0) +1 AS CD_CATEGORIA FROM CATEGORIAS WHERE ID_ENTIDADE = ?`,
        [req.params.id_entidade]
    )

    res.status(200).send(data)
})

app.post('/categorias/:id_entidade/insert', async(req, res) => {

    let { CD_CATEGORIA, NM_CATEGORIA, DS_CATEGORIA, VL_META, SN_ATIVO } = req.body

    try{
        let [data] = await pool.promise().execute(
            `CALL INSERT_CATEGORIA ( ?, ?, ?, ?, ?, ?)`,
            [req.params.id_entidade, CD_CATEGORIA, NM_CATEGORIA, DS_CATEGORIA, VL_META, SN_ATIVO]
        )

        res.status(200).send({
            sucesso: true,
            mensagem: "Registro salvo com sucesso!"
        })
        return
    }
    catch(err){
        if(err.code == "ER_DUP_ENTRY"){
            let match = (err.sqlMessage).match(/CATEGORIAS\.(\w+)/)

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

app.get('/categorias/:id_usuario/grid', async(req, res) => {

    let [data] = await pool.promise().execute(
        `SELECT * FROM CATEGORIAS WHERE ID_ENTIDADE = ?`,
        [req.params.id_usuario]
    )

    res.status(200).send(data)
})

app.get('/categorias/:id_categoria/consulta', async(req, res) => {

    let [data] = await pool.promise().execute(
        `SELECT * FROM CATEGORIAS WHERE ID_CATEGORIA = ?`,
        [req.params.id_categoria]
    )

    res.status(200).send(data)
})

app.delete('/categorias/:id_categoria/delete', async(req, res) => {

    try{
        let [data] = await pool.promise().execute(
            `DELETE FROM CATEGORIAS WHERE ID_CATEGORIA = ?`,
            [req.params.id_categoria]
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

app.put('/categorias/:id_categoria/altera', async(req, res) => {

    let { CD_CATEGORIA, NM_CATEGORIA, DS_CATEGORIA, VL_META, SN_ATIVO } = req.body

    try{

        let [data] = await pool.promise().execute(
            `CALL UPDATE_CATEGORIA( ?, ?, ?, ?, ?, ?)`,
            [CD_CATEGORIA, NM_CATEGORIA, DS_CATEGORIA, VL_META, SN_ATIVO, req.params.id_categoria]
        )

        res.status(200).send({
            sucesso: true,
            mensagem: "Registro alterado com sucesso!"
        })
    }
    catch(err){
        if(err.code == "ER_DUP_ENTRY"){
            let match = (err.sqlMessage).match(/CATEGORIAS\.(\w+)/)

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

app.get('/categorias/:id_entidade/lookup', async(req, res) => {

    let [data] = await pool.promise().execute(
        `SELECT * FROM CATEGORIAS WHERE ID_ENTIDADE = ? AND SN_ATIVO = 1`,
        [req.params.id_entidade]
    )

    res.status(200).send(data)
})
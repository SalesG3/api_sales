const { app, pool } = require('../server')

app.get('/cardapio/:alias/dados', async(req, res) => {

    let [categorias] = await pool.promise().execute(
        `SELECT C.* FROM CATEGORIAS C LEFT JOIN ENTIDADES E ON E.ID_ENTIDADE = C.ID_ENTIDADE WHERE E.ALIAS_ENTIDADE = ?`,
        [req.params.alias]
    )

    res.status(200).send({
        CATEGORIAS: categorias
    })
})
const { app, pool } = require('../server')
const bcrypt = require('bcrypt')

app.post('/admin/login', async(req, res) => {

    // Validações Iniciais
    let { CD_ENTIDADE, USER_SENHA } = req.body

    if(!CD_ENTIDADE || !USER_SENHA){
        res.status(400).send({
            sucesso: false,
            mensagem: "Preencha todos os campos!"
        })
        return
    }

    // Execução no banco
    try{
        let [data] = await pool.promise().execute(
            `SELECT * FROM ENTIDADES WHERE CD_ENTIDADE = ?`,
            [CD_ENTIDADE]
        )

        bcrypt.compare(USER_SENHA, data[0].USER_SENHA, (invalido, sucesso) => {
            if(sucesso){
                res.status(200).send({
                    sucesso: true,
                    ID_ENTIDADE: data[0].ID_ENTIDADE,
                    NM_ENTIDADE: data[0].NM_ENTIDADE
                })
            }
            else{
                res.status(200).send({
                    sucesso: false,
                    mensagem: "Credênciais inválidas!"
                })
            }
        })
    }

    // Tratativa de erros
    catch(err){
        console.log(err)

        res.status(500).send({
            sucesso: false,
            mensagem: "Erro Desconhecido!"
        })
    }
})
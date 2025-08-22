const { app, pool } = require('../server')
const multer = require('multer')
const fs = require('fs')

const upload = multer({ dest: 'uploads/'})

app.post('/produtos/:id_produto/imagem', upload.single('file'), async(req, res) => {

    // Adicionar validações de tipo e tamanho de arquivo 
    
    let img_name = req.file.destination + req.params.id_produto + ".jpg"

    fs.renameSync(req.file.path, img_name)

    let img_url = `http://192.168.0.134:8083/uploads/${req.params.id_produto}.jpg`

    let [data] = await pool.promise().execute(
        `UPDATE PRODUTOS SET IMG_PRODUTO = ? WHERE ID_PRODUTO = ?`,
        [img_url, req.params.id_produto]
    )

    res.status(200).send({
        sucesso: true
    })
})

app.post('/entidades/:id_entidade/imagem', upload.single('file'), async(req, res) => {

    let img_name = req.file.destination + "LOGO_" + req.params.id_entidade + '.png'

    fs.renameSync(req.file.path, img_name)

    let img_url = `http://192.168.0.134:8083/uploads/LOGO_${req.params.id_entidade}.png`

    let [data] = await pool.promise().execute(
        `UPDATE ENTIDADES SET IMG_ENTIDADE = ? WHERE ID_ENTIDADE = ?`,
        [img_url, req.params.id_entidade]
    )

    res.status(200).send({
        sucesso: true
    })
})
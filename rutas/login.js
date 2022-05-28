const express=require('express')
//const res=require('express/lib/response')
const router=express.Router()
//const {pool}=require('../modelos/database/mqtt_user.js')
const {pool, tb_user}=require('../modelos/database/mqtt_user.js')

router.get('/', (req, res)=>{
    const data=Object.assign({}, req.body)
    res.render('usuarios/perfil.ejs')
})

module.exports=router
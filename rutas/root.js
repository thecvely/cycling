const express=require('express')
const router=express.Router()
const {pool}=require('../modelos/database/mqtt_user.js')
router.get('/', (req, res)=>{


    if (req.session.login===true)
    {
        console.log('Sesion Iniciada')
        res.render('usuarios/inicio.ejs')
    } else {
        const error={
            class:'',
            data:''
        }
        console.log('Iniciar Session')
        res.render('usuarios/login.ejs', {error})

    }

    console.log(req.session)
    
    
    

})

module.exports=router
const express=require('express')
const router=express.Router()
const {pool}=require('../modelos/database/mqtt_user.js')



router.get('/', (req, res)=>{


    const sesion={
        enable:'',
        name:'',
        lastname:'',
        nav_h:{
            b1:'',
            b2:''
        }
    }
    
    const error={
        class:'',
        data:''
    }

    if (req.session.login===true)
    {
        sesion.enable=true
        sesion.name=req.session.username
        sesion.lastname=req.session.lastname
        sesion.nav_h.b1="display:block"
        sesion.nav_h.b2="Añadir"

        console.log('Sesion Iniciada')
        res.render('usuarios/inicio.ejs', {error, sesion})
    } else {
        sesion.enable=false
        sesion.name='Right'
        sesion.lastname='Cycling'
        sesion.nav_h.b1="display:none"
        sesion.nav_h.b2="Registrar"
        console.log('Iniciar Session')
        res.render('usuarios/login.ejs', {error, sesion})

    }

    console.log(req.session)
    
    
    

})

module.exports=router
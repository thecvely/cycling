const express=require('express')
const router=express.Router()
const {pool}=require('../modelos/database/mqtt_user.js')

const {sesionControl}=require('../funciones/session.js')

router.get('/', (req, res)=>{
   
    const error={
        class:'',
        data:''
    }
console.log(`Petición Raíz \n Valor de session:`,req.session)

const login=sesionControl(req.session)
const sesion=Object.assign({},login)

if(sesion.login===true){
    console.log('Sesion Iniciada')
    res.render('usuarios/inicio.ejs', {error, sesion})
}else{
    console.log('Iniciar Session')
    res.render('usuarios/login.ejs', {error, sesion})
}
    console.log(req.session)
    
})



module.exports=router
const express=require('express')
const { NULL } = require('mysql/lib/protocol/constants/types')
const sha256=require('crypto')
//const res=require('express/lib/response')
const router=express.Router()
const {pool}=require('../modelos/database/mqtt_user.js')
const {tb_user}=require('../modelos/database/mqtt_user.js')
const {sesionControl}=require('../funciones/session.js')


const mail=require('nodemailer')

function sendMail(mensaje ){
console.log('*************************************************************************')
console.log(`ENVIANDO CORREO!`)
const transporter=mail.createTransport({
    service:'gmail',
    auth:{
        user:'vehoja@gmail.com',
        pass:'gdzgoihtciqnrnda'
    }
})

console.log(`ENVIANDO CORREO! 2`)

let mailOptions={
    from:'vehoja@gmail.com',
    to:'thecvely@gmail.com',
    subject:'Código de Activación',
    text:mensaje
}

console.log(`ENVIANDO CORREO! 3`)

transporter.sendMail(mailOptions,(err,info)=>{

    console.log(`SEND MAIL`)
    if(err){
        console.log('ERROR EN ENVÍO')
        console.log(err)
    }else{
        console.log('ENVÍO DE CORREO OK')
        console.log(info.response)
    }
    console.log(`FIN SEND MAIL`)
})

}


const error={
    class:'',
    data:''
}

router.get('/registro', (req, res)=>{ // Abierto, todos pueden acceder
    const data=Object.assign({}, req.body)    
    const login=sesionControl(req.session)
    const sesion=Object.assign({},login)
    console.log(req.session)
    res.render('usuarios/registro.ejs', {error, sesion})
})


router.post('/', (req, res)=>{ //Página de autenticación, todos pueden acceder

    const data=Object.assign({}, req.body)
    pool.query(`SELECT username, name, lastname, password, salt, email, enable FROM mqtt_user WHERE username ='${data.username}'`, (err, response)=>{
        if(err || response.length===0){
                error.class='text-center form-control is-invalid'
                error.data=`Credenciales Incorrectas ${err}`
                const login=sesionControl(req.session)
                const sesion=Object.assign({},login)
                res.render('usuarios/login.ejs', {error, sesion})
        }else{
                const hash=sha256.createHash('sha256').update(`${response[0].salt}${data.password}`).digest('hex')
                if(hash===response[0].password){
                    req.session.login=true
                    req.session.setvar=true
                    req.session.name=response[0].name
                    req.session.username=response[0].username
                    req.session.lastname=response[0].lastname
                    req.session.email=response[0].email
                    
                    const sesion=Object.assign({}, req.session)
                    res.render('usuarios/inicio.ejs', {error, sesion})
                }else{
                    error.class='text-center form-control is-invalid',
                    error.data='Credenciales Incorrectas'
                    const login=sesionControl(req.session)
                    const sesion=Object.assign({},login)
                    res.render('usuarios/login.ejs', {error, sesion})
                }
        }
    })
})



router.post('/registro', (req, res)=>{ //Cualquiera puede registarse -- si es de sesión iniciada es añadir 
    const data=Object.assign({},req.body)
    data.salt=process.env.DB_SALT
    console.log(data.code)
    req.session.data={
        name:'',
        username:'',
        lastname:'',
        email:'',
        nav_h:{
            b1:'',
            b2:''
        },
        enable:''
    }

    console.log(req.session)

if (data.code==='0'){//REGISTRO DE USUARIO
    console.log(data)
    if (data.passwd[0]===data.passwd[1] && data.passwd[0]!=0 ){

        const hash=sha256.createHash("sha256").update(`${data.salt}${data.passwd[0]}`).digest('hex')
        console.log(hash)
        
        
        delete data.passwd
        data.password=hash 
        data.code=Math.random().toString(36).substring(2,9)
        data.enable='0'
        console.log(data)

                pool.query(`INSERT INTO mqtt_user set ?`, data, (err, result)=>{
            if (err){
                console.log('Error')
                res.send(`Error en base de datos:${err}`)
            }else{           
                
                req.session.login=false
                req.session.setvar=true
                req.session.username=data.username
                req.session.lastname=data.lastname
                req.session.email=data.email
                req.session.name=data.name
                
                //sendMail(`${data.code}`)
                const login=sesionControl(req.session)
                const sesion=Object.assign({},login)                
                console.log("Guardado en base de datos")
                
                res.render('usuarios/activar.ejs', {error, sesion})
            }
        })
       
    }else{
        res.send('Error en contraseña')
    }
}else{// ACTIVACIÓN DE USUARIO
    pool.query(`SELECT code FROM mqtt_user WHERE username='${data.username}'`, (err, result)=>{
        if(err){
            res.send(`Error: ${err}`)
        }else{
            console.log(result[0].code)
            console.log(data.code)
            if (result[0].code.localeCompare(data.code)===0){
                req.session.login=true

                const login=sesionControl(req.session)
                const sesion=Object.assign({}, login)             
                console.log(`Valor de Sesion: ${sesion}`)
                res.render('usuarios/inicio.ejs', {sesion})
            }else{
                const login=sesionControl(req.session)
                const sesion=Object.assign({}, login)
                error.data=' Código incorrecto intente nuevamente'
                error.class='text-center form-control is-invalid'
                res.render('usuarios/activar.ejs', {data, error, sesion})
            }
        }  
    })

}   
    
})

module.exports=router
const express=require('express')
const { NULL } = require('mysql/lib/protocol/constants/types')
const sha256=require('crypto')
//const res=require('express/lib/response')
const router=express.Router()
const {pool}=require('../modelos/database/mqtt_user.js')
const {tb_user}=require('../modelos/database/mqtt_user.js')

router.get('/registro', (req, res)=>{
    const data=Object.assign({}, req.body)
    res.render('usuarios/registro.ejs')
})


router.post('/', (req, res)=>{
    const data=Object.assign({}, req.body)
    pool.query(`SELECT password, salt FROM mqtt_user WHERE username ='${data.username}'`, (err, response)=>{
        if(err){
            res.send(`Error: ${err}`)
        }else{
            if(response.length===1){
                const hash=sha256.createHash('sha256').update(`${response[0].salt}${data.password}`).digest('hex')
                if(hash===response[0].password){
                    req.session.login=true
                    res.render('usuarios/inicio.ejs')
                }else{
                    const error={
                        class:'text-center form-control is-invalid',
                        data:'Credenciales Incorrectas'
                    }
                    res.render('usuarios/login.ejs', {error})
                }
            }else{
                const error={
                    class:'text-center form-control is-invalid',
                    data:'Credenciales Incorrectas'
                }
                res.render('usuarios/login.ejs', {error})

            }

        }
    })
})



router.post('/registro', (req, res)=>{
    const data=Object.assign({},req.body)
    data.salt='$3cr3t'
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

            console.log("Guardado en base de datos")
            res.render('usuarios/activar.ejs', {data, error:''})
            }
        })
       
    }else{
        res.send('Error en contraseña')
    }
}else{// ACTIVACIÓN DE USUARIO
    pool.query(`SELECT code FROM mqtt_user WHERE username='${data.username}'`, (err, result)=>{
        if(err){

        }else{
            console.log(result[0].code)
            console.log(data.code)
            if (result[0].code.localeCompare(data.code)===0){
                
                
                
                res.send('Usuario Activado')

            }else{
                error={
                data:' Código incorrecto intente nuevamente',
                class:'text-center form-control is-invalid'
                }
                res.render('usuarios/activar.ejs', {data, error})
            }
            
        }  
    })

}   
    
})

module.exports=router
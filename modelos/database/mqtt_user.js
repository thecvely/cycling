const mysql=require('mysql')


const tb_user={
    id:'',
    username:'',
    password:'',
    salt:'',
    is_superuser:'',
    created:''
}
const database={
    host:'127.0.0.1',
    user:'mcorella',
    password:'Ytjda3toGe',
    database:'CICLISMO'
}

const pool=mysql.createPool(database)

pool.getConnection((err, con)=>{
    if (err) console.error(err)
    if (con){
        con.release()
        console.log('Conectado a Base de Datos')
    }
})

module.exports={tb_user}
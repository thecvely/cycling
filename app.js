const express=require('express')
const body=require('body-parser')
const session=require('express-session')
const app=express()
const port=80
const {database}=require('./modelos/database/mqtt_user.js')
const MysqlSession=require('express-mysql-session')(session)

const mysqlStore=new MysqlSession(database)


//3.1  Peticiones Post
app.use(body.urlencoded({extended:false}))
app.use(body.json())

//1.- Rutas estáticas
app.use(express.static(`${__dirname}/public`))

//2.- Variables de entorno
const dotenv=require('dotenv')
const { sesionControl } = require('./funciones/session.js')
dotenv.config({path:'./env/.env'})


//3.- Rutas dinámicas
app.set('view engine', 'ejs')
app.set('views', `${__dirname}/vistas`)

//4.- Ruteo y cokies
app.use(session({
    key:'id_usuario',
    secret:'first session',
    store: mysqlStore,
    saveUninitialized:true,
    resave:true,
    cookie:{
        maxAge:60000
    }
}))

app.use('/login', require('./rutas/login.js'))
app.use('/', require('./rutas/root.js'))
//app.use('/admin','./usuarios/admin.js')

//5.- Estados
app.use((req, res, next)=>{


    console.log('Recurso no encontrado')
    const login=sesionControl(req.session)
    const sesion=Object.assign({}, login)
    res.status(404).render('404',{sesion})
})

//6.- Servidor
app.listen(port, ()=>{
    console.log(`Servidor de Ciclismo en puerto ${port}` )
})



//Conexión MQTT

const {pool}=require('./modelos/database/mqtt_user.js')
const mqtt=require('mqtt')
const mqtt_options={
    clientId:'Nodejs Server',
    username:process.env.MQ_USER,
    password:process.env.MQ_PASSW,
    clean:true
}

console.log('++++++++++++++++++++++++++++++++++++++++++++++++++\nConectando a Broker')
const client=mqtt.connect('mqtt://fresvel.com:1883', mqtt_options);

client.on('connect', ()=> {
    client.subscribe('Usuario/', function (err) {
      if (!err) {
        client.publish('Usuario/', 'Hello mqtt')
      }
    })
  })
  
  client.on('message',  (topic, message)=> {
    // message is Buffer

    pool.query(`SELECT name, lastname FROM mqtt_user WHERE username='${message}'`,(err, result)=>{
        console.log(result.length)
        if(err || result.length===0){
            console.log('Error en Base de Datos: ', err)
        }else{
            console.log(result);
            client.publish(`${message.toLocaleString()}/nombre`, `${result[0].name} ${result[0].lastname}`, 2)
            //client.publish(`${message.toLocaleString()}/nombre`,'Marcelo Corella')
        }
        console.log(`${message.toLocaleString()}/nombre`)
        //client.end()

    })
  })
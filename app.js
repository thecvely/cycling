const express=require('express')
const body=require('body-parser')
const session=require('express-session')
const app=express()
const port=80
const {database}=require('./modelos/database/mqtt_user.js')
const MysqlSession=require('express-mysql-session')

const mysqlStore=new MysqlSession(database)

//3.1  Peticiones Post
app.use(body.urlencoded({extended:false}))
app.use(body.json())

//1.- Rutas estáticas
app.use(express.static(`${__dirname}/public`))

//2.- Rutas dinámicas
app.set('view engine', 'ejs')
app.set('views', `${__dirname}/vistas`)

//3.- Ruteo y cokies
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

//4.- Estados
app.use((req, res, next)=>{
    res.status(400).render('404')
})

//5.- Servidor
app.listen(port, ()=>{
    console.log(`Servidor de Ciclismo en puerto ${port}` )
})

function sesionControl(ses){

    console.log(`Control de Sesión: \n Valor de login: ${ses.login}`)

    if (ses.login===true){          //Variables seteadas
        
        console.log('Sesion True')
        ses.nav_h={
            B1:{name:'Historial', class:'btn btn-outline-primary my-2 my-sm-0', style:'display:block', href:''},
            B2:{name:'Añadir Usuario', class:'btn btn-outline-secondary my-2 my-sm-0', style:'display:block', href:''},
            B3:{name:'Cerrar Sesión', class:'btn btn-outline-success my-2 my-sm-0', style:'display:block', href:'http://fresvel.com'}}
    }else if(ses.setvar===undefined || ses.setvar===false){   //Variables no inicializadas : Se inicializa
        console.log(`Setvar: ${ses.setvar}`)
        ses.setvar=true
        ses.login=false
        ses.name='Right'
        ses.lastname='Cycling'
        ses.username=''
        ses.nav_h={
            B1:{name:'', class:'btn btn-outline-primary my-2 my-sm-0', style:'display:none', href:''},
            B2:{name:'Registrar', class:'btn btn-outline-secondary my-2 my-sm-0', style:'display:block', href:'http://fresvel.com/login/registro'},
            B3:{name:'Iniciar Sesión', class:'btn btn-outline-success my-2 my-sm-0', style:'display:block', href:'http://fresvel.com'} 
        }
    }else {
        console.log('Control session todo lo demás')
        ses.nav_h={
            B1:{name:'', class:'btn btn-outline-primary my-2 my-sm-0', style:'display:none', href:''},
            B2:{name:'Registrar', class:'btn btn-outline-secondary my-2 my-sm-0', style:'display:block', href:'http://fresvel.com/login/registro'},
            B3:{name:'Iniciar Sesión', class:'btn btn-outline-success my-2 my-sm-0', style:'display:block', href:'http://fresvel.com'} 
        }
    }

    return ses
}

module.exports={sesionControl}
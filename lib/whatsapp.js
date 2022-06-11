const {Client, LocalAuth}=require('whatsapp-web.js')
const qrcode=require('qrcode-terminal')

const wclient=new Client({
    authStrategy:new LocalAuth({clientId:'wnode', dataPath:'./wstorage'})
})

wclient.on('qr',qr=>{
    qrcode.generate(qr, {small:true})
})

wclient.on('ready', ()=>{
    console.log('Cliente Listo')
})

wclient.on('message', msg=>{
    console.log(msg.body, msg.to, msg.from)
})

wclient.initialize()

module.exports=wclient
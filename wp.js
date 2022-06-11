const fs=require('fs')
const {Client, LocalAuth}=require('whatsapp-web.js')
const qrcode=require('qrcode-terminal')
const client =new Client({
    authStrategy:new LocalAuth()
})

client.on('qr', qr=>{
    qrcode.generate(qr,{small:true})
})

client.on('ready',()=>{
    console.log('Cliente listo!!')
})

client.on('message', msg=>{
    console.log(msg.from, msg.to, msg.body)
    if (msg.body==='ping'){
        client.sendMessage(msg.from, 'pong')
    }
})

client.initialize()

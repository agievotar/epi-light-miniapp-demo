'use strict';
const https = require('node:https');
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) { console.error('Missing TELEGRAM_BOT_TOKEN'); process.exit(1); }
const APP = 'https://agievotar.github.io/epi-light-miniapp-demo/';
let offset = 0;
function api(method, data) {
  return new Promise((resolve,reject)=>{
    const payload=Buffer.from(JSON.stringify(data));
    const req=https.request({hostname:'api.telegram.org',path:`/bot${token}/${method}`,method:'POST',headers:{'Content-Type':'application/json','Content-Length':payload.length},timeout:40000},res=>{
      let buf='';res.on('data',v=>buf+=v);res.on('end',()=>{try{const json=JSON.parse(buf);json.ok?resolve(json.result):reject(new Error(`${method}: ${json.description}`));}catch(e){reject(e);}});
    });
    req.on('timeout',()=>req.destroy(new Error('timeout')));req.on('error',reject);req.end(payload);
  });
}
async function init(){
  const me=await api('getMe',{});
  if(me.username!=='epi_light_bot')throw Error('Token belongs to a different bot');
  await api('deleteWebhook',{drop_pending_updates:false});
  await api('setMyCommands',{commands:[{command:'start',description:'Открыть EPI LIGHT'}]});
  await api('setChatMenuButton',{menu_button:{type:'web_app',text:'✨ Записаться',web_app:{url:APP}}});
  console.log('Bot ready:',me.username);
}
async function poll(){
  for(;;){
    try{
      const updates=await api('getUpdates',{offset,timeout:30,allowed_updates:['message']});
      for(const u of updates){
        offset=u.update_id+1;
        const msg=u.message;
        if(msg?.text?.startsWith('/start') && msg.chat?.type==='private'){
          await api('sendMessage',{chat_id:msg.chat.id,text:'✨ Добро пожаловать в EPI LIGHT!\n\nВаше время для себя — в несколько касаний. Выберите удобную дату и время в нашем мини-приложении.\n\n🌸 Сейчас это демонстрационная запись, без уведомления мастеру.',reply_markup:{inline_keyboard:[[{text:'✨ Записаться',web_app:{url:APP}}]]}});
        }
      }
    }catch(e){console.error(new Date().toISOString(),e.message);await new Promise(r=>setTimeout(r,5000));}
  }
}
init().then(poll).catch(e=>{console.error(e.message);process.exit(1)});

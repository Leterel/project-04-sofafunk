// Consent-based, bounded, stop-and-wait transfer over the existing DataChannel.
export const MAX_FILE_BYTES=5*1024*1024,CHUNK_BYTES=12288;
const validId=value=>typeof value==='string'&&/^[0-9a-f-]{36}$/.test(value);
export function safeFilename(value){let name=Array.from(String(value)).slice(0,120).join('').replace(/[\\/:*?"<>|\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g,'_').replace(/[. ]+$/g,'');if(/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(name))name='_'+name;return name||'datei.bin';}
const hash=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
const encode=bytes=>btoa(String.fromCharCode(...bytes));
function decode(value){if(typeof value!=='string'||!value.length||value.length>16384||value.length%4||!/^[A-Za-z0-9+/]+={0,2}$/.test(value))throw Error('Ungültiger Dateiblock.');const raw=atob(value);if(btoa(raw)!==value)throw Error('Ungültiger Dateiblock.');return Uint8Array.from(raw,c=>c.charCodeAt(0));}
export class FileTransfer{
 constructor({send,onChange=()=>{},timeoutMs=15000,offerTimeoutMs=60000}){if(typeof send!=='function'||!Number.isFinite(timeoutMs)||timeoutMs<=0||!Number.isFinite(offerTimeoutMs)||offerTimeoutMs<=0)throw Error('Ungültige Übertragungskonfiguration.');this.send=send;this.onChange=onChange;this.timeoutMs=timeoutMs;this.offerTimeoutMs=offerTimeoutMs;this.out=null;this.incoming=null;this.closed=false;this.message='Keine Dateiübertragung.';}
 snapshot(){const summary=s=>s?{id:s.id,name:s.name,size:s.size,offset:s.offset,phase:s.phase}:null;return {outgoing:summary(this.out),incoming:summary(this.incoming),message:this.message};}
 notify(message){if(message)this.message=message;this.onChange(this.snapshot());}
 post(message){if(this.closed||!this.send(message))throw Error('Dateikanal nicht bereit oder ausgelastet. Erneut versuchen.');}
 touch(s,offer=false){clearTimeout(s.timer);s.timer=setTimeout(()=>this.fail(s,'Zeitlimit: Dateiübertragung abgebrochen.'),offer?this.offerTimeoutMs:this.timeoutMs);}
 fail(s,message){if(!s||!(this.out===s||this.incoming===s))return;try{this.post({type:'file-cancel',id:s.id});}catch{}clearTimeout(s.timer);if(this.out===s)this.out=null;if(this.incoming===s)this.incoming=null;this.notify(message);}
 async offer(bytes,name){if(this.closed||this.out)throw Error('Es läuft bereits eine Übertragung.');if(!(bytes instanceof Uint8Array)||!bytes.length||bytes.length>MAX_FILE_BYTES)throw Error('Dateien müssen 1 Byte bis 5 MiB groß sein.');const s=this.out={id:crypto.randomUUID(),name:safeFilename(name),size:bytes.length,bytes:bytes.slice(),offset:0,seq:0,phase:'hashing'};this.touch(s);this.notify('Datei wird vorbereitet.');try{s.sha256=await hash(s.bytes);if(this.closed||this.out!==s)return;s.phase='offered';this.post({type:'file-offer',id:s.id,name:s.name,size:s.size,sha256:s.sha256});this.touch(s,true);this.notify('Warte auf bewusste Annahme beim Empfänger.');}catch(error){this.fail(s,error.message);throw error;}}
 accept(){const s=this.incoming;if(!s||s.phase!=='pending')return;try{s.bytes=new Uint8Array(s.size);s.phase='receiving';this.post({type:'file-accept',id:s.id});this.touch(s);this.notify('Datei wird direkt empfangen.');}catch(error){this.fail(s,error.message);}}
 next(s){if(s.offset===s.size){s.phase='verifying';this.post({type:'file-end',id:s.id});}else{const chunk=s.bytes.subarray(s.offset,s.offset+CHUNK_BYTES);s.lastLength=chunk.length;s.awaitingAck=true;this.post({type:'file-chunk',id:s.id,seq:s.seq,data:encode(chunk)});}this.touch(s);this.notify();}
 async receive(data){if(this.closed||!data||typeof data!=='object'||!validId(data.id))return;let current;
  try{
   if(data.type==='file-offer'){
    if(this.incoming||data.id===this.out?.id){this.post({type:'file-cancel',id:data.id});return;}
    if(typeof data.name!=='string'||data.name.length>512||!Number.isSafeInteger(data.size)||data.size<1||data.size>MAX_FILE_BYTES||typeof data.sha256!=='string'||!/^[0-9a-f]{64}$/.test(data.sha256))return;
    current=this.incoming={id:data.id,name:safeFilename(data.name),size:data.size,sha256:data.sha256,offset:0,seq:0,phase:'pending',bytes:null};this.touch(current,true);this.notify('Datei angeboten. Annahme erforderlich.');return;
   }
   if(data.type==='file-cancel'){if(this.out?.id===data.id){clearTimeout(this.out.timer);this.out=null;}if(this.incoming?.id===data.id){clearTimeout(this.incoming.timer);this.incoming=null;}this.notify('Übertragung beendet oder abgelehnt.');return;}
   if(data.type==='file-accept'&&this.out?.id===data.id&&this.out.phase==='offered'){current=this.out;current.phase='sending';this.next(current);return;}
   if(data.type==='file-ack'&&this.out?.id===data.id&&this.out.phase==='sending'){
    current=this.out;if(!current.awaitingAck||data.next!==current.seq+1)throw Error('Unerwartete Empfangsbestätigung.');current.awaitingAck=false;current.offset+=current.lastLength;current.seq++;this.next(current);return;
   }
   if(data.type==='file-chunk'&&this.incoming?.id===data.id&&this.incoming.phase==='receiving'){
    current=this.incoming;if(data.seq!==current.seq)throw Error('Unerwartete Blockreihenfolge.');const bytes=decode(data.data);if(bytes.length!==Math.min(CHUNK_BYTES,current.size-current.offset))throw Error('Ungültige Dateilänge.');current.bytes.set(bytes,current.offset);current.offset+=bytes.length;current.seq++;this.post({type:'file-ack',id:current.id,next:current.seq});this.touch(current);this.notify();return;
   }
   if(data.type==='file-end'&&this.incoming?.id===data.id&&this.incoming.phase==='receiving'){
    current=this.incoming;if(current.offset!==current.size)throw Error('Datei unvollständig.');current.phase='verifying';this.touch(current);const actual=await hash(current.bytes);if(this.closed||this.incoming!==current)return;if(actual!==current.sha256)throw Error('Prüfsumme stimmt nicht.');clearTimeout(current.timer);current.phase='ready';this.post({type:'file-complete',id:current.id});this.notify('Datei vollständig geprüft. Speichern bewusst auswählen.');return;
   }
   if(data.type==='file-complete'&&this.out?.id===data.id&&this.out.phase==='verifying'){clearTimeout(this.out.timer);this.out=null;this.notify('Datei vollständig übertragen.');}
  }catch(error){if(current)this.fail(current,error.message);}
 }
 takeReceived(){const s=this.incoming;if(!s||s.phase!=='ready')return null;this.incoming=null;this.notify('Datei zum lokalen Speichern übergeben.');return {name:s.name,bytes:s.bytes};}
 cancel(){for(const s of [this.out,this.incoming])if(s)this.fail(s,'Übertragung bewusst abgebrochen.');}
 close(){this.closed=true;for(const s of [this.out,this.incoming])if(s)clearTimeout(s.timer);this.out=null;this.incoming=null;}
}

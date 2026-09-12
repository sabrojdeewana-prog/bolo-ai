const s=localStorage.getItem('bolo_settings');if(s){const x=JSON.parse(s);price.value=x.price||199;limit.value=x.limit||10;email.value=x.email||''}
function save(){let x={price:price.value,limit:limit.value,email:email.value};localStorage.setItem('bolo_settings',JSON.stringify(x));saved.textContent='✓ Settings saved on this device.'}

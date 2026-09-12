const $=id=>document.getElementById(id);
function send(){let q=$('q'),t=q.value.trim();if(!t)return;let m=$('messages');m.innerHTML+=`<div class="bubble user">${esc(t)}</div>`;q.value='';setTimeout(()=>{m.innerHTML+=`<div class="bubble ai">आपका संदेश मिल गया। यह Bolo AI का complete frontend है। असली AI जवाब के लिए Admin में अपनी AI API को सुरक्षित backend से connect करना होगा।</div>`;m.scrollTop=m.scrollHeight},450)}
function esc(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function showPlans(){document.querySelector('#plans').scrollIntoView({behavior:'smooth'})}
function openAdmin(){location.href='admin.html'}
function pay(){alert('Payment UI तैयार है। असली payment लेने के लिए Razorpay/Cashfree account + secure backend connection चाहिए।')}
function voiceInput(){if(!('webkitSpeechRecognition'in window||'SpeechRecognition'in window)){alert('इस browser में voice recognition उपलब्ध नहीं है।');return}let R=window.SpeechRecognition||window.webkitSpeechRecognition,r=new R();r.lang='hi-IN';r.onresult=e=>{$('q').value=e.results[0][0].transcript;send()};r.start()}

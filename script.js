// New UI elements
const certInput = document.getElementById('certInput');
const passwordInput = document.getElementById('passwordInput');
const togglePasswordBtn = document.getElementById('togglePassword');
const fileInput = document.getElementById('fileInput');
const dropzone = document.getElementById('dropzone');
const filesList = document.getElementById('filesList');
const signBtn = document.getElementById('signDocumentBtn');
const signMessage = document.getElementById('signMessage');

let certFile = null;
let certPassword = '';

let xmlFiles = []; // array of File objects

function setMessage(text, type = 'info'){
  if(!signMessage) return;
  signMessage.textContent = text;
  signMessage.style.color = type === 'error' ? '#ff7b94' : type === 'success' ? '#6ee7b7' : '#a8d1ff';
}

// Certificate selection
if(certInput){
  certInput.addEventListener('change', (e)=>{
    certFile = e.target.files[0] || null;
    if(certFile) setMessage(`Certificado: ${certFile.name}`);
  });
}

if(passwordInput){
  passwordInput.addEventListener('input', (e)=>{
    certPassword = e.target.value;
  });
}

if(togglePasswordBtn && passwordInput){
  togglePasswordBtn.addEventListener('click', ()=>{
    const obscured = passwordInput.type === 'password';
    passwordInput.type = obscured ? 'text' : 'password';
    togglePasswordBtn.setAttribute('aria-pressed', String(obscured));
  });
}

// Files list helpers
function renderFiles(){
  if(!filesList) return;
  filesList.innerHTML = '';
  xmlFiles.forEach((f, i)=>{
    const li = document.createElement('li');
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${f.name} • ${Math.round(f.size/1024)} KB`;
    const right = document.createElement('div');
    const remove = document.createElement('button');
    remove.className = 'remove';
    remove.title = 'Eliminar';
    remove.textContent = '✕';
    remove.addEventListener('click', ()=>{ xmlFiles.splice(i,1); renderFiles(); });
    right.appendChild(remove);
    li.appendChild(meta);
    li.appendChild(right);
    filesList.appendChild(li);
  });
}


// Add files from input or drop
function addFiles(fileList){
  const added = Array.from(fileList).filter(f=>f.name.toLowerCase().endsWith('.xml'));
  if(added.length===0){ setMessage('Solo se aceptan archivos .xml', 'error'); return; }
  // avoid duplicates by name+size
  for(const f of added){
    if(!xmlFiles.some(x=>x.name===f.name && x.size===f.size)) xmlFiles.push(f);
  }
  renderFiles();
  setMessage(`${xmlFiles.length} archivo(s) listos`);
}

if(fileInput){
  fileInput.addEventListener('change', (e)=> addFiles(e.target.files));
}


// Drag & drop handlers
if(dropzone){
  ['dragenter','dragover'].forEach(ev => dropzone.addEventListener(ev, (e)=>{ e.preventDefault(); e.stopPropagation(); dropzone.classList.add('dragover'); }));
  ['dragleave','drop'].forEach(ev => dropzone.addEventListener(ev, (e)=>{ e.preventDefault(); e.stopPropagation(); dropzone.classList.remove('dragover'); }));

  dropzone.addEventListener('drop', (e)=>{
    if(e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
  });
}


// Signing flow
if(signBtn){
  signBtn.addEventListener('click', async ()=>{
    if(!certFile){ setMessage('Por favor cargue el certificado.', 'error'); return; }
    if(!certPassword){ setMessage('Ingrese la contraseña del certificado.', 'error'); return; }
    if(xmlFiles.length===0){ setMessage('Agregue al menos un archivo XML.', 'error'); return; }

    signBtn.disabled = true;
    setMessage('Firmando... Por favor espere');

    for(const xmlFile of xmlFiles){
      try{
        const text = await xmlFile.text();
        const formData = new FormData();
        formData.append('Certificate', certFile);
        formData.append('CertPassword', certPassword);
        formData.append('XmlContent', text);

        const response = await fetch('https://app.renotec.com.do/api/Sign/sign', { method:'POST', body: formData });
        if(!response.ok) throw new Error(`Error al firmar ${xmlFile.name}: ${response.status} ${response.statusText}`);
        const signed = await response.text();
        const blob = new Blob([signed], { type: 'application/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = xmlFile.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setMessage(`Firmado: ${xmlFile.name}`, 'success');
      }catch(err){
        setMessage(err.message, 'error');
      }
    }

    signBtn.disabled = false;
  });
}


// Accessible keyboard support for dropzone: pressing Enter opens file dialog
if(dropzone && fileInput){
  dropzone.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' ') fileInput.click();
  });
}

// initial render
renderFiles();

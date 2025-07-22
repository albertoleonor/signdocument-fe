const tboxCertificado = document.getElementById("certInput");
const tboxPass = document.getElementById("passwordInput");
const btnChooseXMLFile = document.getElementById("fileInput");
const btnsignDocument = document.getElementById("signDocumentBtn");
const lblsignResult = document.getElementById("signResult");

let certFile = null;
let password = "";
let xmlFiles = []; // Cambia a un array

tboxCertificado.addEventListener("change", function () {
  certFile = tboxCertificado.files[0];
  if (certFile) {
    tboxCertificado.setAttribute("title", certFile.name);
  }
});

tboxPass.addEventListener("change", function () {
  password = tboxPass.value;
  tboxPass.setAttribute("title", password);
});

btnChooseXMLFile.addEventListener("change", function () {
  xmlFiles = Array.from(btnChooseXMLFile.files); // Guarda todos los archivos seleccionados
  if (xmlFiles.length > 0) {
    btnChooseXMLFile.setAttribute("title", xmlFiles.map(f => f.name).join(", "));
  }
});

btnsignDocument.addEventListener("click", async function () {
  if (!certFile || !password || xmlFiles.length === 0) {
    lblsignResult.textContent = "Por favor, complete todos los campos y cargue los archivos.";
    lblsignResult.style.color = "#ea4335";
    return;
  }

  lblsignResult.textContent = "Firmando documentos, por favor espere...";
  lblsignResult.style.color = "#1a73e8";

  for (const xmlFile of xmlFiles) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      const xmlFileContent = e.target.result;
      const formData = new FormData();
      formData.append("Certificate", certFile);
      formData.append("CertPassword", password);
      formData.append("XmlContent", xmlFileContent);

      try {
        const response = await fetch("https://app.renotec.com.do/api/Sign/sign", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Error en la firma de " + xmlFile.name + ": " + response.statusText);
        }

        const result = await response.text();

        // Descargar el archivo firmado con el mismo nombre y extensión
        const blob = new Blob([result], { type: "application/xml" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = xmlFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        lblsignResult.textContent = "Firma exitosa";
        lblsignResult.style.color = "#34a853";
      } catch (error) {
        lblsignResult.textContent = error.message;
        lblsignResult.style.color = "#ea4335";
      }
    };
    reader.readAsText(xmlFile);
    // Espera a que termine la lectura antes de continuar con el siguiente archivo
    await new Promise(resolve => reader.onloadend = resolve);
  }
});

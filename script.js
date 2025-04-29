const tboxCertificado = document.getElementById("certInput");
const tboxPass = document.getElementById("passwordInput");
const btnChooseXMLFile = document.getElementById("fileInput");
const btnsignDocument = document.getElementById("signDocumentBtn");
const lblsignResult = document.getElementById("signResult");

let certFile = null;
let password = "";
let xmlFileContent = null;

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
  const file = btnChooseXMLFile.files[0];
  if (file) {
    btnChooseXMLFile.setAttribute("title", file.name);
    const reader = new FileReader();
    reader.onload = function (e) {
      xmlFileContent = e.target.result;
    };
    reader.readAsText(file);
  }
});

btnsignDocument.addEventListener("click", async function () {
  if (!certFile || !password || !xmlFileContent) {
    lblsignResult.textContent = "Por favor, complete todos los campos y cargue los archivos.";
    lblsignResult.style.color = "#ea4335";
    return;
  }

  const formData = new FormData();
  formData.append("Certificate", certFile);
  formData.append("CertPassword", password);
  formData.append("XmlContent", xmlFileContent);

  lblsignResult.textContent = "Firmando documento, por favor espere...";
  lblsignResult.style.color = "#1a73e8";

  try {
    const response = await fetch("https://app.renotec.com.do/api/Sign/sign", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error en la firma: " + response.statusText);
    }

    const result = await response.text();

    // Descargar el archivo firmado con el mismo nombre y extensión
    const xmlFile = btnChooseXMLFile.files[0];
    const originalName = xmlFile ? xmlFile.name : "documento_firmado.xml";
    const blob = new Blob([result], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    lblsignResult.textContent = "Firma exitosa";
    lblsignResult.style.color = "#34a853";
  } catch (error) {
    lblsignResult.textContent = error.message;
    lblsignResult.style.color = "#ea4335";
  }
});

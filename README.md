# Sign Document Frontend

## Descripción

Este proyecto es el frontend de una aplicación web para firmar documentos XML utilizando certificados digitales. La aplicación permite a los usuarios cargar su certificado, ingresar su contraseña y seleccionar uno o múltiples archivos XML para firmarlos digitalmente.

## Características

- Interfaz de usuario intuitiva y moderna
- Soporte para carga de certificados digitales
- Capacidad para firmar múltiples documentos XML en una sola operación
- Descarga automática de los documentos firmados
- Diseño responsivo para diferentes tamaños de pantalla

## Tecnologías utilizadas

- HTML5
- CSS3 (con diseño responsivo)
- JavaScript (Vanilla JS)
- API Fetch para comunicación con el backend

## Estructura del proyecto

```
├── index.html      # Estructura principal de la aplicación
├── styles.css      # Estilos y diseño visual
├── script.js       # Lógica de la aplicación y comunicación con el backend
└── README.md       # Documentación del proyecto
```

## Funcionamiento

1. El usuario carga su certificado digital
2. Ingresa la contraseña del certificado
3. Selecciona uno o varios archivos XML para firmar
4. Hace clic en el botón "Firmar Documento"
5. La aplicación envía los datos al backend para su procesamiento
6. Los documentos firmados se descargan automáticamente

## API Backend

Este frontend se comunica con un servicio backend en la siguiente URL:

```
https://app.renotec.com.do/api/Sign/sign
```

El backend se encarga de procesar la firma digital de los documentos XML utilizando el certificado proporcionado.

## Instalación y uso

1. Clona este repositorio
2. Abre el archivo `index.html` en tu navegador web
3. Alternativamente, puedes desplegar los archivos en cualquier servidor web

## Requisitos

- Navegador web moderno con soporte para JavaScript ES6+
- Conexión a internet para comunicarse con el backend
- Certificado digital válido para la firma de documentos

## Notas de seguridad

- La contraseña del certificado se envía al backend para el proceso de firma
- No se almacena localmente ninguna información sensible
- Se recomienda utilizar HTTPS para proteger la transmisión de datos sensibles
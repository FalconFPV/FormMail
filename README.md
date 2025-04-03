# Proyecto de Envío de Correos con Nodemailer

Este proyecto proporciona una API que permite enviar correos electrónicos a través de Nodemailer. Está diseñado para ser usado como backend de un formulario de contacto, donde los usuarios pueden enviar su nombre, correo electrónico, teléfono y mensaje.

## Funcionalidad

La API está construida con Node.js y utiliza la librería **Nodemailer** para enviar correos electrónicos. Recibe una solicitud `POST` con los datos del usuario, valida que los datos obligatorios estén presentes, y luego envía un correo electrónico al usuario confirmando que su mensaje ha sido recibido.

El correo enviado también se copia al propietario de la aplicación a través del campo `cc`.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript del lado del servidor.
- **Nodemailer**: Librería para enviar correos electrónicos desde una aplicación Node.js.
- **dotenv**: Librería para gestionar variables de entorno, como el correo electrónico y la contraseña necesarios para enviar correos.
- **Vercel**: Despliegue de la aplicación como una función serverless.

## Instalación

Para instalar y ejecutar el proyecto localmente, sigue estos pasos:

### 1. Clonar el repositorio

Primero, clona el repositorio en tu máquina local:

```bash
git clone https://github.com/tu_usuario/proyecto-enviar-correos.git
cd proyecto-enviar-correos
```

### 2. Instalar dependencias

Instala las dependencias necesarias utilizando npm:

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo .env en la raíz del proyecto con las siguientes variables de entorno:

```bash
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_gmail
RECIPIENT_EMAIL=correo_destino@example.com
```

Nota: Asegúrate de que la cuenta de correo configurada tenga acceso a aplicaciones menos seguras habilitado, o usa la autenticación OAuth2 para mayor seguridad.

### 4. Ejecutar el servidor localmente

Para probar la API localmente, ejecuta el siguiente comando:

```bash
Copiar
Editar
npm run dev
```

La API estará disponible en http://localhost:5000/api/send-email.

### Uso

## Realizar una solicitud POST

Para enviar un correo electrónico, realiza una solicitud POST a la ruta /api/send-email con el siguiente cuerpo de solicitud (en formato JSON):

```bash
{
  "name": "Juan Pérez",
  "email": "juanperez@example.com",
  "phone": "123456789",
  "message": "Hola, estoy interesado en tus servicios."
}
```

La solicitud debe contener los siguientes campos:

- **name**: El nombre del usuario (obligatorio).
- **email**: El correo electrónico del usuario (obligatorio).
- **phone**: El teléfono del usuario (opcional).
- **message**: El mensaje enviado por el usuario (obligatorio).

## Ejemplo de solicitud en fetch (Frontend):

```bash
fetch('http://localhost:5000/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Juan Pérez',
    email: 'juanperez@example.com',
    phone: '123456789',
    message: 'Hola, estoy interesado en tus servicios.',
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Respuestas de la API
La API devolverá una respuesta JSON con el estado de la operación:

Respuesta exitosa (código 200):

```bash
{
  "success": true,
  "message": "Correo enviado con éxito"
}
```

Respuesta con error (código 400):
Si faltan datos obligatorios en la solicitud (nombre, correo electrónico o mensaje), la respuesta será:

```bash
{
  "success": false,
  "message": "Faltan datos obligatorios. Asegúrese de que 'Nombre', 'Correo electrónico' y 'Mensaje' estén completos."
}
```

Respuesta con error de servidor (código 500):
Si ocurre un error al intentar enviar el correo, la respuesta será:

```bash
{
  "success": false,
  "message": "Error al enviar el correo"
}
```

### Despliegue en Vercel

Este proyecto está preparado para ser desplegado en Vercel como una función serverless. Para desplegarlo:

### Pasos para el Despliegue en Vercel

1. **Crear una cuenta en Vercel**  
    Si aún no tienes una cuenta, regístrate en [Vercel](https://vercel.com/).

2. **Conectar tu repositorio**  
    Vincula tu repositorio de GitHub, GitLab o Bitbucket a Vercel.

3. **Configurar variables de entorno**  
    En el panel de configuración del proyecto en Vercel, agrega las siguientes variables de entorno necesarias para el funcionamiento de la API:

    - `EMAIL_USER`: Tu dirección de correo electrónico.
    - `EMAIL_PASS`: La contraseña o token de acceso de tu cuenta de correo.
    - `RECIPIENT_EMAIL`: El correo electrónico que recibirá las copias de los mensajes.

4. **Desplegar el proyecto**  
    Una vez configurado, realiza el despliegue. Vercel generará automáticamente una URL para tu API, como `https://formmail.vercel.app/api/send-email`.

5. **Probar la API**  
    Usa herramientas como Postman o fetch desde el frontend para probar la funcionalidad de la API en la URL proporcionada.

### Seguridad

Contraseña: No compartas ni pongas tu contraseña de correo electrónico directamente en el código. Usa herramientas como las variables de entorno o la autenticación OAuth2 para mayor seguridad.

## CORS: 

La API está configurada para permitir solicitudes solo desde un origen específico (http://localhost:3000 en desarrollo). Puedes cambiar esto según sea necesario.


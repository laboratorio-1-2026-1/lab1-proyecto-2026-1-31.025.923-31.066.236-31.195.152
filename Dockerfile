# versión ligera de Node.js
FROM node:18-alpine

# Creamos el directorio del proyecto
WORKDIR /app

# Copiamos solo los archivos de dependencias primero 
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos lo demas
COPY . .

# Exponemos el puerto que usa la API
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
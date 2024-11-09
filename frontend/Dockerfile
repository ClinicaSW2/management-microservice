# Usa Node.js 18 como base
FROM node:18

# Configura el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración de la aplicación
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto que utiliza Angular en modo de desarrollo
EXPOSE 4200

# Inicia la aplicación en modo de desarrollo
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]

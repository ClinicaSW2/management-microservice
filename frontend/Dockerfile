# Usa una imagen de Node.js 18 como base
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de la aplicación al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Compila el proyecto Next.js
RUN npm run build

# Expone el puerto que utiliza Next.js
EXPOSE 3000

# Inicia la aplicación en modo de producción
CMD ["npm", "start"]

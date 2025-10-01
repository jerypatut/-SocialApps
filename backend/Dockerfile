
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json dan lock file dulu (agar cache layer npm install)
COPY package*.json ./

# Install deps
RUN npm install

# Install nodemon global (opsional)
RUN npm install -g nodemon

# Copy sisa source code
COPY . .

# Port yang digunakan backend
EXPOSE 3001

# Start backend dengan nodemon
CMD ["npm", "run", "dev"]

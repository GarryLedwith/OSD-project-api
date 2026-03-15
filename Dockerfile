FROM node:20-alpine

WORKDIR /app

# Copy package files 
COPY package*.json ./

# Install all dependencies 
RUN npm install

# Copy source code
COPY . .

# Compile TypeScript to build/
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

EXPOSE 3000

CMD ["node", "build/server.js"]

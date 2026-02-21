FROM node:22-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    lilypond \
    fluidsynth \
    ffmpeg \
    fluid-soundfont-gm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy app source
COPY server/ ./server/
COPY public/ ./public/

EXPOSE 3000

CMD ["node", "server/src/index.js"]

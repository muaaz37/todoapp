# ----------- BUILD STAGE ----------
FROM node:18-alpine AS build

WORKDIR /app

# ----- Server - Installiere Abhängigkeiten und baue den Server
COPY server_api/package*.json server_api/
WORKDIR /app/server_api
RUN npm install
COPY server_api/ .
RUN npm run build

# ----- Client - Installiere Abhängigkeiten und baue den Client
WORKDIR /app
COPY client_app/package*.json client_app/
WORKDIR /app/client_app
RUN npm install
COPY client_app/ .
RUN npm run build

# ----------- PRODUCTION STAGE ----------
FROM node:18-alpine

WORKDIR /app

# Stelle sicher, dass nur die build-Ordner und die package.json kopiert werden
COPY --from=build /app/server_api/build/ /app/server_api/build/
COPY --from=build /app/client_app/build/ /app/client_app/build/
COPY --from=build /app/server_api/package*.json /app/server_api/

# Installiere Produktionsabhängigkeiten für den Server
WORKDIR /app/server_api
RUN npm install --omit=dev

# Setze Umgebungsvariablen und expose den Port
ENV HOST=0.0.0.0
EXPOSE 8080

# Starte nur den Server
CMD ["npm", "start"]

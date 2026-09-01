#!/bin/bash
# Naviguer vers le projet
cd /chemin/vers/projet-react

# Build Docker local
docker build -t admin/admin-facscience .

# Relancer le conteneur avec docker-compose
docker compose up -d


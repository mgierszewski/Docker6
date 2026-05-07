# Skrypt uruchamiający środowisko Product Dashboard bez docker-compose

# 1. Usuń stare kontenery (jeśli istnieją)
try { docker rm -f backend } catch {}
try { docker rm -f frontend } catch {}

# 2. Usuń stare obrazy (jeśli istnieją)
try { docker rmi marcinespc/product-dashboard-backend:latest marcinespc/product-dashboard-backend:v1 } catch {}
try { docker rmi marcinespc/product-dashboard-frontend:latest marcinespc/product-dashboard-frontend:v1 } catch {}

# 3. Zbuduj obrazy
cd Backend

docker build -t marcinespc/product-dashboard-backend:latest -t marcinespc/product-dashboard-backend:v1 --build-arg IMAGE_VERSION=v1 .

cd ../Frontend

docker build -t marcinespc/product-dashboard-frontend:latest -t marcinespc/product-dashboard-frontend:v1 --build-arg NGINX_VERSION=v1 .

cd ..

# 4. Utwórz sieć Docker (jeśli nie istnieje)
try { docker network create appnet } catch {}

# 5. Uruchom kontenery

docker run -d --name backend --network appnet marcinespc/product-dashboard-backend:v1
docker run -d --name frontend --network appnet -p 80:80 marcinespc/product-dashboard-frontend:v1

# 6. Testy
curl http://localhost/
curl http://localhost/products.html
curl http://localhost/stats.html
curl http://localhost/api/stats

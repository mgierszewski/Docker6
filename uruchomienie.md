# Instrukcja uruchomienia środowiska Product Dashboard

## 1. Budowanie obrazów

### Backend
```
docker build -t twojrepo/product-backend:latest --build-arg IMAGE_VERSION=v1 ./Zadanie4/Backend
```

### Frontend
```
docker build -t twojrepo/product-frontend:latest --build-arg NGINX_VERSION=v1 ./Zadanie4/Frontend
```

## 2. Tagowanie i push do rejestru (np. Docker Hub)

```
docker tag twojrepo/product-backend:latest twojrepo/product-backend:v1
docker tag twojrepo/product-frontend:latest twojrepo/product-frontend:v1

docker push twojrepo/product-backend:v1
docker push twojrepo/product-frontend:v1
```

## 3. Pull obrazów (na czystym środowisku)

```
docker pull twojrepo/product-backend:v1
docker pull twojrepo/product-frontend:v1
```

## 4. Uruchamianie środowiska (docker network + kontenery)

```
docker network create product-demo

docker run -d --name backend --network product-demo \
  -e INSTANCE_ID=instance-1 -e NODE_ENV=production -e PORT=3000 \
  twojrepo/product-backend:v1

docker run -d --name frontend --network product-demo -p 8080:80 \
  twojrepo/product-frontend:v1
```
> Uwaga: Backend nie publikuje portu na hosta!

## 5. Sprawdzenie warstw backendu

```
docker history --no-trunc twojrepo/product-backend:v1
```

## 6. Testowanie endpointów

- Strona główna: http://localhost:8080/
- Lista produktów: http://localhost:8080/products.html
- Statystyki: http://localhost:8080/stats.html
- API statystyk: http://localhost:8080/api/stats

Możesz użyć np. curl:
```
curl http://localhost:8080/api/stats
```

---

Zmień `twojrepo` na swoją nazwę użytkownika/repozytorium w Docker Hub lub innym rejestrze.

# Instrukcja uruchomienia i publikacji kontenerów

## 1. Budowanie obrazów

```sh
docker-compose build
```

## 2. Logowanie do Docker Hub

```sh
docker login -u marcinespc
```

## 3. Tagowanie obrazów

```sh
docker tag docker2-frontend marcinespc/frontend:latest
docker tag docker2-frontend marcinespc/frontend:v1
docker tag docker2-backend marcinespc/backend:latest
docker tag docker2-backend marcinespc/backend:v1
```

## 4. Wysyłanie obrazów do Docker Hub

```sh
docker push marcinespc/frontend:latest
docker push marcinespc/frontend:v1
docker push marcinespc/backend:latest
docker push marcinespc/backend:v1
```

## 5. Usuwanie lokalnych obrazów (opcjonalnie)

```sh
docker rmi marcinespc/frontend:latest marcinespc/frontend:v1
docker rmi marcinespc/backend:latest marcinespc/backend:v1
```

## 6. Pobieranie obrazów z Docker Hub

```sh
docker pull marcinespc/frontend:latest
docker pull marcinespc/backend:latest
```

## 7. Uruchamianie środowiska

```sh
docker-compose up
```

- Strona dostępna na: http://localhost
- Frontend (publiczny): serwis `frontend`
- Backend (tylko w sieci Dockera): serwis `backend`

---

**Uwaga:**
- Nie publikuj portu backendu na zewnątrz.
- Frontend jest serwowany przez Nginx i proxy do backendu przez `/api/`.
- Obrazy taguj jako `v1` i `latest`.
powershell -ExecutionPolicy Bypass -File start.ps1
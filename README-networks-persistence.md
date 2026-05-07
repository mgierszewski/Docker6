# Dokumentacja uruchomienia i weryfikacji środowiska Product Dashboard (Docker, sieci, persystencja, rejestr)

## 1. Zmodyfikowany backend (persistencja danych)
Produkty są zapisywane i odczytywane z pliku `/data/items.json` dzięki volume. Fragment kodu:
```js
const DATA_FILE = '/data/items.json';
function loadItems() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}
function saveItems(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}
let items = loadItems();
// ...
app.get('/items', (req, res) => {
  items = loadItems();
  res.json(items);
});
app.post('/items', (req, res) => {
  // ...
  items.push({ name, price, manufacturer, category, description });
  saveItems(items);
  res.status(201).json({ ok: true });
});
```

## 2. Sekwencja komend do uruchomienia środowiska
```sh
# Sieci
 docker network create front-net
 docker network create back-net

# Volume do persystencji
 docker volume create items-data

# Backend (tylko back-net, z volume, bez -p)
 docker run -d --name backend --network back-net -v items-data:/data marcinespc/product-dashboard-backend:v2

# Frontend (nginx) w obu sieciach
 docker run -d --name frontend --network front-net -p 80:80 marcinespc/product-dashboard-frontend:v2
 docker network connect back-net frontend

# (Opcjonalnie) Kontener testowy do izolacji
 docker run -it --rm --network front-net alpine sh
# W środku: ping backend lub wget backend:3000

# Publikacja obrazów do Docker Hub
 docker push marcinespc/product-dashboard-backend:v2
 docker push marcinespc/product-dashboard-frontend:v2
```

## 3. Dowód persystencji
1. Dodaj produkt przez frontend lub:
   ```sh
   curl -X POST -H "Content-Type: application/json" -d '{"name":"Test","price":1,"manufacturer":"A","category":"B"}' http://localhost/api/items
   ```
2. Usuń backend:
   ```sh
   docker rm -f backend
   ```
3. Uruchom backend ponownie:
   ```sh
   docker run -d --name backend --network back-net -v items-data:/data marcinespc/product-dashboard-backend:v2
   ```
4. Sprawdź produkty:
   ```sh
   curl http://localhost/api/items
   ```
**Oczekiwany wynik:**
```
[{"name":"Test","price":1,"manufacturer":"A","category":"B","description":null}]
```

## 4. Dowód izolacji sieciowej
```sh
docker run -it --rm --network front-net alpine sh
# W środku:
ping backend
wget backend:3000
```
**Oczekiwany wynik:**
```
ping: bad address 'backend'
wget: bad address 'backend'
```

## 5. Dowód publikacji w rejestrze
```sh
docker push marcinespc/product-dashboard-backend:v2
docker push marcinespc/product-dashboard-frontend:v2
```
**Oczekiwany wynik:**
```
The push refers to repository [docker.io/marcinespc/product-dashboard-backend]
...
v2: digest: sha256:... size: 1573
```

## 6. Wynik końcowego testu
```sh
curl http://localhost/api/items
curl http://localhost/api/stats
```
**Oczekiwany wynik:**
```
curl http://localhost/api/items
[{"name":"Test","price":1,"manufacturer":"A","category":"B","description":null}]

curl http://localhost/api/stats
{"count":1,"instanceId":"...","manufacturers":["A"],"categories":["B"],"avgPrice":"1.00"}
```

---

**Wstaw screeny terminala i wyniki poleceń w odpowiednich sekcjach powyżej.**

W razie potrzeby mogę dodać sekcję z troubleshooting lub checklistę do oddania.

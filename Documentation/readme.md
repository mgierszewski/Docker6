Jesteś członkiem zespołu DevOps odpowiedzialnym za przygotowanie kompletnego środowiska demonstracyjnego dla aplikacji webowej. Zespół frontendowy dostarczył prosty interfejs w postaci statycznych plików HTML/CSS/JS, a zespół backendowy oczekuje, że aplikacja zostanie uruchomiona w kontenerach Docker, poprawnie zintegrowana przez Nginx i opublikowana do rejestru obrazów.

Przygotuj pełne rozwiązanie dla aplikacji typu Product Dashboard składającej się z frontendu opartego na statycznych plikach HTML oraz backendu Node.js/Express.

Wymagania funkcjonalne aplikacji:

Frontend ma być zbudowany wyłącznie ze statycznych plików HTML, CSS i czystego JavaScript (bez frameworków).
Aplikacja ma zawierać co najmniej trzy podstrony: stronę główną (index.html), listę produktów (products.html) oraz widok statystyk (stats.html).
Podstrona listy produktów ma pobierać dane z API przy użyciu fetch i umożliwiać dodanie nowego produktu przez formularz HTML.
Backend ma udostępniać endpointy GET /items, POST /items oraz GET /stats.
Podstrona statystyk ma prezentować co najmniej liczbę wszystkich produktów oraz identyfikator instancji backendu, która obsłużyła żądanie.
Wymagania konteneryzacji i wdrożenia:

Frontend ma zostać umieszczony w obrazie Nginx w wieloetapowym Dockerfile: etap kopiowania plików statycznych oraz etap serwowania ich przez Nginx.
Nginx ma serwować pliki statyczne aplikacji oraz przekazywać ruch z prefiksu /api/ do backendu.
Dla endpointu GET /api/stats należy skonfigurować cache po stronie Nginx na 30 sekund oraz zwracać nagłówek X-Cache-Status.
Backend ma mieć osobny Dockerfile i działać wyłącznie w sieci wewnętrznej Dockera, bez publikowania portu na hosta.
Oba obrazy mają zostać otagowane co najmniej jako v1 oraz latest, opublikowane do rejestru, a następnie usunięte lokalnie i pobrane ponownie z rejestru.
Wymagane artefakty w odpowiedzi:

struktura katalogów projektu
zawartość kluczowych plików aplikacji frontendowej i backendowej
Dockerfile frontendu i backendu
konfiguracja Nginx
komendy docker build, docker tag, docker push, docker pull oraz docker run
wyniki testów potwierdzających działanie adresów /, /products.html, /stats.html oraz /api/stats
Rozwiązanie ma działać po usunięciu lokalnych obrazów i ponownym uruchomieniu środowiska wyłącznie na podstawie obrazów pobranych z rejestru.
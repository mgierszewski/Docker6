// products.js
// Pobieranie i dodawanie produktów przez API

document.addEventListener('DOMContentLoaded', () => {

    const listDiv = document.getElementById('products-list');
    const form = document.getElementById('add-product-form');
    const inputName = document.getElementById('product-name');
    const inputPrice = document.getElementById('product-price');
    const inputManufacturer = document.getElementById('product-manufacturer');
    const inputCategory = document.getElementById('product-category');
    const inputDescription = document.getElementById('product-description');

    // Komunikaty
    let msgDiv = document.getElementById('msg');
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.id = 'msg';
        form.parentNode.insertBefore(msgDiv, form);
    }

    function showMsg(text, type = 'info') {
        msgDiv.textContent = text;
        msgDiv.className = type;
        msgDiv.style.display = 'block';
        setTimeout(() => { msgDiv.style.display = 'none'; }, 2500);
    }

    function setLoading(isLoading) {
        if (isLoading) {
            listDiv.innerHTML = '<div class="loader"></div> Ładowanie...';
        }
    }

    function loadProducts() {
        setLoading(true);
        fetch('/api/items')
            .then(res => {
                if (!res.ok) throw new Error('Błąd pobierania produktów');
                return res.json();
            })
            .then(data => {
                if (data.length === 0) {
                    listDiv.innerHTML = '<div class="empty">Brak produktów.</div>';
                } else {
                    listDiv.innerHTML = `<table class="products-table"><thead><tr><th>#</th><th>Nazwa</th><th>Cena</th><th>Producent</th><th>Kategoria</th><th>Opis</th><th>Usuń</th></tr></thead><tbody>` +
                        data.map((item, i) =>
                            `<tr><td>${i+1}</td><td>${item.name}</td><td>${item.price} zł</td><td>${item.manufacturer}</td><td>${item.category}</td><td>${item.description || ''}</td><td><button class="delete-btn" data-id="${i}">Usuń</button></td></tr>`
                        ).join('') + '</tbody></table>';
                    // Obsługa usuwania
                    document.querySelectorAll('.delete-btn').forEach(btn => {
                        btn.addEventListener('click', function(e) {
                            e.preventDefault();
                            const idx = this.getAttribute('data-id');
                            fetch(`/api/items/${idx}`, { method: 'DELETE' })
                                .then(res => {
                                    if (!res.ok) throw new Error('Błąd usuwania produktu');
                                    showMsg('Produkt usunięty!', 'success');
                                    loadProducts();
                                })
                                .catch(() => {
                                    showMsg('Nie udało się usunąć produktu', 'error');
                                });
                        });
                    });
                }
            })
            .catch(() => {
                listDiv.innerHTML = '<div class="error">Nie udało się pobrać produktów.</div>';
            });
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = inputName.value.trim();
        const price = inputPrice.value.trim();
        const manufacturer = inputManufacturer.value.trim();
        const category = inputCategory.value.trim();
        const description = inputDescription.value.trim();
        if (!name || !price || !manufacturer || !category) {
            showMsg('Wszystkie pola są wymagane!', 'error');
            return;
        }
        fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, manufacturer, category, description })
        })
        .then(res => {
            if (!res.ok) throw new Error('Błąd dodawania produktu');
            showMsg('Produkt dodany!', 'success');
            inputName.value = '';
            inputPrice.value = '';
            inputManufacturer.value = '';
            inputCategory.value = '';
            inputDescription.value = '';
            loadProducts();
        })
        .catch(() => {
            showMsg('Nie udało się dodać produktu', 'error');
        });
    });

    loadProducts();
});

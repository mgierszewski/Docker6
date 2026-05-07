document.addEventListener('DOMContentLoaded', () => {
    const statsDiv = document.getElementById('stats');
    fetch('/api/stats')
        .then(res => res.json())
        .then(data => {
            statsDiv.innerHTML = `
                <p><b>Liczba produktów:</b> ${data.count}</p>
                <p><b>ID instancji backendu:</b> ${data.instanceId}</p>
                <p><b>Liczba producentów:</b> ${data.manufacturers?.length || 0}</p>
                <p><b>Liczba kategorii:</b> ${data.categories?.length || 0}</p>
                <p><b>Średnia cena:</b> ${data.avgPrice} zł</p>
                <p><b>Producenci:</b> ${data.manufacturers?.join(', ') || '-'}</p>
                <p><b>Kategorie:</b> ${data.categories?.join(', ') || '-'}</p>
            `;
        });
});

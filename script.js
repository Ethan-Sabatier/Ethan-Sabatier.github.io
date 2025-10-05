document.querySelectorAll('.menu-item, .btexpe, .btproj, .lien').forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault(); // Empêche le rechargement de la page
        const target = item.getAttribute('data-target'); // Utilise 'item' directement
        const targetPage = document.getElementById(target); // Récupère la page cible

        if (targetPage) { // Vérifie que la page existe
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active'); // Ferme toutes les pages
            });
            targetPage.classList.add('active'); // Affiche la page cible
        }
    });
});

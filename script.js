// Burger menu
const toggle = document.querySelector(".header__toggle");
const nav = document.querySelector(".nav");
const bars = document.querySelectorAll(".header__bar");

if (toggle && nav) {
    toggle.addEventListener("click", () => {
        nav.classList.toggle("nav--open");
        toggle.classList.toggle("is-open");

        if (toggle.classList.contains("is-open")) {
            bars[0].style.transform = "translateY(6px) rotate(45deg)";
            bars[1].style.transform = "translateY(-6px) rotate(-45deg)";
        } else {
            bars[0].style.transform = "";
            bars[1].style.transform = "";
        }
    });

    nav.addEventListener("click", event => {
        if (event.target.classList.contains("nav__link")) {
            nav.classList.remove("nav--open");
            toggle.classList.remove("is-open");
            bars[0].style.transform = "";
            bars[1].style.transform = "";
        }
    });
}

// Mise à jour de l'année du footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Surbrillance du menu en fonction de la section visible
const sections = document.querySelectorAll("main .section");
const navLinks = document.querySelectorAll(".nav__link");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach(link => {
                link.classList.toggle(
                    "nav__link--active",
                    link.getAttribute("href") === "#" + id
                );
            });
        }
    });
}, {
    threshold: 0.4
});

sections.forEach(section => observer.observe(section));

// Effet d'apparition au scroll
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

sections.forEach(section => revealObserver.observe(section));

// Sliders (Projets + Expériences)
document.querySelectorAll(".projects").forEach(slider => {
    const viewport = slider.querySelector(".projects__viewport");
    const track = slider.querySelector(".projects__track");
    const cards = slider.querySelectorAll(".projects__card");
    const prev = slider.querySelector(".projects__arrow--prev");
    const next = slider.querySelector(".projects__arrow--next");

    if (!viewport || !track || cards.length === 0) return;

    let index = 0;

    function getGap() {
        const style = getComputedStyle(track);
        const gap = style.columnGap || style.gap || "0";
        return parseFloat(gap);
    }

    function updateSlider() {
        // Remplacement par offsetWidth pour obtenir la vraie largeur structurelle
        const viewportWidth = viewport.offsetWidth; 
        const cardWidth = cards[0].offsetWidth; 
        const gap = getGap();

        // On centre la carte active dans le viewport
        const centerOffset = (viewportWidth - cardWidth) / 2;
        const translate = centerOffset - index * (cardWidth + gap);

        track.style.transform = `translateX(${translate}px)`;

        // Simplification de la boucle : seule la classe is-active est nécessaire
        cards.forEach((card, i) => {
            card.classList.remove("is-active");
            if (i === index) card.classList.add("is-active");
        });

        if (prev) prev.disabled = index === 0;
        if (next) next.disabled = index === cards.length - 1;
    }

    if (prev) {
        prev.addEventListener("click", () => {
            if (index > 0) {
                index -= 1;
                updateSlider();
            }
        });
    }

    if (next) {
        next.addEventListener("click", () => {
            if (index < cards.length - 1) {
                index += 1;
                updateSlider();
            }
        });
    }

    window.addEventListener("resize", updateSlider);
    updateSlider();
});

// Widget Threat Intelligence via Cloudflare Worker personnel
const cveData = document.getElementById('cve-data');

if (cveData) {
    // RENTRE ICI L'URL DE TON WORKER DEPLOYÉ
    const workerUrl = 'https://cert-fr-proxy.sabatierethan698.workers.dev/';

    fetch(workerUrl)
        .then(response => response.text()) // On récupère la réponse sous forme de chaîne de caractères
        .then(str => new window.DOMParser().parseFromString(str, "text/xml")) // On la transforme en document XML manipulable
        .then(data => {
            const items = data.querySelectorAll("item"); // Récupère toutes les balises <item> (les alertes)
            
            if (items.length > 0) {
                let alertsHtml = '';
                
                // On transforme la NodeList en tableau pour pouvoir l'isoler aux 4 premiers éléments
                const latestThreats = Array.from(items).reverse().slice(0, 4);

                latestThreats.forEach(item => {
                    // Extraction des données textuelles du XML
                    const title = item.querySelector("title").textContent;
                    const link = item.querySelector("link").textContent;
                    const pubDateText = item.querySelector("pubDate").textContent;
                    
                    // Formatage de la date
                    const pubDate = new Date(pubDateText).toLocaleDateString('fr-FR', {
                        day: '2-digit', month: '2-digit'
                    });

                    // Injection dans le template HTML
                    alertsHtml += `
                        <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #1e293b;">
                            <div style="color: #ef4444; font-size: 0.75rem; margin-bottom: 3px;">[ALERTE] - ${pubDate}</div>
                            <a href="${link}" target="_blank" rel="noreferrer" style="color: #f8fafc; font-weight: 600; font-size: 0.8rem; text-decoration: none; display: block; transition: color 0.2s;" onmouseover="this.style.color='#38bdf8'" onmouseout="this.style.color='#f8fafc'">
                                ${title}
                            </a>
                        </div>
                    `;
                });

                cveData.innerHTML = alertsHtml;
            } else {
                cveData.innerHTML = `<span style="color: #eab308;">[Status]</span> Aucun incident critique détecté récemment.`;
            }
        })
        .catch(() => {
            cveData.innerHTML = `<span style="color: #ef4444;">[Erreur]</span> Impossible de joindre le Worker de threat intelligence.`;
        });
}

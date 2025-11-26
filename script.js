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
        const viewportWidth = viewport.getBoundingClientRect().width;
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = getGap();

        // on centre la carte active dans le viewport
        const centerOffset = (viewportWidth - cardWidth) / 2;
        const translate = centerOffset - index * (cardWidth + gap);

        track.style.transform = `translateX(${translate}px)`;

        cards.forEach((card, i) => {
            card.classList.remove("is-active", "is-next");
            if (i === index) card.classList.add("is-active");
            if (i === index + 1) card.classList.add("is-next");
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

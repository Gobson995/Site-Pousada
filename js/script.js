/* --- Lógica do Menu Mobile --- */
const mobileMenu = () => {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu li');

    // Toggle (abrir/fechar) o menu
    burger.addEventListener('click', () => {
        // Ativa a classe 'nav-active' no menu
        nav.classList.toggle('nav-active');

        // Animação dos links (opcional, mas dá um efeito bom)
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Animação do ícone burger
        burger.classList.toggle('toggle');
    });

    // Fecha o menu ao clicar em um link (para SPAs)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                
                // Reseta animação dos links
                navLinks.forEach(link => link.style.animation = '');
            }
        });
    });
}

// Inicializa a função do menu
mobileMenu();

/* Para adicionar a animação 'navLinkFade' que usei acima,
   adicione este @keyframes no seu CSS:
*/

/*
@keyframes navLinkFade {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0px);
    }
}
*/
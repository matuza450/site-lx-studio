document.addEventListener('DOMContentLoaded', () => {
    // --- Contador de Likes (Funcionalidade) ---
    const likeButtons = document.querySelectorAll('.like-btn');

    likeButtons.forEach(button => {
        const projectId = button.dataset.id;
        const likeCountSpan = button.querySelector('.like-count');
        const iconHeart = button.querySelector('.icon-heart');

        // Carregar likes do localStorage
        let likes = parseInt(localStorage.getItem(`likes_${projectId}`)) || 0;
        likeCountSpan.textContent = likes;

        // Verificar se o usuário já curtiu
        let hasLiked = localStorage.getItem(`hasLiked_${projectId}`) === 'true';
        if (hasLiked) {
            button.classList.add('liked');
            iconHeart.textContent = '❤️'; // Coração sólido se já curtiu
        } else {
            iconHeart.textContent = '🤍'; // Coração vazio se não curtiu
        }

        button.addEventListener('click', () => {
            if (hasLiked) {
                // Se já curtiu, descurtir
                likes--;
                hasLiked = false;
                button.classList.remove('liked');
                iconHeart.textContent = '🤍';
            } else {
                // Se não curtiu, curtir
                likes++;
                hasLiked = true;
                button.classList.add('liked');
                iconHeart.textContent = '❤️';
            }
            likeCountSpan.textContent = likes;

            // Salvar no localStorage
            localStorage.setItem(`likes_${projectId}`, likes);
            localStorage.setItem(`hasLiked_${projectId}`, hasLiked);
        });
    });

    // --- Filtro de Projetos (Melhorado) ---
    const filterButtons = document.querySelectorAll('.filtros button');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões e adiciona ao clicado
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filtro;

            portfolioCards.forEach(card => {
                if (filter === 'todos' || card.dataset.categoria === filter) {
                    card.style.display = 'block'; // Mostra o card
                } else {
                    card.style.display = 'none'; // Esconde o card
                }
            });
        });
    });

    // --- Zoom na Imagem do Projeto (Modal) ---
    const body = document.body; // Para impedir scroll quando o modal estiver ativo
    const portfolioGrid = document.querySelector('.portfolio-grid');

    // Cria o overlay do modal uma única vez
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    body.appendChild(modalOverlay);

    modalOverlay.addEventListener('click', (e) => {
        // Fecha o modal se clicar fora da imagem
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            body.style.overflow = ''; // Habilita o scroll novamente
        }
    });

    portfolioGrid.addEventListener('click', (e) => {
        const clickedImg = e.target.closest('.portfolio-card img');
        if (clickedImg) {
            // Cria o conteúdo do modal (imagem e botão de fechar)
            const modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');

            const fullImg = document.createElement('img');
            fullImg.src = clickedImg.src; // Usa a mesma URL da imagem original
            fullImg.alt = clickedImg.alt;

            const closeButton = document.createElement('button');
            closeButton.classList.add('modal-close');
            closeButton.textContent = '✕';
            closeButton.addEventListener('click', () => {
                modalOverlay.classList.remove('active');
                body.style.overflow = '';
            });

            // Limpa o conteúdo anterior e adiciona o novo
            modalOverlay.innerHTML = ''; 
            modalContent.appendChild(fullImg);
            modalContent.appendChild(closeButton);
            modalOverlay.appendChild(modalContent);

            modalOverlay.classList.add('active');
            body.style.overflow = 'hidden'; // Impede o scroll da página
        }
    });

    // Fechar modal com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            modalOverlay.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Adiciona classe 'active' ao botão 'Todos' por padrão
    const allButton = document.querySelector('.filtros button[data-filtro="todos"]');
    if (allButton) {
        allButton.classList.add('active');
    }
});
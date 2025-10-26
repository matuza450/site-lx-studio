document.addEventListener('DOMContentLoaded', () => { // APENAS UM DOMContentLoaded!

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


    // --- Seletores Principais (Buscamos uma vez) ---
    const body = document.body;
    const filterContainer = document.querySelector('.filtros');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    // --- Filtro de Projetos (Profissional com Event Delegation) ---

    // 1. Define o botão 'Todos' como ativo inicialmente
    let activeButton = filterContainer.querySelector('button[data-filtro="todos"]');
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // 2. Adiciona UM listener no container pai (Event Delegation)
    filterContainer.addEventListener('click', (e) => {
        // Encontra o botão que foi clicado
        const clickedButton = e.target.closest('button');

        // Se não clicou em um botão ou clicou no que já está ativo, para
        if (!clickedButton || clickedButton === activeButton) {
            return;
        }

        // 3. Gerencia o estado 'active'
        if (activeButton) {
            activeButton.classList.remove('active');
        }
        clickedButton.classList.add('active');
        activeButton = clickedButton; // Atualiza o botão ativo

        const filter = clickedButton.dataset.filtro;

        // 4. Filtra os cards usando classes CSS
        portfolioCards.forEach(card => {
            const isVisible = (filter === 'todos' || card.dataset.categoria === filter);
            // 'toggle' é mais limpo que 'add'/'remove' com 'if/else'
            card.classList.toggle('hidden', !isVisible);
        });
    });

    // --- Modal de Zoom (Performático: Criado uma única vez) ---

    // 1. Cria a estrutura completa do modal no carregamento da página
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalImage = document.createElement('img');

    const modalClose = document.createElement('button');
    modalClose.className = 'modal-close';
    modalClose.textContent = '✕'; // '✕' é um 'X' de fechar melhor que 'x'

    // Monta a estrutura
    modalContent.append(modalImage, modalClose);
    modalOverlay.appendChild(modalContent);
    body.appendChild(modalOverlay);

    // 2. Funções limpas para abrir e fechar o modal
    const openModal = (imgSrc, imgAlt) => {
        modalImage.src = imgSrc; // Apenas atualiza o 'src' da imagem
        modalImage.alt = imgAlt;
        modalOverlay.classList.add('active');
        body.style.overflow = 'hidden'; // Impede scroll
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        body.style.overflow = ''; // Libera scroll
    };

    // 3. Listeners para abrir e fechar
    portfolioGrid.addEventListener('click', (e) => {
        // Delegação de evento para as imagens dentro da grid
        const clickedImg = e.target.closest('.portfolio-card img');
        if (clickedImg) {
            openModal(clickedImg.src, clickedImg.alt);
        }
    });

    modalOverlay.addEventListener('click', (e) => {
        // Fecha apenas se clicar no fundo (overlay), não no conteúdo
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        // Fecha com a tecla 'Escape'
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

}); // <-- Este é o único fechamento do DOMContentLoaded necessário
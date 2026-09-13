const createCroppedDetailViews = image => [
    { label: 'Full View', image, zoom: 1, position: 'center' },
    { label: 'Close-Up', image, zoom: 1.55, position: 'center' },
    { label: 'Detail View', image, zoom: 2, position: '60% 40%' },
    { label: 'Alternate View', image, zoom: 1.4, position: '35% 60%' }
];

const createRealDetailViews = images => images.map((image, index) => ({
    label: `Detail View ${index + 1}`,
    image,
    zoom: 1,
    position: 'center'
}));

const pathartCases = [
    {
        id: 'pathart-001',
        caseNumber: 'Case 01',
        title: 'Psoriasiform Dermatitis',
        pathArtTitle: 'Psoriasiform Dermatitis',
        description: 'Microscopic H&E section highlighting psoriasiform tissue architecture and characteristic inflammatory changes.',
        category: 'Inflammatory Dermatoses',
        stain: 'H&E',
        magnification: '20x',
        caseType: 'Biopsy',
        caseId: 'BD-CASE-001',
        dateAcquired: 'May 12, 2024',
        mainImage: '../assets/images/pathart/detail-main.png',
        detailViews: createRealDetailViews(['../assets/images/pathart/detail-1.png', '../assets/images/pathart/detail-2.png', '../assets/images/pathart/detail-3.png', '../assets/images/pathart/detail-4.png']),
        alt: 'Microscopic H&E image from Case 01 demonstrating psoriasiform tissue architecture.',
        featured: true
    },
    {
        id: 'pathart-002',
        caseNumber: 'Case 02',
        title: 'Neoplastic Tissue Study',
        pathArtTitle: 'Neoplastic Tissue Study',
        description: 'Microscopic H&E section presenting cellular organization and tissue contrast for neutral diagnostic review.',
        category: 'Neoplastic Lesions',
        stain: 'H&E',
        magnification: '40x',
        caseType: 'Excision',
        caseId: 'BD-CASE-002',
        dateAcquired: 'Jun 8, 2024',
        mainImage: '../assets/images/pathart/gallery-2.jpg',
        detailViews: createCroppedDetailViews('../assets/images/pathart/gallery-2.jpg'),
        alt: 'Microscopic H&E image from Case 02 showing neoplastic tissue organization.',
        featured: true
    },
    {
        id: 'pathart-003',
        caseNumber: 'Case 03',
        title: 'Podiatric Pathology Study',
        pathArtTitle: 'Podiatric Pathology Study',
        description: 'Microscopic H&E section highlighting tissue architecture in a podiatric pathology specimen.',
        category: 'Podiatric Pathology',
        stain: 'H&E',
        magnification: '20x',
        caseType: 'Specimen',
        caseId: 'BD-CASE-003',
        dateAcquired: 'Jul 19, 2024',
        mainImage: '../assets/images/pathart/gallery-3.jpg',
        detailViews: createCroppedDetailViews('../assets/images/pathart/gallery-3.jpg'),
        alt: 'Microscopic H&E image from Case 03 showing podiatric tissue architecture.',
        featured: true
    },
    {
        id: 'pathart-004',
        caseNumber: 'Case 04',
        title: 'Infectious Disease Histology',
        pathArtTitle: 'Infectious Disease Histology',
        description: 'Microscopic H&E section showing tissue pattern and structural context for infectious disease review.',
        category: 'Infectious Diseases',
        stain: 'H&E',
        magnification: '40x',
        caseType: 'Biopsy',
        caseId: 'BD-CASE-004',
        dateAcquired: 'Aug 2, 2024',
        mainImage: '../assets/images/pathart/gallery-4.jpg',
        detailViews: createCroppedDetailViews('../assets/images/pathart/gallery-4.jpg'),
        alt: 'Microscopic H&E image from Case 04 showing infectious disease tissue pattern.',
        featured: true
    },
    {
        id: 'pathart-005',
        caseNumber: 'Case 05',
        title: 'Diagnostic Histopathology Study',
        pathArtTitle: 'Diagnostic Histopathology Study',
        description: 'Microscopic section presenting tissue structure and staining detail for broad educational comparison.',
        category: 'Other Conditions',
        stain: 'H&E',
        magnification: '20x',
        caseType: 'Specimen',
        caseId: 'BD-CASE-005',
        dateAcquired: 'Sep 14, 2024',
        mainImage: '../assets/images/pathart/gallery-5.png',
        detailViews: createCroppedDetailViews('../assets/images/pathart/gallery-5.png'),
        alt: 'Microscopic H&E image from Case 05 showing diagnostic tissue architecture.'
    },
    {
        id: 'pathart-006',
        caseNumber: 'Case 06',
        title: 'Microscopic Tissue Architecture',
        pathArtTitle: 'Microscopic Tissue Architecture',
        description: 'Microscopic section selected for neutral review of tissue organization and pattern recognition.',
        category: 'Inflammatory Dermatoses',
        stain: 'H&E',
        magnification: '40x',
        caseType: 'Biopsy',
        caseId: 'BD-CASE-006',
        dateAcquired: 'Oct 20, 2024',
        mainImage: '../assets/images/pathart/gallery-6.jpg',
        detailViews: createCroppedDetailViews('../assets/images/pathart/gallery-6.jpg'),
        alt: 'Microscopic H&E image from Case 06 showing tissue architecture.'
    },
    {
        id: 'pathart-007',
        caseNumber: 'Case 07',
        title: 'Microscopic Tissue Contrast',
        pathArtTitle: 'Microscopic Tissue Contrast',
        description: 'Microscopic section emphasizing architectural cues and contrast within a tissue specimen.',
        category: 'Neoplastic Lesions',
        stain: 'H&E',
        magnification: '20x',
        caseType: 'Excision',
        caseId: 'BD-CASE-007',
        dateAcquired: 'Nov 7, 2024',
        mainImage: '../assets/images/pathart/gallery-7.jpg',
        detailViews: createCroppedDetailViews('../assets/images/pathart/gallery-7.jpg'),
        alt: 'Microscopic H&E image from Case 07 showing tissue contrast.'
    },
    {
        id: 'pathart-008',
        caseNumber: 'Case 08',
        title: 'Comparative Tissue Study',
        pathArtTitle: 'Comparative Tissue Study',
        description: 'Microscopic section supporting comparative review of tissue organization and specimen detail.',
        category: 'Podiatric Pathology',
        stain: 'H&E',
        magnification: '40x',
        caseType: 'Specimen',
        caseId: 'BD-CASE-008',
        dateAcquired: 'Dec 2, 2024',
        mainImage: '../assets/images/pathart/gallery-8.jpg',
        detailViews: createCroppedDetailViews('../assets/images/pathart/gallery-8.jpg'),
        alt: 'Microscopic H&E image from Case 08 showing comparative tissue organization.'
    },
    {
        id: 'pathart-009',
        caseNumber: 'Case 09',
        title: 'Tissue Pattern Study',
        pathArtTitle: 'Tissue Pattern Study',
        description: 'Microscopic section presenting tissue pattern and section interpretation for educational review.',
        category: 'Infectious Diseases',
        stain: 'H&E',
        magnification: '20x',
        caseType: 'Biopsy',
        caseId: 'BD-CASE-009',
        dateAcquired: 'Jan 16, 2025',
        mainImage: '../assets/images/pathart/gallery-9.jpg',
        detailViews: createCroppedDetailViews('../assets/images/pathart/gallery-9.jpg'),
        alt: 'Microscopic H&E image from Case 09 showing tissue pattern.'
    },
    {
        id: 'pathart-010',
        caseNumber: 'Case 10',
        title: 'Tissue Architecture Study',
        pathArtTitle: 'Tissue Architecture Study',
        description: 'Microscopic section illustrating structural patterns for broader pathology comparison.',
        category: 'Other Conditions',
        stain: 'H&E',
        magnification: '40x',
        caseType: 'Specimen',
        caseId: 'BD-CASE-010',
        dateAcquired: 'Feb 11, 2025',
        mainImage: '../assets/images/pathart/gallery-10.jpg',
        detailViews: createCroppedDetailViews('../assets/images/pathart/gallery-10.jpg'),
        alt: 'Microscopic H&E image from Case 10 showing tissue architecture.'
    },
    {
        id: 'pathart-011',
        caseNumber: 'Case 11',
        title: 'Pattern Arcade',
        pathArtTitle: 'Pattern Arcade',
        description: 'PathArt microscopy study focused on repeating visual structure and tissue pattern.',
        category: 'PathArt Collection',
        stain: 'Not specified',
        magnification: 'Not specified',
        caseType: 'PathArt specimen',
        caseId: 'PA-CASE-011',
        dateAcquired: 'Not specified',
        mainImage: '../assets/images/pathart/pattern-arcade.jpg',
        detailViews: createRealDetailViews(['../assets/images/pathart/pattern-arcade.jpg', '../assets/images/pathart/pattern-arcade 1.jpg', '../assets/images/pathart/pattern-arcade.jpg', '../assets/images/pathart/pattern-arcade 1.jpg']),
        alt: 'PathArt microscopy image titled Pattern Arcade.'
    },
    {
        id: 'pathart-012',
        caseNumber: 'Case 12',
        title: 'Fat Necrosis Pattern',
        pathArtTitle: 'Fat Necrosis Pattern',
        description: 'PathArt microscopy study presenting a distinctive tissue pattern for visual and educational review.',
        category: 'PathArt Collection',
        stain: 'Not specified',
        magnification: 'Not specified',
        caseType: 'PathArt specimen',
        caseId: 'PA-CASE-012',
        dateAcquired: 'Not specified',
        mainImage: '../assets/images/pathart/pattern-fat-nec 1.jpg',
        detailViews: createCroppedDetailViews('../assets/images/pathart/pattern-fat-nec 1.jpg'),
        alt: 'PathArt microscopy image titled Fat Necrosis Pattern.'
    },
    {
        id: 'pathart-013',
        caseNumber: 'Case 13',
        title: 'Rubber Ducky',
        pathArtTitle: 'Rubber Ducky',
        description: 'PathArt microscopy image with a distinctive visual form presented as part of the collection.',
        category: 'PathArt Collection',
        stain: 'Not specified',
        magnification: 'Not specified',
        caseType: 'PathArt specimen',
        caseId: 'PA-CASE-013',
        dateAcquired: 'Not specified',
        mainImage: '../assets/images/pathart/rubber ducky 1.jpg',
        detailViews: createCroppedDetailViews('../assets/images/pathart/rubber ducky 1.jpg'),
        alt: 'PathArt microscopy image titled Rubber Ducky.'
    },
    {
        id: 'pathart-014',
        caseNumber: 'Case 14',
        title: 'Totem Pole',
        pathArtTitle: 'Totem Pole',
        description: 'PathArt microscopy study pairing two views of the same visually distinctive specimen.',
        category: 'PathArt Collection',
        stain: 'Not specified',
        magnification: 'Not specified',
        caseType: 'PathArt specimen',
        caseId: 'PA-CASE-014',
        dateAcquired: 'Not specified',
        mainImage: '../assets/images/pathart/totem-pole .jpg',
        detailViews: createCroppedDetailViews('../assets/images/pathart/totem-pole .jpg'),
        alt: 'PathArt microscopy image titled Totem Pole.'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.querySelector('.gallery-grid');
    const loadMoreButton = document.querySelector('.section-action .button');
    const categorySelect = document.querySelector('.gallery-controls select[aria-label="Filter gallery by category"]');
    const stainSelect = document.querySelector('.gallery-controls select[aria-label="Filter gallery by stain"]');
    const magnificationSelect = document.querySelector('.gallery-controls select[aria-label="Filter gallery by magnification"]');
    const searchInput = document.querySelector('.gallery-search input');
    const featuredImage = document.querySelector('.pathart-featured-image img');
    const featuredTitle = document.querySelector('.pathart-featured-content h2');
    const featuredDescription = document.querySelector('.pathart-featured-content p');
    const featuredMetaList = document.querySelectorAll('.pathart-meta-list li');
    const featuredDotsContainer = document.querySelector('.gallery-dots');
    const featuredPrevButton = document.querySelector('.gallery-arrow-left');
    const featuredNextButton = document.querySelector('.gallery-arrow-right');
    const featuredDetailsButton = document.querySelector('.pathart-featured-content .button');
    const detailMainImage = document.querySelector('.pathart-detail-main img');
    const detailTitle = document.querySelector('.pathart-details-content h2');
    const detailTextFields = document.querySelectorAll('.pathart-detail-list dd');
    const detailThumbnailContainer = document.querySelector('.pathart-thumbnails');
    const detailActions = document.querySelectorAll('.pathart-detail-actions a');
    const educationText = document.querySelector('.pathart-education-text p');
    const learningPointsList = document.querySelector('.learning-points ul');
    const placeholder = 'Not specified';
    const state = {
        filteredItems: [...pathartCases],
        visibleCount: 5,
        isGalleryExpanded: false,
        featuredIndex: 0,
        activeItemId: null
    };

    const text = value => value || placeholder;
    const getFeaturedItems = () => pathartCases.filter(item => item.featured).slice(0, 4);

    const updateFeaturedCarousel = () => {
        const featuredItems = getFeaturedItems();
        const item = featuredItems[state.featuredIndex];
        if (!item) return;

        featuredImage.src = item.mainImage;
        featuredImage.alt = item.alt;
        featuredTitle.textContent = item.pathArtTitle;
        featuredDescription.textContent = `${item.caseNumber} · ${item.description}`;
        featuredMetaList[0].innerHTML = `<strong>Category:</strong> ${text(item.category)}`;
        featuredMetaList[1].innerHTML = `<strong>Stain:</strong> ${text(item.stain)}`;
        featuredMetaList[2].innerHTML = `<strong>Magnification:</strong> ${text(item.magnification)}`;
        featuredDetailsButton.dataset.featuredId = item.id;

        featuredDotsContainer.innerHTML = featuredItems.map((featuredItem, index) => `
            <button type="button" class="gallery-dot ${index === state.featuredIndex ? 'active' : ''}" aria-label="View ${featuredItem.caseNumber}: ${featuredItem.pathArtTitle}" data-feature-index="${index}"></button>
        `).join('');

        featuredDotsContainer.querySelectorAll('.gallery-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                state.featuredIndex = Number(dot.dataset.featureIndex);
                updateFeaturedCarousel();
            });
        });
    };

    const updateDetailView = item => {
        if (!item) return;

        state.activeItemId = item.id;
        const detailViews = item.detailViews;
        const applyDetailView = view => {
            detailMainImage.src = view.image;
            detailMainImage.alt = `${view.label} of ${item.pathArtTitle}`;
            detailMainImage.style.objectFit = view.zoom === 1 ? 'contain' : 'cover';
            detailMainImage.style.objectPosition = view.position;
            detailMainImage.style.transform = `scale(${view.zoom})`;
            detailMainImage.style.transformOrigin = view.position;
        };

        applyDetailView({
            label: 'Full View',
            image: item.mainImage,
            zoom: 1,
            position: 'center'
        });
        detailTitle.textContent = `${item.pathArtTitle} - ${item.caseNumber}`;

        [item.category, item.stain, item.magnification, item.caseType, item.caseId, item.dateAcquired]
            .map(text)
            .forEach((value, index) => {
                if (detailTextFields[index]) detailTextFields[index].textContent = value;
            });

        detailActions.forEach(action => {
            action.href = item.mainImage;
            action.setAttribute('aria-label', `${action.hasAttribute('download') ? 'Download' : 'View full size for'} ${item.pathArtTitle}`);
            if (action.hasAttribute('download')) action.setAttribute('download', item.pathArtTitle);
        });

        detailThumbnailContainer.innerHTML = detailViews.map((view, index) => `
            <button type="button" class="detail-thumbnail-button ${index === 0 ? 'active' : ''}" data-detail-index="${index}" aria-label="View ${view.label} of ${item.pathArtTitle}">
                <img src="${view.image}" alt="${view.label} of ${item.pathArtTitle}." style="object-fit: ${view.zoom === 1 ? 'contain' : 'cover'}; object-position: ${view.position}; transform: scale(${view.zoom}); transform-origin: ${view.position};" />
            </button>
        `).join('');

        detailThumbnailContainer.querySelectorAll('.detail-thumbnail-button').forEach(button => {
            button.addEventListener('click', () => {
                applyDetailView(detailViews[Number(button.dataset.detailIndex)]);
                detailThumbnailContainer.querySelectorAll('.detail-thumbnail-button')
                    .forEach(innerButton => innerButton.classList.toggle('active', innerButton === button));
            });
        });

        if (educationText) educationText.textContent = item.description;
        if (learningPointsList) {
            learningPointsList.innerHTML = [
                `Review ${item.category.toLowerCase()} in context with specimen architecture.`,
                `Compare the ${item.stain} staining context and tissue distribution.`,
                'Use the image as an educational visual reference.'
            ].map(point => `<li>${point}</li>`).join('');
        }
    };

    const updateSelectedCase = item => {
        updateDetailView(item);
        document.getElementById('image-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const renderGallery = () => {
        if (!galleryGrid) return;
        if (!state.filteredItems.length) {
            galleryGrid.innerHTML = '<p class="gallery-empty-state">No matching images found.</p>';
            loadMoreButton.style.display = 'none';
            return;
        }

        galleryGrid.innerHTML = state.filteredItems.map((item, index) => `
            <article class="gallery-card ${index >= state.visibleCount && !state.isGalleryExpanded ? 'gallery-card-hidden' : ''} ${index >= state.visibleCount && state.isGalleryExpanded ? 'gallery-card-revealed' : ''}" tabindex="0" role="button" aria-label="Open ${item.caseNumber}: ${item.pathArtTitle} details" data-gallery-id="${item.id}">
                <img src="${item.mainImage}" alt="${item.alt}" />
                <h3>${item.pathArtTitle}</h3>
                <p>${item.caseNumber} · ${item.category}</p>
            </article>
        `).join('');

        galleryGrid.querySelectorAll('.gallery-card').forEach(card => {
            const openItem = () => {
                const item = pathartCases.find(entry => entry.id === card.dataset.galleryId);
                if (item) updateSelectedCase(item);
            };
            card.addEventListener('click', openItem);
            card.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openItem();
                }
            });
        });

        const hasHiddenItems = state.filteredItems.length > state.visibleCount;
        loadMoreButton.style.display = hasHiddenItems ? 'inline-flex' : 'none';
        loadMoreButton.textContent = state.isGalleryExpanded ? 'Show Less' : 'View Full Gallery';
        loadMoreButton.setAttribute('aria-expanded', String(state.isGalleryExpanded));
    };

    const populateFilterOptions = () => {
        const options = (values, label) => ['all', ...new Set(values)].map(value => `<option value="${value}">${value === 'all' ? label : value}</option>`).join('');
        categorySelect.innerHTML = options(pathartCases.map(item => item.category), 'All Categories');
        stainSelect.innerHTML = options(pathartCases.map(item => item.stain), 'All Stains');
        magnificationSelect.innerHTML = options(pathartCases.map(item => item.magnification), 'All Magnifications');
    };

    const applyFilters = () => {
        const category = categorySelect.value;
        const stain = stainSelect.value;
        const magnification = magnificationSelect.value;
        const search = searchInput.value.trim().toLowerCase();

        state.filteredItems = pathartCases.filter(item => {
            const searchableText = [item.title, item.pathArtTitle, item.caseNumber, item.category, item.description].join(' ').toLowerCase();
            return (category === 'all' || item.category === category) &&
                (stain === 'all' || item.stain === stain) &&
                (magnification === 'all' || item.magnification === magnification) &&
                (!search || searchableText.includes(search));
        });

        state.visibleCount = 5;
        state.isGalleryExpanded = false;
        renderGallery();
    };

    categorySelect.addEventListener('change', applyFilters);
    stainSelect.addEventListener('change', applyFilters);
    magnificationSelect.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);

    loadMoreButton.addEventListener('click', () => {
        state.isGalleryExpanded = !state.isGalleryExpanded;
        renderGallery();
        if (!state.isGalleryExpanded) document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    featuredDetailsButton.addEventListener('click', () => {
        const item = pathartCases.find(entry => entry.id === featuredDetailsButton.dataset.featuredId);
        if (item) updateSelectedCase(item);
    });

    featuredPrevButton.addEventListener('click', () => {
        const featuredItems = getFeaturedItems();
        state.featuredIndex = (state.featuredIndex - 1 + featuredItems.length) % featuredItems.length;
        updateFeaturedCarousel();
    });

    featuredNextButton.addEventListener('click', () => {
        const featuredItems = getFeaturedItems();
        state.featuredIndex = (state.featuredIndex + 1) % featuredItems.length;
        updateFeaturedCarousel();
    });

    populateFilterOptions();
    updateFeaturedCarousel();
    updateDetailView(pathartCases[0]);
    renderGallery();
});

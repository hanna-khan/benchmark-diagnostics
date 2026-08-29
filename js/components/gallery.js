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

    const detailMainImage = document.querySelector('.pathart-detail-main img');
    const detailTitle = document.querySelector('.pathart-details-content h2');
    const detailTextFields = document.querySelectorAll('.pathart-detail-list dd');
    const detailThumbnailContainer = document.querySelector('.pathart-thumbnails');
    const detailActions = document.querySelectorAll('.pathart-detail-actions a');

    const educationText = document.querySelector('.pathart-education-text p');
    const learningPointsList = document.querySelector('.learning-points ul');

    const relatedCasesGrid = document.querySelector('.related-cases-grid');

    const placeholder = 'Information coming soon';
    const state = {
        items: [],
        filteredItems: [],
        visibleCount: 8,
        featuredIndex: 0,
        activeItemId: null,
        loadMoreStep: 4
    };

    const safeText = (value, fallback = placeholder) => {
        if (value === null || value === undefined || value === '') {
            return fallback;
        }

        return value;
    };

    const formatDate = (value) => {
        if (!value) {
            return placeholder;
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    const getFeaturedItems = () => {
        const featured = state.items.filter(item => item.featured);

        return featured.length ? featured : state.items.slice(0, 4);
    };

    const updateFeaturedCarousel = () => {
        const featuredItems = getFeaturedItems();

        if (!featuredItems.length) {
            return;
        }

        if (state.featuredIndex >= featuredItems.length) {
            state.featuredIndex = 0;
        }

        const item = featuredItems[state.featuredIndex];

        if (featuredImage) {
            featuredImage.src = item.image || '../assets/images/pathart/featured-pathart.jpg';
            featuredImage.alt = item.title ? `${item.title} pathology image` : 'Featured PathArt image';
        }

        if (featuredTitle) {
            featuredTitle.textContent = safeText(item.title, 'Featured PathArt Image');
        }

        if (featuredDescription) {
            featuredDescription.textContent = safeText(item.description, placeholder);
        }

        if (featuredMetaList.length >= 3) {
            featuredMetaList[0].innerHTML = `<strong>Category:</strong> ${safeText(item.category, placeholder)}`;
            featuredMetaList[1].innerHTML = `<strong>Stain:</strong> ${safeText(item.stain, placeholder)}`;
            featuredMetaList[2].innerHTML = `<strong>Magnification:</strong> ${safeText(item.magnification, placeholder)}`;
        }

        if (featuredDotsContainer) {
            featuredDotsContainer.innerHTML = featuredItems
                .map((featuredItem, index) => `
                    <button
                        type="button"
                        class="gallery-dot ${index === state.featuredIndex ? 'active' : ''}"
                        aria-label="View featured image ${index + 1}"
                        data-feature-index="${index}"
                    ></button>
                `)
                .join('');

            featuredDotsContainer.querySelectorAll('.gallery-dot').forEach(dot => {
                dot.addEventListener('click', () => {
                    state.featuredIndex = Number(dot.dataset.featureIndex);
                    updateFeaturedCarousel();
                });
            });
        }
    };

    const updateDetailView = (item) => {
        if (!item) {
            return;
        }

        state.activeItemId = item.id;

        if (detailMainImage) {
            detailMainImage.src = item.image || '../assets/images/pathart/detail-main.jpg';
            detailMainImage.alt = item.title ? `${item.title} pathology image` : 'Pathology detail image';
        }

        if (detailTitle) {
            detailTitle.textContent = safeText(item.title, 'Image Title');
        }

        const detailValues = [
            safeText(item.category, placeholder),
            safeText(item.stain, placeholder),
            safeText(item.magnification, placeholder),
            safeText(item.caseType, placeholder),
            safeText(item.caseId, placeholder),
            formatDate(item.dateAcquired)
        ];

        detailTextFields.forEach((field, index) => {
            field.textContent = detailValues[index] || placeholder;
        });

        if (detailActions.length >= 2) {
            const fullSizeLink = detailActions[0];
            const downloadLink = detailActions[1];

            if (item.image) {
                fullSizeLink.href = item.image;
                fullSizeLink.setAttribute('aria-label', `View full size for ${safeText(item.title, 'selected image')}`);
                fullSizeLink.removeAttribute('aria-disabled');
                fullSizeLink.style.pointerEvents = 'auto';

                downloadLink.href = item.image;
                downloadLink.setAttribute('download', item.title || 'benchmark-pathart-image');
                downloadLink.setAttribute('aria-label', `Download ${safeText(item.title, 'selected image')}`);
                downloadLink.removeAttribute('aria-disabled');
                downloadLink.style.pointerEvents = 'auto';
            } else {
                fullSizeLink.href = '#';
                fullSizeLink.setAttribute('aria-disabled', 'true');
                fullSizeLink.style.pointerEvents = 'none';

                downloadLink.href = '#';
                downloadLink.removeAttribute('download');
                downloadLink.setAttribute('aria-disabled', 'true');
                downloadLink.style.pointerEvents = 'none';
            }
        }

        if (educationText) {
            educationText.textContent = safeText(item.educationalNotes, placeholder);
        }

        if (learningPointsList) {
            const points = Array.isArray(item.learningPoints) && item.learningPoints.length
                ? item.learningPoints
                : [placeholder];

            learningPointsList.innerHTML = points
                .map(point => `<li>${safeText(point, placeholder)}</li>`)
                .join('');
        }

        if (detailThumbnailContainer) {
            const thumbnails = Array.isArray(item.thumbnails) && item.thumbnails.length
                ? item.thumbnails
                : [item.image || '../assets/images/pathart/detail-main.jpg'];

            detailThumbnailContainer.innerHTML = thumbnails
                .map((thumb, index) => `
                    <button
                        type="button"
                        class="detail-thumbnail-button ${index === 0 ? 'active' : ''}"
                        data-detail-thumb="${thumb}"
                        aria-label="View detail image ${index + 1}"
                    >
                        <img src="${thumb}" alt="${safeText(item.title, 'Pathology image')} detail view ${index + 1}" />
                    </button>
                `)
                .join('');

            detailThumbnailContainer.querySelectorAll('.detail-thumbnail-button').forEach(button => {
                button.addEventListener('click', () => {
                    const thumbSrc = button.dataset.detailThumb;

                    if (!thumbSrc) {
                        return;
                    }

                    if (detailMainImage) {
                        detailMainImage.src = thumbSrc;
                        detailMainImage.alt = `${safeText(item.title, 'Pathology image')} detail view`;
                    }

                    detailThumbnailContainer.querySelectorAll('.detail-thumbnail-button').forEach(innerButton => {
                        innerButton.classList.toggle('active', innerButton === button);
                    });
                });
            });
        }

        renderRelatedCases(item);
    };

    const renderRelatedCases = (item) => {
        if (!relatedCasesGrid) {
            return;
        }

        if (!item || !Array.isArray(item.relatedCaseIds) || !item.relatedCaseIds.length) {
            relatedCasesGrid.innerHTML = '<p class="gallery-empty-state">Related cases coming soon.</p>';
            return;
        }

        const relatedItems = item.relatedCaseIds
            .map((relatedId) => state.items.find(entry => entry.id === relatedId))
            .filter(Boolean)
            .slice(0, 4);

        if (!relatedItems.length) {
            relatedCasesGrid.innerHTML = '<p class="gallery-empty-state">Related cases coming soon.</p>';
            return;
        }

        relatedCasesGrid.innerHTML = relatedItems
            .map(relatedItem => `
                <article class="related-case-card">
                    <img src="${relatedItem.image || '../assets/images/pathart/related-1.jpg'}" alt="${safeText(relatedItem.title, 'Related pathology image')}" />
                    <h3>${safeText(relatedItem.title, 'Related Image')}</h3>
                    <p>${safeText(relatedItem.category, placeholder)}</p>
                    <button
                        type="button"
                        class="button button-small button-outline related-case-button"
                        data-related-id="${relatedItem.id}"
                    >
                        View Image
                    </button>
                </article>
            `)
            .join('');

        relatedCasesGrid.querySelectorAll('.related-case-button').forEach(button => {
            button.addEventListener('click', () => {
                const selected = state.items.find(entry => entry.id === button.dataset.relatedId);
                if (selected) {
                    updateSelectedCase(selected);
                }
            });
        });
    };

    const updateSelectedCase = (item) => {
        if (!item) {
            return;
        }

        updateDetailView(item);
        document.getElementById('image-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const renderGallery = () => {
        if (!galleryGrid) {
            return;
        }

        if (!state.filteredItems.length) {
            galleryGrid.innerHTML = '<p class="gallery-empty-state">No matching images found.</p>';
            if (loadMoreButton) {
                loadMoreButton.style.display = 'none';
            }
            return;
        }

        const visibleItems = state.filteredItems.slice(0, state.visibleCount);

        galleryGrid.innerHTML = visibleItems
            .map(item => `
                <article
                    class="gallery-card"
                    tabindex="0"
                    role="button"
                    aria-label="Open ${safeText(item.title, 'gallery image')} details"
                    data-gallery-id="${item.id}"
                >
                    <button
                        type="button"
                        class="gallery-card-button"
                        data-gallery-id="${item.id}"
                        aria-label="View image details for ${safeText(item.title, 'gallery image')}"
                    >
                        <img src="${item.image || '../assets/images/pathart/gallery-1.jpg'}" alt="${safeText(item.title, 'Pathology gallery image')}" />
                        <div class="gallery-card-copy">
                            <h3>${safeText(item.title, 'Image Title')}</h3>
                            <p>${safeText(item.category, placeholder)}</p>
                        </div>
                    </button>
                </article>
            `)
            .join('');

        galleryGrid.querySelectorAll('.gallery-card, .gallery-card-button').forEach(element => {
            const trigger = element.closest('[data-gallery-id]');
            if (!trigger) {
                return;
            }

            const openItem = () => {
                const selected = state.items.find(item => item.id === trigger.dataset.galleryId);
                if (selected) {
                    updateSelectedCase(selected);
                }
            };

            if (element.tagName === 'BUTTON') {
                element.addEventListener('click', openItem);
            }

            element.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openItem();
                }
            });
        });

        if (loadMoreButton) {
            loadMoreButton.style.display = state.filteredItems.length > state.visibleCount ? 'inline-flex' : 'none';
        }
    };

    const applyFilters = () => {
        const categoryValue = categorySelect ? categorySelect.value : 'all';
        const stainValue = stainSelect ? stainSelect.value : 'all';
        const magnificationValue = magnificationSelect ? magnificationSelect.value : 'all';
        const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';

        state.filteredItems = state.items.filter(item => {
            const matchesCategory = categoryValue === 'all' || item.category === categoryValue;
            const matchesStain = stainValue === 'all' || item.stain === stainValue;
            const matchesMagnification = magnificationValue === 'all' || item.magnification === magnificationValue;
            const matchesSearch = !searchValue || (
                (item.title || '').toLowerCase().includes(searchValue) ||
                (item.category || '').toLowerCase().includes(searchValue)
            );

            return matchesCategory && matchesStain && matchesMagnification && matchesSearch;
        });

        state.visibleCount = 8;
        renderGallery();

        if (state.filteredItems.length) {
            const selectedItem = state.items.find(item => item.id === state.activeItemId) || state.filteredItems[0];
            updateDetailView(selectedItem);
        }
    };

    const populateFilterOptions = () => {
        if (categorySelect) {
            const categories = ['all', ...new Set(state.items.map(item => item.category).filter(Boolean))];
            categorySelect.innerHTML = categories
                .map(value => `<option value="${value === 'all' ? 'all' : value}">${value === 'all' ? 'All Categories' : value}</option>`)
                .join('');
        }

        if (stainSelect) {
            const stains = ['all', ...new Set(state.items.map(item => item.stain).filter(Boolean))];
            stainSelect.innerHTML = stains
                .map(value => `<option value="${value === 'all' ? 'all' : value}">${value === 'all' ? 'All Stains' : value}</option>`)
                .join('');
        }

        if (magnificationSelect) {
            const magnifications = ['all', ...new Set(state.items.map(item => item.magnification).filter(Boolean))];
            magnificationSelect.innerHTML = magnifications
                .map(value => `<option value="${value === 'all' ? 'all' : value}">${value === 'all' ? 'All Magnifications' : value}</option>`)
                .join('');
        }
    };

    const initialize = () => {
        const jsonPath = '../js/data/pathart-images.json';

        fetch(jsonPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Gallery data request failed with status ${response.status}`);
                }

                return response.json();
            })
            .then(data => {
                state.items = Array.isArray(data) ? data : [];
                populateFilterOptions();
                state.filteredItems = [...state.items];
                state.visibleCount = 8;

                if (state.items.length) {
                    state.activeItemId = state.items[0].id;
                    updateFeaturedCarousel();
                    updateDetailView(state.items[0]);
                }

                renderGallery();
            })
            .catch(error => {
                console.error('PathArt gallery data failed to load:', error);
                if (galleryGrid) {
                    galleryGrid.innerHTML = '<p class="gallery-empty-state">Gallery information is unavailable at the moment.</p>';
                }
                if (loadMoreButton) {
                    loadMoreButton.style.display = 'none';
                }
            });
    };

    if (categorySelect) {
        categorySelect.addEventListener('change', applyFilters);
    }

    if (stainSelect) {
        stainSelect.addEventListener('change', applyFilters);
    }

    if (magnificationSelect) {
        magnificationSelect.addEventListener('change', applyFilters);
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => {
            state.visibleCount += state.loadMoreStep;
            renderGallery();
        });
    }

    if (featuredPrevButton) {
        featuredPrevButton.addEventListener('click', () => {
            const featuredItems = getFeaturedItems();
            if (!featuredItems.length) {
                return;
            }
            state.featuredIndex = (state.featuredIndex - 1 + featuredItems.length) % featuredItems.length;
            updateFeaturedCarousel();
        });
    }

    if (featuredNextButton) {
        featuredNextButton.addEventListener('click', () => {
            const featuredItems = getFeaturedItems();
            if (!featuredItems.length) {
                return;
            }
            state.featuredIndex = (state.featuredIndex + 1) % featuredItems.length;
            updateFeaturedCarousel();
        });
    }

    initialize();
});

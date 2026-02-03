// ========================================
// JAVASCRIPT - Jasper Johns Web
// Interactividad, galería dinámica y efectos visuales
// ========================================

// Array de imágenes de la galería
const galleryImages = [
    { id: 1, title: 'Flag (1954)', color: '#FF6B35', category: 'obra' },
    { id: 2, title: 'Target with Four Faces (1955)', color: '#004E89', category: 'obra' },
    { id: 3, title: 'Numbers (1957-1958)', color: '#D62828', category: 'obra' },
    { id: 4, title: 'Painting with Two Balls (1960)', color: '#FFB703', category: 'obra' },
    { id: 5, title: 'Ale Cans (1964)', color: '#2A9D8F', category: 'obra' },
    { id: 6, title: 'Encáustica y Óleo', color: '#F77F00', category: 'técnica' }
];

let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling para los links de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // No prevenir default para skip-to-main y otros links válidos
            if (href && href !== '#main-content') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Efecto sutil de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos de contenido
    document.querySelectorAll('.obra-card, .curiosity-card').forEach(el => {
        observer.observe(el);
    });

    // Efecto de entrada para gallery items
    document.querySelectorAll('.gallery-item').forEach((el, index) => {
        el.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
    });

    // Efecto de entrada para section headers
    document.querySelectorAll('.section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.animation = 'fadeInUp 0.8s ease-out forwards';
    });

    // Efecto de números animados en la portada
    animateNumbers();

    // Observador para animaciones al scroll
    observeElements();

    // Inicializar galería dinámica
    initializeGallery();

    // Efecto hover personalizado para las obras
    initializeObraCards();

    // Iniciar slideshow junto al título
    initNameSlideshow();

    // Crear cursor triangular negativo personalizado
    createNegativeCursor();

    // Scroll activo en la navegación
    initializeScrollNavigation();
});

// Animar los números en la portada
function animateNumbers() {
    const numbers = document.querySelectorAll('.number');
    numbers.forEach((num, index) => {
        setTimeout(() => {
            num.style.animation = 'slideDown 0.6s ease-out forwards';
        }, index * 100);
    });
}

// Slideshow automático para el nombre (usa imágenes en /img)
function initNameSlideshow() {
    const container = document.querySelector('.name-slideshow');
    if (!container) return;
    const slides = Array.from(container.querySelectorAll('.slide'));
    if (!slides.length) return;
    let idx = slides.findIndex(s => s.classList.contains('active'));
    if (idx < 0) idx = 0;

    setInterval(() => {
        slides[idx].classList.remove('active');
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add('active');
    }, 3500);
}

// Observador para elementos que se animan al entrar en vista
function observeElements() {
    const options = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animar títulos de secciones
                if (entry.target.classList.contains('section-title')) {
                    entry.target.style.animation = 'slideDown 0.8s ease-out forwards';
                }

                // Animar tarjetas de obras
                if (entry.target.classList.contains('obra-card')) {
                    entry.target.style.animation = 'slideDown 0.6s ease-out forwards';
                    entry.target.style.opacity = '1';
                }

                // Animar tarjetas de curiosidades
                if (entry.target.classList.contains('curiosity-card')) {
                    entry.target.style.animation = 'slideDown 0.6s ease-out forwards';
                }
            }
        });
    }, options);

    // Observar elementos
    document.querySelectorAll('.section-title, .obra-card, .curiosity-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Función para cambiar tema (opcional - para futuras mejoras)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

// Efecto hover personalizado para las obras
function initializeObraCards() {
    const obraCards = document.querySelectorAll('.obra-card');
    obraCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'white';
        });
    });
}

// Scroll activo en la navegación
function initializeScrollNavigation() {
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-menu a');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href') || '';
            if (href.startsWith('#') && href.slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Run once to set initial active link
document.addEventListener('DOMContentLoaded', () => {
    const evt = new Event('scroll');
    window.dispatchEvent(evt);
});

console.log('🎨 Bienvenido a la web de Jasper Johns - Inspirada en Pop Art');

// ========================================
// GALERÍA DINÁMICA
// ========================================

function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });

    // Crear modal para la galería
    createLightboxModal();
}

function createLightboxModal() {
    // Verificar si el modal ya existe
    if (document.getElementById('gallery-lightbox')) return;

    const lightbox = document.createElement('div');
    lightbox.id = 'gallery-lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-prev">❮</button>
            <div class="lightbox-main">
                <div class="lightbox-image" id="lightbox-image"></div>
                <div class="lightbox-info">
                    <h3 id="lightbox-title"></h3>
                    <p id="lightbox-category"></p>
                </div>
            </div>
            <button class="lightbox-next">❯</button>
            <div class="lightbox-counter">
                <span id="image-counter">1</span> / <span id="total-images">${galleryImages.length}</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(lightbox);

    // Event listeners para el lightbox
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', () => navigateGallery(-1));
    document.querySelector('.lightbox-next').addEventListener('click', () => navigateGallery(1));
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) closeLightbox();
    });

    // Navegación con teclas
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('gallery-lightbox').style.display === 'flex') {
            if (e.key === 'ArrowLeft') navigateGallery(-1);
            if (e.key === 'ArrowRight') navigateGallery(1);
            if (e.key === 'Escape') closeLightbox();
        }
    });
}

function openLightbox(index) {
    if (index < 0 || index >= galleryImages.length) return;
    
    currentImageIndex = index;
    const lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) return;
    
    const image = galleryImages[index];
    
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const imageCounter = document.getElementById('image-counter');
    
    if (lightboxImage) lightboxImage.style.backgroundColor = image.color;
    if (lightboxTitle) lightboxTitle.textContent = image.title;
    if (lightboxCategory) lightboxCategory.textContent = `Categoría: ${image.category}`;
    if (imageCounter) imageCounter.textContent = index + 1;
    
    lightbox.style.display = 'flex';
    lightbox.style.animation = 'fadeIn 0.3s ease-out';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    lightbox.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

function navigateGallery(direction) {
    currentImageIndex += direction;
    
    // Validar índice con ciclo
    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }
    
    const image = galleryImages[currentImageIndex];
    
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const imageCounter = document.getElementById('image-counter');
    
    if (lightboxImage) lightboxImage.style.backgroundColor = image.color;
    if (lightboxTitle) lightboxTitle.textContent = image.title;
    if (lightboxCategory) lightboxCategory.textContent = `Categoría: ${image.category}`;
    if (imageCounter) imageCounter.textContent = currentImageIndex + 1;
}

// ========================================
// SISTEMA DE AUDIO AMBIENTE - Museo
// Genera sonidos ambientales embebidos sin archivos externos
// ========================================

class MuseumAmbientAudio {
    constructor() {
        this.audioContext = null;
        this.oscillators = [];
        this.gains = [];
        this.isPlaying = false;
        this.masterGain = null;
        this.noiseBuffer = null;
        
        this.initAudioContext();
    }

    initAudioContext() {
        if (!this.audioContext) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        }
    }

    createNoiseBuffer() {
        const bufferSize = this.audioContext.sampleRate * 2;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        return noiseBuffer;
    }

    play() {
        if (this.isPlaying) return;
        
        this.initAudioContext();
        
        // Master gain para volumen general suave
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.15;
        this.masterGain.connect(this.audioContext.destination);

        // Crear sonidos ambientales de baja frecuencia
        this.createAmbientTones();
        
        // Crear ruido blanco sutilmente filtrado (efecto de ambiente)
        this.createFilteredNoise();
        
        this.isPlaying = true;
    }

    createAmbientTones() {
        // Frecuencias bajas para crear ambiente profundo (60-80 Hz)
        const frequencies = [55, 73, 92, 110];
        
        frequencies.forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            // Volumen bajo y variable
            gain.gain.value = 0.02 + (index * 0.01);
            
            // Leve modulación para efecto natural
            const lfo = this.audioContext.createOscillator();
            const lfoGain = this.audioContext.createGain();
            lfo.frequency.value = 0.3 + (index * 0.1);
            lfoGain.gain.value = 2;
            
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start();
            lfo.start();
            
            this.oscillators.push(osc);
            this.oscillators.push(lfo);
            this.gains.push(gain);
        });
    }

    createFilteredNoise() {
        // Crear buffer de ruido blanco
        const bufferSize = this.audioContext.sampleRate * 2;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noiseSource = this.audioContext.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        // Filtro pasa-altos para eliminar ruido muy grave
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 200;

        // Filtro pasa-bajos para suavidad
        const filter2 = this.audioContext.createBiquadFilter();
        filter2.type = 'lowpass';
        filter2.frequency.value = 2000;

        const gain = this.audioContext.createGain();
        gain.gain.value = 0.08;

        noiseSource.connect(filter);
        filter.connect(filter2);
        filter2.connect(gain);
        gain.connect(this.masterGain);

        noiseSource.start(0);
        this.oscillators.push(noiseSource);
    }

    stop() {
        this.oscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {
                // Ignorar errores si ya está detenido
            }
        });
        
        this.oscillators = [];
        this.gains = [];
        this.isPlaying = false;
    }
}

// Instancia global de audio
let museumAudio = null;

// Inicializar controles de audio cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Garantizar reproducción automática del video
    const videoFrame = document.getElementById('jasper-video');
    if (videoFrame) {
        // Forzar reproducción automática
        videoFrame.style.pointerEvents = 'auto';
        
        // Si el navegador no permite autoplay, intentar reproducir con interacción
        setTimeout(() => {
            try {
                // Algunos navegadores permiten esto
                if (videoFrame.contentWindow) {
                    videoFrame.contentWindow.postMessage({
                        event: 'command',
                        func: 'playVideo'
                    }, '*');
                }
            } catch (e) {
                // Silenciar errores - YouTube maneja esto internamente
            }
        }, 500);
    }
    const audioToggle = document.getElementById('audioToggle');
    
    if (audioToggle) {
        audioToggle.addEventListener('click', toggleMuseumAudio);
        
        // Aplicar clase inicial
        audioToggle.classList.add('audio-off');
    }
});

function toggleMuseumAudio() {
    const audioToggle = document.getElementById('audioToggle');
    const icon = audioToggle.querySelector('.audio-icon');
    
    if (!museumAudio) {
        museumAudio = new MuseumAmbientAudio();
    }

    if (museumAudio.isPlaying) {
        museumAudio.stop();
        audioToggle.classList.remove('audio-on');
        audioToggle.classList.add('audio-off');
        audioToggle.setAttribute('aria-pressed', 'false');
        audioToggle.setAttribute('aria-label', 'Activar ambiente de museo');
        icon.textContent = '🔊';
    } else {
        museumAudio.play();
        audioToggle.classList.remove('audio-off');
        audioToggle.classList.add('audio-on');
        audioToggle.setAttribute('aria-pressed', 'true');
        audioToggle.setAttribute('aria-label', 'Desactivar ambiente de museo');
        icon.textContent = '🔇';
        // museum audio started

    }

// Crear cursor triangular negativo y listeners (si no existe)
function createNegativeCursor() {
    // Crear solo en dispositivos con puntero fino (ratón). Evita tablets/móviles.
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;
    if (document.querySelector('.copilot-negative-cursor')) return;
    const cursor = document.createElement('div');
    cursor.className = 'copilot-negative-cursor';
    // Insert SVG arrow (Material-like) inside the cursor container
    // SVG pointer inspired by Material Design pointer (hotspot placed at tip)
    cursor.innerHTML = `
        <svg viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <g>
                <path d="M2 2 L2 30 L8 24 L12 34 L16 32 L12 22 L20 22 Z" />
            </g>
        </svg>
    `;
    document.body.appendChild(cursor);
    document.body.classList.add('custom-cursor');

    // Mover el cursor con el ratón
    document.addEventListener('mousemove', (e) => {
        // posicionar en la coordenada del puntero (ajustada por CSS transform hotspot)
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Click feedback
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click-effect');
    });
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click-effect');
    });
}


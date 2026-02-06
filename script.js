document.addEventListener('DOMContentLoaded', () => {
    const pl2 = document.getElementById('pl2');
    const pl1 = document.getElementById('pl1');
    const col3 = document.querySelector('.wrap > .col:nth-child(3)');
    const isMobileQuery = window.matchMedia('(max-width: 1100px)');
    function handleMobileLayout(mediaQuery) {
        if (!pl2 || !pl1 || !col3) return;

        if (mediaQuery.matches) {
            pl1.after(pl2);
        } else {
            if (pl2.parentElement !== col3) {
                col3.prepend(pl2);
            }
        }
    }
    handleMobileLayout(isMobileQuery);
    isMobileQuery.addEventListener('change', handleMobileLayout);
    const copyButtons = document.querySelectorAll('.aim .copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const code = button.getAttribute('data-code');
            navigator.clipboard.writeText(code).then(() => {
                button.classList.add('copied');
                const span = button.querySelector('span'); 
                if (span) {
                    const originalText = span.textContent;
                    span.textContent = 'скопировано!';
                    setTimeout(() => {
                        button.classList.remove('copied');
                        span.textContent = originalText;
                    }, 1500);
                } else {
                    setTimeout(() => button.classList.remove('copied'), 1500);
                }
            }).catch(err => console.error('Ошибка копирования: ', err));
        });
    });
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    function updateThemeIcon(theme) {
        themeToggle.textContent = theme === 'dark' ? '💡' : '🌙';
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.setAttribute('data-theme', 'dark');
    }
    updateThemeIcon(html.getAttribute('data-theme'));

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox__img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;
    const galleryLinks = document.querySelectorAll('.gallery .ph');
    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        if (lightboxImg) lightboxImg.src = '';
        document.body.style.overflow = '';
    };
    galleryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (lightbox && lightboxImg) {
                lightboxImg.src = link.href;
                lightbox.classList.add('is-open');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
    const splashScreen = document.getElementById('splash-screen');
    const splashVideo = document.getElementById('splash-video');
    if (splashScreen) {
        const hideSplash = () => {
            splashScreen.classList.add('is-done');
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 1000);
        };
        if (splashVideo) {
            const isDark = html.getAttribute('data-theme') === 'dark';
            const lightSrc = splashVideo.getAttribute('data-light-src');
            if (!isDark && lightSrc) {
                const source = splashVideo.querySelector('source');
                if (source) {
                    source.src = lightSrc;
                    splashVideo.load();
                }
            }
            splashVideo.addEventListener('ended', hideSplash);
            splashVideo.play().catch(() => setTimeout(hideSplash, 2000));
            setTimeout(hideSplash, 5000); // Fallback
        } else {
            hideSplash();
        }
    }
});
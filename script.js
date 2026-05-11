document.addEventListener('DOMContentLoaded', () => {

    // ── Playlist mobile/desktop layout ──
    const pl1 = document.getElementById('pl1');
    const pl2 = document.getElementById('pl2');
    const col3 = document.querySelector('.wrap > .col:nth-child(3)');

    if (pl1 && pl2 && col3) {
        const isMobileQuery = window.matchMedia('(max-width: 1100px)');

        const handleMobileLayout = (mq) => {
            if (mq.matches) {
                pl1.after(pl2);
            } else if (pl2.parentElement !== col3) {
                col3.prepend(pl2);
            }
        };

        handleMobileLayout(isMobileQuery);
        isMobileQuery.addEventListener('change', handleMobileLayout);
    }

    // ── Crosshair copy buttons ──
    document.querySelectorAll('.aim .copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.dataset.code;
            if (!code) return;

            navigator.clipboard.writeText(code).then(() => {
                btn.classList.add('copied');
                setTimeout(() => btn.classList.remove('copied'), 1500);
            }).catch(err => console.error('Ошибка копирования:', err));
        });
    });

    // ── Theme toggle ──
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    const getSystemTheme = () =>
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    const applyTheme = (theme) => {
        html.setAttribute('data-theme', theme);
        themeToggle.textContent = theme === 'dark' ? '💡' : '🌙';
        themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Светлая тема' : 'Тёмная тема');
    };

    applyTheme(localStorage.getItem('theme') ?? getSystemTheme());

    themeToggle.addEventListener('click', () => {
        const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // ── Gallery lightbox ──
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox?.querySelector('.lightbox__img');
    const lightboxClose = lightbox?.querySelector('.lightbox__close');

    const openLightbox = (src) => {
        lightboxImg.src = src;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
        document.body.style.overflow = '';
    };

    if (lightbox && lightboxImg) {
        document.querySelectorAll('.gallery .ph').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(link.href);
            });
        });

        lightboxClose?.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    // ── Splash screen ──
    const splashScreen = document.getElementById('splash-screen');
    const splashVideo = document.getElementById('splash-video');

    if (splashScreen) {
        const hideSplash = () => {
            splashScreen.classList.add('is-done');
            setTimeout(() => { splashScreen.style.display = 'none'; }, 1000);
        };

        if (splashVideo) {
            // Switch to light video if needed
            if (html.getAttribute('data-theme') !== 'dark') {
                const lightSrc = splashVideo.dataset.lightSrc;
                const source = splashVideo.querySelector('source');
                if (lightSrc && source) {
                    source.src = lightSrc;
                    splashVideo.load();
                }
            }

            splashVideo.addEventListener('ended', hideSplash, { once: true });
            splashVideo.play().catch(() => setTimeout(hideSplash, 2000));
            setTimeout(hideSplash, 5000); // Safety fallback
        } else {
            hideSplash();
        }
    }

});

// ── Scroll-to-top button ──
const scrollTopBtn = document.getElementById('scroll-top');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('is-visible', window.scrollY > 400);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

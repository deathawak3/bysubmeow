(() => {
    'use strict';

    const html = document.documentElement;
    const btn = document.getElementById('theme-toggle');
    const KEY = 'theme';
    const prefersDark = matchMedia('(prefers-color-scheme: dark)');

    const setToggleUI = (theme) => {
        if (!btn) return;
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        btn.ariaLabel = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
    };

    const updateSpotifyEmbeds = (theme) => {
        const val = theme === 'dark' ? '0' : '1';
        document
            .querySelectorAll('iframe[src*="open.spotify.com/embed/playlist"]')
            .forEach((ifr) => {
                try {
                    const u = new URL(ifr.src);
                    u.searchParams.set('theme', val);
                    const next = u.toString();
                    if (ifr.src !== next) ifr.src = next;
                } catch { }
            });
    };

    const updateSocialIcons = (theme) => {
        const suffix = theme === 'dark' ? 'dark' : 'light';
        document.querySelectorAll('.social img').forEach((img) => {
            const src = img.getAttribute('src');
            if (!src) return;

            const themed = src.match(/-(dark|light)(\.\w+)$/);
            if (themed) {
                const base = src.replace(/-(dark|light)(\.\w+)$/, '');
                const ext = themed[2];
                const next = `${base}-${suffix}${ext}`;
                if (next !== src) img.src = next;
                return;
            }

            const guess = src.replace(/(\.\w+)$/, `-${suffix}$1`);
            const probe = new Image();
            probe.onload = () => (img.src = guess);
            probe.src = guess;
        });
    };

    const applyTheme = (theme, { persist = true } = {}) => {
        html.dataset.theme = theme;
        if (persist) localStorage.setItem(KEY, theme);
        setToggleUI(theme);
        updateSpotifyEmbeds(theme);
        updateSocialIcons(theme);
    };

    const initialTheme = () => {
        const saved = localStorage.getItem(KEY);
        if (saved === 'light' || saved === 'dark') return saved;
        if (html.dataset.theme) return html.dataset.theme;
        return prefersDark.matches ? 'dark' : 'light';
    };

    document.addEventListener('DOMContentLoaded', () => {
        applyTheme(initialTheme(), { persist: false });

        btn?.addEventListener('click', () => {
            applyTheme(html.dataset.theme === 'dark' ? 'light' : 'dark');
        });

        prefersDark.addEventListener?.('change', (e) => {
            if (!localStorage.getItem(KEY)) {
                applyTheme(e.matches ? 'dark' : 'light', { persist: false });
            }
        });

        document.querySelectorAll('.copy-btn').forEach((b) => {
            b.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(b.dataset.code ?? '');
                    b.classList.add('copied');
                    setTimeout(() => b.classList.remove('copied'), 1200);
                } catch {
                    alert('Не получилось скопировать :(');
                }
            });
        });
    });
})();

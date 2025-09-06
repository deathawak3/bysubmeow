(() => {
    'use strict';

    const d = document;
    const root = d.documentElement;
    const toggle = d.getElementById('theme-toggle');
    const THEME_KEY = 'theme';
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const setToggleUI = (theme) => {
        if (!toggle) return;
        toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        toggle.setAttribute('aria-label', theme === 'dark' ? 'Светлая тема' : 'Тёмная тема');
    };

    const setSpotifyTheme = (theme) => {
        const val = theme === 'dark' ? '0' : '1';
        d.querySelectorAll('iframe[src*="open.spotify.com/embed/playlist"]').forEach((ifr) => {
            try {
                const u = new URL(ifr.src);
                if (u.searchParams.get('theme') === val) return;
                u.searchParams.set('theme', val);
                ifr.src = u.toString();
            } catch { }
        });
    };

    const setSocialIcons = (theme) => {
        const suffix = theme === 'dark' ? 'dark' : 'light';
        d.querySelectorAll('.social img').forEach((img) => {
            const src = img.getAttribute('src');
            if (!src) return;

            const themed = src.match(/-(dark|light)(\.\w+)$/);
            if (themed) {
                const next = src.replace(/-(dark|light)(\.\w+)$/, `-${suffix}$2`);
                if (next !== src) img.src = next;
                return;
            }

            const guess = src.replace(/(\.\w+)$/, `-${suffix}$1`);
            const probe = new Image();
            probe.onload = () => (img.src = guess);
            probe.src = guess;
        });
    };

    const applyTheme = (theme, persist = true) => {
        root.dataset.theme = theme;
        if (persist) localStorage.setItem(THEME_KEY, theme);
        setToggleUI(theme);
        setSpotifyTheme(theme);
        setSocialIcons(theme);
    };

    const initialTheme = () => {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') return saved;
        if (root.dataset.theme) return root.dataset.theme;
        return media.matches ? 'dark' : 'light';
    };

    d.addEventListener('DOMContentLoaded', () => {
        applyTheme(initialTheme(), false);

        toggle?.addEventListener('click', () => {
            applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
        });

        media.addEventListener?.('change', (e) => {
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(e.matches ? 'dark' : 'light', false);
            }
        });

        d.querySelectorAll('.copy-btn').forEach((btn) => {
            btn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(btn.dataset.code || '');
                    btn.classList.add('copied');
                    setTimeout(() => btn.classList.remove('copied'), 1200);
                } catch {
                    alert('Не получилось скопировать :(');
                }
            });
        });
    });
})();

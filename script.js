// копирование кода прицела
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const code = btn.dataset.code || '';
        try {
            await navigator.clipboard.writeText(code);
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 1200);
        } catch {
            alert('Не получилось скопировать. Код: ' + code);
        }
    });
});

// переключение темы: безопасная инициализация
(function initThemeToggle() {
    document.addEventListener('DOMContentLoaded', () => {
        const root = document.documentElement;
        const btn = document.getElementById('theme-toggle');
        if (!btn) {
            console.warn('[theme] кнопка не найдена (id="theme-toggle")');
            return;
        }
        const KEY = 'theme';
        const apply = (theme) => {
            root.setAttribute('data-theme', theme);
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
            btn.setAttribute('aria-label', theme === 'dark' ? 'Светлая тема' : 'Тёмная тема');
        };

        const saved = localStorage.getItem(KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        apply(saved ?? (prefersDark ? 'dark' : 'light'));

        btn.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            apply(next);
            localStorage.setItem(KEY, next);
        });

        // меняем тему при смене системной, если пользователь не закрепил выбор
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        mq.addEventListener('change', e => {
            if (!localStorage.getItem(KEY)) apply(e.matches ? 'dark' : 'light');
        });
    });
})();

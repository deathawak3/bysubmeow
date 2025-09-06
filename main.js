// копирование кода прицела с простым фолбэком
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const code = btn.dataset.code || '';
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(code);
            } else {
                const ta = document.createElement('textarea');
                ta.value = code;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
            }
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 1200);
        } catch {
            alert('Не получилось скопировать. Код: ' + code);
        }
    });
});

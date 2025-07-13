function applyTheme() {
    const e = localStorage.getItem('theme') || 'dark';
    (document.documentElement.setAttribute('data-theme', e), changeIcon(e));
}
function loadEvents() {
    document.querySelector('#toggle-theme').addEventListener('click', () => {
        changeTheme();
    });
}
function changeTheme() {
    let e = document.documentElement.getAttribute('data-theme');
    ((e = 'dark' === e ? 'light' : 'dark'), document.documentElement.setAttribute('data-theme', e), localStorage.setItem('theme', e), changeIcon(e));
}
function changeIcon(e) {
    const t = document.querySelector('#toggle-theme'),
        n = document.querySelector('#change-theme-icon'),
        c = document.createElement('img');
    ((c.id = 'change-theme-icon'), 'dark' === e && (c.src = './images/svg/sun-icon.svg'), 'light' === e && (c.src = './images/svg/moon-icon.svg'), n && n.remove(), t.appendChild(c));
}
document.addEventListener('DOMContentLoaded', () => {
    (applyTheme(), loadEvents());
});
class UI {}
class Timer {}
const UIManager = new UI(),
    timerManager = new Timer();

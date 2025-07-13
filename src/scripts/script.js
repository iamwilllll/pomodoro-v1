/* Wait to DOMContentLoaded */
document.addEventListener('DOMContentLoaded', () => {
    // Applies the selected or default visual theme to the interface
    applyTheme();

    // Loads and sets up the necessary events for user interaction
    loadEvents();
});

/* functions */
function applyTheme() {
    //Search for the theme that has the local storage, if it doesn't exist, apply the dark theme
    const savedTheme = localStorage.getItem('theme') || 'dark';

    //Apply the 'data-theme' attribute to the document using the 'savedTheme' variable.
    document.documentElement.setAttribute('data-theme', savedTheme);

    changeIcon(savedTheme);
}

function loadEvents() {
    // Add a click event listener to the toggle-theme button
    document.querySelector('#toggle-theme').addEventListener('click', () => {
        // Call changeTheme function, passing the button element as an argument
        changeTheme();
    });
}

function changeTheme() {
    //get the value of the 'data-theme' attribute
    let currentTheme = document.documentElement.getAttribute('data-theme');
    //If the theme is not 'dark' it stays the same, otherwise it changes to 'light'
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme); // the change is applied to the document
    localStorage.setItem('theme', currentTheme); //the change is applied to localstorage

    changeIcon(currentTheme);
}

function changeIcon(theme) {
    // Select the toggle theme button element
    const toggleThemeHTML = document.querySelector('#toggle-theme');

    // Select the current theme icon element (if any)
    const toggleThemeIconHTML = document.querySelector('#change-theme-icon');

    // Create a new image element for the icon
    const img = document.createElement('img');
    img.id = 'change-theme-icon';

    // Set the icon source depending on the theme
    if (theme === 'dark') img.src = '/build/images/svg/sun-icon.svg'; // Show sun icon when in dark mode

    if (theme === 'light') img.src = '/build/images/svg/moon-icon.svg'; // Show moon icon when in light mode

    // Remove the old icon if it exists
    if (toggleThemeIconHTML) toggleThemeIconHTML.remove();

    // Add the new icon to the toggle button
    toggleThemeHTML.appendChild(img);
}

/* create class */
class UI {}
class Timer {}

/* instantiate class */
const UIManager = new UI();
const timerManager = new Timer();

/*
<li>
    <input type="checkbox" />
    <label for="">Task name</label>
</li> 
*/

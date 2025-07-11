/* Wait to DOMContentLoaded */
document.addEventListener('DOMContentLoaded', () => {
    //Search for the theme that has the local storage, if it doesn't exist, apply the dark theme
    const savedTheme = localStorage.getItem('theme') || 'dark';

    //Apply the 'data-theme' attribute to the document using the 'savedTheme' variable.
    document.documentElement.setAttribute('data-theme', savedTheme);
});

//Get the toggle-theme button and apply a 'click' event to it.
document.querySelector('#toggle-theme').addEventListener('click', () => {
    //get the value of the 'data-theme' attribute
    const currentTheme = document.documentElement.getAttribute('data-theme');
    //If the theme is not 'dark' it stays the same, otherwise it changes to 'light'
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme); // the change is applied to the document
    localStorage.setItem('theme', newTheme); //the change is applied to localstorage
});

/* functions */

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

import {CheckinUI} from './checkin';

window.addEventListener("load", () => {
  console.log("Application loaded");
  let ui = new CheckinUI();
  
  let signInButton = document.getElementById('sign-in') as HTMLInputElement;
  signInButton.addEventListener('click', (event) => {
    ui.signIn();
  });
});
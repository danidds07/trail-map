/* Javascript - main.js */
import { app } from "./app/app.js";

/**
 * window.onbeforeunload - Confirm closing the app tab in the browser
 * @param {Event} event
 */
window.onbeforeunload = (event) => {
    //event.preventDefault() !== "" ? "" : "";
}; //window.onbeforeunload

/**
 * window.onload
 */
window.onload = async () => {
    await app.init();
}; //window.onload
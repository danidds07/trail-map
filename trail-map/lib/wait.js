//*******************************************************
//* Wait Dialog - wait.js
//*******************************************************
export const wait = {
    dialog: document.createElement("dialog"),

    /**
     * Show a wait dialog
     * @param {int} type - animation type 
     * @param {int} delay - animation frame delay in miliseconds
     * @param {String} size - font-size style
     * @param {String} message - message to show
     * @returns {undefined}
     */
    show(type, delay, size, message) {
        if(!document.body.contains(this.dialog)) {
            let curFrame = 0;
            let frames = [
                ["🖥️<small>⚪⚪⚪</small>🌏","🖥️<small>⚫⚪⚪</small>🌍","🖥️<small>⚪⚫⚪</small></small>🌎","🖥️<small>⚪⚪⚫</small>🌏","🖥️<small>⚪⚪⚪</small>🌍","🖥️<small>⚪⚪⚫</small>🌎","🖥️<small>⚪⚫⚪</small>🌏","🖥️<small>⚫⚪⚪</small>🌍","🖥️<small>⚪⚪⚪</small>🌎"],
                ["🖥️<small>🔳🔳🔳</small>🌏","🖥️<small>🔲🔳🔳</small>🌍","🖥️<small>🔳🔲🔳</small></small>🌎","🖥️<small>🔳🔳🔲</small>🌏","🖥️<small>🔳🔳🔳</small>🌍","🖥️<small>🔳🔳🔲</small>🌎","🖥️<small>🔳🔲🔳</small>🌏","🖥️<small>🔲🔳🔳</small>🌍","🖥️<small>🔳🔳🔳</small>🌎"],
                ["⚭","⚮","⚯","⚮","⚭","⚬"],
                ["🯅","🯆","🯅","🯇","🯅","🯈"],
                ["▖","▘","▝","▗"],
                ["☰", "☱", "☲", "☴", "☰", "☱", "☳", "☶", "☵", "☳", "☷", "☶", "☴"],
                ["䷪","䷍","䷈","䷉","䷌","䷫","䷀","䷪","䷍","䷄","䷥","䷤","䷅","䷌","䷫","䷀","䷪","䷍","䷄","䷥","䷾","䷿","䷤","䷅","䷌","䷫","䷀"],
                ["䷫","䷌","䷅","䷤","䷿","䷾","䷥","䷄","䷍","䷪","䷀","䷫","䷌","䷅","䷤","䷥","䷄","䷍","䷪","䷀","䷫","䷌","䷉","䷈","䷍","䷪","䷀"],
                ["🕐","🕜","🕑","🕝","🕒","🕞","🕓","🕟","🕔","🕠","🕕","🕡","🕖","🕢","🕗","🕣","🕘","🕤","🕙","🕥","🕚","🕦","🕛","🕧"],
                ["🌏","🌍","🌎"],
                ["🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌑"],
                ["✚","✖"],
                ["▖","▌","▘","▀","▝","▐","▗","▄"],
                ["▂","▃","▄","▅","▆","▇","█","▇","▆","▅","▄","▃","▂","▁"],
                ["◵","◴","◷","◶"],
                ["◱","◰","◳","◲"],
                ["⧑","⧓","⧒","⋈"],
                ["⧑⋈","⧓⋈","⧒⧑","⋈⧓","⋈⧒","⋈⋈"],
                ["⧑⋈⋈","⧓⋈⋈","⧒⧑⋈","⋈⧓⋈","⋈⧒⧑","⋈⋈⧓","⋈⋈⧒","⋈⋈⋈"]
            ];
            type = (typeof type === "number") ? parseInt(type) : 0; 
            type = type % frames.length; 
            delay = (typeof delay === "number") ? parseInt(delay) : 333; 
            delay = delay >= 50 ? delay : 333;
            size = (typeof size === "string") ? size : "2rem"; 
            size = size.length >= 3 ? size : "2rem"; 
            message = (typeof message === "string") ? message : ""; 

            this.dialog.innerHTML = "";
            let content = document.createElement("div");
            content.style.fontFamily = "sans-serif";
            content.style.fontSize = size;
            content.innerHTML = frames[type][curFrame];
            this.dialog.style.border = "none";
            this.dialog.style.outline = "none";
            this.dialog.appendChild(content);
            let interval = setInterval(() => {
                curFrame = (curFrame + 1) % frames[type].length;
                content.innerHTML = frames[type][curFrame] + message;
            }, delay);
            this.dialog.onclose = () => {
                clearInterval(interval);
                if(document.body.contains(this.dialog)) document.body.removeChild(this.dialog);
            };
            this.dialog.oncancel = (event) => event.preventDefault();
            document.body.appendChild(this.dialog);
            this.dialog.showModal();
        }
    },
    /**
     * Hide and close wait dialog
     * @returns {undefined}
     */
    hide() {
        this.dialog.close();
    }
};
class TxtType {
    constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = "";
        this.isDeleting = false;
        this.tick();
    }

    tick() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Cursor is placed before the text
        this.el.innerHTML = `<span class="wrap">${this.txt}</span> <span class="cursor">|</span>`;

        let delta = 200 - Math.random() * 100;

        if (this.isDeleting) {
            delta /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === "") {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(() => this.tick(), delta);
    }
}

window.onload = () => {
    const elements = document.getElementsByClassName("typewrite");
    Array.from(elements).forEach((element) => {
        const toRotate = element.getAttribute("data-type");
        const period = element.getAttribute("data-period");
        if (toRotate) {
            new TxtType(element, JSON.parse(toRotate), period);
        }
    });

    // Inject CSS for cursor and text styling
    const css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = `
        .typewrite > .wrap { display: inline-block; }
        .cursor { display: inline-block; margin-right: 5px; animation: blink-cursor 0.7s steps(1) infinite; }
        @keyframes blink-cursor { 50% { opacity: 0; } }
    `;
    document.body.appendChild(css);
};

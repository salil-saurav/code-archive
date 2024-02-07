document.addEventListener("DOMContentLoaded", () => {
    const accordionTitle = document.querySelectorAll(".card-header");

    const resMain = document.querySelector(".result-main-cont");

    function countAllChild(element) {
        let count = 0;

        function traverse(node) {
            count++;
            for (let i = 0; i < node.childNodes.length; i++) {
                traverse(node.childNodes[i]);
            }
        }
        traverse(element);
        return count;
    }

    if (countAllChild(resMain) > 10) {
        resMain.style.display = "block";
    }
});

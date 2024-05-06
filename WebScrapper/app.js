document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading");

    function processElement(element, depth, container) {
        const indentation = "  ".repeat(depth); // Adjust the indentation as needed

        // Process child elements
        for (const childElement of element.childNodes) {
            if (
                childElement.nodeType === Node.ELEMENT_NODE &&
                childElement.tagName.toLowerCase() === "span"
            ) {
                // If it's a span element within a p tag, include the text content
                const textContent = childElement.textContent.trim();
                if (textContent) {
                    const textElement = document.createTextNode(
                        `${indentation}${textContent}`
                    );
                    container.appendChild(textElement);
                }
            } else if (childElement.nodeType === Node.ELEMENT_NODE) {
                // If it's an element node, process it recursively
                processElement(childElement, depth, container);
            }
        }

        // If the current element is a heading element or not a p tag, add the element to the container
        if (isHeadingElement(element)) {
            // If the current element is a heading element, add the element to the container
            const newElement = document.createElement(element.tagName);
            newElement.textContent = `${indentation}[${
                element.tagName
            }] ${element.textContent.trim()}`;
            container.appendChild(newElement);
        } else if (element.nodeType === Node.ELEMENT_NODE && element.tagName) {
            // Avoid creating an extra element for span within p
            const newElement = document.createElement(element.tagName);
            newElement.textContent = element.textContent.trim();
            container.appendChild(newElement);
            removeTextNodesOutsideTags(newElement);
        }
    }

    function removeTextNodesOutsideTags(element) {
        const parentNode = element.parentNode;
        const childNodes = parentNode.childNodes;
        for (let i = childNodes.length - 1; i >= 0; i--) {
            const node = childNodes[i];
            if (node !== element && node.nodeType === Node.TEXT_NODE) {
                parentNode.removeChild(node);
            }
        }
    }

    function isHeadingElement(element) {
        return /^H[1-6]$/i.test(element.tagName);
    }

    // Check for heading tag

    const result = document.getElementById("result-main");
    const filterResult = () => {
        const otherElements = result.querySelectorAll(
            "script, a, svg, img, noscript, picture, br, path, canvas, figure, video, iframe, embed, object, map, audio, button, svg, head, link, header, footer, google-cast-launcher, select, textarea, input, form, label, datalist, fieldset, legend, meter, optgroup, option, output, progress"
        );
        otherElements.forEach((element) => element.remove());

        const toRemove = result.querySelectorAll("div, ul, strong");
        toRemove.forEach((element) => element.remove());
    };
    const fetched = document.getElementById("fetched-content");
    const resContainer = document.querySelector(".res-container");
    const searchInput = document.getElementById("search-input");
    const getDataBtn = document.getElementById("get-data");
    const errorMsg = document.querySelector(".error-msg");
    const showResults = (data) => {
        result.innerHTML = "";
        if (!data) {
            setTimeout(() => {
                errorMsg.style.display = "flex";
            }, 100);
            setTimeout(() => {
                errorMsg.style.opacity = "1";
            }, 300);
            loading.style.display = "none";
            loading.style.opacity = 0;
            setTimeout(() => {
                errorMsg.style.opacity = "0";
            }, 3000);
            setTimeout(() => {
                errorMsg.style.display = "none";
            }, 3100);
        }
        if (result.innerHTML.trim().length === 0) {
            setTimeout(() => {
                loading.style.display = "block";
            }, 10);
            setTimeout(() => {
                loading.style.opacity = 1;
            }, 20);
            setTimeout(() => {
                loading.style.opacity = 0;
            }, 1200);
            setTimeout(() => {
                result.style.opacity = 1;
                processElement(data, 1, result);
                filterResult();
            }, 1500);
            setTimeout(() => {
                resContainer.style.display = "block";
            });
        }
    };
    getDataBtn.addEventListener("click", () => {
        const destroyFast = (container) => {
            while (container.firstChild)
                container.removeChild(container.firstChild);
        };
        const value = searchInput.value.trim();
        const data = fetched.querySelector(value);
        showResults(data);
    });

    const resultPara = document.querySelector(".result-para");
    const linebreakheading = document.querySelector(".line-break-heading");
    const linebreak = document.querySelector(".line-break");

    (() => {
        const fetchFlag = fetched.innerHTML.trim();
        if (fetchFlag.length === 0) {
            searchInput.setAttribute("disabled", true);
            getDataBtn.setAttribute("disabled", true);
            resultPara.style.display = "none";
        } else {
            fetched.style.display = "block";
            linebreak.style.display = "block";
            linebreakheading.style.display = "block";
        }
    })();
});

$(document).ready(function () {
    $(".hum-burger").click(function () {
        $(".main-navigation").slideToggle();
        //$("ul.sub-menu").parent().append("<span>Arrow</span>");
    });
    $("ul#top-menu>li>span").click(function () {
        $(this).toggleClass("active");
        $(this).siblings("ul.sub-menu").slideToggle();
    });
});

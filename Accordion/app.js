document.addEventListener("DOMContentLoaded", () => {
    // Select image containers
    const imageContainer = document
        .getElementById("imageContainer")
        .querySelector(".e-con-inner")
        .querySelectorAll("div[data-widget_type='image-box.default']");

    // Define styles for hidden and shown images
    const imgStyleHidden = {
        opacity: "0",
        transform: "translateY(30px)",
    };
    const imgStyleShow = {
        opacity: "1",
        transform: "translateY(0)",
    };

    // Apply styles to image containers
    imageContainer &&
        imageContainer.forEach((img, idx) => {
            img.style.transition = "all 0.3s ease-in-out";
            if (idx !== 0) {
                img.style.display = "none";
                Object.assign(img.style, imgStyleHidden);
            }
        });

    // Select accordion items
    const accordionContainer = document
        .getElementById("accordionContainer")
        .querySelectorAll(".elementor-accordion-item");

    // Add click event listener to accordion items
    accordionContainer &&
        accordionContainer.forEach((item, index) => {
            const accLink = item.querySelector("div:first-child");

            accLink.addEventListener("click", () => {
                // Show or hide corresponding image containers
                imageContainer.forEach((imgItem, imgIndex) => {
                    if (index === imgIndex) {
                        imgItem.style.display = "block";
                        setTimeout(() => {
                            Object.assign(imgItem.style, imgStyleShow);
                        }, 50);
                    } else {
                        setTimeout(() => {
                            Object.assign(imgItem.style, imgStyleHidden);
                        }, 50);
                        imgItem.style.display = "none";
                    }
                });
            });
        });

    //  Icon custom style

    // Select icon container
    const iconContainer = document.getElementById("iconContainer");

    // Define styles for icon links
    const customStyle = {
        backgroundColor: "#605d32",
        color: "#EBEBD6",
    };
    const initialStyle = {
        backgroundColor: "#EBEBD6",
        color: "#646D63",
    };

    // Define styles for clicked links
    const linkStyle = {
        backgroundColor: "#E8E1DA",
        borderRadius: "50%",
    };

    // Apply styles to icon links
    iconContainer &&
        iconContainer
            .querySelector("ul")
            .querySelectorAll("li")
            .forEach((item) => {
                // Prevent default click behavior
                item.querySelector("a").addEventListener("click", (ev) =>
                    ev.preventDefault()
                );
                item.addEventListener("click", function (evt) {
                    // Reset background color of all links
                    iconContainer
                        .querySelector("ul")
                        .querySelectorAll("li")
                        .forEach(
                            (item) => (item.style.backgroundColor = "initial")
                        );

                    // Apply style to clicked link
                    Object.assign(item.style, linkStyle);

                    // Get target element and apply custom styles
                    const linkAtrr = item
                        .querySelector("a")
                        .getAttribute("href")
                        .replace(/#/g, "");

                    const targetElement =
                        document.getElementById(linkAtrr).parentElement
                            .parentElement;

                    try {
                        // Reset styles of other elements and scroll to target
                        document
                            .querySelectorAll(".card-container")
                            .forEach((container) => {
                                container
                                    .querySelectorAll(
                                        ".e-con-inner:first-child"
                                    )
                                    .forEach((item) => {
                                        if (item.children.length > 2) {
                                            item.childNodes.forEach((node) => {
                                                if (
                                                    node.nodeType !==
                                                    Node.TEXT_NODE
                                                ) {
                                                    Object.assign(
                                                        node.style,
                                                        initialStyle
                                                    );
                                                }
                                            });
                                        }
                                    });
                            });

                        // Scroll to target element
                        const customScroll = (element, offset) => {
                            const elementPosition =
                                element.getBoundingClientRect().top;

                            if (elementPosition < 500) {
                                return;
                            } else {
                                const offsetPosition =
                                    elementPosition + window.scrollY - offset;

                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: "smooth",
                                });
                            }
                        };
                        customScroll(targetElement, 600);
                    } catch (error) {
                        console.error(error.message);
                    }
                    Object.assign(targetElement.style, customStyle);
                });
            });
});

//  How much will you rate my code on the scale of 10 in each aspect of code review

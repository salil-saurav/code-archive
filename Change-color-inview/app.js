document.addEventListener("DOMContentLoaded", () => {
    const tabLinks = document.getElementById("tab-links"); // Get the tab links container element
    const offset = 100; // Offset value to delay activation

    if (tabLinks) {
        // Add a scroll event listener to the window
        window.addEventListener("scroll", () => {
            let activeFound = false; // Flag to indicate if an active item has been found

            tabLinks.querySelectorAll("li").forEach((item) => {
                item.classList.remove("active");
            });

            // Iterate over each 'li' element to check visibility and assign 'active' class
            tabLinks.querySelectorAll("li").forEach((item) => {
                // Add a click event listener to each 'li' element
                item.addEventListener("click", (evt) => {
                    evt.target.classList.add("active"); // Add 'active' class to the clicked 'li' element
                });

                // Only proceed if no active item has been found yet
                if (!activeFound) {
                    const id = item
                            .querySelector("a")
                            .getAttribute("href")
                            .replace("#", ""),
                        target = document.getElementById(id);

                    // If the target element exists
                    if (target) {
                        const rect = target.getBoundingClientRect(),
                            isVisible =
                                rect.top < window.innerHeight - offset &&
                                rect.bottom >= offset; // Check if the element is visible with the specified offset

                        if (isVisible) {
                            item.classList.add("active"); // Add 'active' class to the 'li' element
                            activeFound = true; // Set the flag to true as an active item is found
                        }
                    }
                }
            });
        });

        // Add click event listeners to each 'li' element to manage active class
        tabLinks.querySelectorAll("li").forEach((item) => {
            const anchor = item.querySelector("a");

            anchor &&
                anchor.addEventListener("click", (e) => {
                    e.preventDefault();
                    const id = anchor.getAttribute("href").replace("#", ""),
                        target = document.getElementById(id);

                    target && customScroll(target, 100);
                });

            item.addEventListener("click", (evt) => {
                // Remove 'active' class from all 'li' elements
                tabLinks.querySelectorAll("li").forEach((el) => {
                    el.classList.remove("active");
                });

                evt.currentTarget.classList.add("active");
            });
        });
    }
});

function customScroll(element, offset) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
    });
}

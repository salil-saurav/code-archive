const isLoggedin = () => {
    return document.body.classList.contains("logged-in");
};

const errorMessage =
    "Something went Wrong. Please ensure all headings are in H3 tags, with their respective descriptions placed in paragraph tags";

document.addEventListener("DOMContentLoaded", () => {
    const hiddenTab = document.getElementById("hidden_tab"),
        resultTab = document.getElementById("tabgroup_visible"),
        tabList = document.getElementById("tabList"),
        tabContent = document.getElementById("tabContent");

    if (!hiddenTab || !resultTab) return; // Early exit if tabs are not found

    const allHeadings = hiddenTab.querySelectorAll("h3");

    if (allHeadings.length === 0 && isLoggedin()) {
        resultTab.innerHTML = errorMessage;
    }

    if (!allHeadings) return;

    allHeadings.forEach((heading) => {
        const id = generateId(heading.textContent);
        const content = heading.nextElementSibling;

        // Create and append the tab element
        const listElement = createTabElement(heading.textContent, id);
        tabList.appendChild(listElement);

        if (content.tagName.toLowerCase() === "p") {
            // Create and append the tab content
            const contentElement = createTabContentElement(
                heading.textContent,
                id,
                content
            );
            tabContent.appendChild(contentElement);
        } else {
            // is Admin

            if (isLoggedin()) {
                resultTab.innerHTML = errorMessage;
            }
        }
    });

    hiddenTab.remove();
});

// Helper function to generate an ID from heading text
const generateId = (text) => {
    return text.toLowerCase().trim().replace(/\s+/g, "_");
};

// Helper function to create a tab element
const createTabElement = (headingText, id) => {
    const list = document.createElement("li");
    list.classList.add("tab__element");

    const listHeading = document.createElement("h3");
    const listButton = document.createElement("a");
    listButton.setAttribute("href", `#${id}`);
    listButton.textContent = headingText;

    listHeading.appendChild(listButton);
    list.appendChild(listHeading);

    return list;
};

// Helper function to create tab content
const createTabContentElement = (headingText, id, content) => {
    const contentElement = document.createElement("div");
    contentElement.classList.add("tab__content_inner");
    contentElement.setAttribute("id", id);

    const contentHeading = document.createElement("h3");
    contentHeading.textContent = headingText;
    contentElement.appendChild(contentHeading);

    if (content) {
        const article = document.createElement("article");
        article.textContent = content.textContent;
        contentElement.appendChild(article);
    }

    return contentElement;
};

document.addEventListener("DOMContentLoaded", () => {
    const tabVisibilityHandler = () => {
        const tabList = document.getElementById("tabList");

        if (!tabList) return;

        const buttons = tabList.querySelectorAll("li h3 a");

        buttons.forEach((button, index) => {
            const targetId = button.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            // Initialize the first tab as active
            if (index === 0) {
                setActiveTab(button.parentElement, targetElement, true);
            }

            button.addEventListener("click", (evt) => {
                evt.preventDefault();
                handleTabClick(button, targetElement);
            });
        });
    };

    // Helper function to handle tab click
    const handleTabClick = (button, targetElement) => {
        const tabList = document.getElementById("tabList");
        const tabContent = document.getElementById("tabContent");

        // Deactivate all buttons and content
        deactivateAllTabs(tabList, tabContent);

        // Activate clicked tab
        setActiveTab(button.parentElement, targetElement);
    };

    // Helper function to deactivate all tabs
    const deactivateAllTabs = (tabList, tabContent) => {
        tabList.querySelectorAll("li h3").forEach((head) => {
            head.classList.remove("active");
        });

        tabContent.querySelectorAll(".tab__content_inner").forEach((ele) => {
            ele.classList.remove("active", "animate");
        });
    };

    // Helper function to set the active tab and content
    const setActiveTab = (tabButton, tabContent, immediate = false) => {
        tabButton.classList.add("active");

        if (tabContent) {
            tabContent.classList.add("active");

            if (!immediate) {
                setTimeout(() => {
                    tabContent.classList.add("animate");
                }, 100);
            } else {
                tabContent.classList.add("animate");
            }
        }
    };

    tabVisibilityHandler();
});

// Change the tags of label

document.addEventListener("DOMContentLoaded", () => {
    const faqContainer = document.querySelector(".faq__wrap");

    if (!faqContainer) return;

    const faqQuestions = faqContainer.querySelectorAll(".ays-sub-question");

    faqQuestions.forEach((question) => {
        const label = question.querySelector("label");

        label && appendHeading(label, question) && label.remove();
    });
});

const appendHeading = (label, container) => {
    const headingTag = document.createElement("h3");

    headingTag.classList.add(...label.classList);
    headingTag.textContent = label.textContent;

    container.appendChild(headingTag);

    return true;
};

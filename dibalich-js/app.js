//  Function for displaying result with delayed response

/**
 * Debounce function to limit the frequency of function invocation.
 *
 * @param {Function} func - The function to be debounced.
 * @param {number} delay - The delay in milliseconds before invoking the function.
 * @returns {Function} - The debounced function.
 */
const debounce = (func, delay) => {
    let timeoutId;

    // Return a new function that will be the debounced version of the original function.
    return function () {
        // Preserve the context and arguments of the original function.
        const context = this;
        const args = arguments;

        // Clear the previous timeout.
        clearTimeout(timeoutId);

        // Set a new timeout to invoke the original function after the specified delay.
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};
const homePage = document.body.classList.contains("home");
const resultDisplayDelay = 300;

// Execute the following code when the DOM is fully loaded
// Assign DOM elements to the declared variables
const propertyStatus = document.getElementById("property-status");
const bedroom = document.getElementById("bedroom");
const bathroom = document.getElementById("bathroom");
const car = document.getElementById("car");
const propertyInput = document.getElementById("property-input");
const selectSort = document.getElementById("date-filter");
const result = document.querySelectorAll(".res");
const openResult = document.querySelectorAll(".open-res");
const soldResult = document.querySelectorAll(".sold-res");

// Get reference to the container that holds the property results
const resContainer = document.getElementById("res-container");
const loadMore = document.getElementById("load-more");

// Create a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver((mutations) => {
    const noProperty = document.getElementById("no-property");

    // Iterate through each mutation
    mutations.forEach((mutation) => {
        // Check if the mutation is of type "childList" (changes in the child nodes)
        if (mutation.type === "childList") {
            // If the number of child nodes in the container is zero, display the "noProperty" element; otherwise, hide it
            resContainer.children.length === 0
                ? (noProperty.style.display = "block")
                : (noProperty.style.display = "none");
            resContainer.children.length >= 12
                ? (loadMore.style.display = "none")
                : (loadMore.style.display = "inline-block");
        }
    });
});

// Configure the observer to listen for specific types of changes
const config = {
    childList: true, // Watch for changes in the child nodes
};

// Start observing the changes in the resContainer with the specified configuration
if (resContainer) {
    observer.observe(resContainer, config);
}

// Get Current page URL
const currentPageUrl = window.location.href;

// Function to get the value of the selected option in a dropdown and convert it to lowercase
function getSelectedOption(selectElement) {
    // Get the value of the selected option
    const selectedOption =
        selectElement.options[selectElement.selectedIndex].value;
    // Convert to lowercase and return
    return selectedOption.toLowerCase();
}

// Function to get the label text of the selected option in a dropdown and convert it to lowercase
function getSelectedOptionLabel(selectElement) {
    // Get the label text of the selected option
    const selectedOption =
        selectElement.options[selectElement.selectedIndex].innerText;
    // Convert to lowercase and return
    return selectedOption.toLowerCase();
}

// Function to get visible results with a specific class name
const getVisibleResults = (className) => {
    // Get all elements with the specified class name
    const elements = document.querySelectorAll(`.${className}`);
    const filtered = [];

    // Iterate through each element
    elements.forEach((ele) => {
        // Check if the element is visible based on its display style and class
        const isVisible =
            (ele.style.display === "block" &&
                !ele.classList.contains("sold-res")) ||
            (ele.style.display === "flex" &&
                ele.classList.contains("open-res"));

        // If the element is visible or has the specified class, add it to the filtered array
        if (isVisible || ele.classList.contains(className)) {
            filtered.push(ele);
        }
    });

    // Return the filtered array of visible elements
    return filtered;
};

// Function to toggle the class of results
const toggleResultClass = (results) => {
    results.forEach((res) => {
        // Check if the result is currently hidden
        if (res.style.display === "none") {
            // If hidden, remove it from the DOM
            res.remove();
        } else {
            // If visible, append it to the resContainer
            resContainer.appendChild(res);
        }
    });
};

// Function to filter results based on the provided criteria
const filterResult = (selected, inpVal, displayValue) => {
    // Extract and normalize the address text from the selected result
    try {
        const addressText = selected
            .querySelector(".result-address")
            .textContent.trim()
            .toLowerCase();

        // Check if the address text includes the input value or if the input value is empty
        if (addressText.includes(inpVal) || inpVal.length === 0) {
            // If the criteria match, set the display property to the specified value
            selected.style.display = displayValue;
        } else {
            // If the criteria do not match, hide the result
            selected.style.display = "none";
        }
    } catch (err) {
        console.error(err);
    }
};

// ---------------------------------------------------

// loadMoreResultsHandler();

// ---------------------------------------------------

// Debounced input change handler
const debouncedInputChange = debounce(() => {
    // Get the trimmed and lowercase value of the property input
    const inputValue = propertyInput.value.trim().toLowerCase();

    // Function to filter and display results based on the provided criteria
    const filterAndDisplay = (results, displayValue) => {
        results.forEach((res) => {
            filterResult(res, inputValue, displayValue);
        });
        toggleResultClass(results);
    };
    // loadMoreResultsHandler();

    // Filter and display results for different result types
    filterAndDisplay(result, "block");
    filterAndDisplay(openResult, "flex");
    filterAndDisplay(soldResult, "block");
}, resultDisplayDelay); // Delay before invoking the debounced function

function displayInitialResults() {
    // Get the visible divs for all and sold properties (limiting to 12 initially)
    const visibleDivsSold = document.querySelectorAll(
        ".sold-res:nth-child(-n+12)"
    );
    const visibleDivsAll = document.querySelectorAll(".res:nth-child(-n+12)");

    // const visibleDivsOpen = document.querySelectorAll(".res:nth-child(-n+6)");
    if (homePage) {
        console.log(resContainer.children.length);
        if (resContainer.children.length > 6) {
            // Remove extra children starting from the 7th child
            for (let i = 2; i < resContainer.children.length; i++) {
                resContainer.removeChild(resContainer.children[i]);
                console.log("removed");
            }
        }
    } else {
        if (getSelectedOptionLabel(propertyStatus) !== "open") {
            console.log(getSelectedOptionLabel(propertyStatus));
            resContainer.innerHTML = "";
            visibleDivsAll.forEach((res) => resContainer.appendChild(res));
            visibleDivsSold.forEach((res) => resContainer.appendChild(res));
        }
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------
// show & Hide loadmore Button

const createShowResultsOnce = () => {
    let flag = false;

    return function showAllResults() {
        if (!flag) {
            result.forEach((res) => {
                resContainer.appendChild(res);
            });
            loadMore.style.display = "none";
            flag = true; // Set flag to true after execution
        }
    };
};

// Create an instance of showAllResults with closure
const showResultsOnce = createShowResultsOnce();

//  ----------------------------------------------------------------------------------------------------
// Execute the following code when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Redirect the page based on the selected option

    Array.from(propertyStatus.options).forEach((option) => {
        const optionValue = option.value;

        // Set the "selected" attribute for the option matching the current page URL
        if (optionValue === currentPageUrl) {
            option.setAttribute("selected", "selected");
        } else {
            option.removeAttribute("selected");
        }
    });

    // Function to handle the status change and redirect the page
    const handleStatusChange = () => {
        const selectedOption = getSelectedOption(propertyStatus);
        if (selectedOption && selectedOption !== currentPageUrl) {
            window.location.href = selectedOption;
        }
    };

    // Function to filter results based on the selected option for numeric criteria
    const filterResultWithSelected = (result, element, dataVal) => {
        const selectedValue = parseInt(getSelectedOption(element));
        const propValue = +result.querySelector("h6").dataset[dataVal];

        if (isNaN(selectedValue)) {
            // If selected value is not a number, display the result
            result.style.display = "block";
        } else if (
            result.style.display === "block" ||
            result.classList.contains("result")
        ) {
            // Check if the property value is greater than or equal to the selected value
            if (propValue >= selectedValue) {
                result.style.display = "block";
            } else {
                result.style.display = "none";
            }
        }
    };
    const firstChangeFlags = {};

    // Function to debounce changes in the filter input values
    const debouncedFilterChange = (filterElement, filterParam, resultClass) =>
        debounce(() => {
            const isFirstChange = firstChangeFlags[filterElement.id];

            if (isFirstChange === undefined || isFirstChange) {
                const filterRes = getVisibleResults(resultClass);

                // Filter results based on the selected criteria and display values
                filterRes.forEach((res) =>
                    filterResultWithSelected(res, filterElement, filterParam)
                );
                toggleResultClass(filterRes);

                firstChangeFlags[filterElement.id] = false;
            } else {
                result.forEach((res) =>
                    filterResultWithSelected(res, filterElement, filterParam)
                );
                toggleResultClass(result);
            }

            // Toggle the result class based on visibility
        }, resultDisplayDelay);

    // Usage of debouncedFilterChange for different filter elements
    const debouncedValChange = debouncedFilterChange(bedroom, "bed", "res");
    const debouncedBathChange = debouncedFilterChange(bathroom, "bath", "res");
    const debouncedCarChange = debouncedFilterChange(car, "car", "res");

    // Event listeners for input and change events

    propertyInput.addEventListener("input", debouncedInputChange);
    // propertyInput.addEventListener("click", showResultsOnce);
    propertyStatus.addEventListener("change", handleStatusChange);
    bedroom.addEventListener("change", debouncedValChange);
    bathroom.addEventListener("change", debouncedBathChange);
    car.addEventListener("change", debouncedCarChange);
});

// -------------------------------------------------------------------------------------------------------------------------------------------------

// open Properties

// Execute the following code when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Check the selected option label of the propertyStatus dropdown
    if (getSelectedOptionLabel(propertyStatus) === "open") {
        // Function to filter results based on the selected option for numeric criteria
        const filterResultWithSelected = (result, element, spanClass) => {
            const selectedValue = parseInt(getSelectedOption(element));
            const propValue = +result.querySelector(`.${spanClass}`)
                .textContent;

            if (isNaN(selectedValue)) {
                // If selected value is not a number, display the result as flex
                result.style.display = "flex";
            } else if (
                result.style.display === "flex" ||
                result.classList.contains("open-res")
            ) {
                // Check if the property value is greater than or equal to the selected value
                if (propValue >= selectedValue) {
                    result.style.display = "flex";
                } else {
                    result.style.display = "none";
                }
            }
        };

        // Function to debounce changes in the filter input values
        const firstChangeFlags = {};

        // Function to debounce changes in the filter input values
        const debouncedFilterChange = (
            filterElement,
            filterParam,
            resultClass
        ) =>
            debounce(() => {
                const isFirstChange = firstChangeFlags[filterElement.id];

                if (isFirstChange === undefined || isFirstChange) {
                    const filterRes = getVisibleResults(resultClass);

                    // Filter results based on the selected criteria and display values
                    filterRes.forEach((res) =>
                        filterResultWithSelected(
                            res,
                            filterElement,
                            filterParam
                        )
                    );
                    toggleResultClass(filterRes);

                    firstChangeFlags[filterElement.id] = false;
                } else {
                    openResult.forEach((res) =>
                        filterResultWithSelected(
                            res,
                            filterElement,
                            filterParam
                        )
                    );
                    toggleResultClass(openResult);
                }

                // Toggle the result class based on visibility
            }, resultDisplayDelay);

        // Usage of debouncedFilterChange for different filter elements for "open" status
        const debouncedValChange = debouncedFilterChange(
            bedroom,
            "bedrooms",
            "open-res"
        );
        const debouncedBathChange = debouncedFilterChange(
            bathroom,
            "bathrooms",
            "open-res"
        );
        const debouncedCarChange = debouncedFilterChange(
            car,
            "garages",
            "open-res"
        );

        // Event listeners for input and change events
        propertyInput.addEventListener("input", debouncedInputChange);
        bedroom.addEventListener("change", debouncedValChange);
        bathroom.addEventListener("change", debouncedBathChange);
        car.addEventListener("change", debouncedCarChange);
    } else if (getSelectedOptionLabel(propertyStatus) === "sold") {
        // Function to filter results based on the selected option for numeric criteria
        const filterResultWithSelected = (result, element, spanClass) => {
            const selectedValue = parseInt(getSelectedOption(element));
            const propValue = +result.querySelector(`.${spanClass}`)
                .textContent;

            if (isNaN(selectedValue)) {
                // If selected value is not a number, display the result as block
                result.style.display = "block";
            } else if (
                result.style.display === "block" ||
                result.classList.contains("sold-res")
            ) {
                // Check if the property value is greater than or equal to the selected value
                if (propValue >= selectedValue) {
                    result.style.display = "block";
                } else {
                    result.style.display = "none";
                }
            }
        };

        // Function to debounce changes in the filter input values
        const firstChangeFlags = {};

        // Function to debounce changes in the filter input values
        const debouncedFilterChange = (
            filterElement,
            filterParam,
            resultClass
        ) =>
            debounce(() => {
                const isFirstChange = firstChangeFlags[filterElement.id];

                if (isFirstChange === undefined || isFirstChange) {
                    const filterRes = getVisibleResults(resultClass);

                    // Filter results based on the selected criteria and display values
                    filterRes.forEach((res) =>
                        filterResultWithSelected(
                            res,
                            filterElement,
                            filterParam
                        )
                    );
                    toggleResultClass(filterRes);

                    firstChangeFlags[filterElement.id] = false;
                } else {
                    soldResult.forEach((res) =>
                        filterResultWithSelected(
                            res,
                            filterElement,
                            filterParam
                        )
                    );
                    toggleResultClass(soldResult);
                }

                // Toggle the result class based on visibility
            }, resultDisplayDelay);

        // Usage of debouncedFilterChange for different filter elements for "sold" status
        const debouncedValChange = debouncedFilterChange(
            bedroom,
            "bedrooms",
            "sold-res"
        );
        const debouncedBathChange = debouncedFilterChange(
            bathroom,
            "bathrooms",
            "sold-res"
        );
        const debouncedCarChange = debouncedFilterChange(
            car,
            "garages",
            "sold-res"
        );

        // Event listeners for input and change events
        propertyInput.addEventListener("input", debouncedInputChange);
        bedroom.addEventListener("change", debouncedValChange);
        bathroom.addEventListener("change", debouncedBathChange);
        car.addEventListener("change", debouncedCarChange);
    }
});

// -------------------------------------------------------------------------------------------------------------------------------------------------

//  Rearrange the result based on Order

// Execute the following code when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Get the order select element
    const orderSelect = document.getElementById("date-filter");

    Array.from(orderSelect).forEach((option) => {
        if (
            getSelectedOptionLabel(propertyStatus) === "sold" &&
            option.value === "sold"
        ) {
            console.log(getSelectedOptionLabel(propertyStatus));
            option.setAttribute("selected", "selected");
        }
    });

    // Function to sort property cards by date using merge sort
    const sortByDate = (param) => {
        const allPropertyCards = getVisibleResults("res");
        const soldPropertyCards = getVisibleResults("sold-res");
        const openPropertyCards = getVisibleResults("open-res");
        const homeResult = getVisibleResults("result");

        // Merge sort implementation for sorting property cards by date
        function mergeSort(arr) {
            if (arr.length <= 1) {
                return arr;
            }

            const middle = Math.floor(arr.length / 2);
            const left = arr.slice(0, middle);
            const right = arr.slice(middle);

            return merge(mergeSort(left), mergeSort(right));
        }

        function merge(left, right) {
            let result = [];
            let leftIndex = 0;
            let rightIndex = 0;

            while (leftIndex < left.length && rightIndex < right.length) {
                const dateLeft = new Date(
                    left[leftIndex]
                        .querySelector("[data-date]")
                        .getAttribute("data-date")
                );
                const dateRight = new Date(
                    right[rightIndex]
                        .querySelector("[data-date]")
                        .getAttribute("data-date")
                );

                if (param === "asc") {
                    if (dateLeft >= dateRight) {
                        result.push(left[leftIndex]);
                        leftIndex++;
                    } else {
                        result.push(right[rightIndex]);
                        rightIndex++;
                    }
                } else if (param === "dec") {
                    if (dateLeft <= dateRight) {
                        result.push(left[leftIndex]);
                        leftIndex++;
                    } else {
                        result.push(right[rightIndex]);
                        rightIndex++;
                    }
                }
            }

            return result
                .concat(left.slice(leftIndex))
                .concat(right.slice(rightIndex));
        }

        // Apply merge sort to property cards and append to the container
        const sortedAllPropertyCards = mergeSort(Array.from(allPropertyCards));
        const sortedSoldPropertyCards = mergeSort(
            Array.from(soldPropertyCards)
        );
        const sortedOpenPropertyCards = mergeSort(
            Array.from(openPropertyCards)
        );

        if (homePage) {
            const sortedRes = mergeSort(Array.from(homeResult));
            const homeSortedFragments = document.createDocumentFragment();

            sortedRes.forEach((card) => homeSortedFragments.appendChild(card));
            resContainer.appendChild(homeSortedFragments);
        }

        const allFragment = document.createDocumentFragment();
        const soldFragment = document.createDocumentFragment();
        const openFragment = document.createDocumentFragment();

        sortedAllPropertyCards.forEach((card) => allFragment.appendChild(card));
        sortedSoldPropertyCards.forEach((card) =>
            soldFragment.appendChild(card)
        );
        sortedOpenPropertyCards.forEach((card) =>
            openFragment.appendChild(card)
        );

        resContainer.appendChild(allFragment);
        resContainer.appendChild(soldFragment);
        resContainer.appendChild(openFragment);
    };

    // Function to sort property cards by price
    function sortByPrice(param, container, className) {
        const propertyCards = getVisibleResults(className);

        // Convert NodeList to Array and sort based on data-price attribute
        const sortedElements = Array.from(propertyCards).sort((a, b) => {
            const priceA =
                parseFloat(
                    a
                        .querySelector(".result-address")
                        .getAttribute("data-price")
                ) || 0;
            const priceB =
                parseFloat(
                    b
                        .querySelector(".result-address")
                        .getAttribute("data-price")
                ) || 0;

            if (param === "asc") {
                return priceB - priceA;
            } else if (param === "dec") {
                return priceA - priceB;
            }
        });

        // Clear the container and append sorted elements
        // container.innerHTML = "";
        sortedElements.forEach((element) => container.appendChild(element));
    }

    // Function to debounce changes in the order select value
    const debouncedOrderChange = debounce(() => {
        const selected = getSelectedOption(orderSelect);

        // Switch case to determine the selected option and apply the corresponding sorting
        switch (selected) {
            case "newest":
                // Pass 'asc' for newest first
                sortByDate("asc");
                break;
            case "highestprice":
                sortByPrice("asc", resContainer, "res");
                sortByPrice("asc", resContainer, "sold-res");
                sortByPrice("asc", resContainer, "open-res");
                if (homePage) {
                    sortByPrice("asc", resContainer, "result");
                }
                break;
            case "lowestprice":
                sortByPrice("dec", resContainer, "res");
                sortByPrice("dec", resContainer, "sold-res");
                sortByPrice("dec", resContainer, "open-res");

                if (homePage) {
                    sortByPrice("dec", resContainer, "result");
                }
                break;
            case "oldest":
                // Pass 'dec' for oldest first
                sortByDate("dec");
                break;
            default:
                return 0;
        }
    }, resultDisplayDelay);

    // Event listener for change event on the order select element
    orderSelect.addEventListener("change", debouncedOrderChange);
});

// -------------------------------------------------------------------------------------------------------------------------------------------------

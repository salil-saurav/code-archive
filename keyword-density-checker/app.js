const resContainer = document.getElementById("res-container");

let hasChild = false;

document.addEventListener("DOMContentLoaded", () => {
    const urlBtn = document.querySelector(".url-tool");
    const textBtn = document.querySelector(".text-tool");
    const urlTool = document.getElementById("url-tool");
    const textTool = document.getElementById("text-tool");

    const toggleToolActive = (event) => {
        if (event.target.classList.contains("tool-active")) {
            return;
        }
        urlBtn.classList.toggle("tool-active");
        textBtn.classList.toggle("tool-active");

        if (event.target.classList.contains("url-tool")) {
            urlTool.style.display = "flex";
            textTool.style.display = "none";
        } else {
            urlTool.style.display = "none";
            textTool.style.display = "flex";
        }
    };

    if (urlBtn && textBtn) {
        urlBtn.addEventListener("click", toggleToolActive);
        textBtn.addEventListener("click", toggleToolActive);
    }

    const observer = new MutationObserver((mutations) => {
        if (mutations.some((mutation) => mutation.type === "childList")) {
            if (resContainer.children.length > 1) {
            }
        }
    });

    const config = {
        childList: true,
        subtree: true,
    };

    if (resContainer) {
        observer.observe(resContainer, config);
    }
});

function isHeadingElement(element) {
    return /^H[1-6]$/i.test(element.tagName);
}

function isInTitleChecker(node, wordOrPhrase) {
    if (node.tagName && node.tagName.toLowerCase() === "title") {
        const titleContent = node.textContent.trim();

        const isMatch = titleContent.includes(...wordOrPhrase);
        if (isMatch) {
            return true;
        } else {
            return false;
        }
    }
}

function isInMetaDescriptionChecker(node, wordOrPhrase) {
    const nameAttribute = node.getAttribute("name");
    const propertyAttribute = node.getAttribute("property");
    if (
        (nameAttribute && nameAttribute.includes("description")) ||
        (propertyAttribute && propertyAttribute.includes("og:description"))
    ) {
        const contentAttribute = node.getAttribute("content");
        const isMatch = contentAttribute.includes(...wordOrPhrase);

        if (isMatch) {
            return true;
        } else {
            return false;
        }
    }
}

function extractWordsFromTextContent(element, includeMeta) {
    const wordsArray = [];

    const metaWords = [];

    function processTextNode(node) {
        const words = node.textContent
            .replace(/<[^>]*>/g, "")
            .split(/\s+/) // Split into words
            .filter((word) => word.match(/\b\w+\b/g)); // Filter valid words

        if (words.length > 0) {
            const isHeading = isHeadingElement(node.parentNode);
            const isInTitleTag = isInTitleChecker(node.parentNode, words);

            const isInMetaDescription = words.some((word) =>
                word.includes(...metaWords)
            );

            const markedWords = words.map((word) => {
                if (isHeading) {
                    return `${word} (H)`;
                } else if (isInTitleTag) {
                    return `${word} (T)`;
                } else if (isInMetaDescription) {
                    return `$${word} (M)`;
                } else {
                    return word;
                }
            });

            const concatenatedWords = markedWords.join(" ");
            wordsArray.push(concatenatedWords);
        }
    }

    function traverseNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName.toLowerCase() === "meta") {
                // processTextNode(node);
            }

            // Handle specific element types, e.g., meta tags
            if (node.tagName.toLowerCase() === "meta") {
                const nameAttribute = node.getAttribute("name");
                const propertyAttribute = node.getAttribute("property");

                if (
                    (nameAttribute && nameAttribute.includes("description")) ||
                    (propertyAttribute &&
                        propertyAttribute.includes("og:description"))
                ) {
                    const contentAttribute = node.getAttribute("content");
                    if (contentAttribute) {
                        const contentWords = contentAttribute
                            .replace(/<[^>]*>/g, "") // Remove remaining HTML tags
                            .split(/\s+/) // Split into words
                            .filter((word) => word.match(/\b\w+\b/g));

                        const markedContentWords = contentWords.map(
                            (contentWord) => `${contentWord} (M)`
                        );
                        const concatenatedWords = markedContentWords.join(" ");
                        wordsArray.push(concatenatedWords);
                    }
                }
            }

            // Recursively traverse child nodes
            if (node.childNodes.length > 0) {
                node.childNodes.forEach(traverseNode);
            }
        }
    }

    traverseNode(element);

    return wordsArray;
}

const wordsToExclude = [
    "t",
    "m",
    "h",
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "but",
    "by",
    "for",
    "from",
    "has",
    "he",
    "in",
    "is",
    "it",
    "its",
    "of",
    "on",
    "that",
    "the",
    "to",
    "was",
    "were",
    "will",
    "with",
    "you",
    "your",
    "which",
    "am",
    "is",
    "I",
    "me",
    "my",
    "mine",
    "myself",
    "we",
    "us",
    "our",
    "ours",
    "ourselves",
    "you",
    "your",
    "yours",
    "yourself",
    "yourselves",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
    "what",
    "which",
    "who",
    "whom",
    "this",
    "that",
    "these",
    "those",
    "am",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "having",
    "do",
    "does",
    "did",
    "doing",
    "a",
    "an",
    "the",
    "and",
    "but",
    "if",
    "or",
    "because",
    "as",
    "until",
    "while",
    "of",
    "at",
    "by",
    "for",
    "with",
    "about",
    "against",
    "between",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "to",
    "from",
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
    "over",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "can",
    "will",
    "just",
    "don",
    "should",
    "now",
    "d",
    "ll",
    "m",
    "o",
    "re",
    "ve",
    "y",
    "ain",
    "aren",
    "couldn",
    "didn",
    "doesn",
    "hadn",
    "hasn",
    "haven",
    "isn",
    "ma",
    "mightn",
    "mustn",
    "needn",
    "shan",
    "shouldn",
    "wasn",
    "weren",
    "won",
    "wouldn",
];

function countWordOccurrences(wordsArray, minLength, maxLength) {
    const wordCounts = {};

    wordsArray.forEach((word) => {
        const hasHeading = word.includes("(H)");
        const isInTitleTag = word.includes("(T)");
        const isInMetaDescription = word.includes("(M)");

        const words = word
            .toLowerCase()
            .replace(/[^a-zA-Z ]/g, "")
            .split(" ")
            .filter((word) => word !== "" && !wordsToExclude.includes(word));

        for (let i = 0; i < words.length; i++) {
            for (
                let j = i + minLength;
                j <= i + maxLength && j <= words.length;
                j++
            ) {
                const phrase = words.slice(i, j).join(" ");

                if (!wordCounts[phrase]) {
                    wordCounts[phrase] = {
                        count: 1,
                        hasHeading: hasHeading,
                        isInTitleTag: isInTitleTag,
                        isInMetaDescription: isInMetaDescription,
                    };
                } else {
                    wordCounts[phrase].count++;

                    if (hasHeading) {
                        wordCounts[phrase].hasHeading = true;
                    }
                    if (isInTitleTag) {
                        wordCounts[phrase].isInTitleTag = true;
                    }
                    if (isInMetaDescription) {
                        wordCounts[phrase].isInMetaDescription = true;
                    }
                }
            }
        }
    });

    const totalWords = wordsArray.length;

    const wordCountArray = Object.entries(wordCounts).map(
        ([word, { count, hasHeading, isInTitleTag, isInMetaDescription }]) => {
            const density = ((count / totalWords) * 100).toFixed(2); // Calculate density as a percentage
            return {
                word,
                count,
                hasHeading,
                isInTitleTag,
                isInMetaDescription,
                density,
            };
        }
    );

    wordCountArray.sort((a, b) => b.count - a.count);
    // Get the top 10
    return wordCountArray.slice(0, 10);
}

const fetched = document.getElementById("fetched-res");
const loader = document.getElementById("loader");

if (fetched) {
    const fetchedInitial = fetched.innerHTML;

    document.addEventListener("DOMContentLoaded", () => {
        const includeMeta = document.getElementById("meta-tags-include");
        const includeTitle = document.getElementById("title-include");
        const includeAlt = document.getElementById("alt-titles-include");

        let include_meta = false;
        let include_title = false;
        let include_alt_title = false;

        const urlSubmitBtn = document.getElementById("url-submit");

        if (urlSubmitBtn) {
            urlSubmitBtn.addEventListener("click", async (evt) => {
                evt.preventDefault();

                include_meta = includeMeta.checked;
                include_title = includeTitle.checked;
                include_alt_title = includeAlt.checked;

                const url = document.getElementById("url-input").value;
                const data = new URLSearchParams({
                    action: "get_body_content_ajax",
                    url: url,
                    include_meta: include_meta,
                    include_title: include_title,
                    include_alt_title: include_alt_title,
                });

                loader.style.display = "block";

                resContainer.innerHTML = "";
                fetched.innerHTML = "";

                try {
                    const response = await fetch(ajaxurl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: data,
                    });

                    if (response.ok) {
                        const responseBody = await response.text();
                        hasChild = true;
                        resContainer.innerHTML += responseBody;
                        loader.style.display = "none";

                        const wordArray = extractWordsFromTextContent(
                            resContainer,
                            include_meta
                        );

                        const oneCount = countWordOccurrences(wordArray, 1, 1);
                        const twoCount = countWordOccurrences(wordArray, 2, 2);
                        const threeCount = countWordOccurrences(
                            wordArray,
                            3,
                            3
                        );
                        const fourCount = countWordOccurrences(wordArray, 4, 4);

                        resContainer.remove();

                        fetched.innerHTML = fetchedInitial;

                        const topWords =
                            document.getElementById("top-keywords");
                        const topOne = document.getElementById("one-word-cont");
                        const topTwo = document.getElementById("two-word-cont");
                        const topThree =
                            document.getElementById("three-word-cont");
                        const topFour =
                            document.getElementById("four-word-cont");

                        displayWordCountResults(twoCount, topWords, 0);
                        displayWordCountResults(oneCount, topOne, 1);
                        displayWordCountResults(twoCount, topTwo, 2);
                        displayWordCountResults(threeCount, topThree, 3);
                        displayWordCountResults(fourCount, topFour, 4);

                        fetched.style.display = "block";

                        fetched.querySelectorAll("table").forEach((table) => {
                            if (table.rows.length === 1) {
                                const tr = document.createElement("tr");
                                tr.classList.add("no-results");
                                tr.textContent = "No results found";
                                table.appendChild(tr);
                            }
                        });
                    } else {
                        fetched.innerHTML += response.statusText;
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            });
        }
    });
    document.addEventListener("DOMContentLoaded", () => {
        const textSubmitBtn = document.getElementById("text-submit");
        const loader = textSubmitBtn.querySelector(".loader");
        const textArea = document.getElementById("textArea");

        if (!textSubmitBtn) {
            return;
        }

        textSubmitBtn.addEventListener("click", (evt) => {
            fetched.innerHTML = "";

            evt.preventDefault();
            loader.style.display = "block";

            const words = textArea.value
                .replace(/<[^>]*>/g, "")
                .split(/\s+/)
                .filter((word) => word.match(/\b\w+\b/g));

            const oneCount = countWordOccurrences(words, 1, 1);
            const twoCount = countWordOccurrences(words, 2, 2);
            const threeCount = countWordOccurrences(words, 3, 3);
            const fourCount = countWordOccurrences(words, 4, 4);

            setTimeout(() => {
                fetched.style.display = "block";
                fetched.innerHTML = fetchedInitial;

                loader.style.display = "none";

                const topWords = document.getElementById("top-keywords");
                const topOne = document.getElementById("one-word-cont");
                const topTwo = document.getElementById("two-word-cont");
                const topThree = document.getElementById("three-word-cont");
                const topFour = document.getElementById("four-word-cont");

                displayWordCountResults(twoCount, topWords, 0);
                displayWordCountResults(oneCount, topOne, 1);
                displayWordCountResults(twoCount, topTwo, 2);
                displayWordCountResults(threeCount, topThree, 3);
                displayWordCountResults(fourCount, topFour, 4);

                fetched.querySelectorAll("table").forEach((table) => {
                    if (table.rows.length === 1) {
                        const tr = document.createElement("tr");
                        tr.classList.add("no-results");
                        tr.textContent = "No results found";
                        table.appendChild(tr);
                    }
                });
            }, 2500);
        });
    });
}

// display word count results for text

function displayWordCountResults(wordCountResults, resContainer, wordCount) {
    // Iterate through the word count results and create table rows

    const table = document.getElementById("top-keywords-cont");
    const tableOne = document.getElementById("top-one-word");
    const tableTwo = document.getElementById("top-two-word");
    const tableThree = document.getElementById("top-three-word");
    const tableFour = document.getElementById("top-four-word");

    switch (wordCount) {
        case 0:
            seedResult(wordCountResults, false, table);
            resContainer.appendChild(table);
            break;

        case 1:
            seedResult(wordCountResults, true, tableOne);
            resContainer.appendChild(tableOne);
            break;

        case 2:
            seedResult(wordCountResults, true, tableTwo);
            resContainer.appendChild(tableTwo);
            break;

        case 3:
            seedResult(wordCountResults, true, tableThree);
            resContainer.appendChild(tableThree);
            break;
        case 4:
            seedResult(wordCountResults, true, tableFour);
            resContainer.appendChild(tableFour);
        default:
            break;
    }
}

function seedResult(rawData, includeDensity, tableContainer) {
    rawData.forEach((res) => {
        const row = document.createElement("tr");

        // Create cells for each property
        const wordCell = document.createElement("td");
        wordCell.textContent = res.word;
        row.appendChild(wordCell);

        const countCell = document.createElement("td");
        countCell.textContent = res.count;
        row.appendChild(countCell);

        if (includeDensity) {
            const densityCell = document.createElement("td");
            densityCell.textContent = `${res.density} %`; // Display density with two decimal places and a percentage sign
            row.appendChild(densityCell);
        }

        const isInTitleTagCell = document.createElement("td");
        isInTitleTagCell.textContent = res.isInTitleTag ? "Yes" : "No";
        if (isInTitleTagCell.textContent === "Yes") {
            isInTitleTagCell.style.backgroundColor = "#d0f9c9";
        }
        row.appendChild(isInTitleTagCell);

        const isInMetaDescriptionCell = document.createElement("td");
        isInMetaDescriptionCell.textContent = res.isInMetaDescription
            ? "Yes"
            : "No";

        if (isInMetaDescriptionCell.textContent === "Yes") {
            isInMetaDescriptionCell.style.backgroundColor = "#d0f9c9";
        }
        row.appendChild(isInMetaDescriptionCell);

        const hasHeadingCell = document.createElement("td");
        hasHeadingCell.textContent = res.hasHeading ? "Yes" : "No";
        if (hasHeadingCell.textContent === "Yes") {
            hasHeadingCell.style.backgroundColor = "#d0f9c9";
        }
        row.appendChild(hasHeadingCell);

        // Append the row to the table
        tableContainer.appendChild(row);
    });
}

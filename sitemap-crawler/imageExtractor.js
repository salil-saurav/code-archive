import fetch from "node-fetch";
import { load } from "cheerio";

// URL of the webpage you want to scrape
const url = "https://www.gillelectrical.co.nz/";

(async () => {
    try {
        // Fetch the webpage
        const response = await fetch(url, {
            method: "GET",
        });

        if (response.ok) {
            // Parse the HTML text
            const html = await response.text();

            const $ = load(html);
            // Extract all image URLs
            const imageUrls = [];
            $("img").each((index, element) => {
                const src = $(element).attr("src");
                if (src) {
                    imageUrls.push(
                        src.startsWith("http") ? src : `${url}${src}`
                    );
                }
            });

            // Output the extracted image URLs
            console.log(imageUrls);
        } else {
            console.error("Failed to fetch the webpage:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
})();

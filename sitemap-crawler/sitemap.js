import fetch from "node-fetch";
import { parseString } from "xml2js";

const getAllUrls = (url) => {
    fetch(url)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Invalid URL");
            }
            return res.text(); // Return the promise chain
        })
        .then((xml) => {
            // Parse XML to JSON
            parseString(xml, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    // const jsonResult = JSON.stringify(result);
                    const allURLs = result.urlset.url;

                    for (const url of allURLs) {
                        console.log(url.loc.toString());
                    }
                }
            });
        })
        .catch((error) => {
            console.error("Error:", error.message);
        });
};

// Example usage:
const url = "https://www.digitalwebsolutions.com/post-sitemap.xml";
getAllUrls(url);

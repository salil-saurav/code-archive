import fetch from "node-fetch";
import { parseString } from "xml2js";

const url = "https://ultimatedecorator.co.nz/page-sitemap.xml";

try {
    const response = await fetch(url, {
        method: "GET",
    });

    if (response.ok) {
        await response
            .text()
            .then((xml) => {
                parseString(xml, (err, result) => {
                    if (err) {
                        throw new Error(err);
                    } else {
                        const allURLs = result.urlset.url;

                        for (const url of allURLs) {
                            console.log(url.loc.toString());
                        }
                    }
                });
            })
            .catch((err) => {
                throw new Error(err);
            });
    } else {
        throw new Error("Invalid URL");
    }
} catch (error) {
    throw new Error(error);
}

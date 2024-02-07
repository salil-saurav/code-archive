document.addEventListener("DOMContentLoaded", () => {
    const ID = (id) => document.getElementById(id);
    const invalid = ID("invalid-urls");
    const url = ID("given-urls");
    const submitBtn = ID("url-submit-btn");

    const getUrls = () => {
        const inputUrls = url.value
            .split("\n")
            .map((url) => url.trim())
            .filter((url) => url.length > 0);

        const urlPattern =
            /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

        const formattedUrls = inputUrls.map((url) => {
            if (!url.match(urlPattern)) {
                return {
                    original: url,
                    formatted: url,
                    isValid: false,
                };
            }
            return {
                original: url,
                formatted: "https://" + url,
                isValid: true,
            };
        });

        return formattedUrls;
    };

    if (submitBtn) {
        submitBtn.addEventListener("click", () => {
            invalid.innerHTML = "";
            const urls = getUrls();

            for (const urlInfo of urls) {
                if (urlInfo.isValid) {
                    window.open(urlInfo.formatted, "_blank");
                } else {
                    invalid.innerHTML +=
                        "<span class='text-danger'> Invalid URL: </span>" +
                        urlInfo.original +
                        "<br>";
                    // Mark the invalid URL in red
                }
            }
        });
    }
});

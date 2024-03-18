document.addEventListener("DOMContentLoaded", () => {
    const urlSubmitBtn = document.getElementById("url-submit");
    const loader = document.getElementById("loader");

    urlSubmitBtn &&
        urlSubmitBtn.addEventListener("click", async function (evt) {
            evt.preventDefault();

            const url = document.getElementById("url-input").value;

            // Create a URLSearchParams object with the necessary data
            const data = new URLSearchParams({
                action: "some_action_function", // Action to be performed on the server
                url: url, // URL to fetch
            });

            loader.style.display = "block";

            try {
                // Fetch the content from the server using POST request
                const response = await fetch(ajaxurl, {
                    method: "POST", // Specify POST method
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded", // Send data as URL-encoded form data
                    },
                    body: data, // Send the data object
                });

                if (response.ok) {
                    // Extract the response body as text
                    const responseBody = await response.text();

                    // Append the response body to the designated container
                    resContainer.innerHTML += responseBody;
                    loader.style.display = "none";
                } else {
                    // If response failed, display the error status text
                    resContainer.innerHTML += response.statusText;
                }
            } catch (error) {
                // Log any errors to the console
                console.error("Error fetching data:", error);
            }
        });
});

// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Get references to the URL submit button and the loader element
    const urlSubmitBtn = document.getElementById("url-submit");
    const loader = document.getElementById("loader");

    // Check if the URL submit button exists
    if (urlSubmitBtn) {
        // Add a click event listener to the URL submit button
        urlSubmitBtn.addEventListener("click", async (evt) => {
            // Prevent the default form submission behavior
            evt.preventDefault();

            // Get the URL entered by the user
            const url = document.getElementById("url-input").value;

            // Create a URLSearchParams object with the necessary data
            const data = new URLSearchParams({
                action: "get_body_content_ajax", // Action to be performed on the server
                url: url, // URL to fetch
            });

            // Show the loader indicator
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

                // Check if the response was successful
                if (response.ok) {
                    // Extract the response body as text
                    const responseBody = await response.text();

                    // Append the response body to the designated container
                    resContainer.innerHTML += responseBody;

                    // Hide the loader indicator
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
    }
});

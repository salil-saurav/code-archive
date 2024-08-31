// Function to submit a single form
function submitForm(formIndex) {
    const forms = document.querySelectorAll("form");

    try {
        const form = forms[formIndex];

        if (form && form.classList.contains("wpcf7-form")) {
            const submittedKey = `formSubmitted_${formIndex}`;
            const isSubmitted = sessionStorage.getItem(submittedKey);

            // If the form hasn't been submitted yet
            if (!isSubmitted) {
                form.querySelectorAll("input, select").forEach((input) => {
                    switch (input.type) {
                        case "email":
                            input.value = "test@example.com";
                            break;
                        case "tel":
                            input.value = "1234567890";
                            break;
                        case "text":
                            input.value = "test";
                            break;
                        default:
                            break;
                    }
                });

                // Handle textarea input if it exists
                const textarea = form.querySelector("textarea");
                if (textarea) {
                    textarea.value = "Please Ignore";
                }

                // Set the first option of the select element if it exists
                const select = form.querySelector("select");
                if (select && select.options.length > 1) {
                    select.selectedIndex = 1;
                }

                // Submit the form
                form.submit();
                sessionStorage.setItem(submittedKey, "true");
            }
        }
    } catch (error) {
        console.error("Error submitting form:", error);
    }
}

// Function to submit all forms once and set periodic submission
function submitAllForms() {
    const forms = document.querySelectorAll("form");

    forms.forEach((_, index) => {
        submitForm(index); // Submit each form once initially
    });

    // Set up interval to resubmit all forms every 12 hours
    setInterval(() => {
        forms.forEach((_, index) => {
            submitForm(index);
        });
    }, 12 * 60 * 60 * 1000); // 12 hours in milliseconds
}

// Execute form submission when DOM is fully loaded
document.addEventListener("DOMContentLoaded", submitAllForms);

// Function to submit the form
function submitForm(formIndex) {
    const forms = document.querySelectorAll("form");

    try {
        const form = forms[formIndex];
        if (form.classList.contains("wpcf7-form")) {
            const submittedKey = "formSubmitted_" + formIndex;
            const submitted = sessionStorage.getItem(submittedKey);

            if (!submitted) {
                form.querySelectorAll("input, select").forEach((inp) => {
                    switch (inp.type) {
                        case "email":
                            inp.value = "test@example.com";
                            break;
                        case "tel":
                            inp.value = "1234567890";
                            break;
                        case "text":
                            inp.value = "test";
                            break;
                        default:
                            "0";
                    }
                });
                form.querySelector("textarea").value = "Please Ignore";
                form.querySelector("select").selectedIndex = 1;

                // Submit the form
                form.submit();
                sessionStorage.setItem(submittedKey, "true");
            }
        }
    } catch (error) {
        console.error(error);
    }
}

// Function to submit all forms once
function submitAllForms() {
    const forms = document.querySelectorAll("form");
    forms.forEach((form, index) => {
        submitForm(index); // Submit each form
        setInterval(submitForm, 12 * 60 * 60 * 1000);
    });
}

// Execute the form submission function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", submitAllForms);

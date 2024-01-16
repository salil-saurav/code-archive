document.addEventListener("DOMContentLoaded", () => {
    // Get the commentBox and blog_share_post elements
    const commentBox = document.getElementById("wpdevar_comment_1");
    const blog_share_post = document.querySelector(".blog_share_post");

    // Get the target element by its ID

    // Check if the required elements are found
    if (commentBox && blog_share_post) {
        // Remove the first child span from commentBox
        const firstChildSpan = commentBox.querySelector("span:first-child");
        if (firstChildSpan) {
            firstChildSpan.remove();
        }

        const newDiv = blog_share_post.cloneNode(true);

        // Append blog_share_post to commentBox
        commentBox.appendChild(newDiv);

        // Remove the original blog_share_post element
        blog_share_post.remove();
    }
});

var url = window.location.origin;
document.addEventListener(
    "wpcf7mailsent",
    function (event) {
        location = url + "/thank-you";
    },
    false
);

//  Show Text area button

document.addEventListener("DOMContentLoaded", () => {
    const messageText = document.getElementById("message-text");
    const messagebtn = document.getElementById("message-btn");

    if (messageText) {
        messageText.addEventListener("input", () => {
            if (messageText.value.length > 0) {
                console.log();
                messagebtn.classList.add("active");
            } else {
                messagebtn.classList.remove("active");
            }
        });
    }

    //  Contact form Validation

    const formCont = document.getElementById("wpcf7-f16-o1");
    if (formCont) {
        const contactForm = formCont.querySelector("form");
        const submitBtn = contactForm.querySelector("input[type='submit']");
        const tel = contactForm.querySelector("input[type='tel']");
        const patter = "[0-9]{3}";
        tel.setAttribute("pattern", patter);

        const formValidator = (event) => {
            const name = contactForm.querySelectorAll("input[type='text']");
            name.forEach((ele) => {
                const value = ele.value.trim();
                console.log(value);
                if (value.length < 2) {
                    event.preventDefault();
                    ele.style.border = "1px solid red";
                } else {
                    ele.style.border = "1px solid #525252";
                }
            });

            if (!tel.value.match(patter) && tel.value.length < 3) {
                tel.style.border = "1px solid red";
                event.preventDefault();
            } else {
                tel.style.border = "1px solid #525252";
            }
        };

        submitBtn.addEventListener("click", formValidator);
    }
});

jQuery(document).ready(function ($) {
    $("#load-more").on("click", function () {
        let security = $(this).attr("data-nonce");
        let posts_per_page = $(this).attr("data-post-per-page");
        let offset = $(this).attr("data-offset");

        offset = posts_per_page++;

        const data = {
            action: "load_more_properties",
            offset: offset,
            security: security,
        };

        $("#loader").show();

        $.ajax({
            url: ajaxurl, // WordPress AJAX handler
            type: "POST",
            data: data,
            datatype: "html",
            success: function (response) {
                if (response) {
                    $("#res-container").append(response);
                    // Update offset for the next request
                    $("#loader").hide();
                }
            },
        });

        // Loader Hide

        // container.childNodes.forEach((child) => {
        //     console.log(container.lastChild);
        // });
    });

    jQuery(".wprmenu_bar").click(function () {
        jQuery(this).toggleClass("active");
        jQuery(".cbp-spmenu").toggleClass("cbp-spmenu-open");
    });
});

// Intersection Observer function for lazy loading
const lazyLoad = (target) => {
    const io = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute("src");

                img.setAttribute(
                    "src",
                    "https://dibalich.devbuildpro.com/wp-content/uploads/2024/01/placeholder-image.webp"
                );

                const image = new Image();
                image.src = src;

                // Once the actual image loads, remove the blur effect
                image.onload = () => {
                    img.setAttribute("src", src);
                    observer.disconnect();
                };
            }
        });
    });

    io.observe(target);
};

// Example usage with a lazy load class
document.addEventListener("DOMContentLoaded", () => {
    const lazyLoadImages = document.querySelectorAll("img");
    const shareContainer = document.querySelector(
        ".heateor_sss_sharing_container"
    );
    const shareBtn = document.querySelector(".item-share");

    // lazyLoadImages.forEach((img) => {
    //     lazyLoad(img);
    // });
    if (shareBtn) {
        shareBtn.addEventListener("click", () => {
            shareContainer.classList.toggle("active");
        });
    }
});

//  scroll

document.addEventListener("DOMContentLoaded", () => {
    const targetElement = document.querySelectorAll(".id_section");

    if (targetElement) {
        targetElement.forEach((element) => {
            const anchors = element.querySelectorAll("a");

            anchors.forEach((anchor) => {
                // Check if the anchor has the href attribute
                const hrefAttribute = anchor.getAttribute("href");

                if (hrefAttribute && hrefAttribute.startsWith("#")) {
                    // Get the target element associated with the anchor
                    const targetId = hrefAttribute.substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        const offset = 100;
                        const targetPosition = targetElement.offsetTop - offset;

                        // Scroll to the target position
                        anchor.addEventListener("click", (event) => {
                            event.preventDefault(); // Prevent the default behavior of the anchor link

                            window.scrollTo({
                                top: targetPosition,
                                behavior: "smooth", // Optional: Add smooth scrolling effect
                            });
                        });
                    }
                }
            });
        });
    }
});

document.getElementById("contactForm").addEventListener("submit", async function (e) {


e.preventDefault();

const form = document.getElementById("contactForm");
const submitBtn = form.querySelector("button[type='submit']");

/* Disable submit button */

submitBtn.disabled = true;
submitBtn.innerText = "Submitting...";

/* ================= CAPTCHA CHECK ================= */

const captchaToken = grecaptcha.getResponse();

if (!captchaToken || captchaToken.length === 0) {

    Swal.fire({
        icon: "error",
        title: "Captcha Required",
        text: "Please verify that you are not a robot.",
        position: "center",
        confirmButtonColor: "#d33"
    });

    submitBtn.disabled = false;
    submitBtn.innerText = "Submit Request";
    return;
}

/* ================= PAYLOAD ================= */

const payload = {

    fullName: document.querySelector("[name='name']").value.trim(),
    email: document.querySelector("[name='email']").value.trim(),
    enquiries: document.querySelector("[name='enquiry']").value,
    sourceType: document.querySelector("[name='source']").value,
    referName: document.querySelector("[name='referralName']").value || "",
    phoneNumber: document.querySelector("[name='phone']").value,
    whatsAppNumber: document.querySelector("[name='whatsapp']").value,
    message: document.querySelector("[name='message']").value || "Consultation request submitted.",
    captchaToken: captchaToken

};

try {

    const response = await fetch("http://localhost:8080/api/contacts", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)

    });

    const result = await response.json();

    if (response.ok && result.success) {

        Swal.fire({
            icon: "success",
            title: "Request Submitted",
            text: "Our consultant will contact you shortly.",
            position: "center",
            confirmButtonColor: "#0d6efd"
        });

        form.reset();
        grecaptcha.reset();

    } else {

        Swal.fire({
            icon: "error",
            title: "Submission Failed",
            text: result.message || "Something went wrong.",
            position: "center",
            confirmButtonColor: "#d33"
        });

        grecaptcha.reset();
    }

} catch (error) {

    console.error(error);

    Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Please try again later.",
        position: "center",
        confirmButtonColor: "#d33"
    });

    grecaptcha.reset();
}

/* Enable button again */

submitBtn.disabled = false;
submitBtn.innerText = "Submit Request";


});

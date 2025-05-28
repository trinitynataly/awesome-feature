document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  if (!form) {
    console.warn("Contact form not found");
    return;
  }

  const inputs = form.querySelectorAll("input, textarea, select");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;
    let firstInvalid = null;

    // Clear old messages
    form.querySelectorAll(".invalid-feedback").forEach(el => el.remove());
    form.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
    form.querySelectorAll(".alert-warning").forEach(el => el.remove());

    const formData = {};

    inputs.forEach(input => {
      const value = input.value.trim();
      const type = input.type;
      const fieldName = input.getAttribute("name") || "";
      const parent = input.parentElement;

      const showError = (message) => {
        input.classList.add("is-invalid");
        const feedback = document.createElement("div");
        feedback.className = "invalid-feedback";
        feedback.textContent = message;
        parent.appendChild(feedback);
        if (!firstInvalid) firstInvalid = input;
        valid = false;
      };

      const requiredFields = ["first", "last", "email", "phone", "message", "dob", "state", "suburb", "street", "house"];
      const labelMap = {
        first: "First name",
        last: "Last name",
        email: "Email address",
        phone: "Phone number",
        message: "Message",
        dob: "Date of birth",
        state: "State",
        suburb: "Suburb",
        street: "Street",
        house: "House or unit number"
      };

      if (requiredFields.includes(fieldName) && !value) {
        showError(`Please enter your ${labelMap[fieldName] || "input"}.`);
        return;
      }

      if (typeof value === 'string' && /<\/?[^>]+>/gi.test(value)) {
        showError(`${labelMap[fieldName] || "This field"} must not contain HTML.`);
        return;
      }

      // Length limits for name/address-type fields
      if (["first", "last", "suburb", "street", "house"].includes(fieldName) && value.length > 50) {
        showError(`${labelMap[fieldName]} cannot be longer than 50 characters.`);
        return;
      }

      // Length limit for message
      if (fieldName === "message" && value.length > 3000) {
        showError("Message cannot be longer than 3000 characters.");
        return;
      }

      // Email validation
      if (type === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
        showError("Please enter a valid email (e.g. yourname@example.com).");
        return;
      }

      // Phone sanitization + validation
      if (fieldName === "phone") {
        const cleanedPhone = value.replace(/[\s\-]/g, '');
        if (!/^\d+$/.test(cleanedPhone) || cleanedPhone.length > 15) {
          showError("Phone number must be digits only (max 15 characters).");
          return;
        }
        formData[fieldName] = cleanedPhone;
        return;
      }

      // Safe fallback for other fields
      formData[fieldName] = value;
    });

    if (!valid) {
      if (firstInvalid) firstInvalid.focus();

      const warning = document.createElement("div");
      warning.className = "alert alert-warning text-center";
      warning.role = "alert";
      warning.textContent = "Please fill in all fields correctly before submitting.";
      form.prepend(warning);
      return;
    }

    const urlEncodedData = new URLSearchParams(formData).toString();
    // Submit with fetch
    fetch("/form-handler", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: urlEncodedData
    })
      .then(res => res.ok ? res.text() : Promise.reject("Failed"))
      .then(() => {
        form.innerHTML = `
          <div class="alert alert-success text-center" role="alert">
            Thank you for your message! We'll be in touch shortly.
          </div>`;
      })
      .catch(err => {
        form.innerHTML = `
          <div class="alert alert-danger text-center" role="alert">
            Sorry, something went wrong while submitting the form.
          </div>`;
        console.error("Form submission error:", err);
      });
  });

  // Clear error messages while typing
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) {
        input.classList.remove("is-invalid");
        const feedback = input.parentElement.querySelector(".invalid-feedback");
        if (feedback) feedback.remove();
      }
    });
  });
});

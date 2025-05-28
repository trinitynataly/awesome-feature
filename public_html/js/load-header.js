document.addEventListener("DOMContentLoaded", () => {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    fetch("header.html")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to load header.html");
        }
        return response.text();
      })
      .then(html => {
        headerPlaceholder.innerHTML = html;
      })
      .catch(error => {
        console.error("Header load error:", error);
      });
  }
});

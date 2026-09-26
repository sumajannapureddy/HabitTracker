// main.js — simple frontend helpers for forms / UX

document.addEventListener("DOMContentLoaded", () => {
  console.log("HabitFlow frontend loaded.");

  // Example: attach a submit handler to show a small client-side check (optional)
  const forms = document.querySelectorAll("form");
  forms.forEach(f => {
    f.addEventListener("submit", (e) => {
      // Here you could add client-side validation or show a spinner
      // For now just log
      console.log("Submitting form", f.id || f.action);
      // allow normal submit to the server
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  console.log("HabitFlow loaded.");

  // Disable button after submit
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", () => {
      const btn = form.querySelector("button[type=submit]");
      if (btn) {
        btn.disabled = true;
        btn.innerText = "Please Wait...";
      }
    });
  });
});

document.getElementById("adminRegisterForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("admin-name").value.trim();
  const email = document.getElementById("admin-email").value.trim();
  const password = document.getElementById("admin-password").value.trim();

  const res = await fetch(`${API}/admin/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  alert("Admin Registered Successfully!");
  window.location.href = "/admin/login";
});

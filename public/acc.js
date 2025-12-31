const API =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api/users"
    : "/api/users";

const formlog = document.getElementById("createacc");
const loader = document.getElementById("loader");
const success = document.getElementById("successMessage");

formlog.addEventListener("submit", async (e) => {
  console.log("gothere");
  e.preventDefault();
  loader.classList.remove("hidden");

  const data = {
    username: username.value,
    password: password.value,
  };

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      showSuccess();
      form.reset();
    }
  } catch (err) {
    console.error(err);
  } finally {
    loader.classList.add("hidden");
  }
});

function showSuccess() {
  success.classList.remove("hidden");
}

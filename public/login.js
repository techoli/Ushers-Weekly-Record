const API =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api/usersexist"
    : "/api/usersexist";

const formlog = document.getElementById("loginform");
const loader = document.getElementById("loader");
const success = document.getElementById("successMessage");
const error = document.getElementById("errorMessage");

formlog.addEventListener("submit", async (e) => {
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
    console.log("result", result);
    if (result.success) {
      showSuccess();
      if (result.user.username === "pastor") {
        window.location.href = "/pastor.html";
      } else {
        window.location.href = "/recorder.html";
      }
      //   form.reset();
    } else {
      showError();
    }
  } catch (err) {
    console.error(err);
  } finally {
    loader.classList.add("hidden");
  }

  //   fetch(API)
  //     .then((req, res) => res.json())
  //     .then((records) => {
  //       console.log("resords", records);
  //     });
});

function showSuccess() {
  success.classList.remove("hidden");
}

function showError() {
  error.classList.remove("hidden");
}

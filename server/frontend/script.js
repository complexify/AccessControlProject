function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (response.status === 200) {
        window.location.href = "/main.html"; // Redirect on success
      } else if (response.status === 401) {
        alert("Invalid username or password");
      } else {
        alert("An error occurred. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    });
}

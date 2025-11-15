const apiBase = "https://localhost:7030/api";

// 🔹 LOAD ROLES (only if #role exists)
async function loadRoles() {
  const roleSelect = document.getElementById("role");
  if (!roleSelect) return; // Not on registration page, so just exit

  roleSelect.innerHTML = `<option>Loading...</option>`;
  try {
    const res = await fetch(`${apiBase}/GetRoles`);

    if (!res.ok) throw new Error("Failed to fetch roles");

    const roles = await res.json();
    roleSelect.innerHTML = "";

    roles.forEach(role => {
      const option = document.createElement("option");
      option.value = role.id;
      option.textContent = role.name;
      roleSelect.appendChild(option);
    });

    if (roles.length === 0) {
      roleSelect.innerHTML = `<option>No roles found</option>`;
    }
  } catch (err) {
    console.error(err);
    roleSelect.innerHTML = `<option>Error loading roles</option>`;
  }
}

// Call it safely (will do nothing on login.html)
loadRoles();


// 🔹 EMPLOYEE REGISTRATION FORM (only if #employeeForm exists)
const employeeForm = document.getElementById("employeeForm");

if (employeeForm) {
  employeeForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const employee = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      department: document.getElementById("department").value.trim(),
      salary: parseFloat(document.getElementById("salary").value),
      roleId: document.getElementById("role").value,
      password: document.getElementById("password").value
    };

    const messageDiv = document.getElementById("message");
    messageDiv.textContent = "Registering employee...";
    messageDiv.style.color = "#555";

    try {
      const response = await fetch(`${apiBase}/RegisterEmployee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(employee)
      });

      const data = await response.json();

      if (response.ok) {
        messageDiv.textContent = `${data.message} (Employee ID: ${data.employeeId})`;
        messageDiv.style.color = "green";

        employeeForm.reset();

        // Optional redirect to login page
        // setTimeout(() => {
        //   window.location.href = "login.html";
        // }, 1500);
      } else {
        messageDiv.textContent = data.message || "Error registering employee.";
        messageDiv.style.color = "red";
      }
    } catch (error) {
      console.error("Error:", error);
      messageDiv.textContent = "Failed to connect to server.";
      messageDiv.style.color = "red";
    }
  });

  // 🔹 "GO TO LOGIN" BUTTON (only on registration page)
  const goToLoginBtn = document.getElementById("goToLoginBtn");
  if (goToLoginBtn) {
    goToLoginBtn.addEventListener("click", () => {
      window.location.href = "Login.html";
    });
  }
}


// 🔹 LOGIN FORM HANDLER (only if #loginForm exists)
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const messageDiv = document.getElementById("message");

    messageDiv.textContent = "Logging in...";
    messageDiv.style.color = "#555";

    try {
      const response = await fetch(`${apiBase}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        messageDiv.textContent = "Login successful!";
        messageDiv.style.color = "green";

        // Save token if returned
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = "success.html";
        }, 1200);
      } else {
        messageDiv.textContent = data.message || "Invalid email or password";
        messageDiv.style.color = "red";
      }
    } catch (err) {
      console.error(err);
      messageDiv.textContent = "Unable to connect to server";
      messageDiv.style.color = "red";
    }
  });
}

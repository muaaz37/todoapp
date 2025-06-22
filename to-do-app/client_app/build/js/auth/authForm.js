document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("jwt");
    if (token) {
        try {
            const meResponse = await fetch("http://localhost:8090/api/v1/auth/me", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (meResponse.ok) {
                // ✅ Token ist gültig – weiter zur App
                window.location.href = "/index.html";
                return;
            }
            else {
                // ⛔ Token ungültig – entfernen
                localStorage.removeItem("jwt");
                localStorage.removeItem("jwt_type");
            }
        }
        catch (error) {
            console.error("Fehler bei Token-Überprüfung:", error);
        }
    }
    // 🔒 Login-Formular anzeigen
    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        try {
            const response = await fetch("http://localhost:8090/api/v1/auth/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) {
                alert("Login fehlgeschlagen.");
                return;
            }
            const { token, type } = await response.json();
            localStorage.setItem("jwt", token);
            localStorage.setItem("jwt_type", type);
            // ✅ Weiterleitung zur App
            window.location.href = "/index.html";
        }
        catch (error) {
            console.error("Login-Fehler:", error);
            alert("Es ist ein Fehler aufgetreten.");
        }
    });
});
export {};
/*
document.addEventListener("DOMContentLoaded", () => {
  // ✅ Wenn schon eingeloggt, weiter zur App
  const existingToken = localStorage.getItem("jwt");
  if (existingToken) {
    window.location.href = "/index.html";
    return;
  }

  const form = document.querySelector("form")!;
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch("http://localhost:8090/api/v1/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        alert("Login fehlgeschlagen.");
        return;
      }

      // ✅ Token aus der Antwort speichern
      const { token, type } = await response.json();
      localStorage.setItem("jwt", token);
      localStorage.setItem("jwt_type", type); // optional

      // ✅ Weiterleitung zur App
      window.location.href = "/index.html";
    } catch (error) {
      console.error("Login-Fehler:", error);
      alert("Es ist ein Fehler aufgetreten.");
    }
  });
});

 */

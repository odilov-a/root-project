const API_URL = "http://localhost:8000/api";

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("userId", data.data.userId);
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("errorMsg").innerText = data.message;
    }
  } catch (error) {
    console.error("Login error:", error);
  }
});

const token = localStorage.getItem("token");

document.getElementById("sendPdfForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("pdfFile").files[0];
  const receiverId = document.getElementById("receiverUsername").value;
  if (!fileInput) return alert("Please select a PDF file!");
  if (!receiverId) return alert("Please select a receiver!");

  const formData = new FormData();
  formData.append("file", fileInput);
  formData.append("receiverId", receiverId);

  try {
    const response = await fetch(`${API_URL}/files/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await response.json();
    document.getElementById("statusMsg").innerText = response.ok
      ? "PDF sent successfully!"
      : data.message;
  } catch (error) {
    console.error("Error sending PDF:", error);
  }
});

document.getElementById("fetchPdfBtn")?.addEventListener("click", async () => {
  try {
    const response = await fetch(`${API_URL}/files/received`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    const pdfList = document.getElementById("pdfList");
    pdfList.innerHTML = "";
    result.data.forEach((pdf) => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = `
        <a href="${pdf.filePath}" target="_blank">${pdf.filename}</a>
        <button class="btn btn-sm btn-warning ms-2" onclick="signPdf('${pdf._id}')">Sign</button>
        <button class="btn btn-sm btn-info ms-2" onclick="verifyPdf('${pdf._id}')">Verify</button>
      `;
      pdfList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching PDFs:", error);
  }
});

async function signPdf(pdfId) {
  try {
    const response = await fetch(`${API_URL}/files/sign/${pdfId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    alert(response.ok ? "PDF signed successfully!" : data.message);
  } catch (error) {
    console.error("Error signing PDF:", error);
  }
}

async function verifyPdf(pdfId) {
  try {
    const response = await fetch(`${API_URL}/files/verify/${pdfId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    alert(response.ok ? `PDF Verified: ${data.status}` : data.message);
  } catch (error) {
    console.error("Error verifying PDF:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const receiverSelect = document.getElementById("receiverUsername");
  try {
    const response = await fetch(`${API_URL}/users/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    const users = result.data;
    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user._id;
      option.textContent = user.username;
      receiverSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});

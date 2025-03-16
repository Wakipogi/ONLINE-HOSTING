const serverURL = "https://your-backend-url.onrender.com"; // Replace with your backend URL

function uploadFile() {
    let fileInput = document.getElementById("fileInput");
    let file = fileInput.files[0];

    if (!file) {
        alert("Please select a Python file to upload.");
        return;
    }

    let formData = new FormData();
    formData.append("file", file);

    fetch(`${serverURL}/upload`, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchDeployedFiles();
    })
    .catch(error => console.error("Error:", error));
}

function fetchDeployedFiles() {
    fetch(`${serverURL}/deployed`)
    .then(response => response.json())
    .then(files => {
        let deployedList = document.getElementById("deployedFiles");
        deployedList.innerHTML = "";

        files.forEach(file => {
            let listItem = document.createElement("li");
            listItem.innerHTML = `
                ${file}
                <button onclick="startFile('${file}')">Start</button>
                <button onclick="stopFile('${file}')">Stop</button>
            `;
            deployedList.appendChild(listItem);
        });
    })
    .catch(error => console.error("Error:", error));
}

function startFile(filename) {
    fetch(`${serverURL}/start`, {
        method: "POST",
        body: JSON.stringify({ filename }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error("Error:", error));
}

function stopFile(filename) {
    fetch(`${serverURL}/stop`, {
        method: "POST",
        body: JSON.stringify({ filename }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error("Error:", error));
}

window.onload = fetchDeployedFiles;

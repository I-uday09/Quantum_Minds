const BASE_URL = "http://localhost:8080";

// LOGIN
function login() {

    const usernameInput = document.getElementById("loginUsername");
    const passwordInput = document.getElementById("loginPassword");
    const msg = document.getElementById("loginMsg");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // CLEAR OLD MESSAGE
    msg.innerText = "";

    // ===== VALIDATION =====

    // Empty check
    if (username === "" || password === "") {
        msg.innerText = "Please fill all fields";
        msg.style.color = "red";
        return;
    }

    // Space check
    if (username.includes(" ")) {
        msg.innerText = "Username should not contain spaces";
        msg.style.color = "red";
        return;
    }

    // Minimum password length (optional)
    if (password.length < 6) {
        msg.innerText = "Password must be at least 6 characters";
        msg.style.color = "red";
        return;
    }

    // ===== API CALL =====

    fetch(BASE_URL + "/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(res => res.text())
    .then(data => {

        if (data === "Login Success") {

            msg.innerText = "Login Successful";
            msg.style.color = "green";

            // redirect after short delay
            setTimeout(() => {
                window.location.href = "/pages/dashboard.html";
            }, 800);

        } else {
            msg.innerText = data || "Invalid username or password";
            msg.style.color = "red";
        }

    })
    .catch(err => {
        console.error(err);
        msg.innerText = "Server error. Check backend.";
        msg.style.color = "red";
    });
}

// ===== SIGNUP =====
function signup() {

    const username = document.getElementById("signupUsername").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    const msg = document.getElementById("signupMsg");

    // VALIDATION
    if (username === "" || email === "" || password === "") {
        msg.innerText = "All fields required";
        msg.style.color = "red";
        return;
    }

    if (username.includes(" ")) {
        msg.innerText = "Username cannot contain spaces";
        msg.style.color = "red";
        return;
    }

    fetch(BASE_URL + "/auth/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, email, password})
    })
    .then(res => res.text())
    .then(data => {
        msg.innerText = data;
        msg.style.color = data.includes("Registered") ? "green" : "red";
    })
    .catch(() => {
        msg.innerText = "Server error";
        msg.style.color = "red";
    })
    .then(async res => {

    if (!res.ok) {
        const err = await res.json();
        const key = Object.keys(err)[0];
        msg.innerText = err[key];
        msg.style.color = "red";
        return;
    }

    return res.text();
})
.then(data => {
    if (data) {
        msg.innerText = data;
        msg.style.color = "green";
    }
});
}

// NAVIGATION
function goChat() {
    window.location.href = "/pages/chat.html";
}

function goUpload() {
    window.location.href = "/pages/upload.html";
}
// Document
function goDocs() {
    window.location.href = "/pages/document.html";
}
// CHAT
function sendMsg() {
    const msg = document.getElementById("msg").value;

    fetch(BASE_URL + "/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({message: msg})
    })
    .then(res => res.text())
    .then(data => {
        const box = document.getElementById("chatBox");

        box.innerHTML += `<div class="msg user">${msg}</div>`;
        box.innerHTML += `<div class="msg ai">${data}</div>`;
    });
}

// CSV UPLOAD
let chart; // global chart

function upload() {

    const file = document.getElementById("file").files[0];
    const type = document.getElementById("chartType").value;

    const formData = new FormData();
    formData.append("file", file);

    fetch(BASE_URL + "/csv/upload", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {

        const labels = data.map(item => item.name);
        const values = data.map(item => parseInt(item.value));

        const ctx = document.getElementById("myChart").getContext("2d");

        // destroy old chart
        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: "Data",
                    data: values
                }]
            }
        });

    });
}

let currentPath = "";
let selectedFile = "";

// LOAD FILES
function loadFiles() {

    fetch(BASE_URL + "/files/list?path=" + currentPath)
    .then(res => res.json())
    .then(data => {

        const list = document.getElementById("list");
        list.innerHTML = "";

        data.forEach(item => {
            list.innerHTML += `
                <div class="file">
                    ${item}
                    <button onclick="openItem('${item}')">Open</button>
                    <button onclick="deleteItem('${item}')">Delete</button>
                </div>
            `;
        });
    });
}

// OPEN FILE OR FOLDER

/* ===== FILE SYSTEM ===== */
let fileSystem = {
    name: "root",
    type: "folder",
    children: []
};

let currentFolder = fileSystem;
let currentFile = null;


/* ===== CREATE FOLDER ===== */
function createFolder() {
    let name = document.getElementById("folderName").value;
    if (!name) return;

    currentFolder.children.push({
        name: name,
        type: "folder",
        children: []
    });

    document.getElementById("folderName").value = "";
    loadFiles();
}


/* ===== CREATE FILE ===== */
function createFile() {
    let name = document.getElementById("fileName").value;
    let content = document.getElementById("fileContent").value;

    if (!name) return;

    currentFolder.children.push({
        name: name,
        type: "file",
        content: content
    });

    document.getElementById("fileName").value = "";
    document.getElementById("fileContent").value = "";

    loadFiles();
}


/* ===== UPLOAD FILE ===== */
function uploadFile() {
    let fileInput = document.getElementById("file");

    if (!fileInput.files.length) return;

    let file = fileInput.files[0];
    let reader = new FileReader();

    reader.onload = function(e) {
        currentFolder.children.push({
            name: file.name,
            type: "file",
            content: e.target.result
        });

        loadFiles();
    };

    reader.readAsText(file);
}


/* ===== LOAD FILES ===== */
function loadFiles() {
    let list = document.getElementById("list");
    list.innerHTML = "";

    // BACK BUTTON
    if (currentFolder !== fileSystem) {
        let back = document.createElement("div");
        back.className = "file";
        back.innerHTML = "⬅️ Back";
        back.onclick = goBack;
        list.appendChild(back);
    }

    currentFolder.children.forEach(item => {
        let div = document.createElement("div");
        div.className = "file";

        let icon = item.type === "folder" ? "📁" : "📄";

        div.innerHTML = `
            <div class="icon">${icon}</div>
            <div>${item.name}</div>
        `;

        div.onclick = () => openItem(item);
        makeDraggable(div, item);

        list.appendChild(div);
    });
}


/* ===== OPEN FILE / FOLDER ===== */
function openItem(item) {
    if (item.type === "folder") {
        currentFolder = item;
        loadFiles();
    } else {
        currentFile = item;
        document.getElementById("editContent").value = item.content;
    }
}


/* ===== GO BACK ===== */
function goBack() {
    let parent = findParent(fileSystem, currentFolder);

    if (parent) {
        currentFolder = parent;
        loadFiles();
    }
}


/* ===== FIND PARENT ===== */
function findParent(folder, target) {
    if (!folder.children) return null;

    for (let child of folder.children) {
        if (child === target) return folder;

        if (child.type === "folder") {
            let res = findParent(child, target);
            if (res) return res;
        }
    }

    return null;
}


/* ===== UPDATE FILE ===== */
function updateFile() {
    if (!currentFile) return;

    currentFile.content = document.getElementById("editContent").value;

    alert("File Saved");
}


/* ===== DRAG FUNCTION ===== */
function makeDraggable(el, item) {
    el.draggable = true;

    el.ondragstart = () => {
        window.dragItem = item;
    };
}


/* ===== DELETE SYSTEM ===== */
let trash = document.querySelector(".trash");

if (trash) {
    trash.ondragover = (e) => {
        e.preventDefault();
        trash.style.background = "red";
    };

    trash.ondrop = () => {
        deleteItem(fileSystem, window.dragItem);
        loadFiles();
        trash.style.background = "white";
    };
}


/* ===== DELETE FUNCTION ===== */
function deleteItem(folder, item) {
    folder.children = folder.children.filter(i => i !== item);

    folder.children.forEach(child => {
        if (child.type === "folder") {
            deleteItem(child, item);
        }
    });
}
import { auth, db, storage } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Load portfolio data
async function loadData() {
    const docRef = doc(db, "portfolio", "data");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        document.getElementById("name").innerText = docSnap.data().name;
        document.getElementById("role").innerText = docSnap.data().role;
        document.getElementById("about").innerText = docSnap.data().about;
    }
}
loadData();

// Show login
window.showLogin = function () {
    document.getElementById("login").classList.remove("hidden");
};

// Login
window.login = function () {
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, pass)
        .then(() => {
            document.getElementById("admin").classList.remove("hidden");
        })
        .catch(err => alert(err.message));
};

// Save data
window.save = async function () {
    let name = document.getElementById("newName").value;
    let role = document.getElementById("newRole").value;
    let about = document.getElementById("newAbout").value;

    await setDoc(doc(db, "portfolio", "data"), {
        name, role, about
    });

    let file = document.getElementById("resume").files[0];

    if (file) {
        const storageRef = ref(storage, 'resume.pdf');
        await uploadBytes(storageRef, file);
    }

    alert("Saved successfully");
    loadData();
};

// Download resume
window.downloadResume = async function () {
    try {
        const storageRef = ref(storage, 'resume.pdf');
        const url = await getDownloadURL(storageRef);
        window.open(url);
    } catch {
        alert("No resume uploaded");
    }
};
function showRoleQuestions() {
    const role = document.getElementById("role").value;
    const studentSection = document.getElementById("studentSection");
    const professorSection = document.getElementById("professorSection");

    studentSection.classList.add("hidden");
    professorSection.classList.add("hidden");

    if (role === "student") {
        studentSection.classList.remove("hidden");
    } else if (role === "professor") {
        professorSection.classList.remove("hidden");
    }
}

function validateSignup() {
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }

    return true;
}
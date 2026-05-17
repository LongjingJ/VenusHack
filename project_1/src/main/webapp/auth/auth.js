function hideAllSignupSteps() {
    document.getElementById("accountStep").classList.add("hidden");
    document.getElementById("roleStep").classList.add("hidden");
    document.getElementById("studentStep").classList.add("hidden");
    document.getElementById("professorStep").classList.add("hidden");
}

function goToRoleStep() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password.length < 8) {
        alert("Please use at least 8 characters for your password.");
        return;
    }

    if (password !== confirmPassword) {
        alert("The two passwords do not match. Please try again.");
        return;
    }

    hideAllSignupSteps();
    document.getElementById("roleStep").classList.remove("hidden");
}

function chooseRole(role) {
    document.getElementById("role").value = role;

    hideAllSignupSteps();

    if (role === "student") {
        document.getElementById("studentStep").classList.remove("hidden");
    } else if (role === "professor") {
        document.getElementById("professorStep").classList.remove("hidden");
    }
}

function backToAccountStep() {
    hideAllSignupSteps();
    document.getElementById("accountStep").classList.remove("hidden");
}

function backToRoleStep() {
    hideAllSignupSteps();
    document.getElementById("roleStep").classList.remove("hidden");
}

function validateFinalSignup() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const role = document.getElementById("role").value;

    if (password !== confirmPassword) {
        alert("The two passwords do not match. Please try again.");
        return false;
    }

    if (role === "") {
        alert("Please choose whether you are a student or professor.");
        return false;
    }

    if (role === "student") {
        const ccSchool = document.getElementById("cc_school").value;
        const major = document.getElementById("major").value;
        const selectedCampuses =
            document.querySelectorAll('input[name="uc_campuses"]:checked');

        if (ccSchool === "" || major === "") {
            alert("Please enter your community college and major.");
            return false;
        }

        if (selectedCampuses.length === 0) {
            alert("Please choose at least one UC campus.");
            return false;
        }
    }

    if (role === "professor") {
        const department = document.getElementById("department").value;

        if (department === "") {
            alert("Please enter your department.");
            return false;
        }
    }

    return true;
}
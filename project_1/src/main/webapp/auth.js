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

function handleLoginSubmit() {
    const email = document.getElementById("email").value.trim();
    const savedProfile = JSON.parse(localStorage.getItem("transferHubProfile") || "{}");

    localStorage.setItem("transferHubProfile", JSON.stringify({
        ...savedProfile,
        email: email || savedProfile.email || "",
        isLoggedIn: true
    }));

    window.location.href = "main.html";
    return false;
}

function handleSignupSubmit() {
    if (!validateFinalSignup()) {
        return false;
    }

    const role = document.getElementById("role").value;
    const profile = {
        email: document.getElementById("email").value.trim(),
        role: role,
        isLoggedIn: true
    };

    if (role === "student") {
        profile.school = document.getElementById("cc_school").value.trim();
        profile.major = document.getElementById("major").value.trim();
        profile.campuses = Array.from(
            document.querySelectorAll('input[name="uc_campuses"]:checked')
        ).map(function (campus) {
            return campus.value;
        });
    }

    if (role === "professor") {
        profile.department = document.getElementById("department").value.trim();
    }

    localStorage.setItem("transferHubProfile", JSON.stringify(profile));
    window.location.href = "main.html";
    return false;
}

function toast(message) {
    const toastEl = document.getElementById("toast-el");

    if (!toastEl) {
        alert(message);
        return;
    }

    toastEl.textContent = message;
    toastEl.classList.add("show");

    window.clearTimeout(window.transferHubToastTimer);
    window.transferHubToastTimer = window.setTimeout(function () {
        toastEl.classList.remove("show");
    }, 1800);
}

function getInitials(value) {
    if (!value) {
        return "AC";
    }

    const namePart = value.split("@")[0];
    const words = namePart.split(/[._\-\s]+/).filter(Boolean);

    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }

    return namePart.slice(0, 2).toUpperCase();
}

function titleCase(value) {
    return value
        .split(/[._\-\s]+/)
        .filter(Boolean)
        .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
}

function applyProfile() {
    const profile = JSON.parse(localStorage.getItem("transferHubProfile") || "{}");
    const initials = getInitials(profile.email);
    const displayName = profile.email ? titleCase(profile.email.split("@")[0]) : "Alex Chen";

    document.querySelectorAll(".avatar, .profile-av").forEach(function (el) {
        el.textContent = initials;
    });

    document.querySelectorAll(".profile-name").forEach(function (el) {
        el.textContent = displayName;
    });

    document.querySelectorAll(".profile-sub").forEach(function (el) {
        if (profile.role === "professor") {
            el.textContent = profile.department || "Professor / Advisor";
            return;
        }

        el.textContent = profile.school || "Irvine Valley College";
    });

    document.querySelectorAll(".profile-gpa").forEach(function (el) {
        if (profile.role === "professor") {
            el.textContent = "Advisor account";
            return;
        }

        const major = profile.major || "CS";
        el.textContent = "GPA 3.7 · " + major + " · Resident";
    });
}

document.addEventListener("DOMContentLoaded", applyProfile);

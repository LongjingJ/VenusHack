fetch("profile")
    .then(response => {
        if (!response.ok) {
            window.location.href = "Login.html";
            return;
        }
        return response.json();
    })
    .then(profile => {
        if (!profile) return;
        const initials =
            profile.firstName.charAt(0).toUpperCase() +
            profile.lastName.charAt(0).toUpperCase();
        document.getElementById("profile-avatar").textContent = initials;
        document.getElementById("nav-avatar").textContent = initials;
        document.getElementById("profile-name").textContent = profile.firstName + " " + profile.lastName;
        document.getElementById("profile-school").textContent = profile.school;
        document.getElementById("profile-major").textContent = profile.major;
    })
    .catch(error => {
        console.error("Error loading profile:", error);
    });

document.getElementById("nav-avatar").addEventListener("click", function () {
    window.location.href = "profile.html";
});

document.getElementById("profile-avatar").addEventListener("click", function () {
    window.location.href = "profile.html";
});

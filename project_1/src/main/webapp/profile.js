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
        document.getElementById("profile-interested-school").textContent = profile.interestedSchool || "";

        checkInterestedSchool();
    })
    .catch(error => {
        console.error("Error loading profile:", error);
    });

function checkInterestedSchool() {
    const val = document.getElementById("profile-interested-school").textContent.trim();
    const btn = document.getElementById("interested-school-btn");
    if (!val) {
        btn.innerHTML = '<i class="ti ti-plus"></i> Add';
    } else {
        btn.innerHTML = '<i class="ti ti-pencil"></i> Edit';
    }
    btn.style.display = "inline-flex";
}

function showInterestedSchoolInput() {
    const current = document.getElementById("profile-interested-school").textContent.trim();
    document.getElementById("interested-school-input").value = current;
    document.getElementById("interested-school-input-wrap").style.display = "flex";
    document.getElementById("interested-school-input").focus();
}

function saveInterestedSchool() {
    const val = document.getElementById("interested-school-input").value.trim();
    if (!val) return;

    fetch("update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "interestedSchool=" + encodeURIComponent(val)
    }).then(r => {
        if (r.ok) {
            document.getElementById("profile-interested-school").textContent = val;
            document.getElementById("interested-school-input-wrap").style.display = "none";
            checkInterestedSchool();
        }
    });
}

function cancelInterestedSchool() {
    document.getElementById("interested-school-input-wrap").style.display = "none";
}
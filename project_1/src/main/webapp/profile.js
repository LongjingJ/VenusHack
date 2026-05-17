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
        renderRecommendedSchools(profile);
    })
    .catch(error => {
        console.error("Error loading profile:", error);
    });

const schoolRecommendations = {
    physics: [
        { name: "UC Irvine", location: "Irvine, CA", match: 86, fit: "Strong fit", color: "#1d9e75" },
        { name: "UC Santa Barbara", location: "Santa Barbara, CA", match: 82, fit: "Strong fit", color: "#1d9e75" },
        { name: "UC San Diego", location: "La Jolla, CA", match: 78, fit: "Good fit", color: "#f59e0b" },
        { name: "UC Davis", location: "Davis, CA", match: 74, fit: "Good fit", color: "#f59e0b" }
    ],
    math: [
        { name: "UC Berkeley", location: "Berkeley, CA", match: 79, fit: "Reach fit", color: "#f59e0b" },
        { name: "UCLA", location: "Los Angeles, CA", match: 77, fit: "Reach fit", color: "#f59e0b" },
        { name: "UC Santa Cruz", location: "Santa Cruz, CA", match: 83, fit: "Strong fit", color: "#1d9e75" },
        { name: "UC Irvine", location: "Irvine, CA", match: 80, fit: "Strong fit", color: "#1d9e75" }
    ],
    computerscience: [
        { name: "UC San Diego", location: "La Jolla, CA", match: 84, fit: "Strong fit", color: "#1d9e75" },
        { name: "UCLA", location: "Los Angeles, CA", match: 78, fit: "Reach fit", color: "#f59e0b" },
        { name: "UC Irvine", location: "Irvine, CA", match: 82, fit: "Strong fit", color: "#1d9e75" },
        { name: "UC Davis", location: "Davis, CA", match: 76, fit: "Good fit", color: "#f59e0b" }
    ],
    default: [
        { name: "UC Irvine", location: "Irvine, CA", match: 82, fit: "Strong fit", color: "#1d9e75" },
        { name: "UCLA", location: "Los Angeles, CA", match: 76, fit: "Reach fit", color: "#f59e0b" },
        { name: "UC San Diego", location: "La Jolla, CA", match: 80, fit: "Strong fit", color: "#1d9e75" },
        { name: "UC Davis", location: "Davis, CA", match: 74, fit: "Good fit", color: "#f59e0b" }
    ]
};

function normalizeMajor(major) {
    return (major || "").toLowerCase().replace(/[^a-z]/g, "");
}

function normalizeSchoolName(school) {
    return (school || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function renderRecommendedSchools(profile) {
    const container = document.getElementById("recommended-schools");
    if (!container) return;

    const majorKey = normalizeMajor(profile.major);
    const interestedSchool = normalizeSchoolName(profile.interestedSchool);
    const recommendations = schoolRecommendations[majorKey] || schoolRecommendations.default;

    const visibleSchools = recommendations
        .filter(school => normalizeSchoolName(school.name) !== interestedSchool)
        .slice(0, 3);

    container.innerHTML = visibleSchools.map(school => `
        <div class="school-card">
            <div class="sc-name">${school.name}</div>
            <div class="sc-loc">
                <i class="ti ti-map-pin" style="font-size:10px"></i> ${school.location}
            </div>
            <div class="badge-row">
                <span class="badge b-blue">UC</span>
                <span class="badge b-green">Recommended</span>
            </div>
            <div class="match-bar">
                <div class="match-fill" style="width:${school.match}%;background:${school.color}"></div>
            </div>
            <div class="match-meta">
                <span>${school.match}% profile match</span>
                <span>${school.fit}</span>
            </div>
        </div>
    `).join("");
}

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
            renderRecommendedSchools({
                major: document.getElementById("profile-major").textContent,
                interestedSchool: val
            });
        }
    });
}

function cancelInterestedSchool() {
    document.getElementById("interested-school-input-wrap").style.display = "none";
}

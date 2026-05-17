loadProfile();
loadPosts();

function loadProfile() {
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
            document.getElementById("profile-name").textContent =
                profile.firstName + " " + profile.lastName;
            document.getElementById("profile-school").textContent = profile.school;
            document.getElementById("profile-major").textContent = profile.major;
        });
}

function loadPosts() {
    fetch("posts")
        .then(r => r.json())
        .then(posts => {
            const container = document.getElementById("posts-container");
            container.innerHTML = "";
            posts.forEach(post => {
                const initials =
                    post.firstName.charAt(0).toUpperCase() +
                    post.lastName.charAt(0).toUpperCase();
                const card = document.createElement("div");
                card.className = "card";
                card.style.cssText = "margin-bottom:16px; width:auto;";
                card.innerHTML = `
                    <div class="peer-row">
                        <div class="peer-av">${initials}</div>
                        <div style="flex:1; min-width:0;">
                            <div class="peer-name">${post.firstName} ${post.lastName}</div>
                            <div class="peer-sub">${post.school} · ${post.major}</div>
                            <p style="margin:10px 0 6px; color:#1b2a41;">${post.content}</p>
                            <small style="color:#9aa5b4;">${post.createdAt}</small>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        });
}

document.getElementById("nav-avatar").addEventListener("click", function () {
    window.location.href = "profile.html";
});

document.getElementById("profile-avatar").addEventListener("click", function () {
    window.location.href = "profile.html";
});

function doSearch() {
    const query = document.getElementById("school-search").value.trim().toLowerCase();
    const section = document.getElementById("school-results-section");
    const container = document.getElementById("school-results");

    if (query.length === 0) {
        section.style.display = "none";
        container.innerHTML = "";
        return;
    }

    const schools = [
        { name: "UC Irvine", location: "Irvine, CA", type: "UC", url: "schoolProfile.html" }
    ];

    const aliases = {
        "UC Irvine": ["uci", "uc irvine", "irvine", "university of california irvine"]
    };

    const results = schools.filter(school => {
        const keywords = [school.name.toLowerCase(), ...(aliases[school.name] || [])];
        return keywords.some(k => k.includes(query) || query.includes(k));
    });

    if (results.length === 0) {
        section.style.display = "block";
        container.innerHTML = "<p style='color:#6b778c;'>No schools found.</p>";
        return;
    }

    section.style.display = "block";
    container.innerHTML = "";
    results.forEach(school => {
        const card = document.createElement("div");
        card.className = "school-card";
        card.innerHTML = `
            <div class="sc-name">${school.name}</div>
            <div class="sc-loc">
                <i class="ti ti-map-pin" style="font-size:12px"></i>
                ${school.location}
            </div>
            <div class="badge-row">
                <span class="badge b-blue">${school.type}</span>
            </div>
        `;
        card.onclick = () => window.location.href = school.url;
        container.appendChild(card);
    });
}

document.getElementById("search-btn").addEventListener("click", doSearch);

document.getElementById("school-search").addEventListener("keydown", function (e) {
    if (e.key === "Enter") doSearch();
});
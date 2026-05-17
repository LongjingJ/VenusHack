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

fetch("network")
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("recommendations-container");
        container.innerHTML = "";

        data.forEach(user => {
            const initials =
                user.firstName.charAt(0).toUpperCase() +
                user.lastName.charAt(0).toUpperCase();

            const card = document.createElement("div");
            card.className = "card";
            card.style.marginBottom = "16px";

            card.innerHTML = `
                <div class="peer-row">
                    <div class="peer-av">${initials}</div>
                    <div>
                        <div class="peer-name">${user.firstName} ${user.lastName}</div>
                        <div class="peer-sub">${user.school} · ${user.major}</div>
                    </div>
                    <button class="conn-btn" onclick="sendConnectRequest(${user.id}, this)">
                        Connect
                    </button>
                </div>
            `;

            container.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Error loading recommendations:", error);
    });

function sendConnectRequest(receiverId, button) {
    fetch("connect", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "receiver_id=" + encodeURIComponent(receiverId)
    })
        .then(response => response.text())
        .then(result => {
            button.textContent = "Sent";
            button.disabled = true;
            button.style.opacity = "0.6";
            button.style.cursor = "default";
        })
        .catch(error => {
            console.error("Error sending connection request:", error);
        });
}
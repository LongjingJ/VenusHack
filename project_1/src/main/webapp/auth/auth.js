function hideAllSignupSteps() {
    document.getElementById("accountStep").classList.add("hidden");
    document.getElementById("roleStep").classList.add("hidden");
    document.getElementById("studentStep").classList.add("hidden");
    document.getElementById("professorStep").classList.add("hidden");
}

function goToRoleStep() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (email === "") {
        alert("Please enter your email.");
        return;
    }

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
        const ccSchool = document.getElementById("cc_school").value.trim();
        const major = document.getElementById("major").value.trim();
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
        const department = document.getElementById("department").value.trim();

        if (department === "") {
            alert("Please enter your department.");
            return false;
        }
    }

    return true;
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

function handleLoginSubmit() {
    const email = document.getElementById("email").value.trim();
    const savedProfile =
        JSON.parse(localStorage.getItem("transferHubProfile") || "{}");

    localStorage.setItem("transferHubProfile", JSON.stringify({
        ...savedProfile,
        email: email || savedProfile.email || "",
        isLoggedIn: true
    }));

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
    const profile =
        JSON.parse(localStorage.getItem("transferHubProfile") || "{}");

    const initials = getInitials(profile.displayName || profile.email);
    const displayName = profile.displayName || (profile.email
        ? titleCase(profile.email.split("@")[0])
        : "Alex Chen");

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

        const gpa = profile.gpa || "3.7";
        const major = profile.major || "CS";
        const residency = profile.residencyStatus || "Resident";
        const transferYear = profile.transferYear ? " · Transfer " + profile.transferYear : "";
        el.textContent = "GPA " + gpa + " · " + major + " · " + residency + transferYear;
    });
}

function openProfilePage() {
    window.location.href = "profile.html";
}

function enableProfileLinks() {
    document.querySelectorAll(".avatar, .profile-av").forEach(function (el) {
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
        el.title = "Edit profile";
        el.addEventListener("click", openProfilePage);
        el.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProfilePage();
            }
        });
    });
}

function loadProfileForm() {
    const form = document.querySelector(".profile-form");

    if (!form) {
        return;
    }

    const profile =
        JSON.parse(localStorage.getItem("transferHubProfile") || "{}");

    document.getElementById("profileName").value = profile.displayName || "";
    document.getElementById("profileEmail").value = profile.email || "";
    document.getElementById("profileSchool").value = profile.school || "";
    document.getElementById("profileMajor").value = profile.major || profile.department || "";
    document.getElementById("profileGpa").value = profile.gpa || "";
    document.getElementById("profileTransferYear").value = profile.transferYear || "";
    document.getElementById("profileResidency").value = profile.residencyStatus || "";
}

function handleProfileSubmit() {
    const savedProfile =
        JSON.parse(localStorage.getItem("transferHubProfile") || "{}");

    const updatedProfile = {
        ...savedProfile,
        displayName: document.getElementById("profileName").value.trim(),
        email: document.getElementById("profileEmail").value.trim(),
        school: document.getElementById("profileSchool").value.trim(),
        major: document.getElementById("profileMajor").value,
        gpa: document.getElementById("profileGpa").value,
        transferYear: document.getElementById("profileTransferYear").value,
        residencyStatus: document.getElementById("profileResidency").value,
        isLoggedIn: true
    };

    if (updatedProfile.role === "professor") {
        updatedProfile.department = updatedProfile.major;
    }

    localStorage.setItem("transferHubProfile", JSON.stringify(updatedProfile));
    applyProfile();
    toast("Profile saved!");
    return false;
}

const schoolInfo = {
    UCB: {
        name: "UC Berkeley",
        location: "Berkeley, CA",
        match: 82,
        acceptance: "21%",
        tag: "Strong match"
    },
    UCLA: {
        name: "UCLA",
        location: "Los Angeles, CA",
        match: 88,
        acceptance: "24%",
        tag: "Strong match"
    },
    UCI: {
        name: "UC Irvine",
        location: "Irvine, CA",
        match: 76,
        acceptance: "35%",
        tag: "Good match"
    },
    UCSD: {
        name: "UC San Diego",
        location: "La Jolla, CA",
        match: 83,
        acceptance: "30%",
        tag: "Strong match"
    },
    UCSB: {
        name: "UC Santa Barbara",
        location: "Santa Barbara, CA",
        match: 74,
        acceptance: "32%",
        tag: "Good match"
    },
    UCD: {
        name: "UC Davis",
        location: "Davis, CA",
        match: 79,
        acceptance: "41%",
        tag: "Good match"
    },
    UCSC: {
        name: "UC Santa Cruz",
        location: "Santa Cruz, CA",
        match: 70,
        acceptance: "47%",
        tag: "Possible match"
    },
    UCR: {
        name: "UC Riverside",
        location: "Riverside, CA",
        match: 68,
        acceptance: "61%",
        tag: "Possible match"
    },
    UCM: {
        name: "UC Merced",
        location: "Merced, CA",
        match: 65,
        acceptance: "74%",
        tag: "Possible match"
    }
};

function loadSelectedSchools() {
    const grid = document.getElementById("selectedSchoolsGrid");

    if (!grid) {
        return;
    }

    const profile =
        JSON.parse(localStorage.getItem("transferHubProfile") || "{}");

    if (!profile.campuses || profile.campuses.length === 0) {
        grid.innerHTML = `
            <div class="card empty-selected-card">
                <p style="margin:0;color:#64748b">
                    You have not selected any schools yet.
                </p>
            </div>
        `;
        return;
    }

    grid.innerHTML = "";

    profile.campuses.forEach(function (code) {
        const school = schoolInfo[code];

        if (!school) {
            return;
        }

        const color = school.match >= 80 ? "#1d9e75" :
            school.match >= 70 ? "#ef9f27" : "#64748b";

        const badgeClass = school.match >= 80 ? "b-green" :
            school.match >= 70 ? "b-amber" : "b-blue";

        // 重点修改：这里的动态卡片也绑定 showSchoolModal
        grid.innerHTML += `
            <div class="school-card selected-school-card" onclick="showSchoolModal('${code}')">
                <div class="sc-name">${school.name}</div>

                <div class="sc-loc">
                    <i class="ti ti-map-pin" style="font-size:10px"></i>
                    ${school.location}
                </div>

                <div class="badge-row">
                    <span class="badge b-blue">Selected</span>
                    <span class="badge ${badgeClass}">${school.tag}</span>
                </div>

                <div class="match-bar">
                    <div class="match-fill" style="width:${school.match}%;background:${color}"></div>
                </div>

                <div class="match-meta">
                    <span>${school.match}% match</span>
                    <span>${school.acceptance} acceptance</span>
                </div>
            </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    applyProfile();
    enableProfileLinks();
    loadProfileForm();
    loadSelectedSchools();
});

// ==========================================
// 全局学校信息弹窗逻辑 (Hackathon Mock Data)
// ==========================================
const schoolDatabase = {
    "UCLA": {
        name: "University of California, Los Angeles",
        location: "Los Angeles, CA",
        acceptance: "24% (Transfer)",
        gpa: "3.7 - 4.0",
        desc: "Highly competitive. Requires completion of major prep courses. IGETC is highly recommended for College of Letters and Science."
    },
    "UCB": {
        name: "University of California, Berkeley",
        location: "Berkeley, CA",
        acceptance: "21% (Transfer)",
        gpa: "3.8 - 4.0",
        desc: "L&S L&S requires full IGETC completion by Spring prior to transfer. EECS requires specific math and engineering sequences."
    },
    "UCI": {
        name: "University of California, Irvine",
        location: "Irvine, CA",
        acceptance: "35% (Transfer)",
        gpa: "3.4 - 3.9",
        desc: "Participates in TAG (Transfer Admission Guarantee) for certain majors, making it an excellent target school. Strong CS program."
    },
    "UCSD": {
        name: "University of California, San Diego",
        location: "La Jolla, CA",
        acceptance: "30% (Transfer)",
        gpa: "3.5 - 4.0",
        desc: "College system requires specific GEs. Computer Science is heavily impacted and requires high major prep GPA."
    },
    "UCSB": {
        name: "University of California, Santa Barbara",
        location: "Santa Barbara, CA",
        acceptance: "32% (Transfer)",
        gpa: "3.4 - 3.8",
        desc: "Offers TAG for College of Letters & Science. Beautiful coastal campus with strong physics and engineering programs."
    },
    "UCD": {
        name: "University of California, Davis",
        location: "Davis, CA",
        acceptance: "41% (Transfer)",
        gpa: "3.2 - 3.7",
        desc: "Strong STEM and agriculture programs. Participates in TAG. Very transfer-friendly campus culture."
    },
    "UCSC": {
        name: "University of California, Santa Cruz",
        location: "Santa Cruz, CA",
        acceptance: "47% (Transfer)",
        gpa: "3.0 - 3.5",
        desc: "Excellent game design and computer science programs. Participates in TAG for many majors."
    },
    "UCR": {
        name: "University of California, Riverside",
        location: "Riverside, CA",
        acceptance: "61% (Transfer)",
        gpa: "2.8 - 3.4",
        desc: "Fast-growing campus. Participates in TAG. Great support systems for transfer and first-generation students."
    },
    "UCM": {
        name: "University of California, Merced",
        location: "Merced, CA",
        acceptance: "74% (Transfer)",
        gpa: "2.8 - 3.2",
        desc: "Newest UC campus with modern facilities. Small class sizes and highly accessible research opportunities."
    }
};

function showSchoolModal(schoolKey) {
    const data = schoolDatabase[schoolKey] || {
        name: schoolKey, location: "California", acceptance: "N/A", gpa: "N/A", desc: "Detailed information coming soon."
    };

    let modal = document.getElementById('universalSchoolModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'universalSchoolModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
            background: rgba(0,0,0,0.5); display: flex; justify-content: center; 
            align-items: center; z-index: 9999; opacity: 0; pointer-events: none; 
            transition: opacity 0.2s ease;
        `;

        modal.innerHTML = `
            <div style="background: white; padding: 24px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); position: relative;">
                <button onclick="closeSchoolModal()" style="position: absolute; top: 12px; right: 12px; border: none; background: #f0f0f0; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-weight: bold; color: #333;">✕</button>
                <h2 id="modal-title" style="margin-top: 0; margin-bottom: 8px; color: #1a1a1a; font-size: 20px;">School Name</h2>
                <div id="modal-loc" style="color: #666; font-size: 14px; margin-bottom: 16px;">📍 Location</div>
                
                <div style="display: flex; gap: 16px; margin-bottom: 16px; padding: 12px; background: #f9fafb; border-radius: 8px;">
                    <div style="flex: 1;">
                        <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Admit Rate</div>
                        <div id="modal-acc" style="font-weight: bold; color: #1a6fc4; font-size: 16px;">--</div>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Target GPA</div>
                        <div id="modal-gpa" style="font-weight: bold; color: #1d9e75; font-size: 16px;">--</div>
                    </div>
                </div>
                
                <p id="modal-desc" style="font-size: 14px; line-height: 1.5; color: #444; margin-bottom: 0;"></p>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById('modal-title').innerText = data.name;
    document.getElementById('modal-loc').innerText = "📍 " + data.location;
    document.getElementById('modal-acc').innerText = data.acceptance;
    document.getElementById('modal-gpa').innerText = data.gpa;
    document.getElementById('modal-desc').innerText = data.desc;

    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
}

function closeSchoolModal() {
    const modal = document.getElementById('universalSchoolModal');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
    }
}

// ==========================================
// 编辑选校逻辑 (Edit Selected Schools)
// ==========================================

function openEditSchoolsModal() {
    let modal = document.getElementById('editSchoolsModal');

    // 如果还没创建过这个弹窗，就动态创建一个
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editSchoolsModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
            background: rgba(0,0,0,0.5); display: flex; justify-content: center; 
            align-items: center; z-index: 9999; opacity: 0; pointer-events: none; 
            transition: opacity 0.2s ease;
        `;
        document.body.appendChild(modal);
    }

    // 获取当前 localStorage 里已经选好的学校
    const profile = JSON.parse(localStorage.getItem("transferHubProfile") || "{}");
    const selectedCampuses = profile.campuses || [];

    // 所有的 9 所 UC 学校列表，与 schoolInfo 中的 Key 保持完全一致
    const allUCs = [
        { id: "UCB", name: "UC Berkeley" },
        { id: "UCLA", name: "UCLA" },
        { id: "UCSB", name: "UC Santa Barbara" },
        { id: "UCSD", name: "UC San Diego" },
        { id: "UCI", name: "UC Irvine" },
        { id: "UCD", name: "UC Davis" },
        { id: "UCSC", name: "UC Santa Cruz" },
        { id: "UCR", name: "UC Riverside" },
        { id: "UCM", name: "UC Merced" }
    ];

    // 生成 Checkbox 列表，如果存在于 selectedCampuses 中，就默认打上勾
    const checkboxesHtml = allUCs.map(function(uc) {
        const isChecked = selectedCampuses.includes(uc.id) ? "checked" : "";
        return `
            <label style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-size: 15px; cursor: pointer; padding: 4px 0;">
                <input type="checkbox" name="edit_uc" value="${uc.id}" ${isChecked} style="width: 18px; height: 18px; cursor: pointer;">
                ${uc.name}
            </label>
        `;
    }).join("");

    // 将内容填入 Modal
    modal.innerHTML = `
        <div style="background: white; padding: 24px; border-radius: 12px; width: 90%; max-width: 350px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); position: relative;">
            <button onclick="closeEditSchoolsModal()" style="position: absolute; top: 12px; right: 12px; border: none; background: #f0f0f0; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-weight: bold; color: #333; display: flex; justify-content: center; align-items: center;">✕</button>
            <h2 style="margin-top: 0; margin-bottom: 20px; color: #1a1a1a; font-size: 20px;">Edit Selected Schools</h2>
            
            <div style="max-height: 300px; overflow-y: auto; margin-bottom: 20px; padding-right: 10px; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding-top: 12px;">
                ${checkboxesHtml}
            </div>
            
            <button onclick="saveEditedSchools()" style="width: 100%; padding: 12px; background: #1a6fc4; color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer; transition: background 0.2s;">Save Changes</button>
        </div>
    `;

    // 展现弹窗
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
}

function closeEditSchoolsModal() {
    const modal = document.getElementById('editSchoolsModal');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
    }
}

function saveEditedSchools() {
    // 获取所有被打勾的学校 ID
    const checkedBoxes = document.querySelectorAll('input[name="edit_uc"]:checked');
    const newSelection = Array.from(checkedBoxes).map(function(cb) {
        return cb.value;
    });

    if (newSelection.length === 0) {
        alert("Please select at least one UC campus.");
        return;
    }

    // 获取并更新 LocalStorage
    const profile = JSON.parse(localStorage.getItem("transferHubProfile") || "{}");
    profile.campuses = newSelection;
    localStorage.setItem("transferHubProfile", JSON.stringify(profile));

    // 关闭弹窗 -> 触发 Toast 提示 -> 重新加载页面上的学校卡片 (无刷新更新)
    closeEditSchoolsModal();
    toast("Schools updated successfully!");

    // 调用你 auth.js 里的现有函数，重新渲染卡片
    if (typeof loadSelectedSchools === "function") {
        loadSelectedSchools();
    }
}

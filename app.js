/**
 * Masvingo Teachers' College - Academic Website Application Logic
 * Developed by Jerry (NUST Industrial Attachee)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Persistent LocalStorage State
    let currentTheme = localStorage.getItem('mtc_theme') || 'light';
    let isStaffLoggedIn = localStorage.getItem('mtc_staff_auth') === 'true';
    let sessionUser = localStorage.getItem('mtc_staff_user') || 'Jerry (ICT Admin)';

    // Retrieve Custom & Updated Items from LocalStorage
    let customPapers = JSON.parse(localStorage.getItem('mtc_custom_papers') || '[]');
    let customAnnouncements = JSON.parse(localStorage.getItem('mtc_custom_anc') || '[]');
    let customStaff = JSON.parse(localStorage.getItem('mtc_custom_staff') || '[]');

    // Merge custom papers
    customPapers.forEach(cp => {
        const existingIdx = MTC_DATA.pastPapers.findIndex(p => p.id === cp.id);
        if (existingIdx !== -1) {
            MTC_DATA.pastPapers[existingIdx] = cp;
        } else {
            MTC_DATA.pastPapers.unshift(cp);
        }
    });

    // Merge custom announcements
    customAnnouncements.forEach(ca => {
        const existingIdx = MTC_DATA.announcements.findIndex(a => a.id === ca.id);
        if (existingIdx !== -1) {
            MTC_DATA.announcements[existingIdx] = ca;
        } else {
            MTC_DATA.announcements.unshift(ca);
        }
    });

    // Merge custom staff
    customStaff.forEach(cs => {
        const existingIdx = MTC_DATA.staffDirectory.findIndex(s => s.id === cs.id);
        if (existingIdx !== -1) {
            MTC_DATA.staffDirectory[existingIdx] = cs;
        } else {
            MTC_DATA.staffDirectory.unshift(cs);
        }
    });

    let activePapers = [...MTC_DATA.pastPapers];
    let activeAnnouncements = [...MTC_DATA.announcements];

    // Temporary base64 storage for image file upload previews
    let uploadedPaperImg = null;
    let uploadedAncImg = null;
    let uploadedStaffPhoto = null;
    let editUploadedImg = null;

    // Apply theme & Session Status
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateSessionUI();

    // Initialize UI Component Renderers
    initThemeToggle();
    initTabNavigation();
    initGlobalSearch();
    renderStats();
    renderDepartments();
    renderProgrammes();
    renderPastPapers(activePapers);
    renderCalendarEvents();
    renderAnnouncements(activeAnnouncements);
    renderStaffDirectory();
    initStaffAuthAndAdmin();
    initImageUploadPreviews();

    // Theme Toggle Functionality
    function initThemeToggle() {
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (!themeBtn) return;

        updateThemeIcon(themeBtn);

        themeBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('mtc_theme', currentTheme);
            updateThemeIcon(themeBtn);
        });
    }

    function updateThemeIcon(btn) {
        if (currentTheme === 'dark') {
            btn.innerHTML = `<i class="fas fa-sun"></i> Light Mode`;
        } else {
            btn.innerHTML = `<i class="fas fa-moon"></i> Dark Mode`;
        }
    }

    // Session Status UI Update
    function updateSessionUI() {
        const badge = document.getElementById('session-user-badge');
        const userEl = document.getElementById('session-username');
        const adminBtn = document.getElementById('admin-mode-toggle');

        if (isStaffLoggedIn) {
            if (badge) badge.style.display = 'inline-flex';
            if (userEl) userEl.textContent = sessionUser;
            if (adminBtn) {
                adminBtn.classList.add('active');
                adminBtn.innerHTML = `<i class="fas fa-user-shield"></i> Staff Dashboard (Backend)`;
            }
        } else {
            if (badge) badge.style.display = 'none';
            if (adminBtn) {
                adminBtn.classList.remove('active');
                adminBtn.innerHTML = `<i class="fas fa-user-shield"></i> Staff Portal / Admin`;
            }
        }

        renderPastPapers(activePapers);
        renderAnnouncements(activeAnnouncements);
        renderStaffDirectory();
    }

    // Toast Notification Banner Helper
    function showToast(message, icon = 'check-circle') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `<i class="fas fa-${icon}" style="color: #fbbf24; font-size: 1.2rem;"></i> <span>${message}</span>`;

        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }

    // Tab Navigation Logic
    function initTabNavigation() {
        const tabItems = document.querySelectorAll('.nav-tab-item');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabItems.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');

                tabItems.forEach(t => t.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));

                tab.classList.add('active');
                const pane = document.getElementById(`tab-${targetTab}`);
                if (pane) pane.classList.add('active');

                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    // Global Search Bar in Header
    function initGlobalSearch() {
        const searchInput = document.getElementById('global-search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length > 1) {
                switchTab('resources');
                document.getElementById('paper-search-input').value = query;
                filterPapers();
            }
        });
    }

    window.switchTab = function(tabName) {
        const tab = document.querySelector(`.nav-tab-item[data-tab="${tabName}"]`);
        if (tab) tab.click();
    };

    // Render Stats
    function renderStats() {
        const stats = MTC_DATA.collegeInfo.stats;
        document.getElementById('stat-students').textContent = stats.students;
        document.getElementById('stat-lecturers').textContent = `${MTC_DATA.staffDirectory.length}+`;
        document.getElementById('stat-pastpapers').textContent = `${MTC_DATA.pastPapers.length}+`;
        document.getElementById('stat-passrate').textContent = stats.passRate;
    }

    // Render Departments (Clickable Cards)
    function renderDepartments() {
        const container = document.getElementById('departments-container');
        if (!container) return;

        container.innerHTML = MTC_DATA.departments.map(dept => `
            <div class="dept-card clickable-card" onclick="filterPapersByDept('${dept.id}')" title="Click to explore papers & courses for ${dept.name}">
                <div>
                    <div class="dept-card-header">
                        <div class="dept-card-icon">
                            <i class="fas fa-${dept.icon}"></i>
                        </div>
                        <div>
                            <h3 class="dept-card-title">${dept.name}</h3>
                            <div class="dept-card-head"><i class="fas fa-user-tie"></i> Head: ${dept.head}</div>
                        </div>
                    </div>
                    <p class="dept-card-desc">${dept.description}</p>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                    <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="fas fa-envelope"></i> ${dept.email}</span>
                    <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); filterPapersByDept('${dept.id}')"><i class="fas fa-file-pdf"></i> View Papers</button>
                </div>
            </div>
        `).join('');
    }

    // Render Programmes & Courses (Clickable Course Units)
    function renderProgrammes() {
        const container = document.getElementById('programmes-container');
        if (!container) return;

        container.innerHTML = MTC_DATA.programmes.map(prog => `
            <div style="background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color); padding: 1.75rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <span style="background: var(--accent-light); color: var(--accent); font-weight: 700; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 4px; text-transform: uppercase;">
                            ${prog.duration}
                        </span>
                        <h3 style="font-size: 1.35rem; margin-top: 0.4rem;">${prog.title}</h3>
                    </div>
                    <a href="${prog.googleClassroomLink}" target="_blank" class="workspace-badge" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">
                        <i class="fab fa-google"></i> Google Classroom Portal
                    </a>
                </div>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">${prog.description}</p>
                <div style="background: var(--bg-main); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1rem;">
                    <strong><i class="fas fa-check-circle" style="color: var(--primary);"></i> Entry Requirements:</strong> ${prog.entryRequirements}
                </div>
                <h4 style="font-size: 1rem; margin-bottom: 0.75rem; color: var(--primary);"><i class="fas fa-book"></i> Core Course Units (Click any unit to search past papers)</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.75rem;">
                    ${prog.courses.map(c => `
                        <div class="clickable-card" onclick="filterPapersByCode('${c.code}')" style="background: var(--bg-card); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: var(--transition);" title="Click to view past examination papers for ${c.code}">
                            <div>
                                <strong style="color: var(--accent);">${c.code}</strong>: ${c.title}
                            </div>
                            <span style="font-size: 0.75rem; color: var(--text-muted);"><i class="fas fa-search" style="font-size:0.7rem;"></i> ${c.units} Units</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // Render Past Papers (Clean Frontend View)
    function renderPastPapers(papers, highlightId = null) {
        const container = document.getElementById('past-papers-container');
        if (!container) return;

        if (papers.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
                    <i class="fas fa-folder-open" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <p style="color: var(--text-secondary);">No past examination papers match your current search filters.</p>
                    <button class="btn btn-secondary btn-sm" style="margin-top: 1rem;" onclick="resetPaperFilters()">Reset Filters</button>
                </div>
            `;
            return;
        }

        container.innerHTML = papers.map(paper => {
            const isNew = paper.id === highlightId;
            return `
                <div class="paper-card ${isNew ? 'newly-uploaded' : ''}" id="card-${paper.id}">
                    <span class="paper-badge">${paper.year}</span>
                    ${paper.image ? `<img src="${paper.image}" class="paper-img-thumb" alt="Paper diagram">` : ''}
                    <div class="paper-code">${paper.code}</div>
                    <h3 class="paper-title">${paper.title}</h3>
                    <div class="paper-meta">
                        <div class="paper-meta-item"><i class="far fa-clock"></i> ${paper.duration}</div>
                        <div class="paper-meta-item"><i class="far fa-calendar-alt"></i> ${paper.semester}</div>
                        <div class="paper-meta-item"><i class="fas fa-file-pdf"></i> ${paper.fileSize}</div>
                        <div class="paper-meta-item"><i class="fas fa-download"></i> ${paper.downloads} downloads</div>
                    </div>
                    <div class="paper-actions">
                        <button class="btn btn-secondary btn-sm" onclick="previewPaper('${paper.id}')"><i class="far fa-eye"></i> Preview</button>
                        <button class="btn btn-primary btn-sm" onclick="downloadPaper('${paper.id}')"><i class="fas fa-download"></i> Download PDF</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Filter Papers Logic
    window.filterPapers = function() {
        const query = document.getElementById('paper-search-input').value.toLowerCase().trim();
        const deptFilter = document.getElementById('dept-filter-select').value;
        const yearFilter = document.getElementById('year-filter-select').value;

        activePapers = MTC_DATA.pastPapers.filter(paper => {
            const matchesQuery = paper.title.toLowerCase().includes(query) || paper.code.toLowerCase().includes(query) || paper.examiner.toLowerCase().includes(query);
            const matchesDept = deptFilter === 'all' || paper.departmentId === deptFilter;
            const matchesYear = yearFilter === 'all' || paper.year === yearFilter;

            return matchesQuery && matchesDept && matchesYear;
        });

        renderPastPapers(activePapers);
    };

    window.filterCustomUploadedPapers = function() {
        switchTab('resources');
        activePapers = MTC_DATA.pastPapers.filter(p => p.isCustom || p.image || p.examiner.includes('Jerry') || p.examiner.includes('Staff'));
        renderPastPapers(activePapers);
        showToast('Filtering staff & custom uploaded examination papers.');
    };

    window.filterPapersByDept = function(deptId) {
        switchTab('resources');
        document.getElementById('dept-filter-select').value = deptId;
        filterPapers();
    };

    window.filterPapersByCode = function(code) {
        switchTab('resources');
        const input = document.getElementById('paper-search-input');
        if (input) input.value = code;
        document.getElementById('dept-filter-select').value = 'all';
        document.getElementById('year-filter-select').value = 'all';
        filterPapers();
        showToast(`Showing examination papers for course unit: ${code}`);
    };

    window.resetPaperFilters = function() {
        document.getElementById('paper-search-input').value = '';
        document.getElementById('dept-filter-select').value = 'all';
        document.getElementById('year-filter-select').value = 'all';
        activePapers = [...MTC_DATA.pastPapers];
        renderPastPapers(activePapers);
    };

    // Preview & Download Modal logic
    window.previewPaper = function(paperId) {
        const paper = MTC_DATA.pastPapers.find(p => p.id === paperId);
        if (!paper) return;

        const modal = document.getElementById('paper-modal');
        const titleEl = document.getElementById('modal-paper-title');
        const bodyEl = document.getElementById('modal-paper-body');

        titleEl.textContent = `${paper.code}: ${paper.title} (${paper.year})`;
        bodyEl.innerHTML = `
            <div style="display: flex; gap: 1.5rem; margin-bottom: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                <div><strong>Examiner:</strong> ${paper.examiner}</div>
                <div><strong>Semester:</strong> ${paper.semester}</div>
                <div><strong>Time Allowed:</strong> ${paper.duration}</div>
            </div>
            ${paper.image ? `<img src="${paper.image}" style="width: 100%; max-height: 220px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem; border: 1px solid var(--border-color);" alt="Paper Diagram">` : ''}
            <h4>Sample Examination Questions:</h4>
            <div class="exam-preview-box">
                ${paper.questionsPreview.map(q => `<p style="margin-bottom: 0.75rem;">${q}</p>`).join('')}
            </div>
            <div style="text-align: right; margin-top: 1.5rem;">
                <button class="btn btn-primary" onclick="downloadPaper('${paper.id}')"><i class="fas fa-download"></i> Download Full Paper (${paper.fileSize})</button>
            </div>
        `;

        modal.classList.add('active');
    };

    window.downloadPaper = function(paperId) {
        const paper = MTC_DATA.pastPapers.find(p => p.id === paperId);
        if (!paper) return;

        paper.downloads++;
        renderPastPapers(activePapers);

        const textContent = `
MASVINGO TEACHERS' COLLEGE
"EMBLEM OF EXCELLENCE"
DEPARTMENT OF INFORMATION & COMMUNICATION TECHNOLOGY
END OF SEMESTER EXAMINATION PAPER

Course Code: ${paper.code}
Course Title: ${paper.title}
Year: ${paper.year} | ${paper.semester}
Time Allowed: ${paper.duration}
Examiner: ${paper.examiner}

INSTRUCTIONS TO CANDIDATES:
1. Answer all questions in Section A and any two questions from Section B.
2. Cell phones and unauthorized materials are strictly prohibited.
3. Write legibly and present all calculations step-by-step.

----------------------------------------------------------------------
QUESTIONS PREVIEW:
${paper.questionsPreview.join('\n\n')}

[End of Examination Paper - Masvingo Teachers' College Academic Portal]
        `;

        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${paper.code}_PastPaper_${paper.year}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    window.closePaperModal = function() {
        document.getElementById('paper-modal').classList.remove('active');
    };

    // Render Calendar
    function renderCalendarEvents() {
        const container = document.getElementById('calendar-events-container');
        if (!container) return;

        container.innerHTML = MTC_DATA.calendarEvents.map(evt => {
            const dateObj = new Date(evt.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();

            return `
                <div class="calendar-card">
                    <div class="calendar-date-box">
                        <span class="month">${month}</span>
                        <span class="day">${day}</span>
                    </div>
                    <div>
                        <span class="announcement-tag">${evt.category}</span>
                        <h4 style="font-size: 1.05rem; margin: 0.3rem 0;">${evt.title}</h4>
                        <p style="font-size: 0.85rem; color: var(--text-secondary);">${evt.description}</p>
                        <span style="font-size: 0.78rem; color: var(--text-muted);"><i class="fas fa-map-marker-alt"></i> ${evt.location}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render Announcements (Clean Frontend View)
    function renderAnnouncements(items, highlightId = null) {
        const container = document.getElementById('announcements-container');
        if (!container) return;

        container.innerHTML = items.map(anc => {
            const isNew = anc.id === highlightId;
            return `
                <div class="announcement-card ${anc.urgent ? 'urgent' : ''} ${isNew ? 'newly-uploaded' : ''}" id="anc-${anc.id}">
                    <div class="announcement-header">
                        <span class="announcement-tag">${anc.category}</span>
                        <span style="font-size: 0.78rem; color: var(--text-muted);">${anc.date}</span>
                    </div>
                    <h3 class="announcement-title">${anc.title}</h3>
                    ${anc.image ? `<img src="${anc.image}" class="announcement-img" alt="Announcement Image">` : ''}
                    <p class="announcement-content">${anc.content}</p>
                    <div class="announcement-footer">
                        <span><i class="fas fa-user-edit"></i> Published by: ${anc.author}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Staff Directory Renderer (Clickable Lecturer Profiles)
    function renderStaffDirectory(highlightId = null) {
        const container = document.getElementById('staff-container');
        if (!container) return;

        container.innerHTML = MTC_DATA.staffDirectory.map(staff => {
            const isNew = staff.id === highlightId;
            const dept = MTC_DATA.departments.find(d => d.id === staff.departmentId);
            const deptName = dept ? dept.name : "Academic Faculty";

            return `
                <div class="staff-card clickable-card ${isNew ? 'newly-uploaded' : ''}" id="staff-${staff.id}" onclick="viewStaffProfile('${staff.id}')" title="Click to view full lecturer profile and consultation hours">
                    ${staff.badge ? `<span style="position: absolute; top: 1rem; right: 1rem; background: var(--accent-light); color: var(--accent); font-weight: 700; font-size: 0.72rem; padding: 0.2rem 0.6rem; border-radius: 12px; text-transform: uppercase;">${staff.badge}</span>` : ''}
                    
                    ${staff.photo ? `<img src="${staff.photo}" class="staff-avatar-img" alt="${staff.name}">` : `<div class="staff-avatar">${staff.name.charAt(0)}</div>`}
                    
                    <h3 class="staff-name">${staff.name}</h3>
                    <div class="staff-title">${staff.title}</div>
                    
                    <div style="background: rgba(6, 78, 59, 0.06); color: var(--primary); font-size: 0.78rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 20px; margin-bottom: 0.8rem; display: inline-block;">
                        <i class="fas fa-university"></i> ${deptName}
                    </div>

                    ${staff.specialization ? `<p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 1.2rem; font-style: italic;"><i class="fas fa-microscope"></i> ${staff.specialization}</p>` : ''}
                    
                    <div class="staff-details">
                        <div class="staff-details-item">
                            <i class="fas fa-envelope" style="color: var(--primary);"></i> 
                            <a href="mailto:${staff.email}" onclick="event.stopPropagation();" style="color: var(--primary); text-decoration: underline;">${staff.email}</a>
                        </div>
                        <div class="staff-details-item">
                            <i class="fas fa-phone" style="color: var(--primary);"></i> 
                            <a href="tel:${staff.phone}" onclick="event.stopPropagation();" style="color: inherit;">${staff.phone}</a>
                        </div>
                        <div class="staff-details-item">
                            <i class="fas fa-building" style="color: var(--primary);"></i> ${staff.office}
                        </div>
                        <div class="staff-details-item">
                            <i class="far fa-clock" style="color: var(--primary);"></i> ${staff.officeHours}
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem; width: 100%;">
                        <button class="btn btn-primary btn-sm" style="flex: 1; justify-content: center;" onclick="event.stopPropagation(); viewStaffProfile('${staff.id}')">
                            <i class="fas fa-id-card"></i> View Profile
                        </button>
                        <a href="${staff.classroomLink || '#'}" target="_blank" onclick="event.stopPropagation();" class="btn btn-secondary btn-sm" style="padding: 0.45rem 0.85rem;" title="Google Classroom">
                            <i class="fab fa-google"></i>
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }

    // View Staff Profile Modal Popup
    window.viewStaffProfile = function(staffId) {
        const staff = MTC_DATA.staffDirectory.find(s => s.id === staffId);
        if (!staff) return;

        const modal = document.getElementById('staff-modal');
        const nameEl = document.getElementById('staff-modal-name');
        const bodyEl = document.getElementById('staff-modal-body');
        if (!modal || !bodyEl) return;

        const dept = MTC_DATA.departments.find(d => d.id === staff.departmentId);
        const deptName = dept ? dept.name : "Academic Faculty";

        nameEl.textContent = `${staff.name} — Profile Details`;
        bodyEl.innerHTML = `
            <div style="display: flex; gap: 1.5rem; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap;">
                ${staff.photo ? `<img src="${staff.photo}" style="width: 96px; height: 96px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary); box-shadow: var(--shadow-md);">` : `<div style="width: 96px; height: 96px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: 700;">${staff.name.charAt(0)}</div>`}
                <div style="flex: 1; min-width: 240px;">
                    <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.3rem;">
                        <h3 style="font-size: 1.35rem; margin: 0;">${staff.name}</h3>
                        ${staff.badge ? `<span style="background: var(--accent-light); color: var(--accent); font-weight: 700; font-size: 0.72rem; padding: 0.2rem 0.6rem; border-radius: 12px; text-transform: uppercase;">${staff.badge}</span>` : ''}
                    </div>
                    <div style="font-size: 0.95rem; color: var(--primary); font-weight: 600; margin-bottom: 0.4rem;">${staff.title}</div>
                    <div style="background: rgba(6, 78, 59, 0.08); color: var(--primary); font-size: 0.8rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 20px; display: inline-block;">
                        <i class="fas fa-university"></i> ${deptName}
                    </div>
                </div>
            </div>

            ${staff.specialization ? `
                <div style="background: var(--bg-main); padding: 1rem 1.25rem; border-radius: var(--radius-sm); border-left: 4px solid var(--accent); margin-bottom: 1.5rem;">
                    <strong style="color: var(--text-primary);"><i class="fas fa-microscope" style="color: var(--accent);"></i> Academic Specialization & Research:</strong>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.3rem;">${staff.specialization}</p>
                </div>
            ` : ''}

            <h4 style="font-size: 1rem; margin-bottom: 0.75rem; color: var(--primary);"><i class="fas fa-address-book"></i> Office & Contact Information</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem;">
                <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 0.85rem; border-radius: var(--radius-sm);">
                    <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Email Contact</div>
                    <a href="mailto:${staff.email}" style="color: var(--primary); font-weight: 600; font-size: 0.88rem; text-decoration: underline;"><i class="fas fa-envelope"></i> ${staff.email}</a>
                </div>
                <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 0.85rem; border-radius: var(--radius-sm);">
                    <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Campus Phone / Extension</div>
                    <a href="tel:${staff.phone}" style="color: var(--text-primary); font-weight: 600; font-size: 0.88rem;"><i class="fas fa-phone"></i> ${staff.phone}</a>
                </div>
                <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 0.85rem; border-radius: var(--radius-sm);">
                    <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Office Location</div>
                    <div style="color: var(--text-primary); font-weight: 600; font-size: 0.88rem;"><i class="fas fa-building" style="color: var(--primary);"></i> ${staff.office}</div>
                </div>
                <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 0.85rem; border-radius: var(--radius-sm);">
                    <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Consultation Hours</div>
                    <div style="color: var(--text-primary); font-weight: 600; font-size: 0.88rem;"><i class="far fa-clock" style="color: var(--primary);"></i> ${staff.officeHours}</div>
                </div>
            </div>

            <div style="display: flex; gap: 0.75rem; justify-content: flex-end; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
                <a href="mailto:${staff.email}" class="btn btn-secondary"><i class="fas fa-paper-plane"></i> Send Email</a>
                <a href="${staff.classroomLink || '#'}" target="_blank" class="btn btn-primary"><i class="fab fa-google"></i> Open Classroom</a>
            </div>
        `;

        modal.classList.add('active');
    };

    window.closeStaffModal = function() {
        const modal = document.getElementById('staff-modal');
        if (modal) modal.classList.remove('active');
    };

    // Image Upload File Reader Helper
    function initImageUploadPreviews() {
        bindImagePreview('admin-paper-image', 'paper-img-preview', (dataUrl) => { uploadedPaperImg = dataUrl; });
        bindImagePreview('admin-anc-image', 'anc-img-preview', (dataUrl) => { uploadedAncImg = dataUrl; });
        bindImagePreview('admin-staff-photo', 'staff-photo-preview', (dataUrl) => { uploadedStaffPhoto = dataUrl; });
    }

    function bindImagePreview(inputId, previewId, callback) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        if (!input || !preview) return;

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const dataUrl = event.target.result;
                    preview.innerHTML = `<img src="${dataUrl}" alt="Preview">`;
                    preview.style.display = 'block';
                    callback(dataUrl);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Admin Backend Section Switcher (Upload vs Backend CRUD Management)
    window.showAdminSection = function(section) {
        const uploadSec = document.getElementById('admin-upload-section');
        const manageSec = document.getElementById('admin-manage-section');
        const btnUpload = document.getElementById('tab-btn-upload');
        const btnManage = document.getElementById('tab-btn-manage');

        if (section === 'manage') {
            if (uploadSec) uploadSec.style.display = 'none';
            if (manageSec) manageSec.style.display = 'block';
            if (btnUpload) { btnUpload.classList.remove('btn-primary'); btnUpload.classList.add('btn-secondary'); }
            if (btnManage) { btnManage.classList.remove('btn-secondary'); btnManage.classList.add('btn-primary'); }
            renderAdminManageList();
        } else {
            if (uploadSec) uploadSec.style.display = 'block';
            if (manageSec) manageSec.style.display = 'none';
            if (btnUpload) { btnUpload.classList.remove('btn-secondary'); btnUpload.classList.add('btn-primary'); }
            if (btnManage) { btnManage.classList.remove('btn-primary'); btnManage.classList.add('btn-secondary'); }
        }
    };

    // Render Backend Admin Management List (Backend CRUD Interface for Developer/Staff)
    window.renderAdminManageList = function() {
        const listEl = document.getElementById('admin-manage-list');
        if (!listEl) return;

        let html = `
            <div style="background: rgba(6,78,59,0.06); padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1.25rem; border-left: 4px solid var(--primary); font-size: 0.85rem; color: var(--primary);">
                <i class="fas fa-database"></i> <strong>Backend Management Control:</strong> Click <strong>Edit</strong> on any item to update text, details, or replace photos. Click <strong>Delete</strong> to permanently remove records.
            </div>
            
            <h5 style="margin-bottom: 0.6rem; color: var(--primary); font-size: 0.95rem; font-weight: 700;"><i class="fas fa-file-pdf"></i> Past Examination Papers (${MTC_DATA.pastPapers.length})</h5>
        `;

        html += MTC_DATA.pastPapers.map(p => `
            <div class="manage-item-card" id="manage-paper-${p.id}">
                <div class="manage-item-info">
                    ${p.image ? `<img src="${p.image}" class="manage-item-thumb">` : `<div style="width:44px; height:44px; background:rgba(6,78,59,0.1); border-radius:8px; display:flex; align-items:center; justify-content:center; color:var(--primary); font-weight:700;">${p.code}</div>`}
                    <div>
                        <strong style="font-size: 0.95rem; display: block;">${p.code}: ${p.title}</strong>
                        <div style="font-size: 0.78rem; color: var(--text-secondary);">${p.year} • Examiner: ${p.examiner}</div>
                    </div>
                </div>
                <div class="manage-item-actions">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); openEditModal('paper', '${p.id}');"><i class="fas fa-edit"></i> Edit</button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteItem('paper', '${p.id}');"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        `).join('');

        html += `<h5 style="margin: 1.5rem 0 0.6rem 0; color: var(--accent); font-size: 0.95rem; font-weight: 700;"><i class="fas fa-bullhorn"></i> Academic Notices (${MTC_DATA.announcements.length})</h5>`;

        html += MTC_DATA.announcements.map(a => `
            <div class="manage-item-card" id="manage-anc-${a.id}">
                <div class="manage-item-info">
                    ${a.image ? `<img src="${a.image}" class="manage-item-thumb">` : `<div style="width:44px; height:44px; background:rgba(217,119,6,0.1); border-radius:8px; display:flex; align-items:center; justify-content:center; color:var(--accent);"><i class="fas fa-bullhorn"></i></div>`}
                    <div>
                        <strong style="font-size: 0.95rem; display: block;">${a.title}</strong>
                        <div style="font-size: 0.78rem; color: var(--text-secondary);">${a.category} • ${a.date}</div>
                    </div>
                </div>
                <div class="manage-item-actions">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); openEditModal('anc', '${a.id}');"><i class="fas fa-edit"></i> Edit</button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteItem('anc', '${a.id}');"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        `).join('');

        html += `<h5 style="margin: 1.5rem 0 0.6rem 0; color: var(--primary); font-size: 0.95rem; font-weight: 700;"><i class="fas fa-users"></i> Staff Directory Members (${MTC_DATA.staffDirectory.length})</h5>`;

        html += MTC_DATA.staffDirectory.map(s => `
            <div class="manage-item-card" id="manage-staff-${s.id}">
                <div class="manage-item-info">
                    ${s.photo ? `<img src="${s.photo}" class="manage-item-thumb">` : `<div style="width:44px; height:44px; background:var(--primary); color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700;">${s.name.charAt(0)}</div>`}
                    <div>
                        <strong style="font-size: 0.95rem; display: block;">${s.name}</strong>
                        <div style="font-size: 0.78rem; color: var(--text-secondary);">${s.title} • ${s.office}</div>
                    </div>
                </div>
                <div class="manage-item-actions">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); openEditModal('staff', '${s.id}');"><i class="fas fa-edit"></i> Edit</button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteItem('staff', '${s.id}');"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        `).join('');

        listEl.innerHTML = html;
    };

    // Delete Item Backend CRUD Functionality
    window.deleteItem = function(type, id) {
        if (!confirm("Backend Command: Are you sure you want to permanently delete this record from the database?")) return;

        if (type === 'paper') {
            MTC_DATA.pastPapers = MTC_DATA.pastPapers.filter(p => p.id !== id);
            customPapers = customPapers.filter(p => p.id !== id);
            localStorage.setItem('mtc_custom_papers', JSON.stringify(customPapers));
            activePapers = [...MTC_DATA.pastPapers];
            renderPastPapers(activePapers);
            showToast('Backend: Past Examination Paper deleted successfully!', 'trash');
        } else if (type === 'anc') {
            MTC_DATA.announcements = MTC_DATA.announcements.filter(a => a.id !== id);
            customAnnouncements = customAnnouncements.filter(a => a.id !== id);
            localStorage.setItem('mtc_custom_anc', JSON.stringify(customAnnouncements));
            activeAnnouncements = [...MTC_DATA.announcements];
            renderAnnouncements(activeAnnouncements);
            showToast('Backend: Announcement notice deleted successfully!', 'trash');
        } else if (type === 'staff') {
            MTC_DATA.staffDirectory = MTC_DATA.staffDirectory.filter(s => s.id !== id);
            customStaff = customStaff.filter(s => s.id !== id);
            localStorage.setItem('mtc_custom_staff', JSON.stringify(customStaff));
            renderStaffDirectory();
            showToast('Backend: Staff profile deleted successfully!', 'trash');
        }

        renderStats();
        if (document.getElementById('admin-manage-section').style.display !== 'none') {
            renderAdminManageList();
        }
    };

    // Open Edit Item Modal (Backend CRUD)
    window.openEditModal = function(type, id) {
        editUploadedImg = null;
        const modal = document.getElementById('edit-modal');
        const titleEl = document.getElementById('edit-modal-title');
        const bodyEl = document.getElementById('edit-modal-body');

        if (!modal || !bodyEl) return;

        if (type === 'paper') {
            const item = MTC_DATA.pastPapers.find(p => p.id === id);
            if (!item) return;

            titleEl.textContent = `Backend Edit: ${item.code} - ${item.title}`;
            bodyEl.innerHTML = `
                <form id="edit-item-form" onsubmit="event.preventDefault(); saveEditItem('paper', '${item.id}');">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div>
                            <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;">Course Code</label>
                            <input type="text" id="edit-field-code" class="form-control" value="${item.code}" required>
                        </div>
                        <div>
                            <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;">Course Title</label>
                            <input type="text" id="edit-field-title" class="form-control" value="${item.title}" required>
                        </div>
                        <div>
                            <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;">Exam Year</label>
                            <input type="text" id="edit-field-year" class="form-control" value="${item.year}" required>
                        </div>
                        <div>
                            <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;">Examiner Name</label>
                            <input type="text" id="edit-field-examiner" class="form-control" value="${item.examiner}" required>
                        </div>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;">Sample Question 1</label>
                        <textarea id="edit-field-q1" class="form-control" rows="2" required>${item.questionsPreview[0] || ''}</textarea>
                    </div>
                    <div style="margin-bottom: 1.25rem;">
                        <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;"><i class="fas fa-image"></i> Replace Picture / Diagram</label>
                        <input type="file" id="edit-file-img" class="form-control" accept="image/*">
                        ${item.image ? `<div style="margin-top:0.5rem;"><small style="color:var(--text-muted);">Current Attached Image:</small><br><img src="${item.image}" style="max-height:80px; border-radius:6px; border:1px solid var(--border-color); margin-top:0.25rem;"></div>` : ''}
                        <div id="edit-img-preview" class="img-upload-preview"></div>
                    </div>
                    <div style="display: flex; gap: 0.75rem;">
                        <button type="submit" class="btn btn-primary" style="flex: 2; justify-content: center;"><i class="fas fa-save"></i> Save Changes to Portal</button>
                        <button type="button" class="btn btn-secondary" style="flex: 1; justify-content: center;" onclick="closeEditModal()"><i class="fas fa-times"></i> Cancel</button>
                    </div>
                </form>
            `;
        } else if (type === 'anc') {
            const item = MTC_DATA.announcements.find(a => a.id === id);
            if (!item) return;

            titleEl.textContent = `Backend Edit: ${item.title}`;
            bodyEl.innerHTML = `
                <form id="edit-item-form" onsubmit="event.preventDefault(); saveEditItem('anc', '${item.id}');">
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div>
                            <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;">Notice Title</label>
                            <input type="text" id="edit-field-title" class="form-control" value="${item.title}" required>
                        </div>
                        <div>
                            <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;">Category</label>
                            <select id="edit-field-cat" class="form-control" required>
                                <option value="Urgent" ${item.category === 'Urgent' ? 'selected' : ''}>Urgent</option>
                                <option value="Exam Notice" ${item.category === 'Exam Notice' || item.category === 'Exam' ? 'selected' : ''}>Exam Notice</option>
                                <option value="Google Classroom" ${item.category === 'Google Classroom' || item.category === 'E-Learning' ? 'selected' : ''}>Google Classroom</option>
                                <option value="Teaching Practice" ${item.category === 'Teaching Practice' || item.category === 'TP' ? 'selected' : ''}>Teaching Practice</option>
                            </select>
                        </div>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;">Content Body</label>
                        <textarea id="edit-field-content" class="form-control" rows="3" required>${item.content}</textarea>
                    </div>
                    <div style="margin-bottom: 1.25rem;">
                        <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;"><i class="fas fa-camera"></i> Replace Picture / Event Banner</label>
                        <input type="file" id="edit-file-img" class="form-control" accept="image/*">
                        ${item.image ? `<div style="margin-top:0.5rem;"><small style="color:var(--text-muted);">Current Attached Banner:</small><br><img src="${item.image}" style="max-height:80px; border-radius:6px; border:1px solid var(--border-color); margin-top:0.25rem;"></div>` : ''}
                        <div id="edit-img-preview" class="img-upload-preview"></div>
                    </div>
                    <div style="display: flex; gap: 0.75rem;">
                        <button type="submit" class="btn btn-primary" style="flex: 2; justify-content: center;"><i class="fas fa-save"></i> Save Changes to Noticeboard</button>
                        <button type="button" class="btn btn-secondary" style="flex: 1; justify-content: center;" onclick="closeEditModal()"><i class="fas fa-times"></i> Cancel</button>
                    </div>
                </form>
            `;
        } else if (type === 'staff') {
            const item = MTC_DATA.staffDirectory.find(s => s.id === id);
            if (!item) return;

            titleEl.textContent = `Backend Edit: ${item.name}`;
            bodyEl.innerHTML = `
                <form id="edit-item-form" onsubmit="event.preventDefault(); saveEditItem('staff', '${item.id}');">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div>
                            <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;">Full Name & Title</label>
                            <input type="text" id="edit-field-name" class="form-control" value="${item.name}" required>
                        </div>
                        <div>
                            <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;">Title / Designation</label>
                            <input type="text" id="edit-field-title" class="form-control" value="${item.title}" required>
                        </div>
                        <div>
                            <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;">Email Address</label>
                            <input type="email" id="edit-field-email" class="form-control" value="${item.email}" required>
                        </div>
                        <div>
                            <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;">Office Room</label>
                            <input type="text" id="edit-field-office" class="form-control" value="${item.office}" required>
                        </div>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;">Specialization & Research Focus</label>
                        <input type="text" id="edit-field-spec" class="form-control" value="${item.specialization || ''}">
                    </div>
                    <div style="margin-bottom: 1.25rem;">
                        <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; display: block;"><i class="fas fa-id-badge"></i> Replace Profile Photo (Picture)</label>
                        <input type="file" id="edit-file-img" class="form-control" accept="image/*">
                        ${item.photo ? `<div style="margin-top:0.5rem;"><small style="color:var(--text-muted);">Current Photo:</small><br><img src="${item.photo}" style="max-height:80px; border-radius:50%; border:1px solid var(--border-color); margin-top:0.25rem;"></div>` : ''}
                        <div id="edit-img-preview" class="img-upload-preview"></div>
                    </div>
                    <div style="display: flex; gap: 0.75rem;">
                        <button type="submit" class="btn btn-primary" style="flex: 2; justify-content: center;"><i class="fas fa-save"></i> Save Profile Changes</button>
                        <button type="button" class="btn btn-secondary" style="flex: 1; justify-content: center;" onclick="closeEditModal()"><i class="fas fa-times"></i> Cancel</button>
                    </div>
                </form>
            `;
        }

        bindImagePreview('edit-file-img', 'edit-img-preview', (dataUrl) => { editUploadedImg = dataUrl; });
        modal.classList.add('active');
    };

    window.closeEditModal = function() {
        const modal = document.getElementById('edit-modal');
        if (modal) modal.classList.remove('active');
    };

    // Save Edit Item Changes in Backend
    window.saveEditItem = function(type, id) {
        if (type === 'paper') {
            const item = MTC_DATA.pastPapers.find(p => p.id === id);
            if (item) {
                item.code = document.getElementById('edit-field-code').value.toUpperCase();
                item.title = document.getElementById('edit-field-title').value;
                item.year = document.getElementById('edit-field-year').value;
                item.examiner = document.getElementById('edit-field-examiner').value;
                item.questionsPreview[0] = document.getElementById('edit-field-q1').value;
                if (editUploadedImg) item.image = editUploadedImg;

                const customIndex = customPapers.findIndex(p => p.id === id);
                if (customIndex !== -1) {
                    customPapers[customIndex] = { ...item };
                } else {
                    customPapers.push({ ...item });
                }
                localStorage.setItem('mtc_custom_papers', JSON.stringify(customPapers));

                activePapers = [...MTC_DATA.pastPapers];
                renderPastPapers(activePapers, item.id);
                showToast(`Backend: Paper (${item.code}) updated successfully!`);
            }
        } else if (type === 'anc') {
            const item = MTC_DATA.announcements.find(a => a.id === id);
            if (item) {
                item.title = document.getElementById('edit-field-title').value;
                item.category = document.getElementById('edit-field-cat') ? document.getElementById('edit-field-cat').value : item.category;
                item.content = document.getElementById('edit-field-content').value;
                if (editUploadedImg) item.image = editUploadedImg;

                const customIndex = customAnnouncements.findIndex(a => a.id === id);
                if (customIndex !== -1) {
                    customAnnouncements[customIndex] = { ...item };
                } else {
                    customAnnouncements.push({ ...item });
                }
                localStorage.setItem('mtc_custom_anc', JSON.stringify(customAnnouncements));

                activeAnnouncements = [...MTC_DATA.announcements];
                renderAnnouncements(activeAnnouncements, item.id);
                showToast(`Backend: Notice ("${item.title}") updated successfully!`);
            }
        } else if (type === 'staff') {
            const item = MTC_DATA.staffDirectory.find(s => s.id === id);
            if (item) {
                item.name = document.getElementById('edit-field-name').value;
                item.title = document.getElementById('edit-field-title').value;
                item.email = document.getElementById('edit-field-email').value;
                item.office = document.getElementById('edit-field-office').value;
                const specInput = document.getElementById('edit-field-spec');
                if (specInput) item.specialization = specInput.value;
                if (editUploadedImg) item.photo = editUploadedImg;

                const customIndex = customStaff.findIndex(s => s.id === id);
                if (customIndex !== -1) {
                    customStaff[customIndex] = { ...item };
                } else {
                    customStaff.push({ ...item });
                }
                localStorage.setItem('mtc_custom_staff', JSON.stringify(customStaff));

                renderStaffDirectory(item.id);
                showToast(`Backend: Staff profile for ${item.name} updated successfully!`);
            }
        }

        closeEditModal();
        if (document.getElementById('admin-manage-section').style.display !== 'none') {
            renderAdminManageList();
        }
    };

    // Staff Authentication & Admin Dashboard System
    function initStaffAuthAndAdmin() {
        const adminBtn = document.getElementById('admin-mode-toggle');
        const loginModal = document.getElementById('staff-login-modal');
        const closeLoginBtn = document.getElementById('close-login-modal');
        const loginForm = document.getElementById('staff-login-form');
        const loginError = document.getElementById('login-error-msg');

        const adminModal = document.getElementById('admin-modal');
        const closeAdminBtn = document.getElementById('close-admin-modal');
        const logoutBtn = document.getElementById('admin-logout-btn');

        const paperForm = document.getElementById('add-paper-form');
        const ancForm = document.getElementById('add-anc-form');
        const staffForm = document.getElementById('add-staff-form');

        // Toggle / Login button click
        if (adminBtn) {
            adminBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!isStaffLoggedIn) {
                    if (loginModal) loginModal.classList.add('active');
                } else {
                    if (adminModal) adminModal.classList.add('active');
                }
            });
        }

        // Close Login Modal
        if (closeLoginBtn) {
            closeLoginBtn.addEventListener('click', () => {
                loginModal.classList.remove('active');
            });
        }

        // Handle Login Submission
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('login-username').value.trim();
                const password = document.getElementById('login-password').value.trim();

                if (username.length > 0 && (password === 'mtc2026' || password === 'admin123' || username === 'admin')) {
                    isStaffLoggedIn = true;
                    sessionUser = username === 'admin' ? 'Jerry (ICT Admin)' : username;

                    localStorage.setItem('mtc_staff_auth', 'true');
                    localStorage.setItem('mtc_staff_user', sessionUser);

                    if (loginError) loginError.style.display = 'none';
                    if (loginModal) loginModal.classList.remove('active');

                    updateSessionUI();
                    if (adminModal) adminModal.classList.add('active');
                } else {
                    if (loginError) loginError.style.display = 'block';
                }
            });
        }

        // Logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                isStaffLoggedIn = false;
                localStorage.removeItem('mtc_staff_auth');
                localStorage.removeItem('mtc_staff_user');

                updateSessionUI();
                if (adminModal) adminModal.classList.remove('active');
                showToast('Staff session logged out safely.', 'info-circle');
            });
        }

        if (closeAdminBtn) {
            closeAdminBtn.addEventListener('click', () => {
                adminModal.classList.remove('active');
            });
        }

        // Section 1: Publish Past Examination Paper
        if (paperForm) {
            paperForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const code = document.getElementById('admin-paper-code').value.toUpperCase();
                const title = document.getElementById('admin-paper-title').value;
                const dept = document.getElementById('admin-paper-dept').value;
                const year = document.getElementById('admin-paper-year').value;
                const examiner = document.getElementById('admin-paper-examiner').value;
                const question1 = document.getElementById('admin-paper-q1').value;

                const newPaper = {
                    id: `pp-${Date.now()}`,
                    code: code,
                    title: title,
                    departmentId: dept,
                    year: year,
                    semester: "Semester 1",
                    duration: "3 Hours",
                    examiner: examiner,
                    fileSize: "1.2 MB",
                    downloads: 0,
                    image: uploadedPaperImg,
                    isCustom: true,
                    questionsPreview: [
                        `1. ${question1}`,
                        "2. Discuss key pedagogical techniques and curriculum implementation strategies. [20 marks]"
                    ]
                };

                customPapers.unshift(newPaper);
                localStorage.setItem('mtc_custom_papers', JSON.stringify(customPapers));

                MTC_DATA.pastPapers.unshift(newPaper);
                activePapers = [...MTC_DATA.pastPapers];

                renderStats();
                renderPastPapers(activePapers, newPaper.id);

                paperForm.reset();
                uploadedPaperImg = null;
                const preview = document.getElementById('paper-img-preview');
                if (preview) preview.style.display = 'none';

                if (adminModal) adminModal.classList.remove('active');
                switchTab('resources');
                showToast(`Backend: Past Paper (${code}) published!`);
            });
        }

        // Section 2: Post Urgent Notice / Announcement
        if (ancForm) {
            ancForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('admin-anc-title').value;
                const category = document.getElementById('admin-anc-cat').value;
                const content = document.getElementById('admin-anc-content').value;

                const newAnc = {
                    id: `anc-${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    title: title,
                    category: category,
                    author: sessionUser,
                    urgent: true,
                    content: content,
                    image: uploadedAncImg,
                    isCustom: true
                };

                customAnnouncements.unshift(newAnc);
                localStorage.setItem('mtc_custom_anc', JSON.stringify(customAnnouncements));

                MTC_DATA.announcements.unshift(newAnc);
                activeAnnouncements = [...MTC_DATA.announcements];

                renderAnnouncements(activeAnnouncements, newAnc.id);

                ancForm.reset();
                uploadedAncImg = null;
                const preview = document.getElementById('anc-img-preview');
                if (preview) preview.style.display = 'none';

                if (adminModal) adminModal.classList.remove('active');
                switchTab('announcements');
                showToast(`Backend: Announcement ("${title}") published!`);
            });
        }

        // Section 3: Add Staff Profile with Photo Upload
        if (staffForm) {
            staffForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('admin-staff-name').value;
                const title = document.getElementById('admin-staff-title').value;
                const dept = document.getElementById('admin-staff-dept').value;
                const email = document.getElementById('admin-staff-email').value;
                const office = document.getElementById('admin-staff-office').value;

                const newStaff = {
                    id: `stf-${Date.now()}`,
                    name: name,
                    title: title,
                    departmentId: dept,
                    email: email,
                    phone: "+263 39 2262411",
                    office: office,
                    officeHours: "Mon - Fri: 09:00 - 15:30",
                    specialization: "Lecturer & Academic Supervisor",
                    photo: uploadedStaffPhoto,
                    classroomLink: "https://classroom.google.com/c/mtc-staff",
                    isCustom: true
                };

                customStaff.unshift(newStaff);
                localStorage.setItem('mtc_custom_staff', JSON.stringify(customStaff));

                MTC_DATA.staffDirectory.unshift(newStaff);
                renderStats();
                renderStaffDirectory(newStaff.id);

                staffForm.reset();
                uploadedStaffPhoto = null;
                const preview = document.getElementById('staff-photo-preview');
                if (preview) preview.style.display = 'none';

                if (adminModal) adminModal.classList.remove('active');
                switchTab('staff');
                showToast(`Backend: Staff profile for ${name} created!`);
            });
        }
    }
});

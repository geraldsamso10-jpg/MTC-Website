# Masvingo Teachers' College - Academic Website Portal

**Department of Information & Communication Technology**  
*Project Proposal & Implementation by Jerry (Industrial Attachee, BSc Honours Computer Science, NUST)*

---

## 🌟 Overview
An academic web portal designed for **Masvingo Teachers' College** to complement the institution-wide Google Workspace and Google Classroom rollout. Provides a centralized, searchable platform for course outlines, digitized past examination papers (2020–2026), academic notices, calendars, and lecturer directories.

---

## 🚀 Key Features

- **Google Workspace & Classroom Integration**: Direct course deep-links and lecturer profile classroom badges.
- **Digitized Past Examination Papers Repository**: Searchable database with multi-field filtering (by year, department, course code), question preview modal, and dynamic PDF download simulation.
- **Academic Notices & Calendar**: Institutional calendar and news feed.
- **Staff Directory**: Lecturer contact cards with email, phone extension, office location, consultation hours, and profile photos.
- **Backend Admin Portal**: Django-inspired backend admin dashboard for authorized developers and staff (`admin` / `mtc2026`) supporting full CRUD (Create/Upload, Read, Edit/Update with picture replacements, and Delete).

---

## 📁 Repository File Structure

- [`index.html`](file:///C:/Users/Jedza/.gemini/antigravity/scratch/masvingo_academic_website/index.html) — Main portal HTML interface.
- [`styles.css`](file:///C:/Users/Jedza/.gemini/antigravity/scratch/masvingo_academic_website/styles.css) — Design system (academic emerald & gold theme, glassmorphism, responsive grid, dark mode).
- [`app.js`](file:///C:/Users/Jedza/.gemini/antigravity/scratch/masvingo_academic_website/app.js) — Core application logic, local storage persistence, filtering, dynamic text file generation, and backend CRUD.
- [`data.js`](file:///C:/Users/Jedza/.gemini/antigravity/scratch/masvingo_academic_website/data.js) — Datasets for departments, courses, past papers, notices, and staff directory.
- [`college_logo.jpg`](file:///C:/Users/Jedza/.gemini/antigravity/scratch/masvingo_academic_website/college_logo.jpg) — Official Masvingo Teachers' College emblem logo.

---

## 🛠️ How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/geraldsamso10-jpg/MTC-Website.git
   cd MTC-Website
   ```
   ```bash
   python -m http.server 8080
   ```
2. Open `http://localhost:8080/index.html` in your browser.

---

## 🔑 Backend Admin Credentials (Demo)
- **Username**: `admin`
- **Password**: `mtc2026`

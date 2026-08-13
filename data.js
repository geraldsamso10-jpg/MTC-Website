/**
 * Masvingo Teachers' College - Academic Website Data
 * Prepared by ICT Department Industrial Attachee (Jerry)
 */

const MTC_DATA = {
    collegeInfo: {
        name: "Masvingo Teachers' College",
        tagline: "Excellence in Teacher Education, Innovation & Digital Mastery",
        established: "1981",
        location: "Masvingo, Zimbabwe",
        parentDepartment: "Department of Information & Communication Technology",
        attachee: "Jerry (NUST BSc Honours Computer Science)",
        supervisor: "ICT Department / Attachment Supervisor",
        vision: "To be a world-class center of teacher education, research, and technological innovation.",
        mission: "To train highly qualified, responsive, and technologically skilled educators capable of driving national transformation through quality teaching and academic research.",
        motto: "Knowledge, Professionalism, and Technological Growth",
        stats: {
            students: "2,450+",
            lecturers: "120+",
            departments: "6",
            pastPapers: "380+",
            passRate: "96.4%"
        }
    },

    departments: [
        {
            id: "ict",
            name: "Information & Communication Technology",
            code: "ICT",
            icon: "laptop-code",
            head: "Mr. T. Mutero",
            email: "ict.dept@masvingotc.ac.zw",
            description: "Leading digital transformation, educational technology integration, computer science instruction, and e-learning platforms."
        },
        {
            id: "ped",
            name: "Primary Education & Professional Studies",
            code: "PED",
            icon: "chalkboard-teacher",
            head: "Dr. C. Zvobgo",
            email: "ped.dept@masvingotc.ac.zw",
            description: "Pedagogical foundation, curriculum design, classroom management, and child development frameworks."
        },
        {
            id: "ecd",
            name: "Early Childhood Development",
            code: "ECD",
            icon: "child",
            head: "Mrs. M. Chikore",
            email: "ecd.dept@masvingotc.ac.zw",
            description: "Specialized early childhood training, play-based learning methodologies, and early literacy developmental strategies."
        },
        {
            id: "stm",
            name: "Science, Mathematics & Technology",
            code: "STM",
            icon: "atom",
            head: "Mr. R. Mapfumo",
            email: "stm.dept@masvingotc.ac.zw",
            description: "STEM teaching methods, physics, chemistry, biology, environmental science, and practical mathematical applications."
        },
        {
            id: "hum",
            name: "Humanities & Social Sciences",
            code: "HUM",
            icon: "book-open",
            head: "Mr. S. Gumbo",
            email: "hum.dept@masvingotc.ac.zw",
            description: "Language arts, Shona, Ndebele, English Literature, History, Religious and Moral Education, and Heritage Studies."
        },
        {
            id: "tech",
            name: "Technical & Vocational Education",
            code: "TVE",
            icon: "tools",
            head: "Eng. P. Moyo",
            email: "tve.dept@masvingotc.ac.zw",
            description: "Practical vocational skills, agriculture, home economics, music, art and design, and physical education."
        }
    ],

    programmes: [
        {
            id: "dip-ed-primary",
            title: "Diploma in Education (Primary)",
            departmentId: "ped",
            duration: "3 Years (General & Specialization)",
            entryRequirements: "5 'O' Levels including English Language, Mathematics, and Science with Grade C or better.",
            classroomCode: "MTC-PED-2026",
            googleClassroomLink: "https://classroom.google.com/c/mtc-ped-primary",
            description: "Comprehensive 3-year teacher preparation programme covering primary school curriculum subjects, educational psychology, micro-teaching, and 1-year Teaching Practice (TP).",
            courses: [
                { code: "PED101", title: "Theory of Education & Child Development", units: 3 },
                { code: "PED102", title: "Curriculum Studies & Classroom Pedagogy", units: 4 },
                { code: "ICT101", title: "ICT Integration in Primary Classrooms", units: 3 },
                { code: "PED201", title: "Teaching Practice Orientation & Portfolio Design", units: 6 },
                { code: "PED301", title: "Educational Research Project", units: 4 }
            ]
        },
        {
            id: "dip-ed-ict",
            title: "Diploma in Education (ICT & Computer Science)",
            departmentId: "ict",
            duration: "3 Years",
            entryRequirements: "5 'O' Levels including Mathematics, English, plus background interest in Computers/Science.",
            classroomCode: "MTC-ICT-2026",
            googleClassroomLink: "https://classroom.google.com/c/mtc-ict-dept",
            description: "Prepares ICT specialist teachers for secondary and primary schools, covering software, computer hardware, web technologies, instructional design, and e-learning.",
            courses: [
                { code: "ICT101", title: "Introduction to Computer Systems & Office Automation", units: 3 },
                { code: "ICT102", title: "Programming Logic & Web Development Basics", units: 4 },
                { code: "ICT201", title: "Educational Technology & E-Learning Platforms", units: 3 },
                { code: "ICT202", title: "Database Systems & School Record Management", units: 4 },
                { code: "ICT301", title: "Advanced ICT Pedagogy & Attachment Project", units: 6 }
            ]
        },
        {
            id: "dip-ed-ecd",
            title: "Diploma in Education (Early Childhood Development)",
            departmentId: "ecd",
            duration: "3 Years",
            entryRequirements: "5 'O' Levels including English Language and Mathematics.",
            classroomCode: "MTC-ECD-2026",
            googleClassroomLink: "https://classroom.google.com/c/mtc-ecd-dept",
            description: "Specialist programme focusing on infant education (ages 3–8), child psychopathology, toy creation, and play-based learning environments.",
            courses: [
                { code: "ECD101", title: "Foundations of Early Childhood Education", units: 3 },
                { code: "ECD102", title: "Health, Safety & Nutrition for Early Learners", units: 3 },
                { code: "ECD201", title: "Play & Learning Materials Construction", units: 4 },
                { code: "ECD301", title: "Infant Class Supervision & Teaching Practice", units: 6 }
            ]
        },
        {
            id: "dip-ed-stem",
            title: "Diploma in Science & Mathematics Education",
            departmentId: "stm",
            duration: "3 Years",
            entryRequirements: "5 'O' Levels including Mathematics, Science, and English.",
            classroomCode: "MTC-STM-2026",
            googleClassroomLink: "https://classroom.google.com/c/mtc-stm-dept",
            description: "Specialized STEM stream equipping student teachers with practical lab skills, mathematical reasoning, and modern science pedagogy.",
            courses: [
                { code: "STM101", title: "Integrated Physical & Biological Sciences", units: 4 },
                { code: "STM102", title: "Primary & Junior Secondary Mathematics", units: 4 },
                { code: "STM201", title: "Science Laboratory Management & Safety", units: 3 },
                { code: "STM301", title: "Applied STEM Project & Experimental Methods", units: 5 }
            ]
        }
    ],

    pastPapers: [
        {
            id: "pp-2026-ict101",
            code: "ICT101",
            title: "ICT Integration in Primary Classrooms",
            departmentId: "ict",
            year: "2026",
            semester: "Semester 1",
            duration: "3 Hours",
            examiner: "Mr. T. Mutero",
            fileSize: "1.4 MB",
            downloads: 412,
            image: "ict_workshop.jpg",
            questionsPreview: [
                "1. (a) Explain four key benefits of integrating Google Classroom into rural primary school instruction. [8 marks]",
                "1. (b) Discuss challenges related to internet connectivity and propose sustainable mitigation strategies. [12 marks]",
                "2. Design a 45-minute lesson plan incorporating interactive multimedia for Grade 6 Mathematics. [20 marks]"
            ]
        },
        {
            id: "pp-2025-ict102",
            code: "ICT102",
            title: "Programming Logic & Web Development Basics",
            departmentId: "ict",
            year: "2025",
            semester: "Semester 2",
            duration: "3 Hours",
            examiner: "Jerry (Attachee / NUST)",
            fileSize: "1.8 MB",
            downloads: 589,
            questionsPreview: [
                "1. Differentiate between client-side scripting and server-side processing in educational portals. [10 marks]",
                "2. Write HTML and CSS snippets to render a responsive timetable for school staff. [15 marks]",
                "3. Explain the architecture of Django web applications and ORM database management. [15 marks]"
            ]
        },
        {
            id: "pp-2025-ped101",
            code: "PED101",
            title: "Theory of Education & Child Development",
            departmentId: "ped",
            year: "2025",
            semester: "Semester 1",
            duration: "3 Hours",
            examiner: "Dr. C. Zvobgo",
            fileSize: "1.1 MB",
            downloads: 820,
            questionsPreview: [
                "1. Critically analyze Jean Piaget’s stages of cognitive development in relation to primary school teaching in Zimbabwe. [25 marks]",
                "2. Compare and contrast Behaviorist and Constructivist learning theories with practical classroom examples. [25 marks]"
            ]
        },
        {
            id: "pp-2024-stm101",
            code: "STM101",
            title: "Integrated Physical & Biological Sciences",
            departmentId: "stm",
            year: "2024",
            semester: "Semester 1",
            duration: "3 Hours",
            examiner: "Mr. R. Mapfumo",
            fileSize: "2.1 MB",
            downloads: 475,
            image: "science_diagram.jpg",
            questionsPreview: [
                "1. Describe an experiment suitable for Grade 7 pupils to demonstrate photosynthesis using locally available resources. [15 marks]",
                "2. Solve circuit problems involving series and parallel resistor networks as illustrated in Diagram 1. [15 marks]"
            ]
        },
        {
            id: "pp-2026-hum101",
            code: "HUM101",
            title: "Heritage Studies & Culture in Teacher Education",
            departmentId: "hum",
            year: "2026",
            semester: "Semester 1",
            duration: "3 Hours",
            examiner: "Mr. S. Gumbo",
            fileSize: "1.3 MB",
            downloads: 512,
            questionsPreview: [
                "1. Discuss the significance of the Great Zimbabwe national monument in teaching indigenous knowledge systems. [25 marks]",
                "2. How can drama and storytelling be utilized to preserve cultural heritage in primary schools? [25 marks]"
            ]
        }
    ],

    calendarEvents: [
        {
            id: "evt-1",
            date: "2026-08-10",
            title: "Term 3 Student Registration & Google Workspace Onboarding",
            category: "Registration",
            location: "Great Hall & ICT Lab 1",
            description: "Mandatory registration for Intake 24 and 25 students. ICT staff will assist with Google Classroom account activations."
        },
        {
            id: "evt-2",
            date: "2026-08-18",
            title: "Teaching Practice (TP) Final Portfolio Submissions",
            category: "Teaching Practice",
            location: "Departmental Offices",
            description: "All Intake 23 student teachers returning from 1-year school attachments must submit their TP portfolios and schemes of work."
        },
        {
            id: "evt-3",
            date: "2026-08-25",
            title: "ICT Department Workshop: AI Tools & E-Learning in Pedagogy",
            category: "ICT Workshop",
            location: "ICT Lecture Theatre",
            description: "Facilitated by NUST Industrial Attachee Jerry & ICT Faculty for all academic staff and student representatives."
        },
        {
            id: "evt-4",
            date: "2026-09-07",
            title: "Mid-Term Examinations Begin",
            category: "Exams",
            location: "Main Exam Halls A & B",
            description: "All regular and block release students are advised to check their personalized timetables on this academic portal."
        }
    ],

    announcements: [
        {
            id: "anc-1",
            date: "2026-08-04",
            title: "Launch of New Academic Web Portal & Past Papers Repository",
            category: "ICT & Academic",
            author: "ICT Department / Jerry (Attachee)",
            urgent: true,
            image: "ict_workshop.jpg",
            content: "We are pleased to introduce the official Academic Portal for Masvingo Teachers' College! Students can now access past examination papers, course outlines, picture attachments, and academic announcements in one organized platform. The portal complements our ongoing Google Workspace rollout."
        },
        {
            id: "anc-2",
            date: "2026-08-02",
            title: "Google Classroom Joining Codes for Term 3 (2026 Academic Session)",
            category: "E-Learning",
            author: "ICT Coordinator - Mr. T. Mutero",
            urgent: false,
            content: "All students are requested to update their Google Classroom enrollments using the updated course codes listed under the Courses section of this website. Ensure your official college email (@masvingotc.ac.zw) is active."
        },
        {
            id: "anc-3",
            date: "2026-07-28",
            title: "Important Notice: Teaching Practice Supervision Schedule",
            category: "Teaching Practice",
            author: "Director of Teaching Practice - Dr. C. Zvobgo",
            urgent: false,
            image: "campus_hero.jpg",
            content: "Supervisors will be visiting primary schools in Masvingo, Gutu, Bikita, and Zaka districts starting next Monday. All student teachers must ensure their lesson plans, schemes of work, and teaching aids are up to date."
        }
    ],

    staffDirectory: [
        {
            id: "stf-1",
            name: "Mr. T. Mutero",
            title: "Head of Department - ICT",
            departmentId: "ict",
            email: "t.mutero@masvingotc.ac.zw",
            phone: "+263 39 2262411 ext 104",
            office: "ICT Block, Office 04",
            officeHours: "Mon & Wed: 10:00 - 12:00, Thu: 14:00 - 16:00",
            specialization: "Educational Technology, Networking & Systems Admin",
            photo: "mutero_photo.jpg",
            classroomLink: "https://classroom.google.com/c/mtc-ict-mutero",
            badge: "HOD"
        },
        {
            id: "stf-2",
            name: "Jerry [Surname]",
            title: "Industrial Attachee (Computer Science, NUST)",
            departmentId: "ict",
            email: "jerry.attachee@masvingotc.ac.zw",
            phone: "+263 77 123 4567",
            office: "ICT Innovation & Support Hub",
            officeHours: "Mon - Fri: 08:00 - 16:30",
            specialization: "Full-Stack Web Development, Django, E-Learning Portals",
            photo: "college_logo.jpg",
            classroomLink: "https://classroom.google.com/c/mtc-ict-jerry",
            badge: "Developer / Attachee"
        },
        {
            id: "stf-3",
            name: "Dr. C. Zvobgo",
            title: "Senior Lecturer & HOD Primary Education",
            departmentId: "ped",
            email: "c.zvobgo@masvingotc.ac.zw",
            phone: "+263 39 2262411 ext 112",
            office: "PED Administration Wing, Room 01",
            officeHours: "Tue & Thu: 09:00 - 11:30",
            specialization: "Educational Psychology & Pedagogy Research",
            photo: null,
            classroomLink: "https://classroom.google.com/c/mtc-ped-zvobgo",
            badge: "Senior Lecturer"
        },
        {
            id: "stf-4",
            name: "Mrs. M. Chikore",
            title: "Head of Department - ECD",
            departmentId: "ecd",
            email: "m.chikore@masvingotc.ac.zw",
            phone: "+263 39 2262411 ext 120",
            office: "ECD Building, Block B",
            officeHours: "Mon & Fri: 11:00 - 13:00",
            specialization: "Infant Psychology & Play Methodology",
            photo: "chikore_photo.jpg",
            classroomLink: "https://classroom.google.com/c/mtc-ecd-chikore",
            badge: "HOD"
        }
    ]
};

/* dashboard.js - Professional Admin Portal Logic */

/**
 * Modal Management: Handles opening and closing of the student entry/edit modal.
 */
function openModal() {
    document.getElementById("studentModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("studentModal").style.display = "none";
    // Reset modal fields to default "Add Student" state
    document.getElementById("modalTitle").innerText = "Add New Student";
    document.getElementById("editStudentId").value = "";
    document.getElementById("stdName").value = "";
    document.getElementById("stdClass").value = "";
    document.getElementById("stdRoll").value = "";
    document.getElementById("saveBtn").innerText = "Save Student";
}

/**
 * Core Data Fetching: Retrieves student records and populates tables.
 */
async function fetchStudents() {
    try {
        const response = await fetch('/api/students/all');
        const data = await response.json();
        
        let students = Array.isArray(data) ? data : []; 

        // Apply Alphabetical Sorting (A-Z) by Name
        students.sort((a, b) => a.name.localeCompare(b.name));

        const studentData = document.getElementById('studentData');
        const attendanceData = document.getElementById('attendanceData');
        
        // Clear existing table content before re-rendering
        studentData.innerHTML = ""; 
        if (attendanceData) attendanceData.innerHTML = ""; 

        students.forEach(std => {
            // Render: Students Overview Table
            const studentRow = `
                <tr>
                    <td>${std.name}</td>
                    <td>${std.sClass}</td>
                    <td>${std.roll}</td>
                    <td style="color: #10b981; font-weight: 600;">Active</td>
                    <td>
                        <button onclick="openEditModal('${std._id}', '${std.name}', '${std.sClass}', '${std.roll}')" style="background:none; border:none; color:#3b82f6; cursor:pointer; font-weight:600; margin-right:10px;">Edit</button>
                        <button onclick="deleteStudent(this, '${std._id}')" style="background:none; border:none; color:#ef4444; cursor:pointer; font-weight:600;">Delete</button>
                    </td>
                </tr>
            `;
            studentData.innerHTML += studentRow;

            // Render: Attendance Selection Table
            if (attendanceData) {
                const attendanceRow = `
                    <tr>
                        <td>${std.name}</td>
                        <td>${std.roll}</td>
                        <td>
                            <input type="checkbox" class="att-check" style="width:18px; height:18px; cursor:pointer;">
                        </td>
                    </tr>
                `;
                attendanceData.innerHTML += attendanceRow;
            }
        });

        updateCount();

    } catch (err) {
        console.error("Error fetching student data:", err);
    }
}

/**
 * Attendance Retrieval: Fetches saved attendance stats for the current day.
 */
async function fetchTodayAttendance() {
    try {
        const res = await fetch('/api/attendance/today');
        const data = await res.json();
        const presentDisplay = document.getElementById('presentCount');
        if (presentDisplay) {
            presentDisplay.innerText = data.presentCount || 0;
        }
    } catch (err) {
        console.error("Attendance retrieval error:", err);
    }
}

// Initial Data Load
window.onload = () => {
    fetchStudents();
    fetchTodayAttendance();
};

/**
 * Student Persistence: Handles both Creation and Updates (POST/PUT).
 */
async function saveStudent() {
    const id = document.getElementById('editStudentId').value; 
    const name = document.getElementById('stdName').value;
    const sClass = document.getElementById('stdClass').value;
    const roll = document.getElementById('stdRoll').value;

    if (name.trim() === "" || sClass.trim() === "" || roll.trim() === "") {
        alert("Please fill in all required fields.");
        return;
    }

    const studentData = { name, sClass, roll };

    try {
        let url = id ? `/api/students/update/${id}` : '/api/students/add';
        let method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });

        const result = await response.json();

        if (response.ok) {
            closeModal();
            fetchStudents();
            alert(id ? "Student details updated successfully!" : "Student added successfully!");
        } else {
            alert(result.message || "An error occurred while saving data.");
        }
    } catch (err) {
        console.error("Save Error:", err);
        alert("Critical Error: Unable to connect to the server.");
    }
}

/**
 * Search/Filter: Real-time filtering for Students Table.
 */
document.getElementById('searchInput').addEventListener('keyup', function() {
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll("#studentData tr");

    rows.forEach(row => {
        let name = row.cells[0].textContent.toLowerCase();
        row.style.display = name.includes(filter) ? "" : "none";
    });
});

/**
 * Data Deletion: Removes student records from Database and UI.
 */
async function deleteStudent(btn, id) {
    if (confirm("Are you sure you want to delete this student?")) {
        try {
            const response = await fetch(`/api/students/delete/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                let row = btn.parentNode.parentNode;
                row.parentNode.removeChild(row);
                updateCount();
                alert("Student deleted successfully.");
            } else {
                alert("Failed to delete record from the database.");
            }
        } catch (err) {
            console.error("Delete Error:", err);
            alert("An error occurred while deleting.");
        }
    }
}

/**
 * Dashboard Statistics: Updates the 'Total Students' counter.
 */
function updateCount() {
    const totalRows = document.querySelectorAll("#studentData tr").length;
    const countElement = document.getElementById("totalCount");
    if(countElement) countElement.innerText = totalRows;
}

/**
 * Navigation: Handles UI switching between Overview and Attendance sections.
 */
function showSection(sectionName) {
    const studentsSec = document.getElementById('students-section');
    const attendanceSec = document.getElementById('attendance-section');
    const title = document.getElementById('section-title');
    const desc = document.getElementById('section-desc');
    const addBtn = document.getElementById('add-btn-main');

    if (sectionName === 'students') {
        studentsSec.style.display = 'block';
        attendanceSec.style.display = 'none';
        title.innerText = "Students Overview";
        desc.innerText = "Manage your student records efficiently";
        addBtn.style.display = "block";
        document.getElementById('link-students').classList.add('active');
        document.getElementById('link-attendance').classList.remove('active');
    } else {
        studentsSec.style.display = 'none';
        attendanceSec.style.display = 'block';
        title.innerText = "Daily Attendance";
        desc.innerText = "Mark presence for the current session";
        addBtn.style.display = "none";
        document.getElementById('link-attendance').classList.add('active');
        document.getElementById('link-students').classList.remove('active');
        document.getElementById('displayDate').innerText = new Date().toLocaleDateString();
    }
}

/**
 * Attendance Submission: Saves total daily count to the database.
 */
async function submitAttendance() {
    const checkboxes = document.querySelectorAll('.att-check');
    let presentCount = 0;

    checkboxes.forEach(cb => {
        if (cb.checked) presentCount++;
    });

    try {
        await fetch('/api/attendance/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ count: presentCount })
        });

        const presentDisplay = document.getElementById('presentCount');
        if (presentDisplay) {
            presentDisplay.innerText = presentCount;
            alert(`Attendance Saved! Total Present: ${presentCount}`);
            showSection('students');
        }
    } catch (err) {
        console.error("Attendance save error:", err);
        alert("Error: Attendance could not be synchronized with the database.");
    }
}

/**
 * Attendance Filter: Search function for the attendance mark list.
 */
function searchAttendance() {
    let filter = document.getElementById('attendanceSearch').value.toLowerCase();
    let rows = document.querySelectorAll("#attendanceData tr");

    rows.forEach(row => {
        let nameCell = row.getElementsByTagName("td")[0];
        if (nameCell) {
            let nameText = nameCell.textContent || nameCell.innerText;
            row.style.display = nameText.toLowerCase().indexOf(filter) > -1 ? "" : "none";
        }
    });
}

/**
 * Edit Mode: Populates the modal with existing student data for modification.
 */
function openEditModal(id, name, sClass, roll) {
    document.getElementById("modalTitle").innerText = "Edit Student Details";
    document.getElementById("editStudentId").value = id;
    document.getElementById("stdName").value = name;
    document.getElementById("stdClass").value = sClass;
    document.getElementById("stdRoll").value = roll;
    document.getElementById("saveBtn").innerText = "Update Changes";
    document.getElementById("studentModal").style.display = "flex";
}

/**
 * Authentication: Handles session termination and redirection.
 */
function handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('isLoggedIn'); 
        window.location.href = "index.html"; 
    }
}

/**
 * Mobile Interface: Toggles responsive sidebar visibility.
 */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}
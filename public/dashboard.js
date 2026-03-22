function openModal() {
    document.getElementById("studentModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("studentModal").style.display = "none";
    document.getElementById("modalTitle").innerText = "Add New Student";
    document.getElementById("entry-id-field").value = "";
    document.getElementById("input-std").value = "";
    document.getElementById("input-std-class").value = "";
    document.getElementById("input-std-roll").value = "";
    document.getElementById("finalSaveBtn").innerText = "Save Student";
}



async function fetchStudents() {
    console.log("students list is refreshing");
    try {
        const response = await fetch('/api/students/all');
        const data = await response.json();
        
        let students = Array.isArray(data) ? data : []; 

        students.sort((a, b) => a.name.localeCompare(b.name));

        const studentData = document.getElementById('studentData');
        const attTable = document.getElementById('attendanceData');
        
      
        studentData.innerHTML = ""; 
        if (attTable) attTable.innerHTML = ""; 

        students.forEach(std => {
           
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
            if (attTable) {
                const attendanceRow = `
                    <tr>
                        <td>${std.name}</td>
                        <td>${std.roll}</td>
                        <td>
                            <input type="checkbox" class="att-check" style="width:18px; height:18px; cursor:pointer;">
                        </td>
                    </tr>
                `;
                attTable.innerHTML += attendanceRow;
            }
        });

        updateCount();

    } catch (err) {
        console.error("data not found i think server is down:", err);
    }
}




async function fetchTodayAttendance() {
    try {
        const res = await fetch('/api/attendance/today');
        const data = await res.json();
        const presentDisplay = document.getElementById('presentCount');
        if (presentDisplay) {
            presentDisplay.innerText = data.presentCount || 0;
        }
    } catch (err) {
        console.error("error found in fetching today's attendance:", err);
    }
}


window.onload = () => {
    fetchStudents();
    fetchTodayAttendance();
};



async function saveStudent() {
    const id = document.getElementById('entry-id-field').value; 
    const name = document.getElementById('input-std').value;
    const sClass = document.getElementById('input-std-class').value;
    const roll = document.getElementById('input-std-roll').value;

    // validation: Kahin khali toh nahi choda
    if (name.trim() === "" || sClass.trim() === "" || roll.trim() === "") {
        alert("Please fill in all required fields.");
        return;
    }

    const studentData = { name, sClass, roll };

    try {
        // Agar ID hai toh update, warna naya add
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
            fetchStudents(); // Table refresh karo
            alert(id ? "Student details updated successfully!" : "Student added successfully!");
            console.log("data saved!");
        } else {
            alert(result.message || "something went wrong during saving data.");
        }
    } catch (err) {
        console.error("save error:", err);
        alert("critical error: unable to connect to the server.");
    }
}




document.getElementById('searchInput').addEventListener('keyup', function() {
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll("#studentData tr");

    rows.forEach(row => {
        let name = row.cells[0].textContent.toLowerCase();
        row.style.display = name.includes(filter) ? "" : "none";
    });
});




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
                alert("student deleted successfully.");
            } else {
                alert("failed to delete record from the database.");
            }
        } catch (err) {
            console.error("delete error:", err);
            alert("an error occurred while deleting.");
        }
    }
}




function updateCount() {
    const totalRows = document.querySelectorAll("#studentData tr").length;
    const countElement = document.getElementById("totalCount");
    if(countElement) countElement.innerText = totalRows;
}




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




function openEditModal(id, name, sClass, roll) {
    document.getElementById("modalTitle").innerText = "Edit Student Details";
    document.getElementById("entry-id-field").value = id;
    document.getElementById("input-std").value = name;
    document.getElementById("input-std-class").value = sClass;
    document.getElementById("input-std-roll").value = roll;
    document.getElementById("finalSaveBtn").innerText = "Update Changes";
    document.getElementById("studentModal").style.display = "flex";
}


function handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('isLoggedIn'); 
        window.location.href = "index.html"; 
    }
}




function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}
























































// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Initialize admin functionality
    initializeAdmin();
});

// Authentication check
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        showLoginModal();
    } else {
        // Verify token with server
        verifyToken(token);
    }
}

// Show login modal
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}

// Verify token with server
async function verifyToken(token) {
    try {
        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Invalid token');
        }
        
        const adminData = await response.json();
        updateAdminInfo(adminData);
        loadDashboardData();
    } catch (error) {
        console.error('Token verification failed:', error);
        showLoginModal();
    }
}

// Update admin information
function updateAdminInfo(adminData) {
    const adminUsername = document.getElementById('adminUsername');
    if (adminUsername) {
        adminUsername.textContent = adminData.username;
    }
}

// Initialize admin functionality
function initializeAdmin() {
    // Tab navigation
    initializeTabs();
    
    // Login form
    initializeLoginForm();
    
    // Logout functionality
    initializeLogout();
    
    // Activity tabs
    initializeActivityTabs();
    
    // Applications tabs
    initializeApplicationTabs();
    
    // Contact filters
    initializeContactFilters();
    
    // Settings form
    initializeSettingsForm();
    
    // Export functionality
    initializeExportFunctionality();
}

// Initialize tab navigation
function initializeTabs() {
    const tabLinks = document.querySelectorAll('.admin-menu a[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Load data for the selected tab
            loadTabData(targetTab);
        });
    });
}

// Load data for specific tab
function loadTabData(tabName) {
    switch(tabName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'applications':
            loadApplicationsData();
            break;
        case 'contacts':
            loadContactsData();
            break;
        case 'reports':
            loadReportsData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

// Initialize login form
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('adminToken', data.token);
                    document.getElementById('loginModal').style.display = 'none';
                    updateAdminInfo(data.admin);
                    loadDashboardData();
                    showMessage('success', 'Login successful!');
                } else {
                    showMessage('error', data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage('error', 'Network error. Please try again.');
            }
        });
    }
}

// Initialize logout
function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('adminToken');
            window.location.reload();
        });
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/admin/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            updateDashboardStats(data.statistics);
            updateRecentActivity(data.recent);
            initializeCharts();
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showMessage('error', 'Error loading dashboard data');
    }
}

// Update dashboard statistics
function updateDashboardStats(stats) {
    document.getElementById('totalPensionApps').textContent = stats.pension.total;
    document.getElementById('totalFamilyPensionApps').textContent = stats.familyPension.total;
    document.getElementById('totalContacts').textContent = stats.contact.total;
    document.getElementById('pendingApps').textContent = 
        stats.pension.pending + stats.familyPension.pending;
}

// Update recent activity
function updateRecentActivity(recent) {
    updateRecentPensionApps(recent.pensionApplications);
    updateRecentFamilyPensionApps(recent.familyPensionApplications);
    updateRecentContacts(recent.contactMessages);
}

// Update recent pension applications
function updateRecentPensionApps(apps) {
    const container = document.getElementById('recentPensionApps');
    if (!container) return;
    
    if (apps.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No recent applications</p></div>';
        return;
    }
    
    container.innerHTML = apps.map(app => `
        <div class="activity-item">
            <div class="activity-info">
                <h4>${app.applicantName}</h4>
                <p>Employee ID: ${app.employeeId} | Submitted: ${new Date(app.submittedAt).toLocaleDateString()}</p>
            </div>
            <span class="activity-status status-${app.status}">${app.status}</span>
        </div>
    `).join('');
}

// Update recent family pension applications
function updateRecentFamilyPensionApps(apps) {
    const container = document.getElementById('recentFamilyPensionApps');
    if (!container) return;
    
    if (apps.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No recent applications</p></div>';
        return;
    }
    
    container.innerHTML = apps.map(app => `
        <div class="activity-item">
            <div class="activity-info">
                <h4>${app.applicantName}</h4>
                <p>Deceased: ${app.deceasedEmployeeName} | Submitted: ${new Date(app.submittedAt).toLocaleDateString()}</p>
            </div>
            <span class="activity-status status-${app.status}">${app.status}</span>
        </div>
    `).join('');
}

// Update recent contacts
function updateRecentContacts(contacts) {
    const container = document.getElementById('recentContacts');
    if (!container) return;
    
    if (contacts.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No recent messages</p></div>';
        return;
    }
    
    container.innerHTML = contacts.map(contact => `
        <div class="activity-item">
            <div class="activity-info">
                <h4>${contact.name}</h4>
                <p>${contact.subject} | ${new Date(contact.submittedAt).toLocaleDateString()}</p>
            </div>
            <span class="activity-status status-${contact.status}">${contact.status}</span>
        </div>
    `).join('');
}

// Initialize charts
async function initializeCharts() {
    try {
        const token = localStorage.getItem('adminToken');
        
        // Load chart data
        const [statusData, timeData] = await Promise.all([
            fetch('/api/admin/charts/status-distribution', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json()),
            fetch('/api/admin/charts/applications-over-time', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json())
        ]);
        
        // Create status distribution chart
        createStatusChart(statusData);
        
        // Create time series chart
        createTimeChart(timeData);
        
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

// Create status distribution chart
function createStatusChart(data) {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (window.statusChart) {
        window.statusChart.destroy();
    }
    
    const chartData = {
        labels: ['Pending', 'Approved', 'Rejected'],
        datasets: [{
            label: 'Pension Applications',
            data: [
                data.pension.find(d => d._id === 'pending')?.count || 0,
                data.pension.find(d => d._id === 'approved')?.count || 0,
                data.pension.find(d => d._id === 'rejected')?.count || 0
            ],
            backgroundColor: ['#ffc107', '#28a745', '#dc3545'],
            borderWidth: 0
        }, {
            label: 'Family Pension Applications',
            data: [
                data.familyPension.find(d => d._id === 'pending')?.count || 0,
                data.familyPension.find(d => d._id === 'approved')?.count || 0,
                data.familyPension.find(d => d._id === 'rejected')?.count || 0
            ],
            backgroundColor: ['#17a2b8', '#20c997', '#fd7e14'],
            borderWidth: 0
        }]
    };
    
    window.statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Create time series chart
function createTimeChart(data) {
    const ctx = document.getElementById('timeChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (window.timeChart) {
        window.timeChart.destroy();
    }
    
    // Process time data
    const months = [];
    const pensionData = [];
    const familyPensionData = [];
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        months.push(monthYear);
        
        const monthData = data.pensionApplications.find(d => 
            d._id.month === date.getMonth() + 1 && d._id.year === date.getFullYear()
        );
        pensionData.push(monthData?.count || 0);
        
        const familyMonthData = data.familyPensionApplications.find(d => 
            d._id.month === date.getMonth() + 1 && d._id.year === date.getFullYear()
        );
        familyPensionData.push(familyMonthData?.count || 0);
    }
    
    const chartData = {
        labels: months,
        datasets: [{
            label: 'Pension Applications',
            data: pensionData,
            borderColor: '#1e3c72',
            backgroundColor: 'rgba(30, 60, 114, 0.1)',
            tension: 0.4
        }, {
            label: 'Family Pension Applications',
            data: familyPensionData,
            borderColor: '#2a5298',
            backgroundColor: 'rgba(42, 82, 152, 0.1)',
            tension: 0.4
        }]
    };
    
    window.timeChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Initialize activity tabs
function initializeActivityTabs() {
    const activityTabs = document.querySelectorAll('.activity-tab');
    const activityLists = document.querySelectorAll('.activity-list');
    
    activityTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // Remove active class from all tabs and lists
            activityTabs.forEach(t => t.classList.remove('active'));
            activityLists.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding list
            this.classList.add('active');
            document.getElementById(`recent${type.charAt(0).toUpperCase() + type.slice(1)}`).classList.add('active');
        });
    });
}

// Initialize application tabs
function initializeApplicationTabs() {
    const appTabs = document.querySelectorAll('.app-tab');
    const appLists = document.querySelectorAll('.app-list');
    
    appTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const type = this.getAttribute('data-app-type');
            
            // Remove active class from all tabs and lists
            appTabs.forEach(t => t.classList.remove('active'));
            appLists.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding list
            this.classList.add('active');
            document.getElementById(`${type}Applications`).classList.add('active');
            
            // Load data for the selected application type
            loadApplicationsData(type);
        });
    });
}

// Load applications data
async function loadApplicationsData(type = 'pension') {
    try {
        const token = localStorage.getItem('adminToken');
        const endpoint = type === 'pension' ? '/api/admin/applications/pension' : '/api/admin/applications/family-pension';
        
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const applications = await response.json();
            displayApplicationsTable(applications, type);
        }
    } catch (error) {
        console.error('Error loading applications:', error);
        showMessage('error', 'Error loading applications');
    }
}

// Display applications table
function displayApplicationsTable(applications, type) {
    const container = document.getElementById(`${type}Applications`);
    if (!container) return;
    
    if (applications.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No applications found</p></div>';
        return;
    }
    
    const tableHeaders = type === 'pension' ? 
        ['Name', 'Employee ID', 'Designation', 'Department', 'Status', 'Submitted', 'Actions'] :
        ['Applicant', 'Deceased Employee', 'Relationship', 'Status', 'Submitted', 'Actions'];
    
    const table = `
        <table class="applications-table">
            <thead>
                <tr>
                    ${tableHeaders.map(header => `<th>${header}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${applications.map(app => `
                    <tr>
                        <td>${app.applicantName}</td>
                        <td>${type === 'pension' ? app.employeeId : app.deceasedEmployeeId}</td>
                        <td>${type === 'pension' ? app.designation : app.relationship}</td>
                        <td>${type === 'pension' ? app.department : ''}</td>
                        <td><span class="activity-status status-${app.status}">${app.status}</span></td>
                        <td>${new Date(app.submittedAt).toLocaleDateString()}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="viewApplication('${app._id}', '${type}')">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="btn btn-secondary btn-sm" onclick="updateStatus('${app._id}', '${type}')">
                                <i class="fas fa-edit"></i> Update
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = table;
}

// Initialize contact filters
function initializeContactFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchContacts');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', loadContactsData);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(loadContactsData, 300));
    }
}

// Load contacts data
async function loadContactsData() {
    try {
        const token = localStorage.getItem('adminToken');
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const searchQuery = document.getElementById('searchContacts')?.value || '';
        
        let url = '/api/admin/applications/contact';
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (searchQuery) params.append('search', searchQuery);
        if (params.toString()) url += '?' + params.toString();
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const contacts = await response.json();
            displayContactsList(contacts);
        }
    } catch (error) {
        console.error('Error loading contacts:', error);
        showMessage('error', 'Error loading contacts');
    }
}

// Display contacts list
function displayContactsList(contacts) {
    const container = document.getElementById('contactsList');
    if (!container) return;
    
    if (contacts.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No contact messages found</p></div>';
        return;
    }
    
    container.innerHTML = contacts.map(contact => `
        <div class="contact-item">
            <div class="contact-info">
                <h4>${contact.name}</h4>
                <p>${contact.subject}</p>
                <p>${contact.message.substring(0, 100)}${contact.message.length > 100 ? '...' : ''}</p>
                <div class="contact-meta">
                    <span><i class="fas fa-envelope"></i> ${contact.email}</span>
                    <span><i class="fas fa-phone"></i> ${contact.phone}</span>
                    <span><i class="fas fa-calendar"></i> ${new Date(contact.submittedAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="contact-actions">
                <button class="btn btn-primary btn-sm" onclick="viewContact('${contact._id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-secondary btn-sm" onclick="updateContactStatus('${contact._id}')">
                    <i class="fas fa-edit"></i> Update
                </button>
            </div>
        </div>
    `).join('');
}

// Initialize settings form
function initializeSettingsForm() {
    const settingsForm = document.getElementById('adminSettingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (newPassword !== confirmPassword) {
                showMessage('error', 'Passwords do not match');
                return;
            }
            
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch('/api/auth/update-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ newPassword })
                });
                
                if (response.ok) {
                    showMessage('success', 'Password updated successfully');
                    settingsForm.reset();
                } else {
                    const data = await response.json();
                    showMessage('error', data.message || 'Error updating password');
                }
            } catch (error) {
                console.error('Error updating password:', error);
                showMessage('error', 'Network error. Please try again.');
            }
        });
    }
}

// Initialize export functionality
function initializeExportFunctionality() {
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportData();
        });
    }
}

// Export data functionality
async function exportData() {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/admin/export', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pension-data-${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showMessage('success', 'Data exported successfully');
        }
    } catch (error) {
        console.error('Error exporting data:', error);
        showMessage('error', 'Error exporting data');
    }
}

// Load reports data
function loadReportsData() {
    // Implementation for reports tab
    console.log('Loading reports data');
}

// Load settings data
function loadSettingsData() {
    // Implementation for settings tab
    console.log('Loading settings data');
}

// Utility functions
function showMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Global functions for buttons
window.viewApplication = function(id, type) {
    showApplicationModal(id, type);
};

window.updateStatus = function(id, type) {
    showStatusUpdateModal(id, type);
};

window.viewContact = function(id) {
    showContactModal(id);
};

window.updateContactStatus = function(id) {
    showContactStatusModal(id);
};

// Show application modal
async function showApplicationModal(id, type) {
    try {
        const token = localStorage.getItem('adminToken');
        const endpoint = type === 'pension' ? '/api/pension/' : '/api/family-pension/';
        
        const response = await fetch(endpoint + id, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const application = await response.json();
            displayApplicationDetails(application, type);
        }
    } catch (error) {
        console.error('Error loading application details:', error);
        showMessage('error', 'Error loading application details');
    }
}

// Display application details
function displayApplicationDetails(application, type) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${type === 'pension' ? 'Pension' : 'Family Pension'} Application Details</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="application-details">
                    <h3>Personal Information</h3>
                    <p><strong>Name:</strong> ${application.applicantName}</p>
                    <p><strong>Employee ID:</strong> ${type === 'pension' ? application.employeeId : application.deceasedEmployeeId}</p>
                    <p><strong>Date of Birth:</strong> ${new Date(application.dateOfBirth).toLocaleDateString()}</p>
                    ${type === 'family-pension' ? `<p><strong>Relationship:</strong> ${application.relationship}</p>` : ''}
                    
                    <h3>Employment Information</h3>
                    ${type === 'pension' ? `
                        <p><strong>Designation:</strong> ${application.designation}</p>
                        <p><strong>Department:</strong> ${application.department}</p>
                        <p><strong>Date of Joining:</strong> ${new Date(application.dateOfJoining).toLocaleDateString()}</p>
                        <p><strong>Date of Retirement:</strong> ${new Date(application.dateOfRetirement).toLocaleDateString()}</p>
                        <p><strong>Basic Pay:</strong> ₹${application.basicPay}</p>
                    ` : `
                        <p><strong>Deceased Employee Name:</strong> ${application.deceasedEmployeeName}</p>
                        <p><strong>Date of Death:</strong> ${new Date(application.dateOfDeath).toLocaleDateString()}</p>
                    `}
                    
                    <h3>Contact Information</h3>
                    <p><strong>Email:</strong> ${application.email}</p>
                    <p><strong>Phone:</strong> ${application.contactNumber}</p>
                    <p><strong>Address:</strong> ${application.address.street}, ${application.address.city}, ${application.address.state} - ${application.address.pincode}</p>
                    
                    <h3>Bank Details</h3>
                    <p><strong>Bank Name:</strong> ${application.bankDetails.bankName}</p>
                    <p><strong>Account Number:</strong> ${application.bankDetails.accountNumber}</p>
                    <p><strong>IFSC Code:</strong> ${application.bankDetails.ifscCode}</p>
                    
                    <h3>Status</h3>
                    <p><strong>Current Status:</strong> <span class="status-${application.status}">${application.status}</span></p>
                    <p><strong>Submitted On:</strong> ${new Date(application.submittedAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        document.body.removeChild(modal);
    }
    
    window.onclick = function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    }
}

// Show status update modal
function showStatusUpdateModal(id, type) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Update Application Status</h2>
                <span class="close">&times;</span>
            </div>
            <form id="statusUpdateForm">
                <div class="form-group">
                    <label for="newStatus">New Status</label>
                    <select id="newStatus" class="form-control" required>
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="statusNotes">Notes (Optional)</label>
                    <textarea id="statusNotes" class="form-control" rows="3"></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Update Status</button>
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        document.body.removeChild(modal);
    }
    
    // Form submission
    const form = modal.querySelector('#statusUpdateForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const newStatus = document.getElementById('newStatus').value;
        const notes = document.getElementById('statusNotes').value;
        
        try {
            const token = localStorage.getItem('adminToken');
            const endpoint = type === 'pension' ? '/api/pension/' : '/api/family-pension/';
            
            const response = await fetch(endpoint + id + '/status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus, notes })
            });
            
            if (response.ok) {
                showMessage('success', 'Status updated successfully');
                document.body.removeChild(modal);
                loadApplicationsData(type);
                loadDashboardData();
            } else {
                const data = await response.json();
                showMessage('error', data.message || 'Error updating status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showMessage('error', 'Network error. Please try again.');
        }
    });
}

// Show contact modal
async function showContactModal(id) {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/contact/' + id, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const contact = await response.json();
            displayContactDetails(contact);
        }
    } catch (error) {
        console.error('Error loading contact details:', error);
        showMessage('error', 'Error loading contact details');
    }
}

// Display contact details
function displayContactDetails(contact) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Contact Message Details</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="contact-details">
                    <h3>Contact Information</h3>
                    <p><strong>Name:</strong> ${contact.name}</p>
                    <p><strong>Email:</strong> ${contact.email}</p>
                    <p><strong>Phone:</strong> ${contact.phone}</p>
                    
                    <h3>Message Details</h3>
                    <p><strong>Subject:</strong> ${contact.subject}</p>
                    <p><strong>Message:</strong></p>
                    <div class="message-content">${contact.message}</div>
                    
                    <h3>Status Information</h3>
                    <p><strong>Status:</strong> <span class="status-${contact.status}">${contact.status}</span></p>
                    <p><strong>Submitted On:</strong> ${new Date(contact.submittedAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        document.body.removeChild(modal);
    }
    
    window.onclick = function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    }
}

// Show contact status modal
function showContactStatusModal(id) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Update Contact Status</h2>
                <span class="close">&times;</span>
            </div>
            <form id="contactStatusForm">
                <div class="form-group">
                    <label for="contactNewStatus">New Status</label>
                    <select id="contactNewStatus" class="form-control" required>
                        <option value="">Select Status</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="contactNotes">Response Notes (Optional)</label>
                    <textarea id="contactNotes" class="form-control" rows="3"></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Update Status</button>
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        document.body.removeChild(modal);
    }
    
    // Form submission
    const form = modal.querySelector('#contactStatusForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const newStatus = document.getElementById('contactNewStatus').value;
        const notes = document.getElementById('contactNotes').value;
        
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/contact/' + id + '/status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus, notes })
            });
            
            if (response.ok) {
                showMessage('success', 'Contact status updated successfully');
                document.body.removeChild(modal);
                loadContactsData();
                loadDashboardData();
            } else {
                const data = await response.json();
                showMessage('error', data.message || 'Error updating contact status');
            }
        } catch (error) {
            console.error('Error updating contact status:', error);
            showMessage('error', 'Network error. Please try again.');
        }
    });
}

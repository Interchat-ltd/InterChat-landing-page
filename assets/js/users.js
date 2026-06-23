/*=============== USERS MANAGEMENT JS ===============*/

// ========== API Configuration ==========
const USERS_API_CONFIG = {
    BASE_URL: 'https://openapi.echoapi.com/swagger/v3/66791d3bd002000?locale=en',
    ENDPOINTS: {
        GET_USERS: '/api/v1/users',          // May need to be implemented on backend
        GET_USER: '/api/v1/user/:id',        // Individual user details
        SEARCH_USERS: '/api/v1/users/search' // Search endpoint (optional)
    }
};

// ========== State Management ==========
let allUsers = [];
let filteredUsers = [];
let currentPage = 1;
let itemsPerPage = 12;
let currentView = 'grid'; // 'grid' or 'list'

// ========== DOM Elements ==========
const usersGrid = document.getElementById('usersGrid');
const usersList = document.getElementById('usersList');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const filterSort = document.getElementById('filterSort');
const refreshBtn = document.getElementById('refreshBtn');
const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const emptyState = document.getElementById('emptyState');
const pagination = document.getElementById('pagination');
const totalUsersEl = document.getElementById('totalUsers');
const activeUsersEl = document.getElementById('activeUsers');
const inactiveUsersEl = document.getElementById('inactiveUsers');

// ========== Event Listeners ==========
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    setupEventListeners();
});

function setupEventListeners() {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    filterStatus.addEventListener('change', applyFilters);
    filterSort.addEventListener('change', applyFilters);
    refreshBtn.addEventListener('click', refreshUsers);
    gridViewBtn.addEventListener('click', () => switchView('grid'));
    listViewBtn.addEventListener('click', () => switchView('list'));
}

// ========== Load Users from API ==========
async function loadUsers() {
    showLoading(true);
    hideError();

    try {
        // Try to fetch from API
        const response = await fetch(`${USERS_API_CONFIG.BASE_URL}${USERS_API_CONFIG.ENDPOINTS.GET_USERS}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            allUsers = Array.isArray(data) ? data : data.users || [];
        } else {
            // Fallback: Use mock data if API is not available
            console.warn('API not available, using mock data');
            allUsers = getMockUsers();
        }
    } catch (error) {
        console.warn('Failed to fetch from API, using mock data:', error.message);
        allUsers = getMockUsers();
    }

    if (allUsers.length === 0) {
        showError('No users found. Please check the API configuration.');
    }

    updateStats();
    applyFilters();
    showLoading(false);
}

// ========== Mock Data (for demo/testing) ==========
function getMockUsers() {
    return [
        {
            id: '1',
            username: 'john_doe',
            email: 'john@example.com',
            fullName: 'John Doe',
            avatar: 'https://i.pravatar.cc/150?img=1',
            status: 'active',
            joinDate: '2024-01-15',
            lastActive: '2026-06-23',
            bio: 'Software Developer & Tech Enthusiast'
        },
        {
            id: '2',
            username: 'jane_smith',
            email: 'jane@example.com',
            fullName: 'Jane Smith',
            avatar: 'https://i.pravatar.cc/150?img=2',
            status: 'active',
            joinDate: '2024-02-20',
            lastActive: '2026-06-22',
            bio: 'Designer & Creator'
        },
        {
            id: '3',
            username: 'okeke_festus',
            email: 'Okekefestus@gmail.com',
            fullName: 'Okeke Festus',
            avatar: 'https://i.pravatar.cc/150?img=3',
            status: 'active',
            joinDate: '2024-03-10',
            lastActive: '2026-06-23',
            bio: 'InterChat User'
        },
        {
            id: '4',
            username: 'mike_wilson',
            email: 'mike@example.com',
            fullName: 'Mike Wilson',
            avatar: 'https://i.pravatar.cc/150?img=4',
            status: 'inactive',
            joinDate: '2024-01-05',
            lastActive: '2026-05-20',
            bio: 'Entrepreneur'
        },
        {
            id: '5',
            username: 'sarah_jones',
            email: 'sarah@example.com',
            fullName: 'Sarah Jones',
            avatar: 'https://i.pravatar.cc/150?img=5',
            status: 'active',
            joinDate: '2024-04-12',
            lastActive: '2026-06-21',
            bio: 'Artist & Photographer'
        },
        {
            id: '6',
            username: 'david_brown',
            email: 'david@example.com',
            fullName: 'David Brown',
            avatar: 'https://i.pravatar.cc/150?img=6',
            status: 'pending',
            joinDate: '2026-06-20',
            lastActive: '2026-06-20',
            bio: 'New member'
        },
        {
            id: '7',
            username: 'emma_davis',
            email: 'emma@example.com',
            fullName: 'Emma Davis',
            avatar: 'https://i.pravatar.cc/150?img=7',
            status: 'active',
            joinDate: '2024-05-08',
            lastActive: '2026-06-23',
            bio: 'Writer & Content Creator'
        },
        {
            id: '8',
            username: 'tom_miller',
            email: 'tom@example.com',
            fullName: 'Tom Miller',
            avatar: 'https://i.pravatar.cc/150?img=8',
            status: 'inactive',
            joinDate: '2024-02-15',
            lastActive: '2026-04-10',
            bio: 'Tech Enthusiast'
        }
    ];
}

// ========== Search & Filter ==========
function handleSearch() {
    currentPage = 1;
    applyFilters();
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusFilter = filterStatus.value;
    const sortBy = filterSort.value;

    // Filter by search term
    filteredUsers = allUsers.filter(user => {
        const matchesSearch = !searchTerm || 
            user.fullName?.toLowerCase().includes(searchTerm) ||
            user.username?.toLowerCase().includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm);

        const matchesStatus = !statusFilter || user.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Sort
    filteredUsers.sort((a, b) => {
        switch(sortBy) {
            case 'name-asc':
                return a.fullName.localeCompare(b.fullName);
            case 'name-desc':
                return b.fullName.localeCompare(a.fullName);
            case 'oldest':
                return new Date(a.joinDate) - new Date(b.joinDate);
            case 'recent':
            default:
                return new Date(b.joinDate) - new Date(a.joinDate);
        }
    });

    // Render
    renderUsers();
    updateStats();
}

// ========== Render Users ==========
function renderUsers() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(start, end);

    if (paginatedUsers.length === 0) {
        showEmptyState();
        return;
    }

    hideEmptyState();

    if (currentView === 'grid') {
        renderGridView(paginatedUsers);
    } else {
        renderListView(paginatedUsers);
    }

    renderPagination();
}

function renderGridView(users) {
    usersGrid.classList.remove('hidden');
    usersList.classList.add('hidden');

    usersGrid.innerHTML = users.map(user => `
        <div class="user-card">
            <div class="user-card__header">
                <img src="${user.avatar}" alt="${user.fullName}" class="user-card__avatar">
                <span class="user-card__status ${user.status}"></span>
            </div>
            <div class="user-card__body">
                <h3 class="user-card__name">${escapeHtml(user.fullName)}</h3>
                <p class="user-card__username">@${escapeHtml(user.username)}</p>
                <p class="user-card__bio">${escapeHtml(user.bio || 'No bio')}</p>
            </div>
            <div class="user-card__footer">
                <div class="user-info">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${escapeHtml(user.email)}</span>
                </div>
                <div class="user-info">
                    <span class="info-label">Joined:</span>
                    <span class="info-value">${formatDate(user.joinDate)}</span>
                </div>
                <div class="user-actions">
                    <button class="btn-icon" title="View profile" onclick="viewUserProfile('${user.id}')">
                        <i class="bx bx-show"></i>
                    </button>
                    <button class="btn-icon" title="Send message">
                        <i class="bx bx-message"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderListView(users) {
    usersGrid.classList.add('hidden');
    usersList.classList.remove('hidden');

    usersList.innerHTML = `
        <table class="users-table">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr class="user-row">
                        <td class="user-cell">
                            <img src="${user.avatar}" alt="${user.fullName}" class="user-avatar-sm">
                            <div class="user-info-sm">
                                <div class="user-name">${escapeHtml(user.fullName)}</div>
                                <div class="user-username">@${escapeHtml(user.username)}</div>
                            </div>
                        </td>
                        <td>${escapeHtml(user.email)}</td>
                        <td><span class="status-badge ${user.status}">${user.status}</span></td>
                        <td>${formatDate(user.joinDate)}</td>
                        <td>${formatDate(user.lastActive)}</td>
                        <td>
                            <button class="action-btn" title="View" onclick="viewUserProfile('${user.id}')">
                                <i class="bx bx-show"></i>
                            </button>
                            <button class="action-btn" title="Message">
                                <i class="bx bx-message"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// ========== Pagination ==========
function renderPagination() {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = '<div class="pagination-controls">';

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage - 1})">
            <i class="bx bx-chevron-left"></i>
        </button>`;
    }

    // Page numbers
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage + 1})">
            <i class="bx bx-chevron-right"></i>
        </button>`;
    }

    paginationHTML += '</div>';
    pagination.innerHTML = paginationHTML;
}

function goToPage(page) {
    currentPage = page;
    renderUsers();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== View Toggle ==========
function switchView(view) {
    currentView = view;
    currentPage = 1;

    if (view === 'grid') {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    } else {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    }

    renderUsers();
}

// ========== Stats Update ==========
function updateStats() {
    const activeCount = filteredUsers.filter(u => u.status === 'active').length;
    const inactiveCount = filteredUsers.filter(u => u.status === 'inactive').length;

    totalUsersEl.textContent = filteredUsers.length;
    activeUsersEl.textContent = activeCount;
    inactiveUsersEl.textContent = inactiveCount;
}

// ========== Refresh Users ==========
function refreshUsers() {
    refreshBtn.classList.add('spinning');
    loadUsers();

    setTimeout(() => {
        refreshBtn.classList.remove('spinning');
    }, 1000);
}

// ========== User Actions ==========
function viewUserProfile(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
        alert(`User Profile: ${user.fullName}\nEmail: ${user.email}\nStatus: ${user.status}`);
        // Can be replaced with modal or profile page
    }
}

// ========== Utility Functions ==========
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showEmptyState() {
    usersGrid.classList.add('hidden');
    usersList.classList.add('hidden');
    emptyState.classList.remove('hidden');
    pagination.innerHTML = '';
}

function hideEmptyState() {
    emptyState.classList.add('hidden');
}

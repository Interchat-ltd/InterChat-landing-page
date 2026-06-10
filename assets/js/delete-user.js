/*=============== DELETE USER ACCOUNT JS ===============*/

// API Configuration
const API_CONFIG = {
    BASE_URL: 'https://interchat.kinde.com/oauth2/auth?response_type=code&client_id=5cac5e6ebfa8421ea82564cbba6a580b&redirect_uri=https://www.interchatinc.com/auth&scope=openid%20profile%20email&state=1231231242545&connection_id=google', // Replace with actual EchoAPI endpoint
    ENDPOINTS: {
        GET_USER: '/api/v1/user/profile',
        DELETE_USER: '/api/v1/user/delete',
        VERIFY_AUTH: '/api/v1/user/verify-password'
    }
};


// DOM Elements
const deleteAccountForm = document.getElementById('delete-account-form');
const userEmailElement = document.getElementById('user-email');
const userUsernameElement = document.getElementById('user-username');
const userStatusElement = document.getElementById('user-status');
const userInfoContainer = document.getElementById('user-info-container');
const deleteBtn = document.getElementById('delete-btn');
const passwordInput = document.getElementById('password');
const confirmDeleteCheckbox = document.getElementById('confirm-delete');
const loadingSpinner = document.getElementById('loading-spinner');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUserInformation();
    setupFormHandlers();
});

/**
 * Load user information from API
 */
async function loadUserInformation() {
    try {
        showLoadingSpinner(true);
        
        // Get auth token from localStorage or sessionStorage
        const authToken = getAuthToken();
        
        if (!authToken) {
            showError('Authentication token not found. Please log in again.');
            redirectToLogin();
            return;
        }

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_USER}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user info: ${response.statusText}`);
        }

        const userData = await response.json();
        displayUserInformation(userData.data || userData);
        showLoadingSpinner(false);

    } catch (error) {
        console.error('Error loading user information:', error);
        showError('Failed to load user information. Please refresh the page.');
        showLoadingSpinner(false);
    }
}

/**
 * Display user information on the page
 */
function displayUserInformation(userData) {
    try {
        userEmailElement.textContent = userData.email || 'N/A';
        userUsernameElement.textContent = userData.username || userData.name || 'N/A';
        userStatusElement.textContent = userData.status || 'Active';
        
        // Add a data attribute to store user ID for deletion
        userInfoContainer.dataset.userId = userData.id || userData.user_id;
        
    } catch (error) {
        console.error('Error displaying user info:', error);
        userEmailElement.textContent = 'Error loading data';
    }
}

/**
 * Setup form event handlers
 */
function setupFormHandlers() {
    deleteAccountForm.addEventListener('submit', handleFormSubmit);
    
    // Enable/disable delete button based on checkbox
    confirmDeleteCheckbox.addEventListener('change', (e) => {
        deleteBtn.disabled = !e.target.checked || !passwordInput.value;
    });

    // Enable/disable delete button based on password input
    passwordInput.addEventListener('input', (e) => {
        deleteBtn.disabled = !confirmDeleteCheckbox.checked || !e.target.value;
    });

    // Initial disable state
    deleteBtn.disabled = true;
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    if (!confirmDeleteCheckbox.checked) {
        showError('Please confirm that you understand the consequences of account deletion.');
        return;
    }

    if (!passwordInput.value.trim()) {
        showError('Please enter your password.');
        return;
    }

    // Show confirmation dialog
    if (!confirm('Are you absolutely sure? This cannot be undone.')) {
        return;
    }

    try {
        showLoadingSpinner(true);
        deleteBtn.disabled = true;

        const authToken = getAuthToken();
        const userId = userInfoContainer.dataset.userId;
        const password = passwordInput.value;

        // Step 1: Verify password
        const verifyResponse = await verifyPassword(authToken, password);
        
        if (!verifyResponse.success) {
            throw new Error('Password verification failed. Please check your password and try again.');
        }

        // Step 2: Delete account
        const deleteResponse = await deleteUserAccount(authToken, userId, password);

        if (deleteResponse.success) {
            showSuccess('Your account has been successfully deleted. Redirecting...');
            
            // Clear auth token
            clearAuthToken();
            
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        } else {
            throw new Error(deleteResponse.message || 'Failed to delete account.');
        }

    } catch (error) {
        console.error('Error deleting account:', error);
        showError(error.message || 'An error occurred while deleting your account. Please try again.');
        deleteBtn.disabled = false;
    } finally {
        showLoadingSpinner(false);
    }
}

/**
 * Verify user password with API
 */
async function verifyPassword(authToken, password) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_AUTH}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: password
            })
        });

        if (!response.ok) {
            throw new Error('Password verification failed');
        }

        return await response.json();

    } catch (error) {
        console.error('Password verification error:', error);
        return { success: false, message: 'Password verification failed' };
    }
}

/**
 * Delete user account from API
 */
async function deleteUserAccount(authToken, userId, password) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELETE_USER}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                password: password,
                confirmation: true
            })
        });

        if (!response.ok) {
            throw new Error(`Account deletion failed: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Account deletion error:', error);
        return { success: false, message: 'Failed to delete account' };
    }
}

/**
 * Utility: Get auth token from storage
 */
function getAuthToken() {
    return localStorage.getItem('authToken') || 
           sessionStorage.getItem('authToken') ||
           localStorage.getItem('access_token') ||
           sessionStorage.getItem('access_token');
}

/**
 * Utility: Clear auth token
 */
function clearAuthToken() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
}

/**
 * Utility: Show loading spinner
 */
function showLoadingSpinner(show) {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        if (show) {
            spinner.classList.add('active');
        } else {
            spinner.classList.remove('active');
        }
    }
}

/**
 * Utility: Show error message
 */
function showError(message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert--error';
    errorDiv.textContent = message;
    
    // Insert at the top of the form
    deleteAccountForm.parentElement.insertBefore(errorDiv, deleteAccountForm);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);

    // Log to console
    console.error(message);
}

/**
 * Utility: Show success message
 */
function showSuccess(message) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert--success';
    successDiv.textContent = message;
    
    // Insert at the top of the form
    deleteAccountForm.parentElement.insertBefore(successDiv, deleteAccountForm);
    
    // Log to console
    console.log(message);
}

/**
 * Utility: Redirect to login page
 */
function redirectToLogin() {
    setTimeout(() => {
        window.location.href = '/index.html';
    }, 3000);
}

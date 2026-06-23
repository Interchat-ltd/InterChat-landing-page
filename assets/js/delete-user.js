/*=============== DELETE USER ACCOUNT JS ===============*/

// ========== API Configuration ==========
const API_CONFIG = {
    BASE_URL: 'https://openapi.echoapi.com/swagger/v3/66791d3bd002000?locale=en', // Update with your actual API URL
    ENDPOINTS: {
        REQUEST_DELETION: '/api/v1/delete-account/request',
        CONFIRM_DELETION: '/api/v1/delete-account/confirm'
    }
};

// ========== State Management ==========
let currentStep = 1;
let userEmail = '';

// ========== DOM Elements ==========
const step1Form = document.getElementById('step-1');
const step2Form = document.getElementById('step-2');
const emailInput = document.getElementById('email');
const tokenInput = document.getElementById('token');
const requestBtn = document.getElementById('requestBtn');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const backBtn = document.getElementById('backBtn');
const responseBox = document.getElementById('response');
const confirmEmailDisplay = document.getElementById('confirmEmail');

// ========== Event Listeners ==========
requestBtn.addEventListener('click', handleRequestDeletion);
confirmBtn.addEventListener('click', handleConfirmDeletion);
cancelBtn.addEventListener('click', handleCancel);
backBtn.addEventListener('click', handleBackToStep1);
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && currentStep === 1) handleRequestDeletion();
});
tokenInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && currentStep === 2) handleConfirmDeletion();
});

// ========== Step 1: Request Deletion ==========
async function handleRequestDeletion() {
    const email = emailInput.value.trim();

    // Validation
    if (!email) {
        showMessage('Please enter your email address.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }

    // Confirmation dialog
    const confirmed = confirm(
        `Are you sure you want to request deletion of the account associated with ${email}?\n\nYou'll receive a verification code via email.`
    );

    if (!confirmed) return;

    // Disable button and show loading state
    requestBtn.disabled = true;
    requestBtn.innerText = 'Sending request...';

    try {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REQUEST_DELETION}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            }
        );

        let data = {};
        try {
            data = await response.json();
        } catch (err) {
            console.error('Failed to parse response:', err);
        }

        if (response.ok) {
            showMessage(
                'Deletion request submitted successfully! Check your email for the verification code.',
                'success'
            );
            userEmail = email;
            emailInput.disabled = true;
            
            // Move to step 2 after 2 seconds
            setTimeout(() => {
                moveToStep2();
            }, 2000);
        } else {
            const errorMsg = data.message || 
                           (response.status === 404 ? 'Email not found in our system.' : 
                            'Unable to submit deletion request. Please try again.');
            showMessage(errorMsg, 'error');
        }
    } catch (error) {
        console.error('Network error:', error);
        showMessage(
            'Network error. Please check your connection and try again.',
            'error'
        );
    } finally {
        requestBtn.disabled = false;
        requestBtn.innerText = 'Request Deletion';
    }
}

// ========== Step 2: Confirm Deletion ==========
async function handleConfirmDeletion() {
    const token = tokenInput.value.trim();

    // Validation
    if (!token) {
        showMessage('Please enter the verification code.', 'error');
        return;
    }

    // Confirmation dialog
    const finalConfirmed = confirm(
        'FINAL WARNING: This will permanently delete your account and all associated data.\n\nThis action cannot be undone. Are you absolutely sure?'
    );

    if (!finalConfirmed) return;

    // Disable button and show loading state
    confirmBtn.disabled = true;
    confirmBtn.innerText = 'Confirming...';

    try {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONFIRM_DELETION}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            }
        );

        let data = {};
        try {
            data = await response.json();
        } catch (err) {
            console.error('Failed to parse response:', err);
        }

        if (response.ok) {
            showMessage(
                'Your account has been successfully deleted. Redirecting to home page...',
                'success'
            );
            
            // Redirect after 3 seconds
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 3000);
        } else {
            const errorMsg = data.message || 
                           (response.status === 404 ? 'Invalid or expired verification code.' : 
                            'Failed to confirm deletion. Please try again.');
            showMessage(errorMsg, 'error');
        }
    } catch (error) {
        console.error('Network error:', error);
        showMessage(
            'Network error. Please check your connection and try again.',
            'error'
        );
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerText = 'Confirm Deletion';
    }
}

// ========== Navigation ==========
function moveToStep2() {
    currentStep = 2;
    step1Form.classList.remove('active');
    step2Form.classList.add('active');
    confirmEmailDisplay.textContent = userEmail;
    tokenInput.focus();
}

function handleBackToStep1() {
    currentStep = 1;
    step2Form.classList.remove('active');
    step1Form.classList.add('active');
    tokenInput.value = '';
    responseBox.textContent = '';
    emailInput.focus();
}

function handleCancel() {
    const confirmed = confirm('Are you sure you want to cancel? Any unsaved changes will be lost.');
    if (confirmed) {
        window.location.href = '/index.html';
    }
}

// ========== Utilities ==========
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type) {
    responseBox.textContent = message;
    responseBox.className = `form__response ${type}`;
    
    // Auto-clear error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            if (responseBox.textContent === message) {
                responseBox.textContent = '';
                responseBox.className = 'form__response';
            }
        }, 5000);
    }
}











/** SUBCODES  */
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

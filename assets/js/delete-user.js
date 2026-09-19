/*=============== DELETE USER ACCOUNT JS ===============*/

// ========== API Configuration ==========
const API_CONFIG = {
    BASE_URL: 'https://api.staging.interchathq.com',
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

// ========== Step 1: Request Deletion (sends OTP to email) ==========
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
            const rawMsg = data.error || data.message || 'Unable to submit deletion request. Please try again.';
            showMessage(sanitizeErrorMessage(rawMsg), 'error');
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

// ========== Step 2: Confirm Deletion via OTP ==========
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
            const rawMsg = data.error || data.message || 'Invalid or expired verification code.';
            showMessage(sanitizeErrorMessage(rawMsg), 'error');
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

// Hides raw backend/database errors (e.g. MongoDB "E11000 duplicate key...")
// from end users, while keeping the original message in the console for debugging.
function sanitizeErrorMessage(rawMessage) {
    const looksInternal = /E\d{4,5}|duplicate key|collection:|mongo|stack trace|at\s+\S+\s*\(/i.test(rawMessage);

    if (looksInternal) {
        console.error('Server returned an internal error:', rawMessage);
        return 'Something went wrong on our end. Please try again in a moment, or contact support if the issue persists.';
    }

    return rawMessage;
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

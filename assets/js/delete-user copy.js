/*=============== DELETE USER ACCOUNT JS ===============*/

const options = {
  method: 'GET',
  headers: {
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'User-Agent': 'EchoapiRuntime/1.1.0',
    Connection: 'keep-alive',
    Cookie: 'kbtc=ktt_44bf9fe145fb4207a2a632063502d0e4'
  }
};

fetch('https://openapi.echoapi.com/swagger/v3/66791d3bd002000?locale=en', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));

// API Configuration
const API_CONFIG = {
    BASE_URL: 'https://openapi.echoapi.com/swagger/v3/66791d3bd002000?locale=en', // Replace with actual EchoAPI endpoint
    ENDPOINTS: {
        GET_USER: '/api/v1/user/profile',
        DELETE_USER: '/api/v1/user/delete',
        VERIFY_AUTH: '/api/v1/user/verify-password'
    }
};

console.log(getAuthToken);

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


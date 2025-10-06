// API Base URL
const API_BASE = 'http://localhost:3001/api';

// Global state
let currentUser = null;
let candidates = [];
let voters = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupNavigation();
    loadDashboard();
});

// Initialize application
function initializeApp() {
    console.log('🚀 School Voting System Frontend Initialized');
    checkExistingSession();
}

// Check for existing user session
function checkExistingSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showLoggedInState();
    }
}

// Navigation setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    document.getElementById(sectionId).classList.add('active');
    
    // Load section-specific data
    switch(sectionId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'candidates':
            loadCandidates();
            break;
        case 'voters':
            loadVoters();
            break;
        case 'vote':
            loadVoting();
            break;
    }
}

// Load dashboard data
async function loadDashboard() {
    try {
        // ✅ FIXED
        const [candidatesRes, votersRes, healthRes] = await Promise.all([
            fetch(`${API_BASE}/candidates`),
            fetch(`${API_BASE}/voters`),
            fetch(`${API_BASE}/health`)
        ]);

        const candidatesData = await candidatesRes.json();
        const votersData = await votersRes.json();
        const healthData = await healthRes.json();

        // Update dashboard stats
        document.getElementById('totalCandidates').textContent = candidatesData.length;
        document.getElementById('totalVoters').textContent = votersData.length;
        
        // Calculate votes cast (voters who have voted)
        const votesCast = votersData.filter(voter => voter.has_voted).length;
        document.getElementById('votesCast').textContent = votesCast;
        
        // Update system status
        document.getElementById('systemStatus').textContent = 'Online';
        document.getElementById('systemStatus').style.color = '#28a745';

        // Show recent candidates
        displayRecentCandidates(candidatesData.slice(0, 3));

    } catch (error) {
        console.error('Error loading dashboard:', error);
        document.getElementById('systemStatus').textContent = 'Offline';
        document.getElementById('systemStatus').style.color = '#dc3545';
    }
}

// Display recent candidates
function displayRecentCandidates(recentCandidates) {
    const container = document.getElementById('recentCandidates');
    container.innerHTML = '';

    if (recentCandidates.length === 0) {
        container.innerHTML = '<p>No candidates available</p>';
        return;
    }

    recentCandidates.forEach(candidate => {
        const candidateElement = document.createElement('div');
        candidateElement.className = 'candidate-card';
        candidateElement.innerHTML = \
            <div class="candidate-name">\</div>
            <div class="candidate-position">\</div>
            <div class="candidate-grade">\</div>
        \;
        container.appendChild(candidateElement);
    });
}

// Load and display all candidates
async function loadCandidates() {
    try {
        // ✅ FIXED
        const response = await fetch(`${API_BASE}/candidates`);
        candidates = await response.json();
        displayCandidates(candidates);
    } catch (error) {
        console.error('Error loading candidates:', error);
        document.getElementById('candidatesList').innerHTML = 
            '<p>Error loading candidates. Please try again.</p>';
    }
}

// Display candidates in grid
function displayCandidates(candidatesData) {
    const container = document.getElementById('candidatesList');
    
    if (candidatesData.length === 0) {
        container.innerHTML = '<p>No candidates found.</p>';
        return;
    }

    container.innerHTML = candidatesData.map(candidate => \
        <div class="candidate-card">
            <div class="candidate-name">\</div>
            <div class="candidate-position">\</div>
            <div class="candidate-grade">Grade: \</div>
            <div class="candidate-description">\</div>
            <div class="candidate-meta">
                <small>Added: \</small>
            </div>
        </div>
    \).join('');
}

// Load and display all voters
async function loadVoters() {
    try {
        // ✅ FIXED
        const response = await fetch(`${API_BASE}/voters`);
        voters = await response.json();
        displayVoters(voters);
    } catch (error) {
        console.error('Error loading voters:', error);
        document.getElementById('votersList').innerHTML = 
            '<p>Error loading voters. Please try again.</p>';
    }
}

// Display voters in list
function displayVoters(votersData) {
    const container = document.getElementById('votersList');
    
    if (votersData.length === 0) {
        container.innerHTML = '<p>No voters found.</p>';
        return;
    }

    container.innerHTML = votersData.map(voter => {
        const initials = voter.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const statusClass = voter.has_voted ? 'status-voted' : 'status-not-voted';
        const statusText = voter.has_voted ? 'Voted' : 'Not Voted';
        
        return \
            <div class="voter-card">
                <div class="voter-avatar">\</div>
                <div class="voter-info">
                    <div class="voter-name">\</div>
                    <div class="voter-email">\</div>
                </div>
                <div class="voter-status \">\</div>
            </div>
        \;
    }).join('');
}

// Load voting interface
async function loadVoting() {
    try {
        // ✅ FIXED
        const response = await fetch(`${API_BASE}/candidates`);
        const candidatesData = await response.json();
        displayVotingCandidates(candidatesData);
    } catch (error) {
        console.error('Error loading voting candidates:', error);
        document.getElementById('voteCandidates').innerHTML = 
            '<p>Error loading candidates for voting.</p>';
    }
}

// Display candidates for voting
function displayVotingCandidates(candidatesData) {
    const container = document.getElementById('voteCandidates');
    
    if (candidatesData.length === 0) {
        container.innerHTML = '<p>No candidates available for voting.</p>';
        return;
    }

    container.innerHTML = candidatesData.map(candidate => \
        <div class="vote-option">
            <input type="radio" name="candidate" value="\" id="candidate-\>
            <label for="candidate-\">
                <strong>\</strong> - \
                <br><small>\</small>
            </label>
        </div>
    \).join('');
}

// Cast a vote
function castVote() {
    const selectedCandidate = document.querySelector('input[name="candidate"]:checked');
    
    if (!selectedCandidate) {
        alert('Please select a candidate to vote for.');
        return;
    }

    const candidateId = selectedCandidate.value;
    const candidateName = selectedCandidate.nextElementSibling.querySelector('strong').textContent;
    
    if (confirm(\Are you sure you want to vote for \?\)) {
        // Here you would typically send the vote to your API
        // For now, we'll just show a success message
        alert(\Thank you! Your vote for \ has been recorded.\);
        
        // Reset the form
        selectedCandidate.checked = false;
        
        // Refresh the dashboard to show updated stats
        loadDashboard();
    }
}

// Utility function to handle API errors
function handleApiError(error) {
    console.error('API Error:', error);
    alert('An error occurred while communicating with the server. Please try again.');
}
// ===== NEW AUTHENTICATION & VOTING FUNCTIONS =====

// Global variable to track logged-in user
let currentUser = null;

// Login function
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: 'defaultpassword' })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            currentUser = result.voter;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showLoggedInState();
            alert(`Welcome back, ${currentUser.name}!`);
            return result;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
        throw error;
    }
}

// Cast vote function
async function castVoteReal(candidateId, candidateName, position) {
    if (!currentUser) {
        alert('Please login first to vote.');
        showLoginModal();
        return;
    }
    
    if (currentUser.has_voted) {
        alert('You have already voted!');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/votes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                voter_id: currentUser.id,
                candidate_id: candidateId,
                position: position
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(`✅ Thank you! Your vote for ${candidateName} has been recorded.`);
            currentUser.has_voted = true;
            // ADD THIS LINE:
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showLoggedInState();
            loadDashboard();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Voting error:', error);
        alert('Error: ' + error.message);
    }
}

// Load results function
async function loadResults() {
    try {
        const response = await fetch(`${API_BASE}/results`);
        const results = await response.json();
        displayResults(results);
    } catch (error) {
        console.error('Error loading results:', error);
    }
}

// Display results
function displayResults(results) {
    // Create a simple results display
    const resultsHTML = results.map(result => `
        <div class="result-item">
            <strong>${result.name}</strong> - ${result.position}
            <span class="vote-count">${result.vote_count} votes</span>
        </div>
    `).join('');
    
    // You can add this to your dashboard or create a new section
    console.log('Election Results:', results);
}

// Show logged in state in navigation
function showLoggedInState() {
    let userElement = document.getElementById('user-info');
    
    if (!userElement) {
        userElement = document.createElement('li');
        userElement.id = 'user-info';
        document.querySelector('.nav-links').appendChild(userElement);
    }
    
    if (currentUser) {
        userElement.innerHTML = `
            <a href="#" class="nav-link active" id="logoutBtn">Logout</a>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    } else {
        userElement.innerHTML = '';
    }
}

// Logout function
function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoggedInState();
    alert('You have been logged out.');
}

// Password recovery function
async function recoverPassword(email) {
    try {
        const response = await fetch(`${API_BASE}/auth/recover`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Password recovery email sent!');
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Recovery error:', error);
        alert('Error: ' + error.message);
    }
}

// Admin functions
// Load admin dashboard
async function loadAdminDashboard() {
    try {
        const response = await fetch(`${API_BASE}/admin/dashboard`);
        const data = await response.json();
        displayAdminDashboard(data);
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
    }
}

// Display admin dashboard data
function displayAdminDashboard(data) {
    document.getElementById('adminTotalCandidates').textContent = data.total_candidates;
    document.getElementById('adminTotalVoters').textContent = data.total_voters;
    document.getElementById('adminVotesCast').textContent = data.votes_cast;
}

// Initialize admin panel
function initializeAdminPanel() {
    loadAdminDashboard();
    
    document.getElementById('adminLogoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logoutUser();
    });
}

// Call initializeAdminPanel on admin page load
if (window.location.pathname.includes('/admin')) {
    document.addEventListener('DOMContentLoaded', initializeAdminPanel);
}

// 404 handler
function handle404() {
    document.getElementById('mainContent').innerHTML = '<h1>404 - Not Found</h1>';
}

// API health check
async function checkApiHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        
        document.getElementById('apiStatus').textContent = data.status;
    } catch (error) {
        console.error('Error checking API health:', error);
    }
}

// Call health check on regular intervals
setInterval(checkApiHealth, 30000); // 30 seconds

// Initial health check
checkApiHealth();
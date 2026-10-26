/*
  PawConnect prototype – accounts and sessions (US17, Jira T1-71).
  Demonstration only: accounts, passwords and the session are kept in this
  browser's localStorage. A real system would use a secure server.
*/
(function () {
  var USERS_KEY = 'pawconnectUsers';
  var SESSION_KEY = 'pawconnectSession';
  var DEMO_USERS = [
    { email: 'emily@pawconnect.test', password: 'Adopt1234', name: 'Emily Chen', role: 'adopter' },
    { email: 'sarah@harbourpaws.test', password: 'Staff1234', name: 'Sarah Thompson', role: 'staff', shelter: 'Harbour Paws Rescue' }
  ];

  function read(key, fallback) {
    try {
      var value = JSON.parse(localStorage.getItem(key));
      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* storage unavailable */ }
  }

  function normaliseEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  function getUsers() {
    var users = read(USERS_KEY, null);
    var changed = false;
    if (!Array.isArray(users)) { users = []; changed = true; }
    DEMO_USERS.forEach(function (demo) {
      if (!users.some(function (user) { return user.email === demo.email; })) {
        users.push(demo);
        changed = true;
      }
    });
    if (changed) write(USERS_KEY, users);
    return users;
  }

  function saveUsers(users) {
    write(USERS_KEY, users);
  }

  function publicUser(user) {
    return { email: user.email, name: user.name, role: user.role, shelter: user.shelter || '' };
  }

  function getCurrentUser() {
    var session = read(SESSION_KEY, null);
    if (!session || !session.email) return null;
    var user = getUsers().find(function (item) { return item.email === session.email; });
    return user ? publicUser(user) : null;
  }

  function login(email, password) {
    var address = normaliseEmail(email);
    var user = getUsers().find(function (item) { return item.email === address && item.password === password; });
    if (!user) {
      try { localStorage.removeItem(SESSION_KEY); } catch (error) { /* ignore */ }
      return null;
    }
    write(SESSION_KEY, { email: user.email, loggedInAt: new Date().toISOString() });
    return publicUser(user);
  }

  function logout() {
    try { localStorage.removeItem(SESSION_KEY); } catch (error) { /* ignore */ }
  }

  function escapeHtml(text) {
    return String(text == null ? '' : text).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function landingPage(user) {
    return user && user.role === 'staff' ? 'staff.html' : 'account.html';
  }

  // Sends visitors who are not logged in to the login page.
  // A logged-in user with a different role is sent to their own page.
  function requireLogin(role) {
    var user = getCurrentUser();
    if (!user) {
      window.location.replace('login.html?reason=login-required');
      return null;
    }
    if (role && user.role !== role) {
      window.location.replace(landingPage(user));
      return null;
    }
    return user;
  }

  function updateNav() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;
    var user = getCurrentUser();
    if (!user) {
      var loginLink = document.createElement('a');
      loginLink.href = 'login.html';
      loginLink.textContent = 'Log in';
      nav.appendChild(loginLink);
      return;
    }
    var home = document.createElement('a');
    home.href = landingPage(user);
    home.textContent = user.role === 'staff' ? 'Staff area' : 'My account';
    nav.appendChild(home);

    var logoutButton = document.createElement('button');
    logoutButton.type = 'button';
    logoutButton.className = 'nav-button';
    logoutButton.textContent = 'Log out';
    logoutButton.addEventListener('click', function () {
      logout();
      window.location.href = 'login.html?reason=logged-out';
    });
    nav.appendChild(logoutButton);
  }

  window.PawAuth = {
    getUsers: getUsers,
    saveUsers: saveUsers,
    getCurrentUser: getCurrentUser,
    login: login,
    logout: logout,
    requireLogin: requireLogin,
    landingPage: landingPage,
    normaliseEmail: normaliseEmail,
    escapeHtml: escapeHtml
  };

  getUsers();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNav);
  } else {
    updateNav();
  }
}());

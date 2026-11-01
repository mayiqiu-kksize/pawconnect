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

  // US16: create an adopter account and log the new user in.
  // Returns { user } on success or { error: 'exists' } if the email is taken.
  function register(name, email, password) {
    var address = normaliseEmail(email);
    var users = getUsers();
    if (users.some(function (item) { return item.email === address; })) {
      return { error: 'exists' };
    }
    var user = { email: address, password: password, name: String(name).trim(), role: 'adopter', createdAt: new Date().toISOString() };
    users.push(user);
    saveUsers(users);
    write(SESSION_KEY, { email: user.email, loggedInAt: new Date().toISOString() });
    return { user: publicUser(user) };
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normaliseEmail(email));
  }

  function escapeHtml(text) {
    return String(text == null ? '' : text).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function landingPage(user) {
    return user && user.role === 'staff' ? 'staff.html' : 'account.html';
  }

  // Sends visitors who are not logged in to the login page, remembering the page they wanted.
  // A logged-in user with a different role is sent to their own page,
  // or, with options.deny, shown an "Access denied" message instead (US18).
  function requireLogin(role, options) {
    var user = getCurrentUser();
    if (!user) {
      var page = window.location.pathname.split('/').pop() || 'index.html';
      window.location.replace('login.html?reason=login-required&next=' + encodeURIComponent(page + window.location.search));
      return null;
    }
    if (role && user.role !== role) {
      if (options && options.deny) {
        showAccessDenied(user);
      } else {
        window.location.replace(landingPage(user));
      }
      return null;
    }
    return user;
  }

  // US18: staff pages are only for shelter staff.
  function requireStaff() {
    return requireLogin('staff', { deny: true });
  }

  function showAccessDenied(user) {
    document.title = 'Access denied | PawConnect';
    var main = document.querySelector('main');
    if (!main) return;
    main.innerHTML = '<div class="empty-state access-denied" role="alert">' +
      '<h1>Access denied</h1>' +
      '<p>This page is only for shelter staff. You are logged in as ' + escapeHtml(user.name) + ' (adopter).</p>' +
      '<a class="button" href="' + landingPage(user) + '">Go to My account</a></div>';
  }

  // Only local pages are accepted as a place to return to after logging in.
  function safeNext(next) {
    return /^[a-z-]+\.html(\?[\w=&%-]*)?$/i.test(next || '') ? next : '';
  }

  var STAFF_LINKS = [
    ['staff.html', 'Overview'],
    ['staff-pets.html', 'Pet listings'],
    ['staff-applications.html', 'Applications'],
    ['staff-enquiries.html', 'Enquiries']
  ];

  // US18: shelter staff see a staff menu under the header on every page.
  function addStaffMenu() {
    var header = document.querySelector('.site-header');
    if (!header || document.querySelector('.staff-menu')) return;
    var current = window.location.pathname.split('/').pop() || 'index.html';
    var bar = document.createElement('nav');
    bar.className = 'staff-menu';
    bar.setAttribute('aria-label', 'Staff menu');
    bar.innerHTML = '<div class="staff-menu-inner"><span class="staff-menu-label">Staff</span>' +
      STAFF_LINKS.map(function (link) {
        return '<a href="' + link[0] + '"' + (link[0] === current ? ' aria-current="page"' : '') + '>' + link[1] + '</a>';
      }).join('') + '</div>';
    header.insertAdjacentElement('afterend', bar);
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
      var signupLink = document.createElement('a');
      signupLink.href = 'signup.html';
      signupLink.textContent = 'Sign up';
      nav.appendChild(signupLink);
      return;
    }
    if (user.role === 'staff') addStaffMenu();
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
    register: register,
    isValidEmail: isValidEmail,
    requireLogin: requireLogin,
    requireStaff: requireStaff,
    safeNext: safeNext,
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

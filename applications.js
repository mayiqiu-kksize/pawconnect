// Adoption applications, stored in this browser for the prototype (US2, US4, US8).
(function () {
  var KEY = 'pawconnectApplications';
  var STATUSES = ['Submitted', 'Under Review', 'Approved', 'Declined'];

  // Demo applications so shelter staff have something to review in a fresh browser.
  var DEMO = [
    { id: 'APP-100101', petId: 'p1', petName: 'Milo', shelter: 'Harbour Paws Rescue', applicant: 'Emily Chen', email: 'emily@pawconnect.test', accountEmail: 'emily@pawconnect.test', phone: '0412 345 678', suburb: 'Marrickville', message: 'I work from home and have a quiet flat, which should suit a calm cat like Milo.', status: 'Submitted', submittedAt: '2026-10-28T10:15:00+11:00' },
    { id: 'APP-100102', petId: 'p5', petName: 'Archie', shelter: 'Harbour Paws Rescue', applicant: 'Tom Nguyen', email: 'tom.nguyen@example.com', phone: '0423 456 789', suburb: 'Lane Cove', message: 'Our family has had small dogs before and we have a fenced backyard.', status: 'Under Review', submittedAt: '2026-10-26T14:40:00+11:00' },
    { id: 'APP-100103', petId: 'p3', petName: 'Sunny', shelter: 'Western Sydney Animal Care', applicant: 'Priya Shah', email: 'priya.shah@example.com', phone: '0434 567 890', suburb: 'Parramatta', message: 'We run every morning and would love an active young dog to join us.', status: 'Submitted', submittedAt: '2026-10-29T09:05:00+11:00' }
  ];

  function petFor(id) {
    return typeof PETS !== 'undefined' ? PETS.find(function (pet) { return pet.id === id; }) : null;
  }

  // Applications saved before US4 lack a shelter, status and date; fill them in.
  function upgrade(application) {
    var pet = petFor(application.petId);
    if (!application.shelter && pet) application.shelter = pet.shelter;
    if (!application.status) application.status = 'Submitted';
    if (!application.submittedAt) application.submittedAt = application.consentAt || new Date().toISOString();
    if (application.email) application.email = String(application.email).trim().toLowerCase();
    if (application.accountEmail) application.accountEmail = String(application.accountEmail).trim().toLowerCase();
    return application;
  }

  function getAll() {
    var list;
    try { list = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (error) { list = null; }
    if (!Array.isArray(list)) list = [];
    // Add the demo applications once, also in browsers that already saved applications for US2.
    if (localStorage.getItem(KEY + 'Demo') !== '1') {
      DEMO.forEach(function (demo) {
        if (!list.some(function (item) { return item.id === demo.id; })) list.push(Object.assign({}, demo));
      });
      saveAll(list);
      localStorage.setItem(KEY + 'Demo', '1');
    }
    return list.map(upgrade);
  }

  function saveAll(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function add(application) {
    var list = getAll();
    list.push(upgrade(application));
    saveAll(list);
    return application;
  }

  function byId(id) {
    return getAll().find(function (item) { return item.id === id; }) || null;
  }

  function forShelter(shelter) {
    return getAll().filter(function (item) { return item.shelter === shelter; });
  }

  function forEmail(email) {
    var address = String(email || '').trim().toLowerCase();
    return getAll().filter(function (item) { return (item.accountEmail || item.email) === address; });
  }

  function updateStatus(id, status) {
    if (STATUSES.indexOf(status) === -1) return null;
    var list = getAll();
    var item = list.find(function (entry) { return entry.id === id; });
    if (!item) return null;
    item.status = status;
    item.statusUpdatedAt = new Date().toISOString();
    saveAll(list);
    return item;
  }

  function formatDate(iso) {
    var date = new Date(iso);
    return isNaN(date) ? '' : date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  window.PawApps = {
    STATUSES: STATUSES,
    getAll: getAll,
    add: add,
    byId: byId,
    forShelter: forShelter,
    forEmail: forEmail,
    updateStatus: updateStatus,
    formatDate: formatDate
  };
}());

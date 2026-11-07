// Enquiries from adopters to shelters, stored in this browser for the prototype (US5, US6, US13).
(function () {
  var KEY = 'pawconnectEnquiries';

  // Demo enquiries so shelter staff have something to answer in a fresh browser (US6).
  var DEMO = [
    { id: 'ENQ-200101', petId: 'p1', petName: 'Milo', shelter: 'Harbour Paws Rescue', name: 'Emily Chen', email: 'emily@pawconnect.test', accountEmail: 'emily@pawconnect.test', message: 'Is Milo used to living with children? I have a niece who visits most weekends.', sentAt: '2026-11-05T11:20:00+11:00', consentGiven: true, replies: [] },
    { id: 'ENQ-200102', petId: 'p3', petName: 'Sunny', shelter: 'Western Sydney Animal Care', name: 'Priya Shah', email: 'priya.shah@example.com', accountEmail: '', message: 'How much exercise does Sunny need each day?', sentAt: '2026-11-06T09:40:00+11:00', consentGiven: true, replies: [] }
  ];

  function getAll() {
    var list;
    try { list = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (error) { list = []; }
    if (!Array.isArray(list)) list = [];
    // Add the demo enquiries once, also in browsers that already saved enquiries for US5.
    if (localStorage.getItem(KEY + 'Demo') !== '1') {
      DEMO.forEach(function (demo) {
        if (!list.some(function (item) { return item.id === demo.id; })) list.push(JSON.parse(JSON.stringify(demo)));
      });
      saveAll(list);
      localStorage.setItem(KEY + 'Demo', '1');
    }
    return list;
  }

  function saveAll(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function normalise(email) {
    return String(email || '').trim().toLowerCase();
  }

  function add(enquiry) {
    var list = getAll();
    enquiry.email = normalise(enquiry.email);
    enquiry.accountEmail = normalise(enquiry.accountEmail);
    enquiry.replies = enquiry.replies || [];
    list.push(enquiry);
    saveAll(list);
    return enquiry;
  }

  function byId(id) {
    return getAll().find(function (item) { return item.id === id; }) || null;
  }

  function forShelter(shelter) {
    return getAll().filter(function (item) { return item.shelter === shelter; });
  }

  function forEmail(email) {
    var address = normalise(email);
    return getAll().filter(function (item) { return (item.accountEmail || item.email) === address; });
  }

  // Used by US6: staff save a reply that the adopter can then read (US13).
  function addReply(id, reply) {
    var list = getAll();
    var item = list.find(function (entry) { return entry.id === id; });
    if (!item) return null;
    item.replies = item.replies || [];
    item.replies.push(reply);
    saveAll(list);
    return item;
  }

  function formatDate(iso) {
    var date = new Date(iso);
    return isNaN(date) ? '' : date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  window.PawEnquiries = {
    getAll: getAll,
    add: add,
    byId: byId,
    forShelter: forShelter,
    forEmail: forEmail,
    addReply: addReply,
    formatDate: formatDate
  };
}());

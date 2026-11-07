// Enquiries from adopters to shelters, stored in this browser for the prototype (US5, US6, US13).
(function () {
  var KEY = 'pawconnectEnquiries';

  function getAll() {
    var list;
    try { list = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (error) { list = []; }
    return Array.isArray(list) ? list : [];
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

(function () {
  var area = document.getElementById('apply-area');
  if (!area || typeof pet === 'undefined') return;

  var storageKey = 'pawconnectApplications';
  var isAvailable = pet.status === 'Available';

  function getApplications() {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); }
    catch (error) { return []; }
  }

  function saveApplications(applications) {
    localStorage.setItem(storageKey, JSON.stringify(applications));
  }

  function renderSavedApplications() {
    var applications = getApplications();
    var details = document.createElement('details');
    details.className = 'saved-applications';
    var summary = document.createElement('summary');
    summary.textContent = 'Saved applications (' + applications.length + ')';
    details.appendChild(summary);
    var list = document.createElement('ul');
    applications.forEach(function (application) {
      var item = document.createElement('li');
      item.textContent = application.id + ' — ' + application.petName + ' — ' + application.applicant;
      list.appendChild(item);
    });
    details.appendChild(list);
    area.appendChild(details);
  }

  function showForm() {
    area.innerHTML = '';
    var panel = document.createElement('section');
    panel.className = 'application-panel';
    var heading = document.createElement('h2');
    heading.textContent = 'Apply for ' + pet.name;
    panel.appendChild(heading);

    var form = document.createElement('form');
    form.className = 'application-form';
    form.noValidate = true;
    var fields = [
      { name: 'fullName', label: 'Full name', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'tel' },
      { name: 'suburb', label: 'Suburb', type: 'text' },
      { name: 'message', label: 'Why would you like to adopt ' + pet.name + '?', type: 'textarea' }
    ];
    fields.forEach(function (field) {
      var label = document.createElement('label');
      label.htmlFor = field.name;
      label.appendChild(document.createTextNode(field.label + ' *'));
      var input = field.type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
      input.id = field.name; input.name = field.name; input.required = true;
      if (field.type !== 'textarea') input.type = field.type;
      label.appendChild(input);
      var error = document.createElement('span');
      error.className = 'field-error'; error.id = field.name + '-error';
      label.appendChild(error);
      form.appendChild(label);
    });
    // US19: privacy notice and consent, shown above the Submit button
    var notice = document.createElement('p');
    notice.className = 'privacy-notice';
    notice.id = 'privacy-notice';
    notice.appendChild(document.createTextNode('Privacy: we use your details only to process this adoption application. They are shared only with ' + pet.shelter + ' and never sold. '));
    var policyLink = document.createElement('a');
    policyLink.href = 'privacy.html';
    policyLink.target = '_blank';
    policyLink.rel = 'noopener';
    policyLink.textContent = 'Read our Privacy Policy';
    notice.appendChild(policyLink);
    notice.appendChild(document.createTextNode('.'));
    form.appendChild(notice);

    var consentLabel = document.createElement('label');
    consentLabel.className = 'consent';
    consentLabel.htmlFor = 'consent';
    var consentBox = document.createElement('input');
    consentBox.type = 'checkbox'; consentBox.id = 'consent'; consentBox.name = 'consent';
    consentLabel.appendChild(consentBox);
    consentLabel.appendChild(document.createTextNode(' I agree to PawConnect collecting and using my personal information as described in the Privacy Policy. *'));
    form.appendChild(consentLabel);
    var consentError = document.createElement('span');
    consentError.className = 'field-error'; consentError.id = 'consent-error';
    form.appendChild(consentError);

    var submit = document.createElement('button');
    submit.className = 'button'; submit.type = 'submit'; submit.textContent = 'Submit application';
    form.appendChild(submit);
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var valid = true;
      fields.forEach(function (field) {
        var input = form.elements[field.name];
        var error = document.getElementById(field.name + '-error');
        error.textContent = '';
        if (!input.value.trim()) { error.textContent = 'This field is required.'; valid = false; }
        else if (field.name === 'email' && !input.validity.valid) { error.textContent = 'Enter a valid email address.'; valid = false; }
      });
      consentError.textContent = '';
      if (!consentBox.checked) {
        consentError.textContent = 'Please tick the box to give your consent before submitting.';
        valid = false;
      }
      if (!valid) return;
      var applications = getApplications();
      var application = {
        id: 'APP-' + String(Date.now()).slice(-6),
        petId: pet.id,
        petName: pet.name,
        applicant: form.elements.fullName.value.trim(),
        consentGiven: true,
        consentAt: new Date().toISOString()
      };
      applications.push(application);
      saveApplications(applications);
      area.innerHTML = '';
      var confirmation = document.createElement('p');
      confirmation.className = 'confirmation';
      confirmation.textContent = 'Application submitted successfully. Your confirmation number is ' + application.id + '.';
      area.appendChild(confirmation);
      renderSavedApplications();
    });
    panel.appendChild(form);
    area.appendChild(panel);
  }

  if (!isAvailable) {
    var note = document.createElement('p');
    note.className = 'availability-note';
    note.textContent = pet.status === 'Adopted' ? 'This pet is no longer available for adoption.' : 'This pet is currently reserved and cannot accept applications.';
    area.appendChild(note);
    return;
  }

  var applyButton = document.createElement('button');
  applyButton.className = 'button'; applyButton.type = 'button'; applyButton.textContent = 'Apply for Adoption';
  applyButton.addEventListener('click', showForm);
  area.appendChild(applyButton);
}());

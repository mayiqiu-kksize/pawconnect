// US5: adopters send an enquiry about a pet to its shelter from the pet profile.
(function () {
  var area = document.getElementById('enquiry-area');
  if (!area || typeof pet === 'undefined') return;

  var user = window.PawAuth ? PawAuth.getCurrentUser() : null;

  function field(name, labelText, type, value) {
    var label = document.createElement('label');
    label.htmlFor = 'enquiry-' + name;
    label.appendChild(document.createTextNode(labelText + ' *'));
    var input = type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
    input.id = 'enquiry-' + name;
    input.name = name;
    if (type !== 'textarea') input.type = type;
    if (value) input.value = value;
    label.appendChild(input);
    var error = document.createElement('span');
    error.className = 'field-error';
    error.id = 'enquiry-' + name + '-error';
    label.appendChild(error);
    return label;
  }

  function showForm() {
    area.innerHTML = '';
    var panel = document.createElement('section');
    panel.className = 'application-panel enquiry-panel';
    var heading = document.createElement('h2');
    heading.textContent = 'Ask ' + pet.shelter + ' about ' + pet.name;
    panel.appendChild(heading);
    var intro = document.createElement('p');
    intro.className = 'muted';
    intro.textContent = 'Send a question to the shelter before you decide to apply. The shelter replies by email and on PawConnect.';
    panel.appendChild(intro);

    var form = document.createElement('form');
    form.className = 'application-form';
    form.id = 'enquiry-form';
    form.noValidate = true;
    form.appendChild(field('name', 'Your name', 'text', user && user.role === 'adopter' ? user.name : ''));
    form.appendChild(field('email', 'Email', 'email', user && user.role === 'adopter' ? user.email : ''));
    form.appendChild(field('message', 'Your question about ' + pet.name, 'textarea', ''));

    // US19: the same privacy notice and consent as the application form.
    var notice = document.createElement('p');
    notice.className = 'privacy-notice';
    notice.appendChild(document.createTextNode('Privacy: we use your details only to answer this enquiry. They are shared only with ' + pet.shelter + ' and never sold. '));
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
    consentLabel.htmlFor = 'enquiry-consent';
    var consentBox = document.createElement('input');
    consentBox.type = 'checkbox';
    consentBox.id = 'enquiry-consent';
    consentLabel.appendChild(consentBox);
    consentLabel.appendChild(document.createTextNode(' I agree to PawConnect collecting and using my personal information as described in the Privacy Policy. *'));
    form.appendChild(consentLabel);
    var consentError = document.createElement('span');
    consentError.className = 'field-error';
    consentError.id = 'enquiry-consent-error';
    form.appendChild(consentError);

    var formError = document.createElement('p');
    formError.className = 'form-error';
    formError.id = 'enquiry-form-error';
    formError.setAttribute('role', 'alert');
    form.appendChild(formError);

    var actions = document.createElement('div');
    actions.className = 'form-actions';
    var send = document.createElement('button');
    send.className = 'button';
    send.type = 'submit';
    send.textContent = 'Send';
    actions.appendChild(send);
    var cancel = document.createElement('button');
    cancel.className = 'button button-secondary';
    cancel.type = 'button';
    cancel.textContent = 'Cancel';
    cancel.addEventListener('click', showButton);
    actions.appendChild(cancel);
    form.appendChild(actions);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var valid = true;
      var values = {};
      ['name', 'email', 'message'].forEach(function (name) {
        var input = form.elements[name];
        var error = document.getElementById('enquiry-' + name + '-error');
        values[name] = input.value.trim();
        error.textContent = '';
        input.setAttribute('aria-invalid', 'false');
        if (!values[name]) {
          // US5 AC3: an empty message cannot be sent.
          error.textContent = name === 'message' ? 'Please enter your question before sending.' : 'This field is required.';
        } else if (name === 'email' && !input.validity.valid) {
          error.textContent = 'Enter a valid email address.';
        }
        if (error.textContent) { valid = false; input.setAttribute('aria-invalid', 'true'); }
      });
      consentError.textContent = consentBox.checked ? '' : 'Please tick the box to give your consent before sending.';
      if (!consentBox.checked) valid = false;
      if (!valid) {
        formError.textContent = 'Your enquiry has not been sent. Please fix the fields marked above.';
        var first = form.querySelector('[aria-invalid="true"]') || consentBox;
        first.focus();
        return;
      }

      // US5 AC2: save the enquiry and confirm it.
      var now = new Date().toISOString();
      var enquiry = PawEnquiries.add({
        id: 'ENQ-' + String(Date.now()).slice(-6),
        petId: pet.id,
        petName: pet.name,
        shelter: pet.shelter,
        name: values.name,
        email: values.email,
        accountEmail: user && user.role === 'adopter' ? user.email : '',
        message: values.message,
        sentAt: now,
        consentGiven: true,
        consentAt: now
      });
      area.innerHTML = '';
      var confirmation = document.createElement('p');
      confirmation.className = 'confirmation';
      confirmation.id = 'enquiry-confirmation';
      confirmation.setAttribute('role', 'status');
      confirmation.textContent = 'Your enquiry about ' + pet.name + ' has been sent to ' + pet.shelter + '. Your reference number is ' + enquiry.id + '. The shelter will reply to ' + enquiry.email + '.';
      area.appendChild(confirmation);
    });

    panel.appendChild(form);
    area.appendChild(panel);
    form.elements[user && user.role === 'adopter' ? 'message' : 'name'].focus();
  }

  // US5 AC1: a "Contact Shelter" button on every pet profile opens the enquiry form.
  function showButton() {
    area.innerHTML = '';
    var text = document.createElement('p');
    text.className = 'muted enquiry-prompt';
    text.textContent = 'Have a question about ' + pet.name + '?';
    area.appendChild(text);
    var button = document.createElement('button');
    button.className = 'button button-secondary';
    button.type = 'button';
    button.id = 'contact-shelter';
    button.textContent = 'Contact Shelter';
    button.addEventListener('click', showForm);
    area.appendChild(button);
  }

  showButton();
}());

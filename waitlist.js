/* Mohlat founding waitlist — mailto only; no third-party host */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  var wl = $('waitlist');
  if (!wl) return;
  wl.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = ($('wl-name').value || '').trim();
    var email = ($('wl-email').value || '').trim();
    var pair = $('wl-pair').value;
    var channel = $('wl-channel').value;
    var wa = ($('wl-wa').value || '').trim();
    var err = $('wl-err');
    if (!email || email.indexOf('@') < 1) {
      if (err) { err.textContent = 'Please enter a valid email address.'; err.classList.remove('hidden'); }
      return;
    }
    if (err) err.classList.add('hidden');
    var lines = [
      'Hi, I would like to join the Mohlat founding waitlist.',
      '',
      'Name: ' + (name || '(not given)'),
      'Email: ' + email,
      'Country pair: ' + pair,
      'Preferred channel: ' + channel,
      'WhatsApp number (optional): ' + (wa || '(not given)'),
      '',
      'Plan interest: Free / Founding Plus (INR 699/yr or USD 19.99/yr) / Family (USD 34.99/yr)'
    ];
    window.location.href = 'mailto:shashankbhasin21@gmail.com'
      + '?subject=' + encodeURIComponent('Mohlat founding waitlist')
      + '&body=' + encodeURIComponent(lines.join('\n'));
  });
})();

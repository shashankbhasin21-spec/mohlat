/* Mohlat v0: everything runs in the browser. No network requests are made (see CSP connect-src 'none'). */
(function () {
  'use strict';
  var CHECKED = '28 Sep 2026';
  var STORE_KEY = 'mohlat.v0.saved';

  // Official sources. Every lead time on the timeline cites one of these.
  var S = {
    psp_expired: { t: 'Passport Seva: Has your Passport expired? (importance of a valid passport)', u: 'https://www.passportindia.gov.in/psp/PassportExpired',
      q: '“In order to travel abroad, your Passport must be valid at least for 6 months.” “It is advised to apply for a re-issue of Passport up to 1 year before the expiry!”' },
    psp_faq: { t: 'Passport Seva FAQ: Services Available (tabs “Validity Due to Expire” and “Validity Expired”)', u: 'https://www.passportindia.gov.in/psp/FaqServicesAvailable',
      q: 'Fresh police verification is required if you apply for re-issue more than three years after the old passport expired.' },
    psp_home: { t: 'Passport Seva (Ministry of External Affairs)', u: 'https://www.passportindia.gov.in/' },
    psp_mission: { t: 'Passport Seva portal for Indian Missions/Posts abroad (apply for re-issue from abroad)', u: 'https://mportal.passportindia.gov.in/mission/' },
    eoi_uae: { t: 'Embassy of India, Abu Dhabi: Passport Services', u: 'https://www.indembassyuae.gov.in/page-links/?page=passport-services&type=sub' },
    eoi_uae_notice: { t: 'Embassy of India, Abu Dhabi notice dated 21 July 2026: Outsourcing of Indian Consular, Passport, Visa & Attestation services in UAE (to Al Hind Tours & Travels w.e.f. 22 July 2026)', u: 'https://www.indembassyuae.gov.in/section/home-page-ticker/outsourcing-of-indian-consular-passport-visa-and-attestation-services-in-uae5/',
      q: '“The Indian Consular, Passport, Visa & Attestation services in the UAE have been outsourced to Al Hind Tours & Travels w.e.f. 22 July 2026. The services will be provided at 16 (sixteen) Indian Consular Application Centers (ICACs) located across UAE.” “The services will no longer be available at Embassy of India, Abu Dhabi or Consulate General of India, Dubai premises.” (Notice checked 30 Sep 2026.)' },
    cgi_dubai: { t: 'Consulate General of India, Dubai', u: 'https://www.cgidubai.gov.in/' },
    eoi_doha: { t: 'Embassy of India, Doha: Passport Information', u: 'https://indianembassyqatar.gov.in/eoidhpages?id=NQ%2C%2C&subid=OQ%2C%2C',
      q: '“All applicants are advised to submit their applications for renewal of passport upto 1 year before the Expiry Date.”' },
    eoi_usa: { t: 'Embassy of India, Washington DC: Passport Services', u: 'https://indianembassyusa.gov.in/pages/MjU',
      q: 'Re-issuance steps apply if “Your passport validity is Expiring within 1 year”. Check your consular jurisdiction on this page.' },
    icp_renew: { t: 'ICP (UAE): Renewal of residency permits', u: 'https://icp.gov.ae/en/services-details/?serviceid=64afe3c1035448005bd52e66',
      q: '“Passport valid for no less than 6 months.” Grace period after expiry: 180, 90, 60 or 30 days depending on category. “A fine of AED 50 will be charged for each day of stay in the country after the visa has expired or been cancelled.”' },
    gdrfa_renew: { t: 'GDRFA Dubai: Renewal of Residency Visa', u: 'https://www.gdrfad.gov.ae/en/services/71ea8dd8-56c3-11ea-0320-0050569629e8' },
    uae_gov: { t: 'u.ae (UAE Government portal): General provisions for the residence visa', u: 'https://u.ae/en/information-and-services/visa-and-emirates-id/Visa-information/general-provisions-for-the-residence-visa' },
    moi_qa: { t: 'Ministry of Interior, Qatar: e-services', u: 'https://portal.moi.gov.qa/wps/portal/MOIInternet/services' },
    moi_qa_rp: { t: 'Ministry of Interior, Qatar: Residency Permits inquiry (track RP renewal)', u: 'https://portal.moi.gov.qa/wps/portal/MOIInternet/services/inquiries/residencypermits' },
    moi_qa_metrash: { t: 'Ministry of Interior, Qatar: Metrash', u: 'https://portal.moi.gov.qa/wps/portal/MOIInternet/services/inquiries/metrash' },
    uscis_gc: { t: 'USCIS: Replace Your Green Card', u: 'https://www.uscis.gov/green-card/after-we-grant-your-green-card/replace-your-green-card',
      q: 'You must replace your Green Card if it “is either expired or will expire within the next six months”.' },
    uscis_i90: { t: 'USCIS: Form I-90', u: 'https://www.uscis.gov/i-90' },
    uscis_i751: { t: 'USCIS: Form I-751, Petition to Remove Conditions on Residence', u: 'https://www.uscis.gov/i-751',
      q: 'If filing jointly: “You must file your Form I-751 during the 90-day period immediately before your conditional residence expires.” Filing before that date may be rejected.' },
    uscis_i765: { t: 'USCIS: Form I-765, Application for Employment Authorization', u: 'https://www.uscis.gov/i-765',
      q: '“We generally recommend you file a Form I-765 to request a renewal Employment Authorization Document (EAD) up to 180 days before your current EAD expires.”' },
    uscis_i129: { t: 'USCIS: Form I-129, Petition for a Nonimmigrant Worker', u: 'https://www.uscis.gov/i-129',
      q: 'An extension of stay must be requested before the Form I-94 expiration date.' },
    uscis_i129_instr: { t: 'USCIS: Form I-129 Instructions (PDF)', u: 'https://www.uscis.gov/sites/default/files/document/forms/i-129instr.pdf',
      q: '“Generally, a Form I-129 petition may not be filed more than 6 months prior to the date employment is scheduled to begin.”' },
    uscis_i539: { t: 'USCIS: Form I-539, Application to Extend/Change Nonimmigrant Status', u: 'https://www.uscis.gov/i-539',
      q: 'You must apply “before your current authorized stay expires”. “We suggest you file at least 45 days before your stay expires.”' },
    cbp_i94: { t: 'U.S. Customs and Border Protection: I-94 official website', u: 'https://i94.cbp.dhs.gov/' },
    us_emb_in: { t: 'U.S. Embassy & Consulates in India (U.S. Department of State): Visas', u: 'https://in.usembassy.gov/visas/' }
  };

  var $ = function (id) { return document.getElementById(id); };

  // ---- date helpers (all dates are handled as UTC calendar dates) ----
  function parse(v) {
    if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
    var p = v.split('-').map(Number);
    var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    return (d.getUTCMonth() === p[1] - 1) ? d : null;
  }
  function iso(d) { return d.toISOString().slice(0, 10); }
  function addDays(d, n) { return new Date(d.getTime() + n * 86400000); }
  function addMonths(d, n) {
    var y = d.getUTCFullYear(), m = d.getUTCMonth() + n, day = d.getUTCDate();
    var last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    return new Date(Date.UTC(y, m, Math.min(day, last)));
  }
  function today() { var n = new Date(); return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate())); }
  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function fmt(d) { return d.getUTCDate() + ' ' + MON[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }
  function daysBetween(a, b) { return Math.round((b - a) / 86400000); }
  function rel(d) {
    var n = daysBetween(today(), d);
    if (n === 0) return 'today';
    var a = Math.abs(n), s;
    if (a < 60) s = a + (a === 1 ? ' day' : ' days');
    else if (a < 730) s = Math.round(a / 30.44) + ' months';
    else s = (a / 365.25).toFixed(1) + ' years';
    return n > 0 ? 'in ' + s : s + ' ago';
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // ---- UI: country pair toggles ----
  function syncPair() {
    var p = $('pair').value;
    $('fs-uae').classList.toggle('hidden', p !== 'uae');
    $('fs-qatar').classList.toggle('hidden', p !== 'qatar');
    $('fs-usa').classList.toggle('hidden', p !== 'usa');
  }

  function readForm() {
    return {
      who: $('who').value.trim().slice(0, 40),
      pair: $('pair').value,
      pp: $('pp').value,
      uaeDate: $('uae-date').value, uaeEm: $('uae-em').value, uaeCat: $('uae-cat').value,
      qaDate: $('qa-date').value,
      usType: $('us-type').value, usDate: $('us-date').value
    };
  }
  function fillForm(o) {
    $('who').value = o.who || '';
    $('pair').value = o.pair || 'uae';
    $('pp').value = o.pp || '';
    $('uae-date').value = o.uaeDate || ''; $('uae-em').value = o.uaeEm || 'icp'; $('uae-cat').value = o.uaeCat || 'unknown';
    $('qa-date').value = o.qaDate || '';
    $('us-type').value = o.usType || 'gc10'; $('us-date').value = o.usDate || '';
    syncPair();
  }

  // ---- the engine ----
  // Each item: {d: Date, kind: start|deadline|expiry|warning|check, title, detail, src: [ids], startLike: bool}
  function build(o) {
    var items = [], alerts = [], checklist = [];
    var P = parse(o.pp);
    var t = today();

    // Indian passport (applies to every pair)
    var mission = o.pair === 'uae' ? ['eoi_uae', 'eoi_uae_notice', 'cgi_dubai'] : o.pair === 'qatar' ? ['eoi_doha'] : ['eoi_usa'];
    var ppSrc = ['psp_expired'];
    if (o.pair === 'qatar') ppSrc.push('eoi_doha');
    if (o.pair === 'usa') ppSrc.push('eoi_usa');

    items.push({ d: addMonths(P, -12), kind: 'start', startLike: true, endD: P,
      title: 'Start your Indian passport re-issue',
      detail: 'Passport Seva advises applying for re-issue up to 1 year before expiry.' + (o.pair === 'qatar' ? ' The Embassy of India, Doha gives the same advice.' : '') + (o.pair === 'usa' ? ' The Embassy of India, Washington DC lists “expiring within 1 year” as a case for re-issue.' : '') + ' From abroad, you apply through the Indian Embassy/Consulate for where you live.' + (o.pair === 'uae' ? ' In the UAE, per the Embassy of India, Abu Dhabi notice effective 22 July 2026, passport, visa and attestation services are provided by Al Hind Tours & Travels at 16 Indian Consular Application Centers (ICACs) and are no longer available at the Embassy of India, Abu Dhabi or Consulate General of India, Dubai premises. Check the notice for centres and appointment booking.' : ''),
      src: ppSrc.concat(['psp_mission']) });
    items.push({ d: addMonths(P, -6), kind: 'deadline',
      title: 'Passport drops below 6 months validity',
      detail: 'Passport Seva: to travel abroad, your passport must be valid for at least 6 months. Aim to have the new passport before this date.',
      src: ['psp_expired'] });
    items.push({ d: P, kind: 'expiry', title: 'Indian passport expires', detail: 'Plan so that you are never without a valid passport.', src: ['psp_home'] });
    if (P < t) {
      alerts.push({ cls: 'note danger', html: '<strong>Your Indian passport has expired.</strong> Apply for re-issue now through the official channel for where you live. ' + srcLinks(['psp_mission'].concat(mission)) });
      items.push({ d: addMonths(P, 36), kind: 'check',
        title: '3 years after passport expiry',
        detail: 'Passport Seva FAQ: if you apply for re-issue more than three years after expiry, fresh police verification is required.',
        src: ['psp_faq'] });
    }
    checklist.push({ text: 'Indian passport: fill the re-issue form on the Passport Seva portal for missions abroad (or Passport Seva in India) and follow your Embassy/Consulate’s steps.', src: ['psp_mission'].concat(mission) });
    if (o.pair === 'uae') checklist.push({ text: 'UAE: from 22 July 2026 Indian passport, visa and attestation applications go to an Indian Consular Application Center (ICAC) run by Al Hind Tours & Travels, not the Embassy or Consulate premises (Embassy of India, Abu Dhabi notice dated 21 July 2026). Book an appointment as the notice describes.', src: ['eoi_uae_notice'] });

    if (o.pair === 'uae') {
      var V = parse(o.uaeDate);
      var auth = o.uaeEm === 'dxb' ? 'gdrfa_renew' : 'icp_renew';
      var authName = o.uaeEm === 'dxb' ? 'GDRFA Dubai' : 'ICP';
      items.push({ d: V, kind: 'check', startLike: true, endD: V,
        title: 'Plan your UAE residence visa renewal',
        detail: 'We did not find an official ' + authName + ' page stating how early you can start. Check the official page before this date' + (o.uaeEm === 'dxb' ? '.' : ' (ICP renewal is done on the ICP Smart Services website or app).') ,
        src: [auth], noDateRule: true });
      items.push({ d: V, kind: 'expiry', title: 'UAE residence visa expires', detail: 'Renew it before it expires to continue living legally in the UAE without fines (u.ae).', src: ['uae_gov'] });
      var cat = o.uaeCat;
      if (cat !== 'unknown') {
        var g = parseInt(cat, 10);
        items.push({ d: addDays(V, g), kind: 'deadline',
          title: 'Grace period ends (' + g + ' days for your selected category)',
          detail: 'ICP lists a ' + g + '-day grace period after expiry or cancellation for this category, and a fine of AED 50 for each day of stay after the visa has expired or been cancelled. Confirm how this applies to you on the official page.' + (o.uaeEm === 'dxb' ? ' Your visa is Dubai-issued, so also check GDRFA Dubai.' : ''),
          src: o.uaeEm === 'dxb' ? ['icp_renew', 'gdrfa_renew'] : ['icp_renew'] });
      } else {
        alerts.push({ cls: 'note', html: 'Grace period after expiry: ICP lists 30, 60, 90 or 180 days depending on your residence category, and a fine of AED 50 per day after that. Pick your category above to add the date. ' + srcLinks(['icp_renew']) });
      }
      // Cross-border rule: ICP requires passport valid >= 6 months for renewal.
      var need = addMonths(V, 6);
      if (P < need) {
        alerts.push({ cls: 'note danger', html: '<strong>Passport first.</strong> ICP lists “Passport valid for no less than 6 months” as a condition for renewing a residence permit. When your residence visa expires on <strong>' + fmt(V) + '</strong>, your passport (expires ' + fmt(P) + ') will have less than 6 months left. Get your new passport before you apply to renew your residence.' + (o.uaeEm === 'dxb' ? ' Your visa is Dubai-issued: confirm GDRFA Dubai’s requirement on its page.' : '') + ' ' + srcLinks(o.uaeEm === 'dxb' ? ['icp_renew', 'gdrfa_renew'] : ['icp_renew']) });
      } else {
        alerts.push({ cls: 'note', html: 'Passport check: on your residence expiry date (' + fmt(V) + ') your passport will still have 6 months or more left, which ICP lists as a condition for renewal. ' + srcLinks(['icp_renew']) });
      }
      checklist.push({ text: 'UAE residence: check requirements and fees on the ' + authName + ' page, then apply through its official website or app.', src: [auth] });
      checklist.push({ text: 'Keep the requirements for your residence category valid (ICP lists, for example, valid health insurance for many categories).', src: ['icp_renew'] });
    }

    if (o.pair === 'qatar') {
      var Q = parse(o.qaDate);
      items.push({ d: Q, kind: 'check', startLike: true, endD: Q,
        title: 'Plan your Qatar residence permit (QID) renewal',
        detail: 'We did not find an official Ministry of Interior page stating how early you can start or what passport validity is needed. Check Metrash / the MOI site before this date.',
        src: ['moi_qa_metrash', 'moi_qa'], noDateRule: true });
      items.push({ d: Q, kind: 'expiry', title: 'Qatar residence permit (QID) expires', detail: 'Check on the MOI site what applies after expiry. We have not listed any grace period because we did not find it on an official MOI page.', src: ['moi_qa'] });
      alerts.push({ cls: 'note', html: 'Before renewing your residence permit, check on Metrash or the MOI site whether your passport validity is enough. We did not find an official MOI page that states the rule, so Mohlat does not assume one. ' + srcLinks(['moi_qa_metrash']) });
      checklist.push({ text: 'Qatar residence permit: renew via Metrash or MOI e-services; track the renewal on the MOI Residency Permits inquiry page.', src: ['moi_qa_metrash', 'moi_qa_rp'] });
    }

    if (o.pair === 'usa') {
      var U = parse(o.usDate), ty = o.usType;
      if (ty === 'gc10') {
        items.push({ d: addMonths(U, -6), kind: 'start', startLike: true, endD: U, title: 'Green Card renewal window opens (Form I-90)', detail: 'USCIS: you must replace your Green Card if it has expired or will expire within the next six months.', src: ['uscis_gc', 'uscis_i90'] });
        items.push({ d: U, kind: 'expiry', title: 'Green Card expires', detail: 'Check USCIS for what an expired card means for travel and proof of status.', src: ['uscis_gc'] });
        checklist.push({ text: 'File Form I-90 with USCIS (read the form page first).', src: ['uscis_i90'] });
      } else if (ty === 'gc2') {
        items.push({ d: addDays(U, -90), kind: 'start', startLike: true, endD: U, title: 'Form I-751 filing window opens (if filing jointly)', detail: 'USCIS: if filing jointly, file during the 90-day period immediately before your conditional residence expires. Filing before that date may be rejected. Use the USCIS “When to File” page linked from the I-751 page to confirm the first day.', src: ['uscis_i751'] });
        items.push({ d: U, kind: 'deadline', title: 'Conditional residence expires: file I-751 before this date', detail: 'Waiver filings have different timing; see the USCIS I-751 page.', src: ['uscis_i751'] });
        checklist.push({ text: 'Prepare Form I-751 and evidence; confirm your 90-day window on USCIS.', src: ['uscis_i751'] });
      } else if (ty === 'ead') {
        items.push({ d: addDays(U, -180), kind: 'start', startLike: true, endD: U, title: 'EAD renewal: USCIS recommends filing from here', detail: 'USCIS generally recommends filing Form I-765 for a renewal EAD up to 180 days before your current EAD expires. Some categories have different rules; see the form page.', src: ['uscis_i765'] });
        items.push({ d: U, kind: 'expiry', title: 'EAD expires', detail: '', src: ['uscis_i765'] });
        checklist.push({ text: 'File Form I-765 (renewal) and check category-specific timing on USCIS.', src: ['uscis_i765'] });
      } else if (ty === 'h1b') {
        items.push({ d: addMonths(U, -6), kind: 'start', startLike: true, endD: U, title: 'Employer can generally file your extension from about here', detail: 'Form I-129 instructions: generally a petition may not be filed more than 6 months before employment is scheduled to begin. Ask your employer to plan the extension petition.', src: ['uscis_i129_instr'] });
        items.push({ d: U, kind: 'deadline', title: 'I-94 end date: extension must be filed before this', detail: 'USCIS I-129 page: an extension of stay must be requested before the Form I-94 expiration date. Check your latest I-94 on the CBP site.', src: ['uscis_i129', 'cbp_i94'] });
        checklist.push({ text: 'Download your most recent I-94 from CBP and confirm the end date.', src: ['cbp_i94'] });
        checklist.push({ text: 'Confirm with your employer when the I-129 extension will be filed.', src: ['uscis_i129'] });
      } else if (ty === 'i539') {
        items.push({ d: addDays(U, -45), kind: 'start', startLike: true, endD: U, title: 'File Form I-539 by about here (USCIS suggestion)', detail: 'USCIS suggests filing at least 45 days before your stay expires, or as soon as you know you need to extend or change status.', src: ['uscis_i539'] });
        items.push({ d: U, kind: 'deadline', title: 'I-94 end date: apply before this', detail: 'USCIS: you must apply for an extension or change of status before your current authorized stay expires. Check your latest I-94 on the CBP site.', src: ['uscis_i539', 'cbp_i94'] });
        checklist.push({ text: 'Download your most recent I-94 from CBP and confirm the end date.', src: ['cbp_i94'] });
        checklist.push({ text: 'Read the Form I-539 page and eligibility before filing.', src: ['uscis_i539'] });
      } else {
        items.push({ d: U, kind: 'check', startLike: true, endD: U, title: 'US visa stamp expires', detail: 'We are not showing a lead time because we did not verify one on an official page. Check the U.S. Embassy & Consulates in India visa page before any travel, and check your I-94 on the CBP site for how long you may stay.', src: ['us_emb_in', 'cbp_i94'], noDateRule: true });
        checklist.push({ text: 'Before travel, check visa appointment and renewal information on the U.S. Embassy & Consulates in India site.', src: ['us_emb_in'] });
      }
    }

    items.sort(function (a, b) { return a.d - b.d || rank(a) - rank(b); });
    return { items: items, alerts: alerts, checklist: checklist };
  }
  function rank(i) { return { start: 0, check: 1, warning: 2, deadline: 3, expiry: 4 }[i.kind] || 5; }

  function srcLinks(ids) {
    return '<span class="t-src">Official source: ' + ids.map(function (id) {
      return '<a href="' + esc(S[id].u) + '" rel="noopener">' + esc(S[id].t) + '</a>';
    }).join(' · ') + '</span>';
  }

  function badge(it) {
    var t = today();
    if (it.startLike && it.d <= t && (!it.endD || it.endD >= t)) return '<span class="badge now">Start now</span>';
    if (it.d < t) return '<span class="badge past">Date passed</span>';
    if (daysBetween(t, it.d) <= 30) return '<span class="badge soon">Within 30 days</span>';
    return '';
  }

  var last = null;
  function render(o) {
    var r = build(o);
    last = { o: o, r: r };
    $('out-h').textContent = (o.who ? o.who + ': ' : '') + 'your timeline';
    $('alerts').innerHTML = r.alerts.map(function (a) { return '<p class="' + a.cls + '">' + a.html + '</p>'; }).join('');
    $('tl').innerHTML = r.items.map(function (it) {
      return '<li class="k-' + it.kind + '"><div><span class="t-date">' + fmt(it.d) + '</span><span class="t-rel">' + rel(it.d) + '</span>' + badge(it) + '</div>' +
        '<div class="t-title">' + esc(it.title) + '</div>' +
        (it.detail ? '<div class="t-detail">' + esc(it.detail) + '</div>' : '') +
        (it.noDateRule ? '<div class="t-detail"><strong>Check the official page</strong> for when to start.</div>' : '') +
        srcLinks(it.src) + '</li>';
    }).join('');
    $('cl').innerHTML = r.checklist.map(function (c, i) {
      return '<li><input type="checkbox" id="c' + i + '"><label for="c' + i + '" class="inline">' + esc(c.text) + '</label> ' + srcLinks(c.src) + '</li>';
    }).join('');
    $('out').classList.remove('hidden');
  }

  function validate(o) {
    var errs = [];
    if (!parse(o.pp)) errs.push('Enter your Indian passport expiry date.');
    if (o.pair === 'uae' && !parse(o.uaeDate)) errs.push('Enter your UAE residence visa expiry date.');
    if (o.pair === 'qatar' && !parse(o.qaDate)) errs.push('Enter your Qatar residence permit (QID) expiry date.');
    if (o.pair === 'usa' && !parse(o.usDate)) errs.push('Enter the expiry / end date of your US document.');
    return errs;
  }

  // ---- storage (this browser only) ----
  function loadSaved() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; } }
  function storeSaved(a) { try { localStorage.setItem(STORE_KEY, JSON.stringify(a)); return true; } catch (e) { return false; } }
  var PAIRS = { uae: 'India–UAE', qatar: 'India–Qatar', usa: 'India–USA' };
  function renderSaved() {
    var a = loadSaved();
    $('saved-wrap').classList.toggle('hidden', a.length === 0);
    $('saved').innerHTML = a.map(function (o, i) {
      return '<div class="saved-item"><span>' + esc(o.who || 'Unnamed') + ' · ' + PAIRS[o.pair] + '</span><span><button type="button" class="secondary" data-load="' + i + '">Open</button> <button type="button" class="secondary" data-del="' + i + '">Delete</button></span></div>';
    }).join('');
  }

  // ---- calendar file (.ics), generated on device ----
  function icsDate(d) { return iso(d).replace(/-/g, ''); }
  function icsEsc(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
  function makeIcs() {
    if (!last) return;
    var now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//APEX HOLDING//Mohlat v0//EN', 'CALSCALE:GREGORIAN'];
    last.r.items.forEach(function (it, i) {
      var desc = it.detail + (it.noDateRule ? ' Check the official page for when to start.' : '') + '\nOfficial: ' + it.src.map(function (id) { return S[id].u; }).join(' ') + '\nInformation only, not legal advice. Confirm on the official site.';
      lines.push('BEGIN:VEVENT', 'UID:mohlat-' + icsDate(it.d) + '-' + i + '-' + Math.random().toString(36).slice(2) + '@mohlat', 'DTSTAMP:' + now,
        'DTSTART;VALUE=DATE:' + icsDate(it.d), 'DTEND;VALUE=DATE:' + icsDate(addDays(it.d, 1)),
        'SUMMARY:' + icsEsc('Mohlat: ' + (last.o.who ? last.o.who + ': ' : '') + it.title), 'DESCRIPTION:' + icsEsc(desc),
        'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEsc(it.title), 'TRIGGER:-P7D', 'END:VALARM', 'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mohlat-timeline.ics';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  // ---- wire up ----
  $('pair').addEventListener('change', syncPair);
  $('f').addEventListener('submit', function (e) {
    e.preventDefault();
    var o = readForm(), errs = validate(o);
    $('err').classList.toggle('hidden', errs.length === 0);
    $('err').textContent = errs.join(' ');
    if (errs.length) { $('out').classList.add('hidden'); return; }
    render(o);
    $('out').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('sample').addEventListener('click', function () {
    var t = today();
    fillForm({ who: 'Sample', pair: $('pair').value, pp: iso(addMonths(t, 14)), uaeDate: iso(addMonths(t, 10)), uaeEm: 'icp', uaeCat: '30', qaDate: iso(addMonths(t, 10)), usType: 'gc10', usDate: iso(addMonths(t, 8)) });
    $('f').requestSubmit ? $('f').requestSubmit() : $('f').dispatchEvent(new Event('submit', { cancelable: true }));
  });
  $('save').addEventListener('click', function () {
    if (!last) return;
    var a = loadSaved(), o = last.o;
    var idx = -1;
    a.forEach(function (x, i) { if ((x.who || '') === (o.who || '') && x.pair === o.pair) idx = i; });
    if (idx >= 0) a[idx] = o; else a.push(o);
    if (storeSaved(a)) { $('save').textContent = 'Saved on this device'; setTimeout(function () { $('save').textContent = 'Save in this browser'; }, 2000); }
    renderSaved();
  });
  $('ics').addEventListener('click', makeIcs);
  $('print').addEventListener('click', function () { window.print(); });
  $('saved').addEventListener('click', function (e) {
    var t = e.target, a = loadSaved();
    if (t.dataset.load) { fillForm(a[+t.dataset.load]); render(a[+t.dataset.load]); $('out').scrollIntoView({ behavior: 'smooth' }); }
    if (t.dataset.del) { a.splice(+t.dataset.del, 1); storeSaved(a); renderSaved(); }
  });
  $('wipe').addEventListener('click', function () {
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
    renderSaved();
  });

  // Source list at the bottom of the page.
  $('srclist').innerHTML = Object.keys(S).map(function (k) {
    return '<li><a href="' + esc(S[k].u) + '" rel="noopener">' + esc(S[k].t) + '</a>' + (S[k].q ? '<br><span class="small">' + esc(S[k].q) + '</span>' : '') + '</li>';
  }).join('');

  syncPair();
  renderSaved();
  window.__mohlat = { build: build, parse: parse, S: S, CHECKED: CHECKED };
})();

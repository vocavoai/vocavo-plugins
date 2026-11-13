// Inventory of one rendered page for a migration: sections, calls to action, forms, modals, embeds, tracking, fonts,
// colours, legal links, placeholders and broken-looking links. Paste it into any browser console or a browser tool's
// "evaluate JavaScript" (it returns a JSON string), or let inspect-page.py run it. Reads only, changes nothing.
(() => {
  const text = (el) => (el ? (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim() : '');
  const short = (value, max = 160) => (value.length > max ? value.slice(0, max - 1) + '…' : value);
  const abs = (href) => { try { return new URL(href, location.href).href; } catch (e) { return href || ''; } };
  const host = (href) => { try { return new URL(href, location.href).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
  const visible = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
  const top = (el) => Math.round(el.getBoundingClientRect().top + window.scrollY);
  const rgbToHex = (value) => {
    const m = String(value).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m) return value;
    if (m[4] !== undefined && Number(m[4]) === 0) return 'transparent';
    return '#' + [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('');
  };
  const style = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      font_family: s.fontFamily, font_size: s.fontSize, font_weight: s.fontWeight, line_height: s.lineHeight,
      letter_spacing: s.letterSpacing, text_transform: s.textTransform, color: rgbToHex(s.color),
      background: rgbToHex(s.backgroundColor), background_image: s.backgroundImage !== 'none' ? short(s.backgroundImage, 200) : null,
      border_radius: s.borderRadius, padding: s.padding, box_shadow: s.boxShadow !== 'none' ? s.boxShadow : null,
    };
  };

  const PAYMENT = /(buy\.stripe\.com|checkout\.stripe\.com|paypal\.(com|me)|digistore24|copecart|ablefy|elopage|thrivecart|samcart|gumroad|lemonsqueezy|paddle\.com|kajabi|shopify|checkout)/i;
  const BOOKING = /(calendly\.com|meetings[-\w]*\.hubspot\.com|hubspot\.com\/meetings|cal\.com|tidycal|acuityscheduling|youcanbook\.me|zcal\.co|savvycal|doctolib|etermin|simplybook|termin)/i;
  const CHAT = /(wa\.me|whatsapp|t\.me\/|m\.me\/|messenger\.com)/i;
  const LEGAL = /(impressum|imprint|datenschutz|privacy|agb|terms|widerruf|cookie)/i;
  const PLACEHOLDER = /(\[[^\]]{3,80}\]|lorem ipsum|enter [^.]{0,40} here|hier (eintragen|einfügen)|your (text|headline) here|platzhalter|xxx+|todo)/i;

  const MODALISH = /popup|popover|overlay|modal|dialog|lightbox/i;
  const attrs = (el) => Array.from(el.attributes || []).map((a) => a.name + '=' + a.value).join(' ');
  const opensModal = (el) => MODALISH.test(attrs(el)) || !!el.getAttribute('aria-haspopup');
  const classify = (el, href) => {
    const raw = (el.getAttribute('href') || '').trim();
    if (opensModal(el)) return 'modal';
    if (el.tagName === 'BUTTON' || raw === '') return el.closest('form') ? 'form-submit' : 'button';
    if (raw === '#' || /^javascript:/i.test(raw)) return 'placeholder';
    if (raw.startsWith('#')) return 'anchor';
    if (/^mailto:/i.test(raw)) return 'mailto';
    if (/^tel:/i.test(raw)) return 'tel';
    if (PAYMENT.test(href)) return 'payment';
    if (BOOKING.test(href)) return 'booking';
    if (CHAT.test(href)) return 'chat';
    if (LEGAL.test(href) || LEGAL.test(text(el))) return 'legal';
    return host(href) === host(location.href) ? 'internal' : 'external';
  };

  const ctaLike = (el) => {
    if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') return true;
    const s = getComputedStyle(el);
    const cls = (el.className && String(el.className)) || '';
    return /btn|button|cta/i.test(cls) || (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.display.includes('block')) || s.borderRadius !== '0px';
  };

  // Sections: the direct big children of main/body, in order, with their first heading.
  // Page builders nest deeply: descend into the tallest child while a level has fewer than three big children.
  const big = (el) => Array.from(el.children).filter((c) => visible(c) && c.getBoundingClientRect().height > 80);
  let level = document.querySelector('main') || document.body;
  for (let depth = 0; depth < 12 && big(level).length < 3 && big(level).length > 0; depth++) {
    level = big(level).sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0];
  }
  const sections = big(level).map((el, index) => {
    const heading = el.querySelector('h1, h2, h3, h4, h5');
    // The painted background often sits on a layer inside the section (page builders).
    const layers = [el, ...Array.from(el.querySelectorAll('*')).slice(0, 40)].filter((c) => c.getBoundingClientRect().height >= el.getBoundingClientRect().height * 0.8);
    const painted = layers.find((c) => rgbToHex(getComputedStyle(c).backgroundColor) !== 'transparent' || getComputedStyle(c).backgroundImage !== 'none') || el;
    return {
      index, tag: el.tagName.toLowerCase(), id: el.id || null, top: top(el), height: Math.round(el.getBoundingClientRect().height),
      heading: heading ? short(text(heading)) : null, first_text: short(text(el), 100), background: rgbToHex(getComputedStyle(painted).backgroundColor),
      background_image: getComputedStyle(painted).backgroundImage !== 'none' ? short(getComputedStyle(painted).backgroundImage, 200) : null,
      words: text(el).split(' ').filter(Boolean).length, images: el.querySelectorAll('img').length,
      ctas: el.querySelectorAll('a, button').length, forms: el.querySelectorAll('form').length,
    };
  });

  const ctas = Array.from(document.querySelectorAll('a[href], a:not([href]), button, [role="button"]'))
    .filter((el) => text(el) !== '' || el.querySelector('img, svg'))
    .map((el) => {
      const href = el.tagName === 'A' ? abs(el.getAttribute('href') || '') : '';
      return {
        text: short(text(el) || (el.querySelector('img') ? '[image] ' + (el.querySelector('img').alt || '') : '[icon]'), 100),
        href: el.getAttribute('href'), kind: classify(el, href), target: el.getAttribute('target'),
        opens_modal: opensModal(el), modal_target: opensModal(el) ? (Array.from(el.attributes).filter((a) => MODALISH.test(a.name) && a.value).map((a) => a.value)[0] || el.getAttribute('href')) : null,
        button_like: ctaLike(el), visible: visible(el), top: visible(el) ? top(el) : null,
        section: sections.findIndex((s) => visible(el) && top(el) >= s.top && top(el) < s.top + s.height),
      };
    });

  const formProvider = (form) => {
    const html = form.outerHTML.slice(0, 4000) + ' ' + (form.action || '');
    const known = [['hubspot', /hs-form|hubspot|hsforms/i], ['klicktipp', /klicktipp|klick-tipp/i], ['mailchimp', /mailchimp|list-manage/i],
      ['fluent-forms', /fluentform/i], ['activecampaign', /activecampaign|activehosted/i], ['brevo', /sendinblue|brevo|sibforms/i], ['convertkit', /convertkit|ck\.page|kit\.com/i],
      ['getresponse', /getresponse/i], ['quentn', /quentn/i], ['cleverreach', /cleverreach/i], ['elementor', /elementor/i],
      ['contact-form-7', /wpcf7/i], ['gravity', /gform/i], ['wpforms', /wpforms/i], ['typeform', /typeform/i], ['jotform', /jotform/i]];
    const hit = known.find(([, pattern]) => pattern.test(html));
    return hit ? hit[0] : 'unknown';
  };
  const labelFor = (input) => {
    if (input.id) { const l = document.querySelector(`label[for="${CSS.escape(input.id)}"]`); if (l) return text(l); }
    const wrap = input.closest('label'); if (wrap) return text(wrap);
    return input.getAttribute('aria-label') || input.getAttribute('placeholder') || '';
  };
  const modalOf = (el) => { let e = el.parentElement; while (e && e !== document.body) { if (e.getAttribute('role') === 'dialog' || MODALISH.test(String(e.className) + ' ' + e.id + ' ' + Array.from(e.attributes).filter((a) => a.name.startsWith('data-')).map((a) => a.name + '=' + a.value).join(' '))) return e; e = e.parentElement; } return null; };
  const forms = Array.from(document.querySelectorAll('form, .hs-form, .hbspt-form, [class*="klaviyo-form"]')).map((form) => {
    const modal = modalOf(form);
    const heading = (form.closest('section, div') || form).querySelector('h1, h2, h3, h4');
    return {
      action: form.getAttribute ? form.getAttribute('action') : null, method: form.getAttribute ? form.getAttribute('method') : null,
      provider: formProvider(form), heading: heading ? short(text(heading)) : null,
      in_modal: !!modal, modal_id: modal ? (modal.id || null) : null, visible: visible(form),
      submit: short(text(form.querySelector('[type="submit"], button')) || (form.querySelector('[type="submit"]') || {}).value || '', 80),
      fields: Array.from(form.querySelectorAll('input, select, textarea')).filter((i) => !['submit', 'button', 'image', 'reset'].includes((i.type || '').toLowerCase()))
        .map((i) => ({
          name: i.name || i.id || null, type: (i.tagName === 'INPUT' ? i.type : i.tagName).toLowerCase(), label: short(labelFor(i), 120),
          required: i.required || i.getAttribute('aria-required') === 'true', hidden: (i.type || '').toLowerCase() === 'hidden',
          value: (i.type || '').toLowerCase() === 'hidden' ? short(i.value || '', 80) : undefined,
          options: i.tagName === 'SELECT' ? Array.from(i.options).map((o) => short(o.text, 80)) : undefined,
        })),
    };
  });

  const modals = Array.from(new Set(Array.from(document.querySelectorAll('form')).map(modalOf).filter(Boolean).concat(Array.from(document.querySelectorAll('[role="dialog"], .modal, .popup, .elementor-popup-modal, .pum')))))
    .map((m) => ({ id: m.id || null, heading: short(text(m.querySelector('h1, h2, h3, h4')) || ''), has_form: !!m.querySelector('form'), text: short(text(m), 240) }));

  const embeds = Array.from(document.querySelectorAll('iframe, video, [data-src*="youtube"], [data-src*="vimeo"], .wistia_embed, [class*="vidyard"]')).map((el) => {
    const src = el.getAttribute('src') || el.getAttribute('data-src') || (el.querySelector && el.querySelector('source') ? el.querySelector('source').src : '') || '';
    const kind = /youtu/i.test(src) ? 'youtube' : /vimeo/i.test(src) ? 'vimeo' : /wistia/i.test(src + el.className) ? 'wistia' : /google\.com\/maps/i.test(src) ? 'map'
      : /calendly|hubspot|cal\.com/i.test(src) ? 'booking' : el.tagName === 'VIDEO' ? 'video-file' : 'iframe';
    return { kind, src: abs(src), title: el.getAttribute('title'), width: Math.round(el.getBoundingClientRect().width), top: visible(el) ? top(el) : null };
  });

  const scripts = Array.from(document.scripts).map((s) => s.src || short(s.textContent || '', 400)).join('\n');
  const TRACKING = [
    ['google-tag-manager', /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]+/], ['google-analytics', /gtag\/js\?id=G-|G-[A-Z0-9]{6,}|google-analytics\.com/],
    ['google-ads', /AW-\d{6,}|googleadservices|conversion\.js/], ['meta-pixel', /connect\.facebook\.net|fbq\(/], ['tiktok-pixel', /analytics\.tiktok\.com|ttq\./],
    ['linkedin-insight', /snap\.licdn\.com|_linkedin_partner_id/], ['hotjar', /hotjar/], ['microsoft-clarity', /clarity\.ms/], ['pinterest-tag', /pintrk|s\.pinimg\.com\/ct/],
    ['hubspot-tracking', /js\.hs-scripts\.com|js\.hs-analytics\.net/], ['matomo', /matomo|piwik/], ['cookie-banner', /cookiebot|usercentrics|borlabs|complianz|cookieyes|onetrust|klaro/i],
  ];
  const ids = (pattern) => Array.from(new Set((scripts.match(new RegExp(pattern, 'g')) || [])));
  const tracking = TRACKING.filter(([, pattern]) => pattern.test(scripts)).map(([name]) => ({
    name, ids: name === 'google-analytics' ? ids('G-[A-Z0-9]{6,}') : name === 'google-ads' ? ids('AW-\\d{6,}') : name === 'google-tag-manager' ? ids('GTM-[A-Z0-9]+')
      : name === 'meta-pixel' ? ids("fbq\\(['\"]init['\"],\\s*['\"]\\d+") .map((v) => v.replace(/\D/g, '')) : [],
  }));

  const headingStyles = {};
  ['h1', 'h2', 'h3'].forEach((tag) => { const el = Array.from(document.querySelectorAll(tag)).find(visible); if (el) headingStyles[tag] = { text: short(text(el), 100), ...style(el) }; });
  const buttons = ctas.filter((c) => c.button_like && c.visible).slice(0, 6);
  const buttonEls = Array.from(document.querySelectorAll('a, button')).filter((el) => visible(el) && ctaLike(el) && text(el)).slice(0, 6);
  const fontsLoaded = document.fonts ? Array.from(document.fonts).filter((f) => f.status === 'loaded').map((f) => `${f.family.replace(/"/g, '')} ${f.weight} ${f.style}`) : [];
  const fontSources = Array.from(document.querySelectorAll('link[href*="fonts.googleapis"], link[href*="typekit"], link[href*="fonts.bunny"], link[rel="preload"][as="font"]')).map((l) => l.href);

  const images = Array.from(document.images).filter((img) => img.currentSrc || img.src).map((img) => ({
    src: img.currentSrc || img.src, alt: img.alt, width: img.naturalWidth, height: img.naturalHeight, top: visible(img) ? top(img) : null,
    hint: /logo/i.test(img.src + img.alt + img.className) ? 'logo' : img.closest('[class*="testimonial"], [class*="review"], blockquote') ? 'testimonial' : null,
  }));
  const backgrounds = Array.from(document.querySelectorAll('body *')).filter((el) => getComputedStyle(el).backgroundImage.includes('url(') && visible(el))
    .map((el) => ({ src: abs((getComputedStyle(el).backgroundImage.match(/url\(["']?([^"')]+)/) || [])[1] || ''), top: top(el), background: true }));

  const testimonials = Array.from(document.querySelectorAll('blockquote, [class*="testimonial"], [class*="review"]')).filter(visible)
    .map((el) => short(text(el), 300)).filter((t, i, all) => t && all.indexOf(t) === i).slice(0, 40);

  // Placeholders also in hidden parts (popups) and in attributes; `hidden` says whether a visitor sees it right away.
  const placeholders = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const value = node.nodeValue.trim();
    if (value && PLACEHOLDER.test(value) && node.parentElement && !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentElement.tagName)) placeholders.push({ text: short(value, 200), hidden: !visible(node.parentElement) });
  }
  document.querySelectorAll('[placeholder], [alt], [title], input[value]').forEach((el) => ['placeholder', 'alt', 'title', 'value'].forEach((name) => {
    const value = el.getAttribute(name);
    if (value && PLACEHOLDER.test(value)) placeholders.push({ text: short(value, 200), attribute: name, hidden: !visible(el) });
  }));

  const numbers = Array.from(new Set((text(document.body).match(/(\d[\d.,]*\s?(%|€|EUR|\+|Kunden|Teilnehmer|Jahre|Sterne|Bewertungen|students|clients|years))/gi) || []))).slice(0, 60);

  return JSON.stringify({
    url: location.href, title: document.title, lang: document.documentElement.lang || null,
    description: (document.querySelector('meta[name="description"]') || {}).content || null,
    og_image: (document.querySelector('meta[property="og:image"]') || {}).content || null,
    robots: (document.querySelector('meta[name="robots"]') || {}).content || null,
    viewport: { width: window.innerWidth, height: window.innerHeight, page_height: document.documentElement.scrollHeight },
    sections, ctas, forms, modals, embeds, tracking,
    styles: { body: style(document.body), headings: headingStyles, links: style(Array.from(document.querySelectorAll('p a, li a')).find(visible) || null),
      buttons: buttonEls.map((el) => ({ text: short(text(el), 60), ...style(el) })), fonts_loaded: fontsLoaded, font_sources: fontSources },
    images, backgrounds, testimonials, placeholders: placeholders.filter((p, i, all) => all.findIndex((q) => q.text === p.text) === i),
    numbers_on_page: numbers,
    legal_links: ctas.filter((c) => c.kind === 'legal').map((c) => ({ text: c.text, href: c.href })),
    problems: {
      placeholder_links: ctas.filter((c) => c.kind === 'placeholder').map((c) => c.text),
      buttons_without_target: buttons.filter((c) => c.kind === 'button').map((c) => c.text),
    },
  });
})();

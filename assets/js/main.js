(function () {
  'use strict';

  var cfg = window.VIA_CERTA || {};
  var g = cfg.google || {};
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var isPhone = window.matchMedia('(max-width: 720px)');

  function waLink(msg) {
    return 'https://wa.me/' + (cfg.whatsapp || '5554999821015') + (msg ? '?text=' + encodeURIComponent(msg) : '');
  }

  /* ---------- Links do WhatsApp com mensagem pronta ---------- */
  $$('[data-wa]').forEach(function (el) {
    el.href = waLink(el.getAttribute('data-wa'));
  });

  /* ---------- Área do Assinante (dialog) ---------- */
  var sheet = $('#area-cliente');

  function openCliente() {
    closeMenu();
    if (sheet && typeof sheet.showModal === 'function') sheet.showModal();
    else if (cfg.areaClienteUrl) window.location.href = cfg.areaClienteUrl;
  }

  $$('[data-open-cliente]').forEach(function (el) { el.addEventListener('click', openCliente); });

  if (sheet) {
    $$('[data-close-sheet]', sheet).forEach(function (el) {
      el.addEventListener('click', function () { sheet.close(); });
    });
    // Fecha ao tocar fora do painel
    sheet.addEventListener('click', function (e) {
      if (e.target === sheet) sheet.close();
    });
  }

  /* ---------- Links configuráveis ---------- */
  var app = cfg.app || {};
  var isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
  var segundaVia = cfg.segundaViaUrl || cfg.areaClienteUrl ||
    waLink('Olá! Sou cliente da Via Certa Internet e preciso da 2ª via da minha fatura.');
  var avaliar = g.placeId
    ? 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(g.placeId)
    : g.mapsUrl;

  var links = {
    areaCliente: cfg.areaClienteUrl,
    segundaVia: segundaVia,
    testeVelocidade: cfg.testeVelocidadeUrl,
    googleMaps: g.mapsUrl,
    googleAvaliar: avaliar,
    appAndroid: app.android,
    appIos: app.ios,
    // No painel do assinante, leva direto à loja do aparelho
    appAuto: isApple ? (app.ios || app.android) : (app.android || app.ios),
    instagram: cfg.redes && cfg.redes.instagram,
    facebook: cfg.redes && cfg.redes.facebook,
    tiktok: cfg.redes && cfg.redes.tiktok
  };

  $$('[data-link]').forEach(function (el) {
    var url = links[el.getAttribute('data-link')];
    if (url) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener';
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  });

  $$('[data-requires]').forEach(function (el) {
    if (!links[el.getAttribute('data-requires')]) el.hidden = true;
  });

  /* ---------- Menu mobile ---------- */
  var toggle = $('.nav-toggle');
  var menu = $('#menu');

  function closeMenu() {
    if (!menu || !menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      document.body.classList.toggle('menu-open', open);
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080) closeMenu(); });
  }

  /* ---------- Destaque do menu conforme a seção visível ---------- */
  var navLinks = $$('.nav__list a[href^="#"]');
  if ('IntersectionObserver' in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('is-active'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Planos: carrossel no celular ---------- */
  var plansGrid = $('[data-plans]');
  var planBtns = $$('[data-plan-go]');

  function planOffset(card) {
    return card.offsetLeft - (plansGrid.clientWidth - card.offsetWidth) / 2;
  }

  function markPlan(index) {
    planBtns.forEach(function (b, i) {
      if (i === index) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
  }

  if (plansGrid && planBtns.length) {
    var cards = $$('.plan', plansGrid);

    planBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = cards[Number(btn.getAttribute('data-plan-go'))];
        plansGrid.scrollTo({ left: planOffset(card), behavior: 'smooth' });
      });
    });

    // Atualiza o botão ativo conforme o cartão centralizado
    var ticking = false;
    plansGrid.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var center = plansGrid.scrollLeft + plansGrid.clientWidth / 2;
        var best = 0;
        cards.forEach(function (c, i) {
          var mid = c.offsetLeft + c.offsetWidth / 2;
          var bestMid = cards[best].offsetLeft + cards[best].offsetWidth / 2;
          if (Math.abs(mid - center) < Math.abs(bestMid - center)) best = i;
        });
        markPlan(best);
        ticking = false;
      });
    }, { passive: true });

    // No celular, abre no plano em destaque com os vizinhos aparecendo nas bordas
    function centerFeatured() {
      if (!isPhone.matches) return;
      var featured = $('.plan--featured', plansGrid);
      if (featured) plansGrid.scrollLeft = planOffset(featured);
    }
    centerFeatured();
    window.addEventListener('load', centerFeatured);
  }

  /* ---------- Avaliações do Google ao vivo (Places API New) ---------- */
  var track = $('[data-reviews]');

  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function starsHtml(n) {
    var html = '';
    for (var i = 0; i < 5; i++) {
      html += '<svg' + (i < Math.round(n) ? '' : ' style="opacity:.25"') + '><use href="#i-star"/></svg>';
    }
    return '<span class="stars" role="img" aria-label="' + n + ' de 5 estrelas">' + html + '</span>';
  }

  function renderLive(place) {
    var nota = Number(place.rating || 5).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    $$('[data-g-nota]').forEach(function (el) { el.textContent = nota; });
    if (place.userRatingCount) $$('[data-g-total]').forEach(function (el) { el.textContent = place.userRatingCount; });
    var quando = $('[data-g-quando]');
    if (quando) quando.textContent = 'ao vivo';

    var reviews = (place.reviews || []).filter(function (r) { return r.text; });
    if (!reviews.length) return;

    var tones = ['', ' review__avatar--dark', ' review__avatar--wine', ' review__avatar--gray'];
    track.innerHTML = reviews.map(function (r, i) {
      var a = r.authorAttribution || {};
      var name = esc(a.displayName);
      var avatar = a.photoURI
        ? '<img src="' + esc(a.photoURI) + '" alt="" loading="lazy" referrerpolicy="no-referrer">'
        : esc((a.displayName || '?').charAt(0).toUpperCase());
      var nameHtml = a.uri ? '<a href="' + esc(a.uri) + '" target="_blank" rel="noopener">' + name + '</a>' : name;
      return '<article class="review">' +
        '<div class="review__head">' +
          '<span class="review__avatar' + tones[i % tones.length] + '">' + avatar + '</span>' +
          '<div class="review__who"><p class="review__name">' + nameHtml + '</p>' +
          '<p class="review__when">' + esc(r.relativePublishTimeDescription || 'Avaliação no Google') + '</p></div>' +
          '<svg class="review__g" aria-hidden="true"><use href="#i-google"/></svg>' +
        '</div>' +
        starsHtml(r.rating || 5) +
        '<p class="review__text">' + esc(r.text) + '</p>' +
      '</article>';
    }).join('');

    var source = $('[data-reviews-source]');
    if (source) source.textContent = 'Avaliações fornecidas pelo Google';
  }

  function loadLiveReviews() {
    window.__vcMapsReady = function () {
      google.maps.importLibrary('places').then(function (lib) {
        var place = new lib.Place({ id: g.placeId, requestedLanguage: 'pt-BR' });
        return place.fetchFields({ fields: ['rating', 'userRatingCount', 'reviews'] }).then(function () {
          renderLive(place);
        });
      }).catch(function (err) {
        // Mantém as avaliações escritas no HTML se a API falhar
        if (window.console) console.warn('Avaliações do Google indisponíveis:', err);
      });
    };
    var s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(g.apiKey) +
      '&v=weekly&loading=async&libraries=places&language=pt-BR&callback=__vcMapsReady';
    s.async = true;
    document.head.appendChild(s);
  }

  if (g.apiKey && g.placeId && track) {
    // Carrega a API só quando a seção de avaliações estiver perto da tela
    if ('IntersectionObserver' in window) {
      var lazy = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { lazy.disconnect(); loadLiveReviews(); }
      }, { rootMargin: '600px 0px' });
      lazy.observe(track);
    } else {
      loadLiveReviews();
    }
  }

  // Setas do carrossel de avaliações
  function scrollReviews(dir) {
    var card = track && track.querySelector('.review');
    if (!card) return;
    var step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 24);
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  }
  var prev = $('[data-reviews-prev]');
  var next = $('[data-reviews-next]');
  if (prev) prev.addEventListener('click', function () { scrollReviews(-1); });
  if (next) next.addEventListener('click', function () { scrollReviews(1); });

  /* ---------- Mapa sob demanda ---------- */
  var mapBtn = $('[data-map-load]');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var box = $('[data-map]');
      var frame = document.createElement('iframe');
      frame.title = 'Mapa da loja Via Certa Internet em Nova Araçá';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.src = 'https://maps.google.com/maps?q=Viacerta%20Bitcom%20-%20Nova%20Ara%C3%A7%C3%A1&ll=-28.6588271,-51.7441465&z=16&hl=pt-BR&output=embed';
      box.innerHTML = '';
      box.appendChild(frame);
    });
  }

  /* ---------- Formulários → WhatsApp ---------- */
  function maskPhone(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  $$('[data-mask="phone"]').forEach(function (input) {
    input.addEventListener('input', function () { input.value = maskPhone(input.value); });
  });

  function validate(form) {
    var firstInvalid = null;
    $$('input, select', form).forEach(function (el) {
      var wrap = el.type === 'checkbox' ? el.closest('.check') : el.closest('.field');
      var ok = el.type === 'checkbox' ? el.checked : el.value.trim() !== '';
      if (ok && el.getAttribute('data-mask') === 'phone') ok = el.value.replace(/\D/g, '').length >= 10;
      if (!el.required) ok = true;
      if (wrap) wrap.classList.toggle('is-invalid', !ok);
      if (!ok && !firstInvalid) firstInvalid = el;
    });
    var error = $('.form-error', form);
    if (firstInvalid) {
      error.textContent = 'Confira os campos destacados para continuar.';
      error.hidden = false;
      firstInvalid.focus();
      return false;
    }
    error.hidden = true;
    return true;
  }

  var builders = {
    indicacao: function (f) {
      return [
        'Olá! Quero fazer uma indicação no *Indique e Ganhe* da Via Certa Internet.',
        '',
        '*Quem indica*',
        'Nome: ' + f.nome.value.trim(),
        'WhatsApp: ' + f.telefone.value.trim(),
        '',
        '*Amigo indicado*',
        'Nome: ' + f.amigo.value.trim(),
        'WhatsApp: ' + f.amigoTelefone.value.trim(),
        'Cidade: ' + f.cidade.value,
        '',
        '✔ Sou cliente ativo da Via Certa Internet.',
        '✔ Tenho autorização da pessoa indicada para compartilhar os dados.'
      ].join('\n');
    },
    cobertura: function (f) {
      return [
        'Olá! Quero saber se a Via Certa Internet atende o meu endereço.',
        '',
        'Nome: ' + f.nome.value.trim(),
        'Endereço: ' + f.rua.value.trim() + ', ' + f.numero.value.trim() + ' – ' + f.bairro.value.trim(),
        'Cidade: ' + f.cidade.value.trim(),
        'WhatsApp: ' + f.telefone.value.trim()
      ].join('\n');
    }
  };

  $$('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var url = waLink(builders[form.getAttribute('data-form')](form.elements));

      // Deixa um botão de reserva caso o navegador bloqueie a abertura automática
      var done = $('.form-done', form);
      if (done) {
        $('[data-form-wa]', done).href = url;
        done.hidden = false;
      }
      var win = window.open(url, '_blank');
      if (win) win.opener = null;
    });
    form.addEventListener('input', function (e) {
      var wrap = e.target.closest('.field, .check');
      if (wrap) wrap.classList.remove('is-invalid');
    });
  });

  /* ---------- Esconde a barra inferior enquanto a pessoa digita (teclado aberto) ---------- */
  document.addEventListener('focusin', function (e) {
    if (e.target.matches('input:not([type="checkbox"]), select, textarea')) document.body.classList.add('is-typing');
  });
  document.addEventListener('focusout', function () {
    document.body.classList.remove('is-typing');
  });

  /* ---------- Ano no rodapé ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

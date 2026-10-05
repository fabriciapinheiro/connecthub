/* ============================================================
   FABRÍCIA PINHEIRO · script compartilhado
   Usado por: index.html, materiais.html, pdi.html, curriculo.html, recrutamento.html
   ============================================================ */

// Nav: borda ao rolar
const nav = document.getElementById('siteNav');
const root = document.documentElement;

/* ---------- BARRA LATERAL · mapa do site ----------
   Montada aqui para ficar igual em todas as páginas.
   Para incluir uma página nova, acrescente um item em SITE_MAP. */
const SITE_MAP = [
  { label: 'Para você', links: [
    { href: 'curriculo.html', text: 'Currículo e LinkedIn', icon: 'doc' },
  ]},
  { label: 'Para empresas', links: [
    { href: 'recrutamento.html', text: 'Recrutamento & Seleção', icon: 'search' },
    { href: 'index.html#servicos', text: 'Todos os serviços', icon: 'grid' },
  ]},
  { label: 'Materiais', links: [
    { href: 'materiais.html', text: 'Materiais e cursos', icon: 'book' },
    { href: 'pdi.html', text: 'PDI que sai do papel', icon: 'target' },
  ]},
];
const SIDE_ICONS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21a2 2 0 0 1 2-2h13"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  insta: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
};
const sideIcon = name =>
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + SIDE_ICONS[name] + '</svg>';

let side = null, setSide = () => {};
if (nav) {
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const link = l => {
    const current = !l.href.includes('#') && l.href === page;
    return '<a class="side-link' + (current ? ' is-current' : '') + '" href="' + l.href + '"' +
      (current ? ' aria-current="page"' : '') + '>' + sideIcon(l.icon) + '<span>' + l.text.replace(/&/g, '&amp;') + '</span></a>';
  };
  // Seções da página atual: aproveita os links "#..." do menu do topo
  const sections = [...nav.querySelectorAll('.nav-links a[href^="#"]')];
  const here = sections.length
    ? '<div class="side-group"><span class="mono-label">Nesta página</span><div class="side-sub">' +
      sections.map(a => '<a class="side-link" href="' + a.getAttribute('href') + '">' + a.textContent + '</a>').join('') +
      '</div></div>'
    : '';

  side = document.createElement('aside');
  side.className = 'side';
  side.id = 'siteSide';
  side.setAttribute('aria-label', 'Navegação do site');
  side.innerHTML =
    '<div class="side-head">' +
      '<a href="index.html" class="logo"><span class="mark">FP</span> Fabrícia Pinheiro</a>' +
      '<button class="side-close" type="button" aria-label="Fechar menu">×</button>' +
    '</div>' +
    '<div class="side-progress" aria-hidden="true"><i></i></div>' +
    '<nav aria-label="Mapa do site">' +
      '<div class="side-group">' + link({ href: 'index.html', text: 'Início', icon: 'home' }) + '</div>' +
      here +
      SITE_MAP.map(g => '<div class="side-group"><span class="mono-label">' + g.label + '</span>' + g.links.map(link).join('') + '</div>').join('') +
    '</nav>' +
    '<div class="side-foot">' +
      '<a class="side-link" href="https://www.instagram.com/fabipinheiro_rh/" target="_blank" rel="noopener">' + sideIcon('insta') + '<span>@fabipinheiro_rh</span></a>' +
    '</div>';

  // Botão principal: o mesmo do menu do topo (WhatsApp ou compra, conforme a página)
  const cta = nav.querySelector('.nav-actions .btn');
  if (cta) {
    const c = cta.cloneNode(true);
    c.classList.remove('btn-sm');
    c.classList.add('btn-block');
    side.querySelector('.side-foot').prepend(c);
  }

  const backdrop = document.createElement('div');
  backdrop.className = 'side-backdrop';
  document.body.prepend(backdrop);
  document.body.prepend(side);
  root.classList.add('has-side');

  // Em telas menores a barra vira gaveta, aberta pelo botão de menu
  const wide = window.matchMedia('(min-width:1240px)');
  const toggleBtn = nav.querySelector('.nav-toggle');
  const closeBtn = side.querySelector('.side-close');
  const sync = () => {
    if (wide.matches) root.classList.remove('side-open');
    const open = root.classList.contains('side-open');
    side.inert = !wide.matches && !open;
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  setSide = open => {
    root.classList.toggle('side-open', open && !wide.matches);
    sync();
    if (wide.matches) return;
    if (open) closeBtn.focus(); else if (toggleBtn) toggleBtn.focus();
  };
  sync();
  if (wide.addEventListener) wide.addEventListener('change', sync); else wide.addListener(sync);
  closeBtn.addEventListener('click', () => setSide(false));
  backdrop.addEventListener('click', () => setSide(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('side-open')) setSide(false); });
  side.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { if (!wide.matches) { root.classList.remove('side-open'); sync(); } }));
}

if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = nav.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => setSide(!root.classList.contains('side-open')));
  }
}

// Revelar seções ao rolar
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => io.observe(el));
}
// Rede de segurança: nenhuma seção fica invisível
setTimeout(() => revealEls.forEach(el => el.classList.add('is-visible')), 1800);

// Abas: cada bloco [data-tabs] controla os painéis da própria seção
document.querySelectorAll('[data-tabs]').forEach(group => {
  const scope = group.closest('section') || document;
  const btns = group.querySelectorAll('.tab-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      scope.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = scope.querySelector('.tab-panel[data-panel="' + btn.dataset.tab + '"]');
      if (panel) panel.classList.add('active');
    });
  });
});

// Ano automático no rodapé
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

/* ---------- DINÂMICA ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Índice para a entrada em cascata dos cards
document.querySelectorAll('.bento, .grid, .steps, .faq').forEach(group => {
  [...group.children].forEach((el, i) => el.style.setProperty('--i', i));
});

// Barra de progresso de leitura (menu do topo e barra lateral)
if (nav) {
  const bar = document.createElement('div');
  bar.className = 'nav-progress';
  nav.appendChild(bar);
  const sideBar = side && side.querySelector('.side-progress i');
  const upd = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const v = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
    bar.style.transform = v;
    if (sideBar) sideBar.style.transform = v;
  };
  upd();
  addEventListener('scroll', upd, { passive: true });
  addEventListener('resize', upd);
}

if (finePointer && !reduceMotion) {
  // Brilho que segue o mouse + inclinação 3D suave nos cards
  document.querySelectorAll('.card, .step').forEach(card => {
    const max = card.classList.contains('step') ? 4 : 5;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', (x * 100) + '%');
      card.style.setProperty('--my', (y * 100) + '%');
      card.classList.add('tilt-on');
      card.style.transform =
        'perspective(900px) rotateX(' + ((0.5 - y) * max) + 'deg) rotateY(' + ((x - 0.5) * max) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilt-on');
      card.style.transform = '';
    });
  });

  // Foto e mockup do hero acompanham o mouse
  const hero = document.querySelector('.hero');
  const floatEl = hero && hero.querySelector('.photo-frame, .mock-stage');
  if (hero && floatEl) {
    floatEl.style.transition = 'transform .5s cubic-bezier(.2,.7,.2,1)';
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      floatEl.style.transform = 'perspective(1000px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg)';
    });
    hero.addEventListener('mouseleave', () => { floatEl.style.transform = ''; });
  }
}

// Menu acompanha a seção visível
const spyLinks = [...document.querySelectorAll('.nav-links a, .side-sub a')].filter(a => {
  const h = a.getAttribute('href') || '';
  const id = h.split('#')[1];
  return id && (h.startsWith('#') || location.pathname.endsWith(h.split('#')[0])) && document.getElementById(id);
});
if (spyLinks.length && 'IntersectionObserver' in window) {
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      spyLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href').split('#')[1] === en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  spyLinks.forEach(a => spy.observe(document.getElementById(a.getAttribute('href').split('#')[1])));
}

// Barra de compra fixa no celular (pdi.html): aparece depois do hero
// e some quando a seção de compra está na tela, pra não duplicar o botão
const buyBar = document.getElementById('buyBar');
if (buyBar) {
  document.body.classList.add('has-buy-bar');
  const heroEl = document.querySelector('.hero');
  const buyEl = document.getElementById('comprar');
  const buyBtn = buyBar.querySelector('a');
  let pastHero = false, atBuy = false;
  const render = () => {
    const show = pastHero && !atBuy;
    buyBar.classList.toggle('show', show);
    buyBar.setAttribute('aria-hidden', show ? 'false' : 'true');
    if (buyBtn) buyBtn.tabIndex = show ? 0 : -1;
  };
  if ('IntersectionObserver' in window) {
    if (heroEl) new IntersectionObserver(([en]) => {
      pastHero = !en.isIntersecting && en.boundingClientRect.top < 0; render();
    }).observe(heroEl);
    else pastHero = true;
    if (buyEl) new IntersectionObserver(([en]) => { atBuy = en.isIntersecting; render(); }, { threshold: 0.15 }).observe(buyEl);
  } else { pastHero = true; }
  render();
}

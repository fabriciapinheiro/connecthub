/* ============================================================
   FABRÍCIA PINHEIRO · script compartilhado
   Usado por: index.html, materiais.html, pdi.html, curriculo.html
   ============================================================ */

// Nav: borda ao rolar + menu mobile
const nav = document.getElementById('siteNav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = nav.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('.nav-links a').forEach(a =>
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
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

// Barra de progresso de leitura
if (nav) {
  const bar = document.createElement('div');
  bar.className = 'nav-progress';
  nav.appendChild(bar);
  const upd = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
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
const spyLinks = [...document.querySelectorAll('.nav-links a')].filter(a => {
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

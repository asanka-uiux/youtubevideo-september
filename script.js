(function(){
  "use strict";

  /* ============================================================
     SHOW OR WORK DATA
     score: 0 is all work, 100 is all show. The wheels are the only
     part the brief actually calls, so that one is the build's own
     verdict from the copy doc. The other eight were set here and have
     not been confirmed against the narration, which is noted in the
     README rather than on the page. The meter average recomputes
     itself from this array, so fixing a score fixes the readout.
     ============================================================ */
  var PARTS = [
    {
      id:"wheels", cat:"Wheels and tires", name:"American Force 26x14", brand:"American Force . Fury Offroad Country Hunter MT II",
      img:"images/meter-wheels.jpg", score:78, tk:false,
      is:"26x14 wheels wrapped in 35x14.50R26LT Country Hunter MT IIs.",
      why:"It's the widest we can go without losing towing ability.",
      call:"More show than work. It's almost too wide.",
      other:"This is about as wide as it goes. Hauling heavier? Go a little narrower for capability and drivability."
    },
    {
      id:"lift", cat:"Lift kit", name:"BDS 4-inch Lift Kit", brand:"BDS Suspension, radius arms and dual rate coil springs",
      img:"images/meter-lift.jpg", score:55, tk:true,
      is:"A 4in lift with radius arms and dual rate coil springs.",
      why:"The 26x14s don't fit under a stock 3500.",
      call:"A little more show than work. It's what makes the wheels fit.",
      other:"A shorter lift means a shorter tire. Taller than 4in will make the truck more difficult to get in and out of."
    },
    {
      id:"brakes", cat:"Brakes", name:"Drilled and slotted rotors", brand:"R1 Concepts Black Performance Rotor Set",
      img:"images/meter-brakes.jpg", score:35, tk:true,
      is:"A black finish drilled and slotted rotor set for the 2026 Ram 3500.",
      why:"The tires got heavier and the trailer didn't get lighter.",
      call:"This one's work. The finish comes free.",
      other:"Tow at the top of the rating every week? A plain heavy duty rotor is the safer buy."
    },
    {
      id:"diff", cat:"Drivetrain", name:"RAM Air differential cover", brand:"Banks Power Black Ops, with hardware",
      img:"images/meter-diff.jpg", score:30, tk:true,
      is:"A finned cover for the AAM rear axle, hardware included.",
      why:"Gear oil is the first thing to give up under a trailer.",
      call:"Work. It just happens to look like a show piece.",
      other:"A plain cast cover seals the axle for a third of the money. You give up the cooling."
    },
    {
      id:"boost", cat:"Lighting", name:"Mirror and cab lights", brand:"Boost Auto Parts",
      img:"images/meter-boost.jpg", score:55, tk:true,
      is:"Switchback LED mirror lights and a set of cab lights.",
      why:"Easy visibility for clearance and turn signals.",
      call:"Close to even. Helps at night, looks good at a show.",
      other:"Fresh lighting that still stays functional."
    },
    {
      id:"ufo", cat:"Lighting", name:"UFO Glow bundle", brand:"Adrenaline Offroad UFO Glow Bundle Kit",
      img:"images/meter-ufo.jpg", score:95, tk:true,
      is:"Rock lights under the frame and ring lights in the wheels.",
      why:"There's no work answer here. It's for after dark.",
      call:"All show. That's the whole point.",
      other:"Check your state. Most of this is fine parked and not fine moving."
    },
    {
      id:"steering", cat:"Steering", name:"Death Grip steering group", brand:"Kryptonite steering kit, dual stabilizer with Fox 2.0",
      img:"images/meter-steering.jpg", score:12, tk:true,
      is:"A heavy duty steering kit and a dual stabilizer on two Fox 2.0s.",
      why:"14in wheels put more leverage on the steering than the factory parts were built for.",
      call:"All work. You can't see any of it once the wheels are on.",
      other:"On a stock width truck you can skip the stabilizer. The links still earn it."
    },
    {
      id:"exhaust", cat:"Exhaust", name:"Black DPF Series", brand:"MagnaFlow",
      img:"images/meter-exhaust.jpg", score:60, tk:true,
      is:"A 5in DPF back system in black. The emissions equipment stays.",
      why:"Color, plain and simple. The factory pipe didn't match the rest of the build, and black does.",
      call:"Show. This was a color swap from the start, and it looks like it came off the truck that way.",
      other:"Happy with the factory finish? Leave it as is."
    },
    {
      id:"tonneau", cat:"Bed", name:"Lomax tonneau cover", brand:"Agri-Cover",
      img:"images/meter-tonneau.jpg", score:35, tk:true,
      is:"A hard folding cover, cut around the gooseneck ball.",
      why:"The gooseneck hardware needs to stay protected.",
      call:"Work, barely. Keeps cargo dry, cleans up the bed.",
      other:"A hard fold gives up full bed access. Dropping pallets? Run a roll up."
    }
  ];

  var el = function(id){ return document.getElementById(id); };

  /* ============ THE METER ============ */
  var picks = el('picks'), detail = el('detail');
  var ptr = el('gPtr'), avgMark = el('gAvg'), avgLine = el('gAvgLine');
  var q = function(role){ return detail.querySelector('[data-role="' + role + '"]'); };
  var current = -1;

  /* The meter art runs SHOW TRUCK on the left to WORK TRUCK on the right, so a
     high show score sits toward the left end. These two numbers are the track's
     own inset inside the artwork, measured off the file: the lit track starts at
     7.9% and ends at 92.1% of the image width. */
  var TRACK_L = 7.9, TRACK_R = 92.1;
  function posFor(score){ return TRACK_L + ((100 - score) / 100) * (TRACK_R - TRACK_L); }

  /* Five zones, no numbers on screen. The score still drives the gauge,
     it just never gets printed as a grade. */
  function zone(s){
    if (s >= 82) return { i:0, word:'All show' };
    if (s >= 60) return { i:1, word:'Leans show' };
    if (s >  40) return { i:2, word:'Right down the middle' };
    if (s >  18) return { i:3, word:'Leans work' };
    return { i:4, word:'All work' };
  }

  function show(i){
    if (i === current) return;
    current = i;
    var d = PARTS[i];
    var pad = function(n){ return (n < 10 ? '0' : '') + n; };
    q('badge').textContent = 'Part ' + pad(i + 1) + ' of ' + pad(PARTS.length);
    q('img').src = d.img;
    q('img').alt = d.name;
    q('cat').textContent = d.cat;
    q('name').textContent = d.name;
    q('brand').textContent = d.brand;
    var z = zone(d.score);
    q('verdict').textContent = z.word;
    [].slice.call(detail.querySelectorAll('.lean__scale span')).forEach(function(s, n){
      s.className = n === z.i ? (n === 2 ? 'on on--mid' : 'on') : '';
    });
    q('is').innerHTML = d.is;
    q('why').innerHTML = tk(d.why);
    q('call').innerHTML = tk(d.call);
    q('other').innerHTML = tk(d.other);

    ptr.style.left = posFor(d.score) + '%';

    [].slice.call(picks.children).forEach(function(b, n){
      b.setAttribute('aria-selected', n === i ? 'true' : 'false');
      b.tabIndex = n === i ? 0 : -1;
    });
  }

  // wrap any TK_ token in the shared placeholder pill
  function tk(s){
    return String(s).replace(/TK_[A-Z_0-9]+/g, function(m){ return '<span class="tk">' + m + '</span>'; });
  }

  PARTS.forEach(function(d, i){
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'pk';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', 'detail');
    b.setAttribute('aria-selected', 'false');
    b.tabIndex = -1;
    b.innerHTML = '<i></i>' + d.cat + (d.cat === 'Lighting' ? ' . ' + (d.id === 'ufo' ? 'Glow' : 'Boost') : '');
    b.addEventListener('click', function(){ show(i); });
    b.addEventListener('keydown', function(e){
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % PARTS.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + PARTS.length) % PARTS.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = PARTS.length - 1;
      if (n !== null) { e.preventDefault(); show(n); picks.children[n].focus(); }
    });
    picks.appendChild(b);
  });

  // running average: where the build actually landed
  (function(){
    var sum = 0;
    PARTS.forEach(function(d){ sum += d.score; });
    var avg = Math.round(sum / PARTS.length);
    var off = Math.abs(avg - 50), side = avg > 50 ? 'show' : 'work';
    avgMark.style.left = posFor(avg) + '%';
    avgLine.style.left = posFor(avg) + '%';

    var head = off <= 3 ? 'dead center'
             : off <= 9 ? 'a hair ' + side + ' of center'
             : off <= 20 ? 'on the ' + side + ' side'
             : 'well onto the ' + side + ' side';
    var note = off <= 3 ? "That's the target hit: a truck that shows up and still works."
             : off <= 9 ? 'Close enough to the middle to call it: still a work truck, just not a boring one.'
             : off <= 20 ? 'Off the middle, but not by enough to cost the truck its job.'
             : 'Further than the plan called for. Something on this list needs a second look.';
    el('avgHead').innerHTML = 'The build landed <span>' + head + '</span>.';
    el('avgWord').innerHTML = note + ' Averaged across all ' + PARTS.length + ' parts on the truck.';
  })();

  show(0);

  /* ============ FINANCING MODAL ============ */
  var finModal = el('finModal'), finOpen = el('finOpen'), lastFocus = null;
  function openFin(){
    lastFocus = document.activeElement;
    finModal.classList.add('on');
    finModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var x = finModal.querySelector('.modal__x');
    if (x) x.focus();
  }
  function closeFin(){
    finModal.classList.remove('on');
    finModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Safari doesn't focus a clicked button, so fall back to the trigger rather than dropping focus on <body>
    (lastFocus && lastFocus !== document.body ? lastFocus : finOpen).focus();
  }
  if (finOpen) finOpen.addEventListener('click', openFin);
  [].slice.call(finModal.querySelectorAll('[data-close]')).forEach(function(n){
    n.addEventListener('click', closeFin);
  });
  document.addEventListener('keydown', function(e){
    if (!finModal.classList.contains('on')) return;
    if (e.key === 'Escape') { closeFin(); return; }
    if (e.key !== 'Tab') return;
    // keep focus inside the dialog: wrap from the last control to the first and back
    var f = [].slice.call(finModal.querySelectorAll('a[href],button:not([disabled])'));
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ============ PARTS CATEGORY TABS ============ */
  var ptabs = [].slice.call(document.querySelectorAll('.ptab'));
  var pcards = [].slice.call(document.querySelectorAll('.pcard'));
  function matches(cat, c){
    var k = c.dataset.cat;
    if (cat === 'all') return true;
    if (cat === 'wt') return k === 'wheel' || k === 'tire';
    return k === cat;
  }
  var PER_PAGE = 6;
  var pgCat = 'all', pgPage = 0, pgPool = [];
  var pager = el('pager'), pgDots = el('pgDots');

  function drawPage(){
    var total = Math.max(1, Math.ceil(pgPool.length / PER_PAGE));
    if (pgPage > total - 1) pgPage = total - 1;
    if (pgPage < 0) pgPage = 0;
    var start = pgPage * PER_PAGE, end = start + PER_PAGE;

    pcards.forEach(function(c){ c.style.display = 'none'; });
    pgPool.slice(start, end).forEach(function(c){ c.style.display = ''; c.classList.add('in'); });

    var single = total < 2;
    pager.hidden = single;
    el('pgPrev').hidden = single;
    el('pgNext').hidden = single;
    el('pgNow').textContent = pgPage + 1;
    el('pgTotal').textContent = total;
    el('pgCount').textContent = '. ' + pgPool.length + (pgPool.length === 1 ? ' part' : ' parts');
    el('pgPrev').disabled = pgPage === 0;
    // left arrow only shows once the shopper has paged forward; it keeps its space so the layout doesn't shift
    el('pgPrev').classList.toggle('is-off', pgPage === 0);
    // 821px and up: on page 1 the left column collapses so the cards sit flush with the heading and tabs
    el('pgPrev').parentNode.classList.toggle('is-first', pgPage === 0);
    el('pgNext').disabled = pgPage >= total - 1;

    var dots = '';
    for (var i = 0; i < total; i++) {
      dots += '<button type="button" data-p="' + i + '" aria-current="' + (i === pgPage ? 'true' : 'false') +
              '" aria-label="Go to page ' + (i + 1) + '"></button>';
    }
    pgDots.innerHTML = dots;
  }

  function setCat(cat){
    pgCat = cat; pgPage = 0;
    el('pgrid').style.minHeight = '';
    pgPool = pcards.filter(function(c){ return matches(cat, c); });
    drawPage();
  }

  function pickTab(t){
    ptabs.forEach(function(x){
      x.setAttribute('aria-selected', x === t ? 'true' : 'false');
      x.tabIndex = x === t ? 0 : -1;
    });
    setCat(t.dataset.cat);
  }
  ptabs.forEach(function(t, i){
    t.addEventListener('click', function(){ pickTab(t); });
    t.addEventListener('keydown', function(e){
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % ptabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + ptabs.length) % ptabs.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = ptabs.length - 1;
      if (n !== null) { e.preventDefault(); pickTab(ptabs[n]); ptabs[n].focus(); }
    });
  });
  // paging keeps the page still: no scrolling, and the grid holds at least its current height so a short
  // last page doesn't pull the arrows and everything below it upward. Category changes and resizes release it.
  function holdGrid(){
    var g = el('pgrid');
    g.style.minHeight = Math.max(g.offsetHeight, parseFloat(g.style.minHeight) || 0) + 'px';
  }
  window.addEventListener('resize', function(){ el('pgrid').style.minHeight = ''; });
  el('pgPrev').addEventListener('click', function(){
    holdGrid(); pgPage--; drawPage();
    if (pgPage === 0) el('pgNext').focus(); // the left arrow just went invisible, so hand focus to the right one
  });
  el('pgNext').addEventListener('click', function(){ holdGrid(); pgPage++; drawPage(); });
  pgDots.addEventListener('click', function(e){
    var b = e.target.closest('button[data-p]');
    if (b) { holdGrid(); pgPage = parseInt(b.dataset.p, 10); drawPage(); }
  });
  setCat('all');

  /* ============ FAQ ACCORDION ============ */
  var qbtns = [].slice.call(document.querySelectorAll('.q__btn'));
  qbtns.forEach(function(btn){
    var body = btn.nextElementSibling;
    btn.addEventListener('click', function(){
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      body.style.maxHeight = open ? '0px' : body.scrollHeight + 'px';
    });
  });
  window.addEventListener('resize', function(){
    qbtns.forEach(function(btn){
      if (btn.getAttribute('aria-expanded') === 'true') btn.nextElementSibling.style.maxHeight = btn.nextElementSibling.scrollHeight + 'px';
    });
  });

  /* ============ NAV SCROLLSPY + PROGRESS ============ */
  var navLinks = [].slice.call(document.querySelectorAll('.nav__links a'));
  var secs = navLinks.map(function(a){ return document.querySelector(a.getAttribute('href')); });
  var bar = el('progress');
  function onScroll(){
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    var mark = y + 140, best = -1;
    secs.forEach(function(sec, n){ if (sec && sec.offsetTop <= mark) best = n; });
    navLinks.forEach(function(a, n){
      a.classList.toggle('on', n === best);
      if (n === best) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ============ MOBILE NAV DRAWER ============ */
  var nav = document.querySelector('.nav'), burger = el('navBurger');
  function setNav(open){
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (burger) {
    burger.addEventListener('click', function(){ setNav(!nav.classList.contains('is-open')); });
    navLinks.forEach(function(a){ a.addEventListener('click', function(){ setNav(false); }); });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); burger.focus(); }
    });
    document.addEventListener('click', function(e){
      if (nav.classList.contains('is-open') && !nav.contains(e.target)) setNav(false);
    });
    window.matchMedia('(min-width: 1041px)').addEventListener('change', function(m){ if (m.matches) setNav(false); });
  }

  /* ============ REVEAL ============ */
  var rv = [].slice.call(document.querySelectorAll('.rv'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -70px 0px', threshold: 0.05 });
    rv.forEach(function(n){ io.observe(n); });
  } else {
    rv.forEach(function(n){ n.classList.add('in'); });
  }
})();

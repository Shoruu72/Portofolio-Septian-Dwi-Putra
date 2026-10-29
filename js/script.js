// Background interaktif: partikel + cahaya mengikuti kursor
(() => {
  const canvas = document.getElementById("bg-canvas");
  const glow = document.querySelector(".cursor-glow");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  let w,
    h,
    dpr,
    particles = [];

  const COUNT = 70;
  const LINK_DIST = 120;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.1 - Math.random() * 0.25,
      r: 0.8 + Math.random() * 1.4,
      red: Math.random() < 0.18,
    };
  }

  function init() {
    resize();
    const n = w < 768 ? Math.round(COUNT / 2) : COUNT;
    particles = Array.from({ length: n }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.red ? "rgba(230,57,70,0.8)" : "rgba(255,255,255,0.35)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(255,255,255,${0.08 * (1 - d / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  // w & h harus sudah terisi sebelum dipakai oleh cahaya kursor
  init();

  // cahaya merah halus mengikuti kursor
  if (glow && !reduceMotion) {
    let tx = w / 2,
      ty = h / 2,
      cx = tx,
      cy = ty;
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });
    (function follow() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      glow.style.transform = `translate(${cx - 200}px, ${cy - 200}px)`;
      requestAnimationFrame(follow);
    })();
  }

  window.addEventListener("resize", () => {
    init();
    if (reduceMotion) draw();
  });
  draw();
})();

// Menu navbar aktif otomatis saat halaman di-scroll
(() => {
  const links = document.querySelectorAll(".navbar nav a");
  const sections = document.querySelectorAll("section[id]");
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) =>
            a.classList.toggle(
              "active",
              a.getAttribute("href") === "#" + entry.target.id,
            ),
          );
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );

  sections.forEach((s) => observer.observe(s));
})();

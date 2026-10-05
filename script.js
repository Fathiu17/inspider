/* ============ INSPIDER — Portfolio JS ============ */
(function () {
  "use strict";

  /* ---------- Sticky nav shadow ---------- */
  const nav = document.getElementById("nav");
  const backTop = document.getElementById("backTop");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
    backTop.classList.toggle("show", window.scrollY > 600);
  }, { passive: true });

  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Mobile burger menu ---------- */
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");

  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      burger.classList.remove("open");
      navLinks.classList.remove("open");
    })
  );

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll(".stat-num[data-count]");
  let counted = false;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          counters.forEach(animateCounter);
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  if (counters.length) {
    const heroStats = document.querySelector(".hero-stats");
    if (heroStats) counterObserver.observe(heroStats);
  }

  /* ---------- Gallery filters ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".g-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      galleryItems.forEach((item) => {
        const match = filter === "all" || item.dataset.cat === filter;
        item.classList.toggle("hidden", !match);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lbArt = document.getElementById("lbArt");
  const lbCaption = document.getElementById("lbCaption");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");
  let currentIndex = 0;

  const visibleItems = () =>
    Array.from(galleryItems).filter((i) => !i.classList.contains("hidden"));

  const showItem = (item) => {
    // Reuse the item's gradient art in the lightbox
    const bg = getComputedStyle(item).backgroundImage.split(",").slice(0, 2).join(",");
    lbArt.style.background = getComputedStyle(item).backgroundColor;
    lbArt.style.backgroundImage = getComputedStyle(item).backgroundImage;
    lbCaption.textContent = item.dataset.title || "";
  };

  const openLightbox = (item) => {
    const items = visibleItems();
    currentIndex = items.indexOf(item);
    showItem(item);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  };

  const stepLightbox = (dir) => {
    const items = visibleItems();
    if (!items.length) return;
    currentIndex = (currentIndex + dir + items.length) % items.length;
    showItem(items[currentIndex]);
  };

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
  });

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(-1); });
  lbNext.addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(1); });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  /* ---------- Subtle parallax on hero glows ---------- */
  const glowA = document.querySelector(".glow-a");
  const glowB = document.querySelector(".glow-b");

  window.addEventListener("mousemove", (e) => {
    if (!glowA || !glowB) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    glowA.style.transform = `translate(${x}px, ${y}px)`;
    glowB.style.transform = `translate(${-x}px, ${-y}px)`;
  }, { passive: true });
})();

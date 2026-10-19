(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.style.scrollBehavior = "auto";
  }

  // Only observe in-page anchors; links to other HTML pages must not be queried as selectors.
  const navLinks = [...document.querySelectorAll(".primary-nav a")]
    .filter(link => link.getAttribute("href")?.startsWith("#"));
  const sections = navLinks.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);

  if ("IntersectionObserver" in window && navLinks.length && sections.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          if (link.getAttribute("href") === "#" + entry.target.id) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-25% 0px -65% 0px" });
    sections.forEach(section => observer.observe(section));
  }
})();
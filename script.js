(() => {
  const themeKey = "claire-site-theme";
  const themeButtons = [];
  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    document.body.classList.toggle("theme-light", theme === "light");
    themeButtons.forEach(button => {
      button.textContent = theme === "dark" ? "LIGHT MODE ☼" : "DARK MODE ☾";
      button.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      button.setAttribute("aria-pressed", String(theme === "dark"));
    });
  };
  let savedTheme = null;
  try { savedTheme = localStorage.getItem(themeKey); } catch (_) {}
  applyTheme(savedTheme === "light" ? "light" : "dark");
  document.querySelectorAll(".claire-header, .site-header").forEach(header => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.addEventListener("click", () => {
      const next = document.body.classList.contains("theme-light") ? "dark" : "light";
      applyTheme(next);
      try { localStorage.setItem(themeKey, next); } catch (_) {}
    });
    const nav = header.querySelector("nav");
    if (nav) nav.insertAdjacentElement("afterend", button);
    else header.appendChild(button);
    themeButtons.push(button);
  });
  applyTheme(savedTheme === "light" ? "light" : "dark");
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
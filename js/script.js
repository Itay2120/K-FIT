const CONFIG = {
  // החליפו למספר הווטסאפ של העסק בפורמט בינלאומי, ללא + וללא רווחים.
  whatsappNumber: "+97246984877"
};

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");
const packageSelect = document.querySelector("[data-package-select]");

if (year) year.textContent = new Date().getFullYear();

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 12);
});

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  document.body.classList.toggle("no-scroll", Boolean(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  });
});

document.querySelectorAll("[data-package]").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedPackage = button.getAttribute("data-package") || "";
    if (packageSelect && selectedPackage) packageSelect.value = selectedPackage;
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const answer = item?.querySelector(".answer");
    const isOpen = item?.classList.toggle("open");
    button.setAttribute("aria-expanded", String(Boolean(isOpen)));
    if (answer) answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : "0px";
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function encodeWhatsAppMessage(formData) {
  const lines = [
    "היי קרן, אשמח לקבל פרטים על ליווי K-FIT.",
    `שם: ${formData.get("name")}`,
    `טלפון: ${formData.get("phone")}`,
    `מטרה: ${formData.get("goal")}`,
    `מסלול: ${formData.get("package")}`,
    `הערות: ${formData.get("message") || "-"}`
  ];
  return encodeURIComponent(lines.join("\n"));
}

document.querySelector("[data-contact-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeWhatsAppMessage(formData)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

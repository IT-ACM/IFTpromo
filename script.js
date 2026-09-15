// =====================================================
// CONFIGURACIÓN DE LA LANDING
// Modificá esta sección para actualizar videos y textos.
// No hace falta tocar el resto del archivo.
// =====================================================

const videos = [
  {
    type: "local",
    title: "Samuel y su experiencia con IFT",
    url: "videos/video1.mp4"
  },
  {
    type: "local",
    title: "Elias y su experiencia con IFT",
    url: "videos/video2.mp4"
  },
  {
    type: "local",
    title: "Romel y su experiencia con IFT",
    url: "videos/video3.mp4"
  }
];

// =====================================================
// FIN DE LA CONFIGURACIÓN — no es necesario editar debajo de esta línea
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  renderVideos(videos);
  setupSmoothScroll();
  setupScrollReveal();
});

/**
 * Extrae el ID de un video de YouTube a partir de una URL de tipo embed.
 */
function getYouTubeId(embedUrl) {
  const match = embedUrl.match(/embed\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * Genera dinámicamente las tarjetas de video dentro de #videosGrid.
 */
function renderVideos(list) {
  const grid = document.getElementById("videosGrid");
  if (!grid) return;

  grid.innerHTML = "";

  list.forEach((item) => {
    const card = document.createElement("article");
    card.className = "video-card reveal";

    const frame = document.createElement("div");
    frame.className = "video-card__frame";

    if (item.type === "youtube") {
      frame.appendChild(buildYouTubeFacade(item));
    } else if (item.type === "local") {
      frame.appendChild(buildLocalVideo(item));
    }

    const body = document.createElement("div");
    body.className = "video-card__body";

    const title = document.createElement("h3");
    title.className = "video-card__title";
    title.textContent = item.title;

    body.appendChild(title);
    card.appendChild(frame);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

/**
 * Crea una miniatura clickeable para YouTube. El iframe solo se inserta
 * cuando el usuario hace clic, evitando reproducción automática y
 * mejorando el rendimiento de carga inicial.
 */
function buildYouTubeFacade(item) {
  const videoId = getYouTubeId(item.url);

  const wrapper = document.createElement("button");
  wrapper.type = "button";
  wrapper.className = "yt-facade";
  wrapper.setAttribute("aria-label", `Reproducir video: ${item.title}`);
  wrapper.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;border:none;padding:0;cursor:pointer;background:#000;";

  if (videoId) {
    const thumb = document.createElement("img");
    thumb.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    thumb.alt = item.title;
    thumb.loading = "lazy";
    thumb.style.cssText = "width:100%;height:100%;object-fit:cover;opacity:0.85;";
    wrapper.appendChild(thumb);
  }

  const playIcon = document.createElement("span");
  playIcon.setAttribute("aria-hidden", "true");
  playIcon.style.cssText = `
    position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
    width:60px; height:60px; border-radius:50%;
    background:rgba(1,43,59,0.75); backdrop-filter:blur(2px);
    display:flex; align-items:center; justify-content:center;
    transition: transform 0.3s ease, background 0.3s ease;
  `;
  playIcon.innerHTML = `
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1.5V22.5L19 12L1 1.5Z" fill="#f6f2e9" stroke="#f6f2e9" stroke-width="1.4" stroke-linejoin="round"/>
    </svg>`;
  wrapper.appendChild(playIcon);

  wrapper.addEventListener("mouseenter", () => {
    playIcon.style.transform = "translate(-50%,-50%) scale(1.08)";
    playIcon.style.background = "rgba(199,162,86,0.85)";
  });
  wrapper.addEventListener("mouseleave", () => {
    playIcon.style.transform = "translate(-50%,-50%) scale(1)";
    playIcon.style.background = "rgba(1,43,59,0.75)";
  });

  wrapper.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = `${item.url}?autoplay=1&rel=0`;
    iframe.title = item.title;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    wrapper.replaceWith(iframe);
  });

  return wrapper;
}

/**
 * Crea el elemento <video> para archivos locales, sin autoplay.
 */
function buildLocalVideo(item) {
  const video = document.createElement("video");
  video.src = item.url;
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.setAttribute("aria-label", item.title);
  return video;
}

/**
 * Smooth scroll desde el CTA del hero hacia la sección de videos.
 */
function setupSmoothScroll() {
  const cta = document.getElementById("scrollCta");
  const target = document.getElementById("videos");
  if (!cta || !target) return;

  cta.addEventListener("click", () => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/**
 * Revela elementos con la clase .reveal cuando entran al viewport.
 */
function setupScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

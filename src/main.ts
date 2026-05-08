import './style.css'

declare const THREE: any

// Scroll fade in/out
const revealTargets = [
  '#hero h1',
  '.hero-sub',
  '#hero .btn-primary',
  '#portfolio h2',
  '.marquee-wrapper',
  '#curated h2',
  '.card',
  '.section-label',
  '#approach p',
  '#unlock h2',
  '#explore h2',
  '#explore p',
  '#explore .btn-primary',
  '.stat',
]

const revealEls = document.querySelectorAll<HTMLElement>(revealTargets.join(', '))

revealEls.forEach((el) => el.classList.add('scroll-hidden'))

const getDelay = (el: HTMLElement): number => {
  if (el.matches('#unlock li')) {
    return Array.from(el.parentElement?.children ?? []).indexOf(el) * 300
  }
  if (el.matches('.card, .stat')) {
    return Array.from(el.parentElement?.children ?? []).indexOf(el) * 70
  }
  if (el.closest('#hero')) {
    return ['H1', 'P', 'A'].indexOf(el.tagName) * 90
  }
  return 0
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const el = entry.target as HTMLElement
      if (entry.isIntersecting) {
        el.style.transitionDelay = `${getDelay(el)}ms`
        el.classList.replace('scroll-hidden', 'scroll-visible')
      } else {
        el.style.transitionDelay = '0ms'
        el.classList.replace('scroll-visible', 'scroll-hidden')
      }
    })
  },
  { threshold: 0.1 }
)

revealEls.forEach((el) => observer.observe(el))

// Request Access modal
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxe1VE1SUj_RiDtN-jAk9Hd03Kgw4p8OqQ5FcuMle1eylFH0WFsdLpCUeDwkwxxzj5vjA/exec'

const modal        = document.getElementById('request-modal')!
const requestForm  = document.getElementById('request-form') as HTMLFormElement
const modalSuccess = document.querySelector('.modal-success') as HTMLElement
const modalTitle   = modal.querySelector<HTMLElement>('#modal-title')!
const modalSub     = modal.querySelector<HTMLElement>('.modal-sub')!
const submitBtn    = requestForm.querySelector<HTMLButtonElement>('.modal-submit')!

const showForm = () => {
  requestForm.hidden = false
  requestForm.reset()
  submitBtn.disabled = false
  submitBtn.textContent = 'Submit'
  modalTitle.hidden = false
  modalSub.hidden = false
  modalSuccess.hidden = true
}

const openModal = () => {
  showForm()
  modal.classList.add('open')
  modal.setAttribute('aria-hidden', 'false')
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  modal.classList.remove('open')
  modal.setAttribute('aria-hidden', 'true')
  document.body.style.overflow = ''
}

document.querySelectorAll('[data-modal="request"]').forEach((btn) => {
  btn.addEventListener('click', (e) => { e.preventDefault(); openModal() })
})

modal.querySelector('.modal-close')!.addEventListener('click', closeModal)
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal() })
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal() })

requestForm.addEventListener('submit', (e) => {
  e.preventDefault()
  submitBtn.disabled = true
  submitBtn.textContent = 'Sending…'

  const body = new URLSearchParams({
    name:    (requestForm.querySelector('#f-name')    as HTMLInputElement).value,
    company: (requestForm.querySelector('#f-company') as HTMLInputElement).value,
    email:   (requestForm.querySelector('#f-email')   as HTMLInputElement).value,
    note:    (requestForm.querySelector('#f-note')    as HTMLTextAreaElement).value,
  })

  fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', body }).catch(() => {})

  requestForm.hidden = true
  modalTitle.hidden = true
  modalSub.hidden = true
  modalSuccess.hidden = false
})

// Hide/show navbar on scroll direction
const navbar = document.querySelector<HTMLElement>('#navbar')!
let lastScrollY = window.scrollY

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY
  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    navbar.classList.add('nav-hidden')
  } else {
    navbar.classList.remove('nav-hidden')
  }
  lastScrollY = currentScrollY
}, { passive: true })

// Scroll-driven fade for unlock list items
const unlockItems = Array.from(document.querySelectorAll<HTMLElement>('#unlock li'))
unlockItems.forEach((li) => { li.style.opacity = '0' })

const updateUnlock = () => {
  const viewH = window.innerHeight
  unlockItems.forEach((li) => {
    const top = li.getBoundingClientRect().top
    const progress = (viewH - top) / (viewH * 0.45)
    li.style.opacity = String(Math.min(1, Math.max(0, progress)))
  })
}

window.addEventListener('scroll', updateUnlock, { passive: true })
updateUnlock()

// Animated light beam — Three.js shader (ref: "To recreate the animated light beam.txt")
const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'
document.getElementById('vanta-bg')!.appendChild(renderer.domElement)

const scene  = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */`
  uniform float uTime;
  uniform float uScroll;
  varying vec2 vUv;

  // Value noise (replaces the broken Perlin stub in the reference)
  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),                hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 uv  = vUv;
    vec2 muv = uv * 2.0 - 1.0;   // origin at center

    // 1. Vertical beam — both ends widen as user scrolls
    float topWidth    = mix(0.04, 0.70, uScroll);
    float bottomWidth = mix(0.20, 1.20, uScroll);
    float beamWidth   = mix(topWidth, bottomWidth, pow(1.0 - uv.y, 2.0));
    float yBeam = 1.0 - smoothstep(0.001, beamWidth, abs(muv.x));
    yBeam *= noise(uv * 1.5 + vec2(0.0, uTime * 0.18)) * 1.0;
    vec3 yBeamCol = mix(
      vec3(0.88, 0.94, 1.00),
      vec3(0.15, 0.32, 0.82),
      smoothstep(0.0, 1.0, abs(muv.x) / max(beamWidth, 0.001))
    );

    // 2. Horizontal radial spread at origin
    float spread = smoothstep(0.35, 0.0,
      length(vec2(muv.x * 0.65, uv.y * 0.75 + noise(uv * 0.4 + vec2(uTime * 0.08, 0.0)) * 0.08))
    );
    spread *= (noise(uv * 1.2 + vec2(uTime * 0.12, 0.0)) + 0.3) * 0.7;
    vec3 spreadCol = mix(vec3(0.48, 0.64, 1.00), vec3(0.06, 0.14, 0.48), uv.y);

    // Combine
    vec3 bgCol  = vec3(0.063, 0.075, 0.118);
    float mask  = clamp(yBeam + spread, 0.0, 1.0);
    vec3  beams = yBeam * yBeamCol + spread * spreadCol;
    vec3  final = mix(bgCol, beams, mask);

    gl_FragColor = vec4(final, 1.0);
  }
`

const uniforms = { uTime: { value: 0.0 }, uScroll: { value: 0.0 } }
const mesh = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader })
)
scene.add(mesh)

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
}, { passive: true })

window.addEventListener('scroll', () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight
  uniforms.uScroll.value = maxScroll > 0 ? window.scrollY / maxScroll : 0
}, { passive: true })

;(function animate(t: number) {
  uniforms.uTime.value = t * 0.001
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
})(0)


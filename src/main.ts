import './style.css'

declare const VANTA: any

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

// Mouse-driven metal shine
document.addEventListener('mousemove', (e) => {
  const pct = e.clientX / window.innerWidth
  const pos = 38 + pct * 24  // maps 0→1 to 38%→62% (subtle range)
  document.documentElement.style.setProperty('--shine-pos', `${pos}%`)
}, { passive: true })

// Request Access modal
const modal = document.getElementById('request-modal')!
const openModal = () => {
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

document.getElementById('request-form')!.addEventListener('submit', (e) => {
  e.preventDefault()
  closeModal()
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

VANTA.NET({
  el: '#vanta-bg',
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  color: 0x202741,
  backgroundColor: 0x06080f,
  points: 5.00,
  maxDistance: 30.00,
  spacing: 25.00,
  showDots: false,
})

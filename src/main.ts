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
  color: 0xDBDBDB,
  backgroundColor: 0xffffff,
  points: 5.00,
  maxDistance: 30.00,
  spacing: 25.00,
  showDots: false,
})

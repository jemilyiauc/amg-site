import './style.css'

declare const VANTA: any

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

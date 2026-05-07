import './style.css'

declare const VANTA: any

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <nav id="navbar">
    <span class="nav-brand">AMG</span>
    <a href="#" class="btn btn-outline">Request Access</a>
  </nav>

  <section id="hero">
    <h1>Get access to<br>exclusive networks<br>and opportunities</h1>
    <p class="hero-sub">A strategic platform for executives, leaders, and investors creating transformative partnerships across industries.</p>
    <a href="#" class="btn btn-primary">Request Access</a>
  </section>

  <section id="stats">
    <h2>A highly curated ecosytem</h2>
    <p class="section-sub">Gain access to strategic initiatives, deal flow, and private networks across industries.</p>
    <div class="stat-row">
      <div class="stat">
        <span class="stat-num">0+</span>
        <span class="stat-label">Executives</span>
      </div>
      <div class="stat">
        <span class="stat-num">0+</span>
        <span class="stat-label">Investors</span>
      </div>
      <div class="stat">
        <span class="stat-num">0+</span>
        <span class="stat-label">Founders</span>
      </div>
    </div>
  </section>

  <section id="portfolio">
    <h2>Portfolio &amp; partners</h2>
    <div class="logo-row">
      <div class="logo-box"></div>
      <div class="logo-box"></div>
      <div class="logo-box"></div>
      <div class="logo-box"></div>
      <div class="logo-box"></div>
    </div>
  </section>

  <section id="curated">
    <h2>Curated by</h2>
    <div class="cards-row">
      <div class="card">
        <div class="card-img"></div>
        <div class="card-body">
          <span class="card-role">2018 Chairman</span>
          <h3>Metta World Peace</h3>
          <p>IMG Chairman, Artist Management Group, Artist University.</p>
        </div>
      </div>
      <div class="card">
        <div class="card-img"></div>
        <div class="card-body">
          <span class="card-role">Board &amp; Co-Chair</span>
          <h3>Stephen Stokols</h3>
          <p>Brand Media, Freestyle2p.</p>
        </div>
      </div>
      <div class="card">
        <div class="card-img"></div>
        <div class="card-body">
          <span class="card-role">CTO</span>
          <h3>Nektar Baziotis</h3>
        </div>
      </div>
      <div class="card">
        <div class="card-img"></div>
        <div class="card-body">
          <span class="card-role">CTO</span>
          <h3>Nektar Baziotis</h3>
        </div>
      </div>
    </div>
  </section>

  <section id="approach">
    <span class="section-label">Our approach</span>
    <p>AMG operates as a strategic management and growth platform, creating pathways to success through meaningful networks of executives, leaders, and investors.</p>
  </section>

  <section id="unlock">
    <h2>Unlock<br>opportunities<br>through</h2>
    <ul>
      <li>invite-only events</li>
      <li>private Slack</li>
      <li>global collaborators</li>
      <li>strategic partnerships</li>
      <li>high-growth portfolios</li>
      <li>capital access</li>
    </ul>
  </section>

  <section id="explore">
    <h2>Explore<br>alignment</h2>
    <p>If you are seeking partnership, investment alignment, or strategic collaboration, we invite you to apply for access.</p>
    <a href="#" class="btn btn-primary">Request Access</a>
  </section>

  <footer id="footer">
    <div class="footer-main">
      <span class="footer-brand">AMG</span>
      <div class="footer-cols">
        <div class="footer-col">
          <h4>Learn</h4>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Request Access</a>
        </div>
        <div class="footer-col">
          <h4>Connect</h4>
          <div class="social-row">
            <a href="#" class="social-icon" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="#" class="social-icon" aria-label="X">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" class="social-icon" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Artist Management Group, Inc.</span>
    </div>
  </footer>
`

VANTA.NET({
  el: '#vanta-bg',
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  color: 0xffffff,
  backgroundColor: 0xf2f2f2,
  points: 7.00,
  maxDistance: 26.00,
  spacing: 19.00,
  showDots: false,
})

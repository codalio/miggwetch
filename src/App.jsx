import { useEffect, useState } from 'react'

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const COOKIES = [
  {
    name: 'Kakabeka Crunch',
    price: '$5',
    image: asset('images/kakabeka-pack.jpg'),
    blurb:
      'Semisweet, milk, and white Belgian chocolate with pretzel pieces, toffee bits, and flaky sea salt.',
    story: 'Inspired by Kakabeka Falls & the legend of Princess Green Mantle',
  },
  {
    name: 'Sleeping Giant',
    price: '$5',
    image: asset('images/sleeping-giant.jpg'),
    blurb:
      'Semisweet, milk, and dark Belgian chocolate with walnut pieces — rich, nutty, and bold.',
    story: 'Named for the Sleeping Giant of Thunder Bay',
  },
  {
    name: 'Turtle Island',
    price: '$5',
    image: asset('images/turtle-island.jpg'),
    blurb: 'Old-fashioned chewy oatmeal raisin with browned butter.',
    story: 'A classic cookie carrying the Turtle Island story',
  },
  {
    name: 'Louis Riel',
    price: '$5',
    image: asset('images/louis-riel-front.jpg'),
    blurb: 'Oatmeal chocolate chip — a tribute cookie with history on the label.',
    story: 'Honouring Métis history and leadership',
  },
  {
    name: 'Every Child Matters',
    price: '$5',
    image: asset('images/ecm-cookies.jpg'),
    blurb: 'Branded chocolate chip cookies for Orange Shirt Day and school events.',
    story: 'Baked for remembrance, education, and solidarity',
  },
  {
    name: 'White Thunder',
    price: '$5',
    image: asset('images/macadamia.jpg'),
    blurb: 'Premium white chocolate and macadamia nuts.',
    story: 'A bright, celebratory cookie for thank-you moments',
  },
]

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const links = [
    { href: '#story', label: 'Our story' },
    { href: '#cookies', label: 'Cookies' },
    { href: '#legends', label: 'Legend cookies' },
    { href: '#corporate', label: 'Corporate gifts' },
    { href: '#order', label: 'Order' },
  ]

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="nav-brand" href="#top" aria-label="Miigwetch Cookies home">
          <img src={asset("images/logo-transparent.png")} alt="" />
          <span>Miigwetch</span>
        </a>
        <nav aria-label="Primary">
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
            <li>
              <a className="nav-cta" href="#order">
                Place an inquiry
              </a>
            </li>
          </ul>
        </nav>
        <button
          className="nav-toggle"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>
      </header>
      <div
        className={`nav-drawer ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
        role="presentation"
      >
        <div
          className="nav-drawer-panel"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="Mobile menu"
        >
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a className="nav-cta" href="#order" onClick={() => setOpen(false)}>
            Place an inquiry
          </a>
        </div>
      </div>
    </>
  )
}

function InquiryForm() {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const type = String(data.get('type') || '').trim()
    const quantity = String(data.get('quantity') || '').trim()
    const message = String(data.get('message') || '').trim()
    const phone = String(data.get('phone') || '').trim()

    if (!name || !email || !message) {
      setError('Please fill in your name, email, and a short note about your order.')
      return
    }

    const subject = encodeURIComponent(`Miigwetch inquiry — ${type || 'General'} — ${name}`)
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        `Order type: ${type || 'Not specified'}`,
        quantity ? `Approx. quantity: ${quantity}` : null,
        '',
        message,
        '',
        '(Sent from miigwetchcookies.ca inquiry form)',
      ]
        .filter(Boolean)
        .join('\n'),
    )

    window.location.href = `mailto:miigwetch.cookies@gmail.com?subject=${subject}&body=${body}`
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="form-success" role="status">
        <h3>Chi Miigwetch — thank you</h3>
        <p>
          Your email app should open with your inquiry ready to send. If it doesn&apos;t, write
          us directly at{' '}
          <a href="mailto:miigwetch.cookies@gmail.com">miigwetch.cookies@gmail.com</a>.
        </p>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form-row two">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>
      <div className="form-row two">
        <div className="field">
          <label htmlFor="phone">Phone (optional)</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor="type">What are you ordering?</label>
          <select id="type" name="type" defaultValue="Corporate gift">
            <option>Corporate gift / event</option>
            <option>Personal thank-you gift</option>
            <option>Legend cookie (custom story)</option>
            <option>School / Every Child Matters</option>
            <option>Something else</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="quantity">Approximate quantity</label>
        <input
          id="quantity"
          name="quantity"
          type="text"
          placeholder="e.g. 24, 50, 100 cookies"
        />
      </div>
      <div className="field">
        <label htmlFor="message">Tell us about the occasion or story</label>
        <textarea
          id="message"
          name="message"
          required
          placeholder="Date needed, delivery area, flavour preferences, or who you’re thanking…"
        />
      </div>
      <p className="form-note">
        For Legend cookies, email a photo and a few bullet points about your person — Ken and
        Lorraine craft the label and poem with you. Cookies are baked to order and delivered fresh
        (Greater Toronto area &amp; by arrangement).
      </p>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="btn btn-primary" type="submit">
        Send inquiry
      </button>
    </form>
  )
}

export default function App() {
  useReveal()

  return (
    <div className="site" id="top">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />

      <main id="main">
        <section className="hero" aria-label="Miigwetch Cookies">
          <div className="hero-media">
            <img
              src={asset("images/gift-box.jpg")}
              alt="Assorted Miigwetch cookies packaged for gifting in a red gift box"
            />
          </div>
          <div className="hero-scrim" aria-hidden="true" />
          <div className="hero-content">
            <img
              className="hero-logo"
              src={asset("images/logo-transparent.png")}
              alt="Miigwetch Cookies — Sweetness with Gratitude"
            />
            <p className="hero-kicker">Sweetness with gratitude</p>
            <h1>Give the gift that says thank you</h1>
            <p className="hero-lead">
              Premium home-baked cookies from an Indigenous-owned bakery in Ontario — each one a
              thank-you, each package a story of people, places, and legends.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#order">
                Inquire about an order
              </a>
              <a className="btn btn-ghost" href="#cookies">
                Meet the cookies
              </a>
            </div>
          </div>
        </section>

        <section className="section meaning" aria-labelledby="meaning-title">
          <div className="section-inner meaning-grid reveal">
            <div>
              <p className="meaning-word" id="meaning-title">
                Miigwetch
                <em>means thank you</em>
              </p>
            </div>
            <p>
              It&apos;s the way we say thank you in our home and native land — and the heart of
              everything we bake. Gratitude for the land, the water, the air, and the people we love.
              Stay grateful. Give Miigwetch.
            </p>
          </div>
        </section>

        <section className="section" id="story" aria-labelledby="story-title">
          <div className="section-inner story-layout">
            <div className="story-copy reveal">
              <div className="section-head" style={{ marginBottom: 0 }}>
                <p className="eyebrow">Our story</p>
                <h2 id="story-title">Cookies that carry Indigenous stories</h2>
              </div>
              <p>
                Ken Costello — Métis Nation of Ontario citizen, entrepreneur, and baker — founded
                Miigwetch after the Aboriginal BEST program at the Native Canadian Centre of Toronto.
                His business plan placed third. The idea stuck: premium cookies with a purpose.
              </p>
              <p>
                There are plenty of cookie brands. Miigwetch stands apart by weaving Indigenous
                legends, history, and place into every package — printed on the back, like a fortune
                cookie with deeper roots. Kakabeka Falls. The Sleeping Giant. Turtle Island. Stories
                that deserve to be shared.
              </p>
              <p>
                Today Ken bakes from a licensed home bakery, expanding the kitchen one mixer and oven
                at a time — baking to order so every cookie arrives fresh.
              </p>
              <div className="badge-row">
                <span className="badge">100% Indigenous-owned</span>
                <span className="badge">Métis Nation of Ontario</span>
                <span className="badge">Belgian chocolate</span>
                <span className="badge">Baked to order</span>
              </div>
            </div>
            <div className="story-gallery reveal">
              <figure>
                <img
                  src={asset("images/baking-more.jpg")}
                  alt="Fresh Miigwetch cookies cooling on baking sheets"
                  loading="lazy"
                />
              </figure>
              <figure>
                <img
                  src={asset("images/vendor.jpg")}
                  alt="Miigwetch booth at a community marketplace"
                  loading="lazy"
                />
              </figure>
              <figure>
                <img
                  src={asset("images/packaging.jpg")}
                  alt="Individually packaged Miigwetch cookies ready for delivery"
                  loading="lazy"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="section cookies" id="cookies" aria-labelledby="cookies-title">
          <div className="section-inner">
            <div className="section-head reveal">
              <p className="eyebrow">The lineup</p>
              <h2 id="cookies-title">Each recipe tells its own story</h2>
              <p>
                Not one dough with sprinkles on top — distinct home-baked recipes, premium
                ingredients, and a legend or theme on every label.
              </p>
            </div>
            <div className="cookie-grid">
              {COOKIES.map((c) => (
                <article className="cookie-card reveal" key={c.name}>
                  <div className="media">
                    <img src={c.image} alt={c.name} loading="lazy" />
                  </div>
                  <div>
                    <p className="price">{c.price} each</p>
                    <h3>{c.name}</h3>
                    <p>{c.blurb}</p>
                    <p className="story-note">{c.story}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section legend" id="legends" aria-labelledby="legends-title">
          <div className="section-inner legend-layout">
            <div className="reveal">
              <div className="section-head" style={{ marginBottom: '0.5rem' }}>
                <p className="eyebrow">Legend cookies</p>
                <h2 id="legends-title">Turn someone you love into a legend</h2>
                <p>
                  Custom cookies for birthdays, milestones, and thank-yous — a portrait on the front,
                  a short poem or story on the back. Who in your life is a legend?
                </p>
              </div>
              <div className="legend-steps">
                <div className="legend-step">
                  <span className="num">1</span>
                  <div>
                    <strong>Share a photo</strong>
                    <p>A favourite picture of your person, team, or moment.</p>
                  </div>
                </div>
                <div className="legend-step">
                  <span className="num">2</span>
                  <div>
                    <strong>Send a few details</strong>
                    <p>What they love, what you’re grateful for, the occasion.</p>
                  </div>
                </div>
                <div className="legend-step">
                  <span className="num">3</span>
                  <div>
                    <strong>We craft &amp; bake</strong>
                    <p>Artwork and wording on the package — then fresh cookies, delivered.</p>
                  </div>
                </div>
              </div>
              <a className="btn btn-primary" href="#order">
                Start a legend cookie
              </a>
            </div>
            <div className="legend-photos reveal" aria-label="Custom legend cookie examples">
              <figure>
                <img src={asset("images/legend-molly.jpg")} alt="Custom Molly Lou legend cookie" loading="lazy" />
              </figure>
              <figure>
                <img src={asset("images/legend-natty.jpg")} alt="Custom Nathaniel Crooks legend cookie" loading="lazy" />
              </figure>
              <figure>
                <img src={asset("images/legend-hunter.jpg")} alt="Custom Hunter first birthday cookie" loading="lazy" />
              </figure>
            </div>
          </div>
        </section>

        <section className="section" id="corporate" aria-labelledby="corporate-title">
          <div className="section-inner corporate-layout">
            <div className="reveal">
              <div className="section-head" style={{ marginBottom: '1rem' }}>
                <p className="eyebrow">Corporate &amp; community</p>
                <h2 id="corporate-title">Gratitude that beats another plastic pen</h2>
                <p>
                  For clients, conferences, Truth and Reconciliation events, and team thank-yous —
                  a tangible gift with culture and care baked in.
                </p>
              </div>
              <div className="corporate-points">
                <div className="point">
                  <h3>Event &amp; conference giveaways</h3>
                  <p>
                    From Indigenous STEM gatherings to awards nights — planned batches of 50–100+
                    with delivery on your date.
                  </p>
                </div>
                <div className="point">
                  <h3>Client &amp; partner appreciation</h3>
                  <p>
                    Say thank you with Belgian chocolate and a story worth reading — not another
                    piece of branded swag that ends up in a drawer.
                  </p>
                </div>
                <div className="point">
                  <h3>Schools &amp; Every Child Matters</h3>
                  <p>
                    Branded cookies for Orange Shirt Day and community markets, delivered when you
                    need them.
                  </p>
                </div>
              </div>
            </div>
            <div className="corporate-visual reveal">
              <img
                src={asset("images/box-cookies.jpg")}
                alt="Box of individually wrapped Miigwetch cookies"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="section contact" id="order" aria-labelledby="order-title">
          <div className="section-inner contact-layout">
            <div className="contact-aside reveal">
              <div className="section-head" style={{ marginBottom: 0 }}>
                <p className="eyebrow">Orders</p>
                <h2 id="order-title">Bake to order — tell us what you need</h2>
                <p>
                  No storefront, no guesswork leftovers. Share your date, quantity, and occasion —
                  we&apos;ll confirm flavours, packaging, and delivery.
                </p>
              </div>
              <a className="email" href="mailto:miigwetch.cookies@gmail.com">
                miigwetch.cookies@gmail.com
              </a>
              <p className="prose">
                Proudly Indigenous-owned · Greater Toronto area delivery · Fresh from a licensed
                home bakery
              </p>
            </div>
            <div className="reveal">
              <InquiryForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src={asset("images/logo-transparent.png")} alt="" />
            <div>
              <strong>Miigwetch Cookies</strong>
              <span>Sweetness with gratitude</span>
            </div>
          </div>
          <div className="footer-meta">
            <a href="mailto:miigwetch.cookies@gmail.com">Email Ken</a>
            <a href="#cookies">Cookies</a>
            <a href="#legends">Legend cookies</a>
            <a href="#order">Order inquiry</a>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} Miigwetch Cookies. Miigwetch means thank you. Stay
            grateful.
          </p>
        </div>
      </footer>
    </div>
  )
}

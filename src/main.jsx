import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUpRight, CalendarDays, MapPin, Menu, Trophy, Users, X } from 'lucide-react';
import LumosCanvas from './LumosCanvas';
import './styles.css';

const HOUSE_TRACKS = [
  { house: 'Gryffindor', track: 'AI / ML', mark: '01', tone: 'crimson' },
  { house: 'Ravenclaw', track: 'Healthcare', mark: '02', tone: 'blue' },
  { house: 'Hufflepuff', track: 'Sustainable Development Goals', mark: '03', tone: 'gold' },
  { house: 'Slytherin', track: 'Open Innovation', mark: '04', tone: 'green' },
];

const GUIDE_STOPS = [
  { id: 'venue', label: 'Visit the venue' },
  { id: 'houses', label: 'Explore the houses' },
  { id: 'journey', label: 'See the two rounds' },
  { id: 'registration', label: 'Event details' },
];

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNightCampus, setShowNightCampus] = useState(false);
  const [activeGuideIndex, setActiveGuideIndex] = useState(0);
  const envelopeRef = useRef(null);

  useEffect(() => {
    const envelope = envelopeRef.current;
    if (!envelope) return undefined;

    let frameId = 0;
    let lastFrameTime = 0;
    let currentPose = null;
    let targetPose = null;
    let attachedToOwl = true;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const getAttachedPose = () => {
      const heroArt = document.querySelector('.landing-hero-art');
      if (!heroArt) return null;

      const rect = heroArt.getBoundingClientRect();
      const envelopeWidth = envelope.offsetWidth;
      const scale = Math.max(0.14, Math.min(0.42, rect.width * 0.26 / Math.max(1, envelopeWidth)));
      const visibleSizeRatio = envelopeWidth * scale / Math.max(1, rect.width);
      // The envelope's top fold (about 27% across, 23% down its square image)
      // sits on the beak; this keeps the owl's face clear as the art floats.
      return {
        x: ((rect.left + rect.width * (0.325 + (0.5 - 0.274) * visibleSizeRatio)) / window.innerWidth) * 100,
        y: ((rect.top + rect.height * (0.275 + (0.5 - 0.23) * visibleSizeRatio)) / window.innerHeight) * 100,
        scale,
        rotate: -5,
      };
    };

    const updateScrollTransition = () => {
      const hero = document.querySelector('.landing-hero');
      const showcase = document.querySelector('.campus-showcase');
      const heroArt = document.querySelector('.landing-hero-art');
      if (!hero || !showcase || !heroArt || !envelope) return;

      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const absoluteTop = (element) => element.getBoundingClientRect().top + scrollY;
      const heroTop = absoluteTop(hero);
      const venueTop = absoluteTop(showcase);
      const heroBottom = absoluteTop(hero) + hero.offsetHeight;
      const challenge = document.querySelector('.challenge-section');
      const journey = document.querySelector('.journey-section');
      const registration = document.querySelector('.registration-section');
      const footer = document.querySelector('.landing-footer');
      const isNarrow = window.innerWidth <= 640;
      const guideRightX = isNarrow ? 60 : 88;
      const guideLeftX = isNarrow ? 40 : 12;
      const guideTopY = isNarrow ? 22 : 24;
      const guideBottomY = isNarrow ? 76 : 77;
      const envelopeWidth = envelope.offsetWidth;
      const guideScale = isNarrow ? 0.46 : Math.min(0.48, Math.max(0.39, 300 / envelopeWidth));
      const startAt = heroTop + viewportHeight * 0.18;
      const attachedPose = getAttachedPose();
      const releasePose = attachedPose
        ? { ...attachedPose, y: (attachedPose.y * viewportHeight / 100 + scrollY - startAt) / viewportHeight * 100 }
        : { x: 50, y: 50, scale: 0.2, rotate: -5 };
      const stops = [
        { at: startAt, ...releasePose },
        { at: heroBottom - viewportHeight * 0.18, x: guideRightX, y: guideTopY, scale: guideScale, rotate: 16 },
        { at: venueTop + viewportHeight * 0.18, x: guideRightX - (isNarrow ? 3 : 5), y: guideTopY + 4, scale: guideScale, rotate: -7 },
        { at: venueTop + viewportHeight * 0.8, x: guideRightX, y: 52, scale: guideScale, rotate: 8 },
        { at: venueTop + viewportHeight * 1.55, x: guideRightX - 8, y: guideBottomY, scale: guideScale, rotate: -8 },
        { at: venueTop + showcase.offsetHeight - viewportHeight * 0.18, x: guideRightX, y: guideTopY, scale: guideScale, rotate: 16 },
        { at: absoluteTop(challenge) + viewportHeight * 0.28, x: guideRightX, y: guideTopY, scale: guideScale, rotate: -7 },
        { at: absoluteTop(challenge) + viewportHeight * 0.82, x: guideRightX, y: guideBottomY, scale: guideScale, rotate: 8 },
        { at: absoluteTop(journey) + viewportHeight * 0.2, x: guideLeftX, y: guideBottomY, scale: guideScale, rotate: -12 },
        { at: absoluteTop(journey) + viewportHeight * 0.78, x: guideLeftX, y: guideTopY, scale: guideScale, rotate: 9 },
        { at: absoluteTop(registration) + viewportHeight * 0.2, x: guideRightX, y: guideBottomY, scale: guideScale, rotate: -10 },
        { at: absoluteTop(footer) + viewportHeight * 0.25, x: guideLeftX, y: guideTopY, scale: guideScale, rotate: 8 },
      ];
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
      let pose;
      attachedToOwl = scrollY < startAt;
      if (attachedToOwl) {
        pose = attachedPose || releasePose;
      } else {
        const segmentIndex = stops.findIndex((stop, index) => index < stops.length - 1 && scrollY <= stops[index + 1].at);
        const segment = Math.max(0, segmentIndex < 0 ? stops.length - 2 : segmentIndex);
        const from = stops[segment];
        const to = stops[segment + 1];
        const local = clamp((scrollY - from.at) / Math.max(1, to.at - from.at), 0, 1);
        const eased = local * local * (3 - 2 * local);
        const point = (a, b) => a + (b - a) * eased;
        pose = {
          x: point(from.x, to.x),
          y: point(from.y, to.y),
          scale: point(from.scale, to.scale),
          rotate: point(from.rotate, to.rotate),
        };
      }

      if (!attachedToOwl) {
        pose.x = clamp(pose.x, isNarrow ? 38 : 8, isNarrow ? 62 : 92);
        pose.y = clamp(pose.y, 12, 84);
      }
      targetPose = pose;
      if (!currentPose) currentPose = { ...pose };
      envelope.style.opacity = '1';
      if (!frameId) frameId = window.requestAnimationFrame(animateEnvelope);

      const guideSections = [showcase, challenge, journey, registration];
      let guideIndex = 0;
      guideSections.forEach((section, index) => {
        if (absoluteTop(section) <= scrollY + viewportHeight * 0.56) guideIndex = index;
      });
      const guiding = scrollY > heroTop + viewportHeight * 0.48;
      envelope.classList.toggle('is-guiding', guiding);
      envelope.style.pointerEvents = guiding ? 'auto' : 'none';
      setActiveGuideIndex((current) => current === guideIndex ? current : guideIndex);
      setShowNightCampus(scrollY >= venueTop + viewportHeight * 0.72);
    };

    function animateEnvelope(time) {
      if (!targetPose || !currentPose) {
        frameId = 0;
        return;
      }
      if (attachedToOwl) {
        const pose = getAttachedPose();
        if (pose) {
          currentPose = pose;
          targetPose = { ...currentPose };
          envelope.style.transform = `translate3d(${currentPose.x}vw, ${currentPose.y}vh, 0) translate(-50%, -50%) scale(${currentPose.scale}) rotate(${currentPose.rotate}deg)`;
        }
        if (reduceMotion) {
          frameId = 0;
          return;
        }
        frameId = window.requestAnimationFrame(animateEnvelope);
        return;
      }
      const delta = lastFrameTime ? Math.min(48, time - lastFrameTime) : 16;
      lastFrameTime = time;
      const ease = reduceMotion ? 1 : 1 - Math.exp(-delta / 90);
      let remaining = 0;
      ['x', 'y', 'scale', 'rotate'].forEach((key) => {
        const difference = targetPose[key] - currentPose[key];
        currentPose[key] += difference * ease;
        remaining = Math.max(remaining, Math.abs(difference));
      });
      envelope.style.transform = `translate3d(${currentPose.x}vw, ${currentPose.y}vh, 0) translate(-50%, -50%) scale(${currentPose.scale}) rotate(${currentPose.rotate}deg)`;
      if (remaining > 0.015) frameId = window.requestAnimationFrame(animateEnvelope);
      else {
        currentPose = { ...targetPose };
        lastFrameTime = 0;
        frameId = 0;
      }
    }

    window.addEventListener('scroll', updateScrollTransition, { passive: true });
    window.addEventListener('resize', updateScrollTransition);
    updateScrollTransition();
    return () => {
      window.removeEventListener('scroll', updateScrollTransition);
      window.removeEventListener('resize', updateScrollTransition);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="site-wrapper landing-page">
      <LumosCanvas />
      <a
        ref={envelopeRef}
        className="scrolling-seal-guide"
        href={`#${GUIDE_STOPS[activeGuideIndex].id}`}
        aria-label={GUIDE_STOPS[activeGuideIndex].label}
      >
        <img
          className="scrolling-seal-envelope"
          src="/assets/v2/Gemini_Generated_Image_5hr7u45hr7u45hr7-clean.png"
          alt=""
          aria-hidden="true"
        />
        <span className="letter-guide-label"><span>THE OWL POST</span>{GUIDE_STOPS[activeGuideIndex].label}<ArrowUpRight size={14} /></span>
      </a>

      <header className="landing-header">
        <a className="landing-brand" href="#home" aria-label="HexWartz home">
          <span className="landing-brand-name">HexWartz</span>
          <span className="landing-brand-sub">Sharda University · Agra</span>
        </a>
        <button
          className="landing-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={`landing-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="#venue" onClick={() => setMenuOpen(false)}>Venue</a>
          <a href="#houses" onClick={() => setMenuOpen(false)}>Houses & tracks</a>
          <a href="#journey" onClick={() => setMenuOpen(false)}>The journey</a>
          <a href="#registration" onClick={() => setMenuOpen(false)}>Event details</a>
          <a className="landing-nav-cta" href="#registration" onClick={() => setMenuOpen(false)}>Join the challenge <ArrowUpRight size={16} /></a>
        </nav>
      </header>

      <main id="home">
        <section className="landing-hero" aria-labelledby="hero-title">
          <div className="landing-hero-glow" aria-hidden="true" />
          <div className="landing-hero-inner">
            <div className="landing-hero-copy">
              <p className="landing-kicker"><span /> Sharda University Agra · Anand School of Engineering and Technology</p>
              <h1 id="hero-title">Where code<br /><em>meets magic.</em></h1>
              <p className="landing-hero-lede">Four houses. One grand challenge. Build bold ideas, solve real problems, and make your mark at HexWartz.</p>
              <div className="landing-hero-meta">
                <span><CalendarDays size={17} /> 13–14 November 2026</span>
                <span><MapPin size={17} /> Sharda University, Agra</span>
              </div>
              <div className="landing-hero-actions">
                <a className="gold-button" href="#challenge">Explore the challenge <ArrowDown size={17} /></a>
                <a className="text-button" href="#registration">Registration details <ArrowUpRight size={17} /></a>
              </div>
              <p className="landing-format-note">A 24-hour hackathon · Online shortlist · Offline grand finale</p>
            </div>
            <div className="landing-hero-art-wrap">
              <div className="landing-art-frame">
                <img
                  className="landing-hero-art"
                  src="/assets/v2/Gemini_Generated_Image_qshw3cqshw3cqshw-clean%20%281%29.png"
                  alt="HexWartz crest with a moonlit castle, owl, and spellbook"
                  fetchPriority="high"
                />
              </div>
              <div className="prize-callout"><Trophy size={20} /><span><small>Prize pool</small><strong>₹50,000+</strong></span></div>
            </div>
          </div>
          <div className="landing-hero-bottomline"><span>HEXWARTZ 2026</span><span>FOUR HOUSES · ONE GRAND CHALLENGE</span><span>SCROLL TO EXPLORE ↓</span></div>
        </section>

        <section className="campus-showcase" id="venue" aria-label="Sharda University Agra by day and night">
          <div className="campus-showcase-sticky">
            <img
              className={`campus-showcase-image ${showNightCampus ? 'is-hidden' : 'is-visible'}`}
              src="/assets/v2/sharda%20agra.jpg"
              alt="Sharda University Agra campus in daylight"
              fetchPriority="high"
            />
            <img
              className={`campus-showcase-image ${showNightCampus ? 'is-visible' : 'is-hidden'}`}
              src="/assets/v2/Gemini_Generated_Image_msm9x2msm9x2msm9-clean.png"
              alt="Sharda University Agra campus at night"
            />
            <div className="campus-showcase-shade" />
            <div className="campus-showcase-caption">
              <span>OFFICIAL VENUE</span>
              <strong>SHARDA UNIVERSITY, AGRA</strong>
              <small>Anand School of Engineering and Technology</small>
            </div>
            <span className="campus-showcase-scroll-hint" aria-hidden="true">SCROLL TO EXPLORE ↓</span>
          </div>
        </section>

        <section className="landing-section challenge-section" id="challenge" aria-labelledby="challenge-title">
          <div className="landing-section-head">
            <p className="section-kicker">Four houses · four challenge tracks</p>
            <h2 id="challenge-title">Choose your <em>frontier.</em></h2>
            <p>Find your house and explore the event’s four challenge tracks.</p>
          </div>
          <div className="house-track-grid" id="houses">
            {HOUSE_TRACKS.map(({ house, track, mark, tone }) => (
              <article className={`house-track-card tone-${tone}`} key={house}>
                <span className="track-number">{mark}</span>
                <span className="track-house">{house}</span>
                <h3>{track}</h3>
                <span className="track-rule" />
                <p>Build a thoughtful solution for the {track.toLowerCase()} challenge.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section journey-section" id="journey" aria-labelledby="journey-title">
          <div className="landing-section-head">
            <p className="section-kicker">From first idea to grand finale</p>
            <h2 id="journey-title">Two rounds. <em>One destination.</em></h2>
          </div>
          <div className="journey-steps">
            <article className="journey-step">
              <span className="journey-index">01</span>
              <div><span className="journey-mode">ONLINE ROUND</span><h3>PPT-based shortlisting</h3><p>Share your proposal in the online round. Shortlisted teams advance to the offline finale.</p></div>
              <ArrowUpRight className="journey-arrow" size={24} />
            </article>
            <article className="journey-step">
              <span className="journey-index">02</span>
              <div><span className="journey-mode">OFFLINE GRAND FINALE</span><h3>Build at Sharda Agra</h3><p>Meet, build, and present at Sharda University, Agra. Food and accommodation are provided for the finale.</p></div>
              <MapPin className="journey-arrow" size={24} />
            </article>
          </div>
        </section>

        <section className="landing-section registration-section" id="registration" aria-labelledby="registration-title">
          <div className="registration-panel">
            <div className="registration-copy">
              <p className="section-kicker">Everything you need to know</p>
              <h2 id="registration-title">Bring your <em>whole team.</em></h2>
              <p>Open to undergraduate and postgraduate students from recognized colleges and universities. Inter-college teams are welcome.</p>
              <div className="registration-facts">
                <div><Users size={18} /><span><small>Team size</small><strong>4–6 members</strong></span></div>
                <div><Trophy size={18} /><span><small>Prize pool</small><strong>₹50,000+</strong></span></div>
                <div><CalendarDays size={18} /><span><small>Dates</small><strong>13–14 Nov 2026</strong></span></div>
                <div><MapPin size={18} /><span><small>Finale</small><strong>Sharda University, Agra</strong></span></div>
              </div>
            </div>
            <div className="fee-card">
              <span className="fee-label">ROUND 1</span>
              <strong className="fee-price">FREE</strong>
              <p>Registration and PPT-based shortlisting</p>
              <span className="fee-divider" />
              <span className="fee-label">ROUND 2 · SHORTLISTED TEAMS</span>
              <strong className="fee-price">₹250 <small>/ member</small></strong>
              <p>Fee applies only to teams shortlisted for Round 2.</p>
              <a href="#journey" className="gold-button">See the two rounds <ArrowUpRight size={17} /></a>
            </div>
          </div>
          <p className="poster-note">Food and accommodation are provided for the offline grand finale.</p>
        </section>
      </main>

      <footer className="landing-footer">
        <a className="landing-brand" href="#home"><span className="landing-brand-name">HexWartz</span><span className="landing-brand-sub">Sharda University · Agra</span></a>
        <p>13–14 November 2026 <span>·</span> Anand School of Engineering and Technology</p>
        <a href="#home" className="back-to-top">Back to top ↑</a>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);

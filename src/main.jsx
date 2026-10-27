import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Sparkles, 
  Zap, 
  Menu, 
  X, 
  Award, 
  ShieldAlert, 
  Eye, 
  FlaskConical, 
  Wand2, 
  Coins, 
  Flame, 
  ChevronRight,
  ChevronDown,
  Volume2,
  VolumeX,
  Clock,
  Copy,
  Check,
  Compass,
  Scroll
} from 'lucide-react';
import LumosCanvas from './LumosCanvas';
import { sounds } from './sound';
import './styles.css';

// Speakers Data with Harry Potter lore & keynote topics
const ALL_SPEAKERS = [
  {
    id: 1,
    name: 'HERMIONE GRANGER',
    role: 'MINISTER & ARITHMANCY LEAD',
    img: '/assets/speaker_hermione.jpg',
    house: 'Gryffindor',
    wand: 'Vine wood, Dragon heartstring, 10¾"',
    topic: 'Compiling Runes: Parsing Ancient Spellbooks with Distributed Transformers'
  },
  {
    id: 2,
    name: 'CEDRIC DIGGORY',
    role: 'TRIWIZARD CAPTAIN & ARCHITECT',
    img: '/assets/speaker_cedric.jpg',
    house: 'Hufflepuff',
    wand: 'Ash, Unicorn hair, 12¼"',
    topic: 'Triwizard Reliability: Zero-Fault Systems During High-Risk Quests'
  },
  {
    id: 3,
    name: 'HARRY POTTER',
    role: 'AUROR CHIEF & DEFENSE PROTOCOLS',
    img: '/assets/speaker_harry.jpg',
    house: 'Gryffindor',
    wand: 'Holly, Phoenix feather, 11"',
    topic: 'Defense Against Dark Arts: Zero-Trust Cryptography for Spellcasters'
  },
  {
    id: 4,
    name: 'LUNA LOVEGOOD',
    role: 'FOUNDER AT SPECTRESPECS LABS',
    img: '/assets/speaker_luna.jpg',
    house: 'Ravenclaw',
    wand: 'Harebell wood, Thestral hair, 11½"',
    topic: 'Spectrespecs Spatial UI: Rendering Invisible Creatures with WebGL'
  },
  {
    id: 5,
    name: 'SEVERUS SNAPE',
    role: 'POTIONS & BACKEND SORCERY',
    img: '/assets/speaker_cedric.jpg',
    house: 'Slytherin',
    wand: 'Ebony, Basilisk horn, 13"',
    topic: 'Sub-Millisecond Cauldron Pipelines: High-Throughput Memory Alchemy'
  },
  {
    id: 6,
    name: 'MINERVA MCGONAGALL',
    role: 'DEPUTY HEAD & SYSTEM REFACTORING',
    img: '/assets/speaker_luna.jpg',
    house: 'Gryffindor',
    wand: 'Fir, Dragon heartstring, 9½"',
    topic: 'Transfiguration Patterns: Dynamic Type Shifting in Legacy Codebases'
  }
];

// Sponsors with Bounties
const SPONSORS_DATA = [
  { 
    name: 'OLLIVANDERS', 
    desc: 'FINE WANDS SINCE 382 BC', 
    bounty: '5,000 Galleon Hardware Bounty for Best IoT Wand Controller',
    icon: Wand2 
  },
  { 
    name: 'GRINGOTTS', 
    desc: 'WIZARDING VAULT & INCUBATOR', 
    bounty: '10,000 Galleons Seed Grant + Dragon-Secured Cloud Infrastructure',
    icon: Coins 
  },
  { 
    name: 'DAILY PROPHET', 
    desc: 'ARCANE CHRONICLES', 
    bounty: 'Exclusive Front-Page Moving Photo Feature for Hackathon Winners',
    icon: Eye 
  },
  { 
    name: 'WEASLEYS\' WHEEZES', 
    desc: 'CREATIVE LABS', 
    bounty: 'Most Creative Mischief-Making Hack Prize + 100 Skiving Snackboxes',
    icon: Flame 
  },
  { 
    name: 'NIMBUS RACING', 
    desc: 'HIGH-VELOCITY BROOMS', 
    bounty: 'Nimbus 2000 Pro Developer Kits for Ultra-Low Latency Streaming',
    icon: Zap 
  },
  { 
    name: 'MINISTRY OF MAGIC', 
    desc: 'DEPT. OF ARCANE INVENTIONS', 
    bounty: 'Official Order of Merlin Innovation Fellowship & Mentorship',
    icon: Award 
  }
];

export function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Interactive House Pledge
  const [pledgedHouse, setPledgedHouse] = useState('Gryffindor');
  const [housePoints, setHousePoints] = useState(480);

  // Speaker Filtering & Pagination
  const [speakerFilter, setSpeakerFilter] = useState('ALL');
  const [activeDot, setActiveDot] = useState(0);
  const [showAllSpeakers, setShowAllSpeakers] = useState(false);

  // Interactive Schedule Accordion (which day is expanded)
  const [expandedDay, setExpandedDay] = useState(null);

  // Interactive Spell Cast State in Hero
  const [spellCastActive, setSpellCastActive] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // 3D Tilt for Hero Frame
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Countdown Timer to Nov 13, 2026
  const [timeLeft, setTimeLeft] = useState({ days: 17, hours: 14, mins: 32, secs: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        return { ...prev, secs: 59, mins: prev.mins > 0 ? prev.mins - 1 : 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Registration Form State
  const [formData, setFormData] = useState({
    wizardName: '',
    email: '',
    house: 'Gryffindor',
    wandType: 'Phoenix Feather',
    projectTrack: 'Grand Triwizard Cup'
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleSound = () => {
    const next = sounds.toggle();
    setSoundEnabled(next);
  };

  const handleHouseSwitch = (house) => {
    setPledgedHouse(house);
    setHousePoints(prev => prev + 50);
    sounds.playChime([523.25, 659.25, 783.99, 1046.5]);
  };

  const triggerSpellCast = (spellName) => {
    setSpellCastActive(true);
    sounds.playSpell();
    setTimeout(() => setSpellCastActive(false), 2400);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(
`const tournament = new HexWartzTournament({
  house: "${pledgedHouse}",
  track: "Triwizard Cup",
  runtime: "v4.2-arcane"
});
await tournament.cast("WIN_HACKATHON");`
    );
    setCopiedCode(true);
    sounds.playChime();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  const filteredSpeakers = ALL_SPEAKERS.filter(s => {
    if (speakerFilter === 'ALL') return true;
    return s.house.toUpperCase() === speakerFilter.toUpperCase();
  });

  const displaySpeakers = showAllSpeakers ? filteredSpeakers : filteredSpeakers.slice(0, 4);

  const handleSubmit = (e) => {
    e.preventDefault();
    sounds.playChime([587.33, 739.99, 880, 1174.66]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
    }, 2800);
  };

  return (
    <div className="site-wrapper">
      {/* Background Lumos Particle Dust */}
      <LumosCanvas />

      {/* TOP COUNTDOWN & HOUSE SELECTOR BAR */}
      <div className="top-ticker">
        <div className="container">
          <div className="ticker-inner">
            
            <div className="ticker-left">
              <Clock size={14} color="var(--accent-gold-bright)" />
              <span>THE GOBLET OF FIRE AWAKENS IN:</span>
              <span className="ticker-countdown">
                {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.mins}M : {timeLeft.secs}S
              </span>
            </div>

            <div className="house-selector-strip">
              <span style={{ fontSize: '0.74rem', color: 'var(--fg-muted)' }}>PLEDGE HOUSE:</span>
              {['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'].map(h => (
                <button
                  key={h}
                  className={`house-pill-btn ${pledgedHouse === h ? 'active' : ''}`}
                  onClick={() => handleHouseSwitch(h)}
                  title={`Pledge for ${h} (+50 House Points)`}
                >
                  {h === 'Gryffindor' && '🦁'}
                  {h === 'Ravenclaw' && '🦅'}
                  {h === 'Hufflepuff' && '🦡'}
                  {h === 'Slytherin' && '🐍'}
                  <span>{h}</span>
                </button>
              ))}
            </div>

            <button 
              className={`sound-toggle-btn ${soundEnabled ? 'active' : ''}`}
              onClick={toggleSound}
              title={soundEnabled ? "Mute Enchanted Sounds" : "Enable Enchanted Sounds"}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{soundEnabled ? 'SPELLS ON' : 'SOUND'}</span>
            </button>

          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <header className="navbar-wrapper">
        <div className="container">
          <nav className="navbar" aria-label="Main Navigation">
            <a href="#top" className="brand-link" onClick={() => sounds.playWandHum()}>
              <span className="brand-top">
                HEXWARTZ <Zap size={20} className="bolt-icon" />
              </span>
              <span className="brand-sub">.COM</span>
            </a>

            <ul className="nav-links">
              <li><a href="#top" className="nav-link" onClick={() => sounds.playWandHum()}>Home</a></li>
              <li><a href="#journey" className="nav-link" onClick={() => sounds.playWandHum()}>Journey</a></li>
              <li><a href="#speakers" className="nav-link" onClick={() => sounds.playWandHum()}>Speakers</a></li>
              <li><a href="#schedule" className="nav-link" onClick={() => sounds.playWandHum()}>Schedule</a></li>
              <li><a href="#sponsors" className="nav-link" onClick={() => sounds.playWandHum()}>Sponsors</a></li>
              <li><a href="#prizes" className="nav-link" onClick={() => sounds.playWandHum()}>Prizes</a></li>
            </ul>

            <button 
              className="btn-primary-gold nav-cta-btn"
              onClick={() => {
                sounds.playChime();
                setModalOpen(true);
              }}
            >
              <Sparkles size={16} />
              <span>REGISTER TODAY</span>
            </button>

            <button 
              className="mobile-menu-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* =========================================================================
            HERO SECTION (Frogtober Format Adapted for HexWartz)
            ========================================================================= */}
        <section className="hero-frogtober-layout">
          <div className="container">
            
            {/* Top Right Organizer Brand (matching Leapfrog Open Source) */}
            <div className="hero-organizer-row">
              <a 
                href="#top" 
                className="hero-organizer-brand"
                title="Hogwarts Open Arcane Initiative"
                onClick={() => sounds.playWandHum()}
              >
                <div className="organizer-icon-badge">
                  <Wand2 size={20} />
                </div>
                <div className="organizer-text">
                  <span className="organizer-name">HexWartz</span>
                  <span className="organizer-sub">Open Arcane</span>
                </div>
              </a>
            </div>

            <div className="hero-frogtober-grid">
              
              {/* LEFT COLUMN: Peeking Mascot + 3D Block Wordmark + Info */}
              <div className="hero-left-block">
                
                {/* Peeking Mascot: Chibi Harry Potter */}
                <div className="peeking-mascot-wrapper">
                  <img 
                    src="/assets/harry_peeking.png" 
                    alt="Chibi Harry Potter peeking over HexWartz title" 
                    className="peeking-mascot-img"
                    onClick={() => {
                      sounds.playChime([523.25, 659.25, 783.99, 1046.5]);
                      setHousePoints(prev => prev + 25);
                    }}
                    title="Click Harry (+25 House Points)!"
                  />
                </div>

                {/* Giant 3D Isometric Block Title */}
                <div className="block-wordmark-container">
                  <span className="block-wordmark-top">HEXWARTZ</span>
                  <div className="block-wordmark-bottom-row">
                    <span className="block-wordmark-fest">HACK</span>
                    <div className="block-wordmark-year-stack">
                      <span className="block-year-digits">20</span>
                      <span className="block-year-digits">26</span>
                    </div>
                  </div>
                </div>

                {/* Subtitle & Description */}
                <h2 className="hero-format-tagline">Embracing Arcane Code</h2>
                <p className="hero-format-desc">
                  A 48-hour wizarding hackathon to summon spells, craft magical software, and compete for the legendary Triwizard Cup.
                </p>

                {/* Date Badge Pill */}
                <div 
                  className="hero-format-date-pill"
                  onClick={() => {
                    sounds.playChime();
                    setModalOpen(true);
                  }}
                  title="Click to register for HexWartz"
                >
                  <Clock size={18} color="var(--accent-gold-bright)" />
                  <span>Nov 13 to Nov 15, 2026</span>
                </div>

              </div>

              {/* RIGHT COLUMN: Retro Computer Terminal Monitor with Pinned Sticky Note */}
              <div className="hero-right-monitor-col">
                <div className="retro-monitor-assembly">
                  
                  {/* Monitor Bezel */}
                  <div className="retro-monitor-bezel">
                    
                    {/* Screen Glass */}
                    <div className="retro-monitor-screen">
                      
                      <div>
                        <div className="terminal-cmd-line">
                          $ cat participation_guidelines.txt
                        </div>

                        <div className="terminal-section-heading">
                          Participation guidelines:
                        </div>

                        <ul className="terminal-bullet-list">
                          <li className="terminal-bullet-item">
                            <span className="bullet-dot">•</span>
                            <span>Summon 1 working magical prototype between Nov 13 to Nov 15, 2026.</span>
                          </li>
                          <li className="terminal-bullet-item">
                            <span className="bullet-dot">•</span>
                            <span>At least 1 spell repository must be open-source on GitHub.</span>
                          </li>
                          <li className="terminal-bullet-item">
                            <span className="bullet-dot">•</span>
                            <span>PRs and repositories can be submitted by any Hogwarts House.</span>
                          </li>
                          <li className="terminal-bullet-item">
                            <span className="bullet-dot">•</span>
                            <span>Spells must not be labeled by the Ministry as 'Dark Arts.'</span>
                          </li>
                        </ul>
                      </div>

                      <div className="terminal-bottom-section">
                        <div className="terminal-subcmd-line">
                          $ register-hexwartz --info
                        </div>
                        
                        <div className="terminal-dotted-divider" />

                        <div className="terminal-register-area">
                          <span className="terminal-register-label">Register Now</span>
                          <a 
                            href="#register" 
                            className="terminal-register-link"
                            onClick={(e) => {
                              e.preventDefault();
                              sounds.playChime();
                              setModalOpen(true);
                            }}
                          >
                            <span>hex.ly/hexwartz-2026</span>
                            <ChevronRight size={16} />
                          </a>
                          <div className="terminal-cursor-prompt">
                            $ <span className="cursor-blink">_</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* PINNED PARCHMENT YELLOW STICKY NOTE WITH QR CODE */}
                    <div 
                      className="sticky-note-qr"
                      onClick={() => {
                        sounds.playChime();
                        setModalOpen(true);
                      }}
                      title="Scan or click to register for HexWartz Hackathon"
                    >
                      <div className="sticky-note-tape" />
                      
                      {/* Crisp Clean QR Code Vector with Lightning Bolt Center */}
                      <svg viewBox="0 0 100 100" className="qr-code-svg" fill="#0c0a09">
                        {/* Top-Left Position Square */}
                        <rect x="5" y="5" width="26" height="26" fill="none" stroke="#0c0a09" strokeWidth="6" />
                        <rect x="12" y="12" width="12" height="12" />

                        {/* Top-Right Position Square */}
                        <rect x="69" y="5" width="26" height="26" fill="none" stroke="#0c0a09" strokeWidth="6" />
                        <rect x="76" y="12" width="12" height="12" />

                        {/* Bottom-Left Position Square */}
                        <rect x="5" y="69" width="26" height="26" fill="none" stroke="#0c0a09" strokeWidth="6" />
                        <rect x="12" y="76" width="12" height="12" />

                        {/* Data Matrix Bits */}
                        <rect x="38" y="8" width="6" height="6" />
                        <rect x="48" y="14" width="6" height="6" />
                        <rect x="56" y="8" width="6" height="6" />
                        <rect x="38" y="24" width="6" height="6" />
                        <rect x="50" y="24" width="6" height="6" />

                        <rect x="8" y="38" width="6" height="6" />
                        <rect x="18" y="46" width="6" height="6" />
                        <rect x="8" y="56" width="6" height="6" />

                        <rect x="38" y="38" width="6" height="6" />
                        <rect x="56" y="38" width="6" height="6" />
                        <rect x="74" y="38" width="6" height="6" />
                        <rect x="86" y="46" width="6" height="6" />
                        <rect x="74" y="56" width="6" height="6" />

                        <rect x="38" y="68" width="6" height="6" />
                        <rect x="48" y="76" width="6" height="6" />
                        <rect x="38" y="86" width="6" height="6" />
                        <rect x="58" y="86" width="6" height="6" />
                        <rect x="74" y="74" width="6" height="6" />
                        <rect x="86" y="84" width="6" height="6" />

                        {/* Center Lightning Mark */}
                        <path d="M 52,44 L 46,52 L 50,52 L 48,60 L 56,50 L 52,50 Z" fill="#b35c52" stroke="#0c0a09" strokeWidth="1" />
                      </svg>
                    </div>

                  </div>

                  {/* Monitor Stand */}
                  <div className="retro-monitor-neck" />
                  <div className="retro-monitor-base" />

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            THE WIZARD'S JOURNEY: STAGGERED 4-CARD FLOW (Register, Build, Connect, Grow)
            ========================================================================= */}
        <section className="cards-flow-section" id="journey">
          <div className="container">
            
            <div className="cards-flow-header">
              <div className="cards-flow-eyebrow">
                <Sparkles size={16} />
                <span>THE WIZARD'S JOURNEY</span>
                <Sparkles size={16} />
              </div>
              <h2 className="cards-flow-headline">
                FROM ENROLLMENT TO TRIWIZARD CUP
              </h2>
            </div>

            <div className="cards-flow-wrapper">
              
              {/* Sweeping Glowing Golden Ribbon Weaving Through the Cards */}
              <svg 
                viewBox="0 0 1200 480" 
                className="cards-flow-ribbon-svg" 
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="wandRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#cca262" stopOpacity="0.4" />
                    <stop offset="25%" stopColor="#ffe676" stopOpacity="1" />
                    <stop offset="50%" stopColor="#f2be42" stopOpacity="0.9" />
                    <stop offset="75%" stopColor="#ffe676" stopOpacity="1" />
                    <stop offset="100%" stopColor="#cca262" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Primary Sweeping Golden Ribbon Path */}
                <path 
                  d="M 20,310 C 140,320 220,110 340,90 C 460,70 510,380 640,390 C 760,400 810,130 940,110 C 1040,90 1120,320 1190,300" 
                  fill="none" 
                  stroke="url(#wandRibbonGrad)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />

                {/* Secondary Delicate Swirling Spark Line */}
                <path 
                  d="M 40,290 C 160,340 200,90 320,80 C 480,60 490,410 630,410 C 780,410 790,110 930,95 C 1060,80 1100,340 1180,310" 
                  fill="none" 
                  stroke="#ffe676" 
                  strokeWidth="1.5" 
                  strokeDasharray="6 8"
                  opacity="0.8"
                />
              </svg>

              <div className="cards-flow-grid">
                
                {/* Card 1: REGISTER */}
                <article 
                  className="staggered-step-card card-step-1"
                  onClick={() => {
                    sounds.playWandHum();
                    setModalOpen(true);
                  }}
                  title="Click to register your guild"
                >
                  <h3 className="step-brush-title">REGISTER</h3>
                  
                  <div className="step-center-badge">
                    <span className="badge-tag-top">&lt;HEX/&gt;</span>
                    <span className="badge-tag-main">ENROLL</span>
                    <span className="badge-tag-sub">3.0 <Zap size={10} /></span>
                  </div>

                  <p className="step-card-desc">
                    Sign up your team now. Share your innovative ideas to solve real problems.
                  </p>
                </article>

                {/* Card 2: BUILD */}
                <article 
                  className="staggered-step-card card-step-2"
                  onClick={() => {
                    sounds.playSpell();
                  }}
                  title="Cast spell & build prototype"
                >
                  <h3 className="step-brush-title">BUILD</h3>
                  
                  <div className="step-center-badge">
                    <span className="badge-tag-top">&lt;CODE/&gt;</span>
                    <span className="badge-tag-main">CONJURE</span>
                    <span className="badge-tag-sub">3.0 <Wand2 size={10} /></span>
                  </div>

                  <p className="step-card-desc">
                    Code your solution using cutting-edge tech. Overcome challenges and bring your idea to life.
                  </p>
                </article>

                {/* Card 3: CONNECT */}
                <article 
                  className="staggered-step-card card-step-3"
                  onClick={() => {
                    sounds.playWandHum();
                  }}
                  title="Collaborate across Hogwarts houses"
                >
                  <h3 className="step-brush-title">CONNECT</h3>
                  
                  <div className="step-center-badge">
                    <span className="badge-tag-top">&lt;GUILD/&gt;</span>
                    <span className="badge-tag-main">ALLY</span>
                    <span className="badge-tag-sub">3.0 <Compass size={10} /></span>
                  </div>

                  <p className="step-card-desc">
                    Collaborate with students across majors. Network with peers who can boost your project.
                  </p>
                </article>

                {/* Card 4: GROW */}
                <article 
                  className="staggered-step-card card-step-4"
                  onClick={() => {
                    sounds.playChime([523.25, 659.25, 783.99, 1046.5]);
                  }}
                  title="Ascend & win the Triwizard Cup"
                >
                  <h3 className="step-brush-title">GROW</h3>
                  
                  <div className="step-center-badge">
                    <span className="badge-tag-top">&lt;CUP/&gt;</span>
                    <span className="badge-tag-main">ASCEND</span>
                    <span className="badge-tag-sub">3.0 <Award size={10} /></span>
                  </div>

                  <p className="step-card-desc">
                    Level up your skills with expert feedback. Top teams earn prizes and resume credentials.
                  </p>
                </article>

              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            SECONDARY BANNER: UNLOCKING THE HEXAVERSE
            ========================================================================= */}
        <section className="unlocking-banner-section">
          <div className="perspective-grid-floor" aria-hidden="true" />
          
          <div className="container">
            <div className="unlocking-grid">
              
              {/* Left Dynamic Wizard Runner with Telemetry HUD */}
              <div className="unlocking-character-left">
                <div 
                  className="character-card"
                  onClick={() => sounds.playWandHum()}
                >
                  <img 
                    src="/assets/wizard_runner.jpg" 
                    alt="Young wizard running dynamically with glowing wand and neon sneakers" 
                  />
                  
                  {/* Interactive Telemetry HUD */}
                  <div className="character-hud-badge">
                    <div className="character-hud-row">
                      <span>RUNNER_ID:</span>
                      <span className="character-hud-val">#GRYFF-884</span>
                    </div>
                    <div className="character-hud-row">
                      <span>SPEED:</span>
                      <span className="character-hud-val">120 KPH (FIREBOLT)</span>
                    </div>
                    <div className="character-hud-row">
                      <span>SPELL:</span>
                      <span className="character-hud-val" style={{ color: 'var(--accent-gold-bright)' }}>EXPELLIARMUS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Headline & Date & Button */}
              <div className="unlocking-center">
                <div className="event-date-tag">
                  <Sparkles size={16} />
                  <span>13 NOV - 15 NOV 2026</span>
                  <Sparkles size={16} />
                </div>

                <h2 className="sliced-headline">
                  <span className="sliced-line-1">UNLOCKING THE</span>
                  <span className="sliced-line-2">HEXAVERSE</span>
                </h2>

                <a 
                  href="#schedule" 
                  className="btn-white"
                  onClick={() => sounds.playWandHum()}
                >
                  EXPLORE TIMELINE
                </a>
              </div>

              {/* Right Floating Wizard in Mid-Air with Telemetry HUD */}
              <div className="unlocking-character-right">
                <div 
                  className="character-card"
                  onClick={() => sounds.playSpell()}
                >
                  <img 
                    src="/assets/wizard_floating.jpg" 
                    alt="Floating witch summoning arcane glowing holographic code rune windows" 
                  />

                  {/* Interactive Telemetry HUD */}
                  <div className="character-hud-badge">
                    <div className="character-hud-row">
                      <span>LEVITATION:</span>
                      <span className="character-hud-val">400 FT (WINGARDIUM)</span>
                    </div>
                    <div className="character-hud-row">
                      <span>LATENCY:</span>
                      <span className="character-hud-val">0.4 MS (FLOONET)</span>
                    </div>
                    <div className="character-hud-row">
                      <span>STACK:</span>
                      <span className="character-hud-val" style={{ color: 'var(--accent-gold-bright)' }}>REACT + ARITHMANCY</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            OUR SPEAKERS SECTION (With House Filters & Keynote Bios)
            ========================================================================= */}
        <section id="speakers" className="speakers-section">
          <div className="container">
            
            {/* Header: Outline "OUR" + Solid "SPEAKERS" + House Filter Tabs */}
            <div className="section-header-speakers">
              <div className="section-title-stacked">
                <span className="title-outline-lg font-display">OUR</span>
                <span className="title-solid-lg font-display">SPEAKERS</span>
              </div>

              <div className="speaker-filter-tabs">
                {['ALL', 'Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'].map(cat => (
                  <button
                    key={cat}
                    className={`speaker-filter-btn ${speakerFilter === cat ? 'active' : ''}`}
                    onClick={() => {
                      sounds.playWandHum();
                      setSpeakerFilter(cat);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Speakers Grid */}
            <div className="speakers-grid">
              {displaySpeakers.map((speaker) => (
                <article 
                  key={speaker.id} 
                  className="speaker-card"
                  onClick={() => sounds.playWandHum()}
                >
                  <span className="speaker-house-badge">
                    {speaker.house.toUpperCase()}
                  </span>

                  <div className="speaker-img-wrapper">
                    <img src={speaker.img} alt={`${speaker.name} portrait`} />
                  </div>

                  <div className="speaker-info">
                    <h3 className="speaker-name">{speaker.name}</h3>
                    <p className="speaker-role">{speaker.role}</p>
                    
                    <div className="speaker-keynote-snippet">
                      <span style={{ color: 'var(--accent-gold-bright)', fontWeight: 'bold' }}>KEYNOTE: </span>
                      <span>{speaker.topic}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Footer with pagination dots and pink CTA */}
            <div className="speakers-footer">
              <div className="carousel-dots" role="tablist" aria-label="Speaker navigation">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <button 
                    key={idx} 
                    className={`dot ${activeDot === idx ? 'active' : ''}`}
                    onClick={() => {
                      sounds.playWandHum();
                      setActiveDot(idx);
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button 
                className="btn-primary-gold"
                onClick={() => {
                  sounds.playChime();
                  setShowAllSpeakers(!showAllSpeakers);
                }}
              >
                {showAllSpeakers ? 'SHOW FEWER PROFESSORS' : 'VIEW ALL PROFESSORS'}
              </button>
            </div>

          </div>
        </section>

        {/* =========================================================================
            KEY STATS STRIP (Interactive Lore Hover)
            ========================================================================= */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              
              <div className="stat-item" onMouseEnter={() => sounds.playWandHum()}>
                <span className="stat-num">4+</span>
                <span className="stat-label">HOUSES</span>
                <span className="stat-sub">Competing for the 500 Pt Cup</span>
              </div>

              <div className="stat-item" onMouseEnter={() => sounds.playWandHum()}>
                <span className="stat-num">5+</span>
                <span className="stat-label">WORKSHOPS</span>
                <span className="stat-sub">Arithmancy AI to Zero-Trust Defense</span>
              </div>

              <div className="stat-item" onMouseEnter={() => sounds.playWandHum()}>
                <span className="stat-num">20+</span>
                <span className="stat-label">PROFESSORS</span>
                <span className="stat-sub">Mentors from Hogwarts & Ilvermorny</span>
              </div>

              <div className="stat-item" onMouseEnter={() => sounds.playWandHum()}>
                <span className="stat-num">16+</span>
                <span className="stat-label">SPELL TALKS</span>
                <span className="stat-sub">Live Keynotes & System Deep Dives</span>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            3 DAYS HACKATHON / SCHEDULE SECTION (Interactive Accordions)
            ========================================================================= */}
        <section id="schedule" className="schedule-section">
          <div className="container">
            
            <div className="schedule-header">
              <div className="section-title-stacked">
                <span className="title-outline-lg font-display">3 DAYS</span>
                <span className="title-solid-lg font-display">HACKATHON</span>
              </div>
              <p>
                Connect with wizard coders worldwide, brewing world-class spells and forging 
                connections across houses, guilds, and magical boundaries. Click any day to reveal the hour-by-hour timeline.
              </p>
            </div>

            <div className="schedule-grid">
              
              {/* Day 1 */}
              <div 
                className="day-card"
                onClick={() => {
                  sounds.playWandHum();
                  setExpandedDay(expandedDay === 1 ? null : 1);
                }}
              >
                <div className="day-top-row">
                  <span className="day-badge">DAY 1</span>
                  <span className="day-expand-prompt">
                    {expandedDay === 1 ? 'HIDE AGENDA ▲' : 'VIEW AGENDA ▼'}
                  </span>
                </div>

                <h3 className="day-title">The Sorting & Orientation</h3>
                <p className="day-desc">
                  Keynote address in the Great Hall, house allocation, and team formation under the enchanted ceiling.
                </p>

                {expandedDay === 1 && (
                  <div className="day-agenda-list">
                    <div className="agenda-row">
                      <span className="agenda-time">09:00</span>
                      <span className="agenda-desc">Great Hall Arrival & Sorting Feast</span>
                    </div>
                    <div className="agenda-row">
                      <span className="agenda-time">11:00</span>
                      <span className="agenda-desc">Opening Keynote by Hermione Granger</span>
                    </div>
                    <div className="agenda-row">
                      <span className="agenda-time">14:00</span>
                      <span className="agenda-desc">Wand Pairing & House Team Matching</span>
                    </div>
                    <div className="agenda-row">
                      <span className="agenda-time">18:00</span>
                      <span className="agenda-desc">Hacking Commences: The First Incantation</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Day 2 */}
              <div 
                className="day-card"
                onClick={() => {
                  sounds.playWandHum();
                  setExpandedDay(expandedDay === 2 ? null : 2);
                }}
              >
                <div className="day-top-row">
                  <span className="day-badge">DAY 2</span>
                  <span className="day-expand-prompt">
                    {expandedDay === 2 ? 'HIDE AGENDA ▲' : 'VIEW AGENDA ▼'}
                  </span>
                </div>

                <h3 className="day-title">Potion Brewing & Hacking</h3>
                <p className="day-desc">
                  Non-stop 24-hour sprint. Midnight cauldron feast, mentor office hours with Hogwarts professors, and debugging spells.
                </p>

                {expandedDay === 2 && (
                  <div className="day-agenda-list">
                    <div className="agenda-row">
                      <span className="agenda-time">00:00</span>
                      <span className="agenda-desc">Midnight Cauldron Treats & Butterbeer Sprint</span>
                    </div>
                    <div className="agenda-row">
                      <span className="agenda-time">09:00</span>
                      <span className="agenda-desc">Marauder's Mentor Office Hours</span>
                    </div>
                    <div className="agenda-row">
                      <span className="agenda-time">14:00</span>
                      <span className="agenda-desc">Workshop: Sub-Millisecond Database Potions</span>
                    </div>
                    <div className="agenda-row">
                      <span className="agenda-time">23:59</span>
                      <span className="agenda-desc">Code Freeze & Spell Verification</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Day 3 */}
              <div 
                className="day-card"
                onClick={() => {
                  sounds.playWandHum();
                  setExpandedDay(expandedDay === 3 ? null : 3);
                }}
              >
                <div className="day-top-row">
                  <span className="day-badge">DAY 3</span>
                  <span className="day-expand-prompt">
                    {expandedDay === 3 ? 'HIDE AGENDA ▲' : 'VIEW AGENDA ▼'}
                  </span>
                </div>

                <h3 className="day-title">Triwizard Showcase & Judging</h3>
                <p className="day-desc">
                  Live spell pitching before the Goblet of Fire, public demos, and the Grand House Cup coronation ceremony.
                </p>

                {/* Floating 3D Golden Snitch Badge with Playful Click Reaction */}
                <div 
                  className="snitch-floating-badge" 
                  title="Catch the Golden Snitch (+150 pts)!"
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playChime([783.99, 987.77, 1174.66, 1567.98]);
                    setHousePoints(prev => prev + 150);
                    alert("✨ GOLDEN SNITCH CAUGHT! +150 House Points awarded to your House!");
                  }}
                >
                  <img src="/assets/golden_snitch.jpg" alt="Golden Snitch badge" />
                </div>

                {expandedDay === 3 && (
                  <div className="day-agenda-list">
                    <div className="agenda-row">
                      <span className="agenda-time">10:00</span>
                      <span className="agenda-desc">Triwizard Project Showcase & Pitches</span>
                    </div>
                    <div className="agenda-row">
                      <span className="agenda-time">14:00</span>
                      <span className="agenda-desc">Ministry Judges Deliberation</span>
                    </div>
                    <div className="agenda-row">
                      <span className="agenda-time">17:00</span>
                      <span className="agenda-desc">Grand Trophy Award & Afterparty</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            SPONSORS SECTION (With Interactive Bounties)
            ========================================================================= */}
        <section id="sponsors" className="sponsors-section">
          <div className="container">
            <h2 className="sponsors-title font-display">SPONSORS & BOUNTIES</h2>
            <p className="sponsors-sub">
              Backing the brightest minds in wizardry with capital, cloud compute, and magical hardware bounties.
            </p>
            
            <div className="sponsors-grid">
              {SPONSORS_DATA.map((s, idx) => {
                const IconComponent = s.icon;
                return (
                  <div 
                    key={idx} 
                    className="sponsor-card-box"
                    onClick={() => sounds.playWandHum()}
                  >
                    <div className="sponsor-header-row">
                      <IconComponent size={22} className="sponsor-box-icon" />
                      <span className="sponsor-box-name">{s.name}</span>
                    </div>
                    <p className="sponsor-box-bounty">{s.bounty}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            PRIZES SECTION (Interactive Rewards & Tracks)
            ========================================================================= */}
        <section id="prizes" className="prizes-section">
          <div className="container">
            
            <div className="prizes-header">
              <h2>PRIZES & BOUNTIES</h2>
              <p>
                Get ready to brew your masterwork! The top performers will receive legendary artifacts, 
                galleons, and global recognition.
              </p>
            </div>

            <div className="prizes-grid">
              
              {/* Left Featured Grand Prize Card */}
              <div 
                className="prize-card-featured"
                onClick={() => sounds.playChime([523.25, 659.25, 783.99, 1046.5])}
              >
                {/* 50K Golden Ribbon Sticker */}
                <span className="prize-ribbon-tag">50 K</span>

                <div className="featured-prize-content">
                  <span className="featured-prize-eyebrow">GRAND CHAMPION</span>
                  <h3 className="featured-prize-role">THE TRIWIZARD CUP</h3>
                  <div className="featured-prize-amount">50,000 GALLEONS</div>
                  
                  <ul className="featured-prize-perks">
                    <li><Sparkles size={15} color="var(--accent-gold-bright)" /> The Crystalline Triwizard Cup (Custom Team Engraving)</li>
                    <li><Sparkles size={15} color="var(--accent-gold-bright)" /> Gringotts Ventures Seed Grant + Dragon Vault Access</li>
                    <li><Sparkles size={15} color="var(--accent-gold-bright)" /> 1-Year Order of Merlin Innovation Fellowship</li>
                  </ul>

                  <div className="featured-prize-trophy">
                    <img src="/assets/triwizard_cup.jpg" alt="Glowing Triwizard Cup Trophy" />
                  </div>
                </div>
              </div>

              {/* Right Prize Cards Stack */}
              <div className="prizes-stack">
                
                {/* Track 1 */}
                <div 
                  className="prize-subcard"
                  onClick={() => sounds.playWandHum()}
                >
                  <div className="prize-subcard-icon">
                    <ShieldAlert size={28} />
                  </div>
                  <div className="prize-subcard-info">
                    <span className="prize-subcard-amount">30,000 GALLEONS</span>
                    <h4 className="prize-subcard-title">Defense Against Dark Arts</h4>
                    <p className="prize-subcard-desc">Top cybersecurity, anti-curse zero-trust, and privacy wizardry.</p>
                  </div>
                </div>

                {/* Track 2 */}
                <div 
                  className="prize-subcard"
                  onClick={() => sounds.playWandHum()}
                >
                  <div className="prize-subcard-icon">
                    <Sparkles size={28} />
                  </div>
                  <div className="prize-subcard-info">
                    <span className="prize-subcard-amount">10,000 GALLEONS</span>
                    <h4 className="prize-subcard-title">Crowd's Choice & UI Charms</h4>
                    <p className="prize-subcard-desc">Most spellbinding frontend, interactive animations, and visual enchantment.</p>
                  </div>
                </div>

                {/* Track 3 */}
                <div 
                  className="prize-subcard"
                  onClick={() => sounds.playWandHum()}
                >
                  <div className="prize-subcard-icon">
                    <FlaskConical size={28} />
                  </div>
                  <div className="prize-subcard-info">
                    <span className="prize-subcard-amount">5,000 GALLEONS</span>
                    <h4 className="prize-subcard-title">Potions & Backend Alchemy</h4>
                    <p className="prize-subcard-desc">High-throughput distributed systems, arcane database alchemy, and APIs.</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-inner">
            <a href="#top" className="brand-link" onClick={() => sounds.playWandHum()}>
              <span className="brand-top">
                HEXWARTZ <Zap size={16} className="bolt-icon" />
              </span>
              <span className="brand-sub">.COM</span>
            </a>

            <p className="footer-motto">
              "Draco Dormiens Nunquam Titillandus — Code the Unimagined"
            </p>

            <p className="footer-copy">
              © 2026 HEXWARTZ HACKATHON. ALL WIZARDING RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>

      {/* REGISTRATION MODAL (The Sorting Hat Experience) */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <h3 className="modal-title font-display">ACCEPT YOUR INVITATION</h3>
            <p className="modal-sub">HEXWARTZ HACKATHON WEEK · 13-15 NOV 2026</p>

            {/* Sorting Hat Dialogue */}
            <div className="sorting-dialogue-box">
              <Scroll size={24} className="sorting-dialogue-icon" />
              <p className="sorting-dialogue-text">
                "Ah, another brave coder approaches the Goblet of Fire. 
                Whether your allegiance lies with Gryffindor boldness, Ravenclaw algorithmic wit, 
                or Slytherin ambition—your wand awaits."
              </p>
            </div>

            {submitted ? (
              <div style={{ padding: '32px 0', textAlign: 'center' }}>
                <Sparkles size={52} color="var(--accent-gold-bright)" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: 'var(--accent-gold-bright)', lineHeight: 1 }}>
                  OWL EN ROUTE TO {formData.wizardName.toUpperCase() || 'WIZARD'}!
                </h4>
                <p style={{ color: 'var(--fg-base)', marginTop: '12px', fontSize: '1rem', lineHeight: 1.5 }}>
                  Your official Hogwarts Acceptance Parchment and Tournament Ticket have been dispatched to <b>{formData.email}</b>.
                </p>
                <div style={{ marginTop: '16px', display: 'inline-block', padding: '8px 16px', borderRadius: '4px', background: 'var(--accent-crimson-deep)', color: 'var(--accent-gold-bright)', fontWeight: 'bold' }}>
                  HOUSE {formData.house.toUpperCase()} ALLOCATED · WAND PAIRED
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">WIZARD NAME</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Harry Potter"
                    className="form-input"
                    value={formData.wizardName}
                    onChange={(e) => setFormData({ ...formData, wizardName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">OWL POST (EMAIL)</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="harry@hexwartz.edu"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CHOOSE YOUR HOUSE</label>
                  <select 
                    className="form-select"
                    value={formData.house}
                    onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                  >
                    <option value="Gryffindor">🦁 Gryffindor (Courage & Audacity)</option>
                    <option value="Ravenclaw">🦅 Ravenclaw (Wisdom & Algorithmic Wit)</option>
                    <option value="Slytherin">🐍 Slytherin (Ambition & Resourcefulness)</option>
                    <option value="Hufflepuff">🦡 Hufflepuff (Loyalty & Dedication)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">WAND CORE</label>
                  <select 
                    className="form-select"
                    value={formData.wandType}
                    onChange={(e) => setFormData({ ...formData, wandType: e.target.value })}
                  >
                    <option value="Phoenix Feather">Phoenix Feather (Rare & Powerful Initiative)</option>
                    <option value="Dragon Heartstring">Dragon Heartstring (High Energy & Speed)</option>
                    <option value="Unicorn Hair">Unicorn Hair (Consistent & Reliable Output)</option>
                    <option value="Thestral Hair">Thestral Hair (Spatial & Unconventional Genius)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">CHOSEN TRACK</label>
                  <select 
                    className="form-select"
                    value={formData.projectTrack}
                    onChange={(e) => setFormData({ ...formData, projectTrack: e.target.value })}
                  >
                    <option value="Grand Triwizard Cup">🏆 Grand Triwizard Cup (Overall Best Hack)</option>
                    <option value="Defense Against Dark Arts">🛡️ Defense Against Dark Arts (Cybersecurity)</option>
                    <option value="UI Charms">✨ Charms & UI Magic (Frontend/Creative)</option>
                    <option value="Potions Backend">🧪 Potions & Backend Alchemy</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary-gold" style={{ width: '100%', marginTop: '12px' }}>
                  ENROLL FOR TOURNAMENT
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);

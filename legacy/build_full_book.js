const fs = require('fs');
const path = require('path');

const b64Image = fs.readFileSync(path.join(__dirname, 'user_img_b64.txt'), 'utf8').trim();

const htmlContent = `<!DOCTYPE html>
<html lang="en" class="lang-en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Thirukkural — Classical 3D Flip Book</title>
<style>
  :root {
    --bg-wood: #2b1f14;
    --paper-base: #f7edd9;
    --paper-vignette: #e5d2b3;
    --ink-primary: #2a1e12;
    --ink-soft: #5a4836;
    --gold-accent: #b8860b;
    --gold-bright: #d4af37;
    --palm-bg: linear-gradient(180deg, #e4be86 0%, #d5a563 50%, #c4904a 100%);
    --palm-border: #a37233;
    --cover-bg: linear-gradient(135deg, #3b0d0d 0%, #220505 60%, #120202 100%);
    --cover-gold: #e6c280;
    --shadow-color: rgba(15, 10, 5, 0.45);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: radial-gradient(circle at 50% 40%, #4a3828 0%, #1e150d 100%);
    font-family: 'Noto Serif Tamil', 'Latha', 'InaiMathi', 'Tamil Sangam MN', 'Georgia', 'Times New Roman', serif;
    color: var(--ink-primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    -webkit-user-select: none;
    user-select: none;
  }

  /* Header & Navigation Controls */
  .top-bar {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    display: flex;
    gap: 10px;
    align-items: center;
    background: rgba(30, 21, 13, 0.9);
    padding: 4px 14px;
    border-radius: 30px;
    border: 1px solid rgba(212, 175, 55, 0.45);
    box-shadow: 0 4px 18px rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
  }

  .controls button {
    font-family: inherit;
    background: transparent;
    border: 1px solid var(--gold-bright);
    color: #e6c280;
    padding: 2px 10px;
    border-radius: 16px;
    cursor: pointer;
    font-size: 11.5px;
    letter-spacing: 0.5px;
    transition: all 0.2s ease;
  }

  .controls button:hover {
    background: rgba(212, 175, 55, 0.25);
    color: #fff;
  }

  .controls button.active {
    background: var(--gold-bright);
    color: #1a0505;
    font-weight: 600;
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
  }

  .top-bar .sep {
    width: 1px;
    height: 14px;
    background: rgba(212, 175, 55, 0.3);
  }

  .page-indicator {
    font-size: 11.5px;
    color: #d4af37;
    font-style: italic;
    min-width: 180px;
    text-align: center;
  }

  /* 3D Book Scene Container */
  .scene {
    perspective: 2200px;
    perspective-origin: 50% 30%;
    width: min(1080px, 95vw);
    height: min(680px, 85vh);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-top: 10px;
  }

  /* Book Wrapper with Realistic Stacked Page Edges & Outer Cover Board */
  .book-outer-frame {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    padding: 8px;
    background: linear-gradient(135deg, #3d1414 0%, #1f0808 100%);
    box-shadow: 
      0 25px 35px rgba(0, 0, 0, 0.65),
      0 10px 15px rgba(0, 0, 0, 0.4),
      inset 0 0 0 2px rgba(212, 175, 55, 0.4),
      inset 0 0 15px rgba(0, 0, 0, 0.8);
    display: flex;
    transition: clip-path 0.4s ease;
  }

  /* Left & Right Page-Edge Stacks */
  .book-outer-frame::before,
  .book-outer-frame::after {
    content: '';
    position: absolute;
    top: 10px;
    bottom: 10px;
    width: 12px;
    z-index: 1;
    background: repeating-linear-gradient(
      90deg,
      #d9c5a3 0px,
      #bfa57d 1px,
      #e8d7b8 2px,
      #9a7f56 3px
    );
    box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
    transition: opacity 0.3s ease;
  }
  .book-outer-frame::before { left: 0px; border-radius: 4px 0 0 4px; }
  .book-outer-frame::after { right: 0px; border-radius: 0 4px 4px 0; }

  /* Closed Book State Clipping Rules */
  .book-outer-frame.closed-front::before { opacity: 0; }
  .book-outer-frame.closed-back::after { opacity: 0; }

  .book-outer-frame.closed-front {
    clip-path: inset(0 0 0 50%);
  }
  .book-outer-frame.closed-back {
    clip-path: inset(0 50% 0 0);
  }

  .book {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }

  /* Spine Center Crease Overlay */
  .spine-crease {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 28px;
    height: 100%;
    z-index: 50;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      rgba(0,0,0,0.35) 0%,
      rgba(0,0,0,0.1) 35%,
      rgba(255,255,255,0.15) 50%,
      rgba(0,0,0,0.1) 65%,
      rgba(0,0,0,0.35) 100%
    );
  }

  /* Individual Leaf (Page Pair) */
  .leaf {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    transform-style: preserve-3d;
    transform-origin: left center;
    transform: rotateY(0deg);
    touch-action: none;
  }

  /* Front & Back Faces */
  .face {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    background-color: var(--paper-base);
    background-image: 
      radial-gradient(ellipse at 50% 50%, var(--paper-base) 60%, var(--paper-vignette) 100%),
      repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px);
    overflow: hidden;
    box-shadow: inset 0 0 20px rgba(139, 94, 30, 0.15);
  }

  .face-back {
    transform: rotateY(180deg);
  }

  /* Ornate Frame & Corner Border Overlay */
  .page-frame-border {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 1px solid #a88242;
    pointer-events: none;
    z-index: 10;
  }

  .page-frame-border::before {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    border: 1px solid rgba(168, 130, 66, 0.4);
  }

  /* SVG Gold Corner Ornaments */
  .corner-ornament {
    position: absolute;
    width: 24px;
    height: 24px;
    fill: #966f2d;
    pointer-events: none;
  }
  .corner-ornament.top-left { top: -2px; left: -2px; }
  .corner-ornament.top-right { top: -2px; right: -2px; transform: scaleX(-1); }
  .corner-ornament.bottom-left { bottom: -2px; left: -2px; transform: scaleY(-1); }
  .corner-ornament.bottom-right { bottom: -2px; right: -2px; transform: scale(-1); }

  /* Page Content Container */
  .face-content {
    position: absolute;
    top: 26px;
    left: 22px;
    right: 22px;
    bottom: 26px;
    display: flex;
    flex-direction: column;
    z-index: 5;
  }

  /* Interactive Corner Turn Areas */
  .corner {
    position: absolute;
    bottom: 0;
    width: 90px;
    height: 90px;
    z-index: 40;
    cursor: pointer;
  }
  .corner-fwd { right: 0; }
  .corner-back { left: 0; }
  .corner::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 32px;
    height: 32px;
    border-radius: 0 0 0 100%;
    background: linear-gradient(135deg, transparent 50%, rgba(212,175,55,0.4) 50%);
    transition: all 0.2s ease;
  }
  .corner-fwd::after { right: 0; border-radius: 100% 0 0 0; }
  .corner-back::after { left: 0; border-radius: 0 100% 0 0; }
  
  .corner:hover::after {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, transparent 40%, rgba(212,175,55,0.7) 40%);
  }

  /* Rich Hardcover Front Cover Layout (Occupying 2/3 of Cover for Portrait) */
  .face-cover {
    background: var(--cover-bg) !important;
    color: var(--cover-gold);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    border: 3px solid var(--gold-bright);
    box-shadow: inset 0 0 50px rgba(0,0,0,0.9);
    position: relative;
    padding: 12px 10px 12px 10px;
  }

  /* Metallic Brass Corner Brackets on Hard Cover */
  .cover-bracket {
    position: absolute;
    width: 34px;
    height: 34px;
    border: 3px solid var(--gold-bright);
    pointer-events: none;
    z-index: 12;
  }
  .cover-bracket.top-left { top: 6px; left: 6px; border-right: none; border-bottom: none; }
  .cover-bracket.top-right { top: 6px; right: 6px; border-left: none; border-bottom: none; }
  .cover-bracket.bottom-left { bottom: 6px; left: 6px; border-right: none; border-top: none; }
  .cover-bracket.bottom-right { bottom: 6px; right: 6px; border-left: none; border-top: none; }

  /* User Thiruvalluvar Portrait Container - Exactly 2/3 of Cover Height */
  .portrait-container-23 {
    width: 92%;
    height: 82%; /* user requested proportion */
    border: 2px solid var(--gold-bright);
    border-radius: 6px;
    padding: 2px;
    background: #4a1515;
    box-shadow: 0 6px 20px rgba(0,0,0,0.85), inset 0 0 10px rgba(0,0,0,0.6);
    overflow: hidden;
    position: relative;
    margin-top: 4px;
  }

  .portrait-img-23 {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain; /* fit the full image within the frame */
    object-position: center center; /* center the image */
    background-color: #300909; /* filler behind letterboxed areas */
    border-radius: 4px;
  }

  .cover-title-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .cover-title-ta {
    font-size: 30px;
    font-weight: bold;
    letter-spacing: 2px;
    color: var(--gold-bright);
    text-shadow: 0 2px 6px rgba(0,0,0,0.9), 0 0 10px rgba(212,175,55,0.4);
    line-height: 1.1;
  }

  .cover-title-en {
    font-size: 14px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #e6c280;
  }

  .cover-author-text {
    font-size: 14px;
    color: var(--gold-bright);
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  /* Table of Contents Styling (Two-page spread matching Gokulnath Kural structure) */
  .toc-container {
    padding: 4px 6px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .toc-title {
    font-size: 18px;
    text-align: center;
    color: var(--ink-primary);
    border-bottom: 2px double var(--gold-accent);
    padding-bottom: 4px;
    margin-bottom: 8px;
  }
  .toc-section-header {
    font-size: 12px;
    font-weight: bold;
    color: #7a2b0e;
    background: rgba(184, 134, 11, 0.15);
    padding: 3px 6px;
    border-radius: 3px;
    margin-top: 4px;
    margin-bottom: 3px;
    border-left: 3px solid var(--gold-accent);
  }
  .toc-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .toc-item {
    padding: 4px 6px;
    font-size: 11.5px;
    border-bottom: 1px dashed rgba(168, 130, 66, 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border-radius: 3px;
    transition: background 0.15s ease;
  }
  .toc-item:hover {
    background: rgba(184, 134, 11, 0.2);
  }
  .toc-item.live {
    font-weight: 600;
    color: #4a2e16;
  }
  .toc-item.soon {
    color: #8c7b6b;
    font-style: italic;
    cursor: default;
  }
  .toc-badge {
    font-size: 10px;
    background: rgba(138, 74, 43, 0.15);
    color: #7a2b0e;
    padding: 1px 6px;
    border-radius: 10px;
    font-weight: bold;
  }

  /* Kural Reading Spread Styling (Palm Leaf Manuscript Cards) */
  .kpage-header-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12.5px;
    font-weight: 600;
    color: #6b2e15;
    border-bottom: 1.5px solid var(--gold-accent);
    padding-bottom: 3px;
    margin-bottom: 4px;
    flex-shrink: 0;
  }
  .chapter-nav-btn {
    background: rgba(138, 74, 43, 0.15);
    border: 1px solid var(--gold-accent);
    color: #501d07;
    border-radius: 12px;
    padding: 1px 8px;
    font-size: 10.5px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .chapter-nav-btn:hover {
    background: var(--gold-bright);
    color: #1a0505;
  }

  .klist {
    display: flex;
    flex-direction: column;
    gap: 3px;
    height: 100%;
    justify-content: space-between;
  }

  /* Individual Kural Item (Palm Leaf Strip Look) */
  .krow {
    position: relative;
    background: var(--palm-bg);
    border: 1px solid var(--palm-border);
    border-radius: 4px;
    padding: 2px 28px 2px 28px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
    min-height: 0;
  }

  .krow:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.6);
  }

  .krow.open {
    background: linear-gradient(180deg, #f0cf9e 0%, #e2b77a 100%);
    border-color: #8c5519;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
    flex-grow: 2;
  }

  /* String Binding Holes (Olai Suvadi Detail) */
  .string-hole {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background: #4a2e16;
    border-radius: 50%;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.3);
    z-index: 2;
  }
  .string-hole.left { left: 18px; }
  .string-hole.right { right: 18px; }

  /* Kural Index Badge */
  .knum {
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 9px;
    font-weight: bold;
    color: #4a2e16;
    opacity: 0.75;
    width: 12px;
    text-align: center;
  }

  /* Strict 2-Line Tamil Couplet Formatting (Line 1: 4 words, Line 2: 3 words) */
  .taline {
    font-size: 11px;
    line-height: 1.25;
    color: #1a0f07;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
  }

  /* Translation Line */
  .trline {
    font-size: 11px;
    line-height: 1.25;
    color: #2b1809;
    font-weight: 500;
  }

  /* Expanded Explanation Box */
  .kexp {
    display: none;
    font-size: 10px;
    line-height: 1.25;
    color: #401b05;
    margin-top: 3px;
    padding-top: 3px;
    border-top: 1px dashed rgba(74, 46, 22, 0.4);
    font-style: italic;
  }

  .krow.open .kexp {
    display: block;
  }

  /* Language Visibility Controls */
  .lang-en .only-de { display: none !important; }
  .lang-de .only-en { display: none !important; }

  /* Bottom Controls / Arrow Nav */
  .bottom-nav {
    position: absolute;
    bottom: 8px;
    display: flex;
    gap: 20px;
    z-index: 100;
  }
  .bottom-nav button {
    background: rgba(30, 21, 13, 0.88);
    border: 1px solid var(--gold-bright);
    color: var(--gold-bright);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .bottom-nav button:hover {
    background: var(--gold-bright);
    color: #1a0505;
    box-shadow: 0 0 12px rgba(212,175,55,0.6);
  }

  /* Responsive Adjustments for Mobile (390px) */
  @media (max-width: 600px) {
    .top-bar {
      top: 4px;
      padding: 3px 10px;
    }
    .controls button {
      padding: 2px 8px;
      font-size: 10.5px;
    }
    .page-indicator {
      min-width: 120px;
      font-size: 10px;
    }
    .scene {
      width: 98vw;
      height: 88vh;
      margin-top: 25px;
    }
    .book-outer-frame {
      padding: 4px;
    }
    .book-outer-frame::before, .book-outer-frame::after {
      width: 4px;
    }
    .face-content {
      top: 14px; left: 14px; right: 14px; bottom: 14px;
    }
    .taline, .trline {
      font-size: 9px;
    }
    .kexp {
      font-size: 8.5px;
    }
    .kpage-header-nav {
      font-size: 10.5px;
    }
    .string-hole {
      width: 5px; height: 5px;
    }
    .string-hole.left { left: 10px; }
    .string-hole.right { right: 10px; }
    .knum { left: 2px; font-size: 8.5px; }
    .krow { padding: 2px 18px 2px 18px; }
    .cover-title-ta { font-size: 22px; }
  }
</style>
</head>
<body class="lang-en">

  <div class="top-bar">
    <div class="controls">
      <button id="btnEN" class="active">EN</button>
      <button id="btnDE">DE</button>
    </div>
    <div class="sep"></div>
    <div class="page-indicator" id="pageInfo">closed · front cover</div>
  </div>

  <div class="scene">
    <div class="book-outer-frame closed-front">
      <div class="spine-crease"></div>
      <div class="book" id="book">
        <!-- Leaves dynamically created by JS -->
      </div>
    </div>
  </div>

  <div class="bottom-nav">
    <button id="prevBtn" title="Previous Page">&#10094;</button>
    <button id="nextBtn" title="Next Page">&#10095;</button>
  </div>

<script>
// Multi-Chapter Dataset from Gokulnath Thirukkural Taxonomy (133 Chapters total structure)
const chaptersData = {
  1: {
    title_ta: "அதிகாரம் 1: கடவுள் வாழ்த்து",
    title_en: "Chapter 1: In Praise of God",
    title_de: "Kapitel 1: Lob Gottes",
    kurals: [
      {ta1:"அகர முதல எழுத்தெல்லாம் ஆதி", ta2:"பகவன் முதற்றே உலகு.",
       ta_x:"அகரம் எழுத்துகளுக்கு முதன்மை போல, இறைவன் உலகின் மூலகாரணம்.",
       en:"As “A” begins every letter, God begins the world.", en_x:"The alphabet begins with A; the world begins with the primal being.",
       de:"Wie „A“ jeden Buchstaben beginnt, beginnt Gott die Welt.", de_x:"Das Alphabet beginnt mit A; die Welt beginnt mit dem Urwesen."},
      {ta1:"கற்றதனால் ஆய பயனென்கொல் வாலறிவன்", ta2:"நற்றாள் தொழாஅர் எனின்.",
       ta_x:"தூய அறிஞரின் அடி வணங்காதவர் கல்வி பயனற்றது.",
       en:"What use is learning without bowing to pure wisdom?", en_x:"Education is worthless without reverence for true wisdom.",
       de:"Was nützt Lernen ohne Ehrfurcht vor reiner Weisheit?", de_x:"Bildung ist wertlos ohne Ehrfurcht vor wahrer Weisheit."},
      {ta1:"மலர்மிசை ஏகினான் மாணடி சேர்ந்தார்", ta2:"நிலமிசை நீடுவாழ் வார்.",
       ta_x:"மலர் மேல் இறைவன் அடி அடைந்தோர் நீடு வாழ்வர்.",
       en:"Those who reach the flower-treading feet live long.", en_x:"Devotion to the lotus-dwelling divine brings an enduring life.",
       de:"Wer die Füße des Blütenwandlers erreicht, lebt lange.", de_x:"Hingabe an das Göttliche auf der Blüte bringt langes Leben."},
      {ta1:"வேண்டுதல் வேண்டாமை இலானடி சேர்ந்தார்க்கு", ta2:"யாண்டும் இடும்பை இல.",
       ta_x:"விருப்பு வெறுப்பு இல்லானை அடைந்தோர்க்கு துன்பம் இல்லை.",
       en:"No sorrow ever touches those who reach the desireless One.", en_x:"Union with the divine beyond craving ends worldly suffering.",
       de:"Kein Leid trifft die, die den Begierdelosen erreichen.", de_x:"Vereinigung mit dem Göttlichen beendet weltliches Leid."},
      {ta1:"இருள்சேர் இருவினையும் சேரா இறைவன்", ta2:"பொருள்சேர் புகழ்புரிந்தார் மாட்டு.",
       ta_x:"இறைவன் புகழ் போற்றுவோரை நல்-தீ வினை அணுகா.",
       en:"Good and evil deeds don't touch those who praise the Lord.", en_x:"Sincere praise of the divine frees one from karma.",
       de:"Gut und Böse berühren die Lobpreisenden nicht.", de_x:"Aufrichtiges Lob befreit vom Kreislauf des Karmas."},
      {ta1:"பொறிவாயில் ஐந்தவித்தான் பொய்தீர் ஒழுக்க", ta2:"நெறிநின்றார் நீடுவாழ்வார்.",
       ta_x:"ஐம்புலன் வென்றோனின் நெறி பின்பற்றுவோர் நீடு வாழ்வர்.",
       en:"Long live those who follow the five-senses' master.", en_x:"This truthful path brings a full, enduring life.",
       de:"Lange leben die Anhänger des Sinnesmeisters.", de_x:"Dieser Pfad führt zu einem erfüllten, langen Leben."},
      {ta1:"தனக்குவமை இல்லாதான் தாள்சேர்ந்தார்க்", ta2:"கல்லால் மனக்கவலை மாற்றல் அரிது.",
       ta_x:"ஒப்பற்றோன் அடி அடையாவிடின் கவலை நீங்காது.",
       en:"Only the incomparable One's feet dissolve the mind's sorrow.", en_x:"Only surrender to the divine truly ends anxiety.",
       de:"Nur die Füße des Unvergleichlichen lösen die Sorgen.", de_x:"Nur Hingabe an das Göttliche beendet die Angst."},
      {ta1:"அறவாழி அந்தணன் தாள்சேர்ந்தார்க்", ta2:"கல்லால் பிறவாழி நீந்தல் அரிது.",
       ta_x:"அறவாழியை அடையாவிடின் பிறவிக் கடல் கடத்தல் அரிது.",
       en:"Without the virtuous One, the other ocean can't be crossed.", en_x:"Devotion to righteousness makes worldly existence crossable.",
       de:"Ohne den Rechtschaffenen ist der andere Ozean unüberwindbar.", de_x:"Hingabe an Rechtschaffenheit macht das Dasein überwindbar."},
      {ta1:"கோளில் பொறியில் குணமிலவே எண்குணத்தான்", ta2:"தாளை வணங்காத் தலை.",
       ta_x:"எண்குணத்தானை வணங்காத் தலை பயனற்ற பொறி போன்றது.",
       en:"A head that won't bow is as useless as a faulty organ.", en_x:"Ignoring the eight divine virtues is like a blind sense.",
       de:"Ein Haupt ohne Ehrfurcht ist wie ein defektes Organ.", de_x:"Missachtung der acht Tugenden ist wie ein blindes Sinnesorgan."},
      {ta1:"பிறவிப் பெருங்கடல் நீந்துவர் நீந்தார்", ta2:"இறைவன் அடிசேரா தார்.",
       ta_x:"இறைவன் அடி அடையாதோர் பிறவிக் கடல் கடவார்.",
       en:"Only those at the Lord's feet cross the ocean of birth.", en_x:"Refuge at the divine's feet ends the cycle of rebirth.",
       de:"Nur wer beim Herrn Zuflucht sucht, überquert die Geburt.", de_x:"Zuflucht beim Göttlichen beendet den Kreislauf der Wiedergeburt."}
    ]
  },
  2: {
    title_ta: "அதிகாரம் 2: வான் சிறப்பு",
    title_en: "Chapter 2: The Glory of Rain",
    title_de: "Kapitel 2: Die Herrlichkeit des Regens",
    kurals: [
      {ta1:"வானின்று உலகம் வழங்கி வருதலால்", ta2:"தான்அமிழ்தம் என்றுணரப் பாற்று.",
       ta_x:"மழையால் உலகம் வாழ்வதால் மழை அமிழ்தம் எனக் கருதப்படும்.",
       en:"It is the rain that sustains the world, hence called nectar.", en_x:"Rain sustains all life on earth and is regarded as divine nectar.",
       de:"Der Regen erhält die Welt, daher wird er als Nektar bezeichnet.", de_x:"Regen erhält alles Leben auf Erden und gilt als göttlicher Nektar."},
      {ta1:"துப்பார்க்குத் துப்பாய துப்பாக்கித் துப்பார்க்குத்", ta2:"துப்பாய தூஉம் மழை.",
       ta_x:"உண்பவருக்கு உணவை உண்டாக்கித் தானும் உணவாகும் மழை.",
       en:"Rain creates food for consumers and itself becomes food.", en_x:"Rain provides food for all living beings while acting as drink.",
       de:"Regen erzeugt Nahrung für alle und wird selbst zur Nahrung.", de_x:"Regen spendet Nahrung für alle Lebewesen und dient als Trank."},
      {ta1:"விண்இன்று பொய்ப்பின் விரிநீர் வியனுலகத்து", ta2:"உள்நின்று உடற்றும் பசி.",
       ta_x:"மழை பெய்யாவிடின் கடலால் சூழப்பட்ட உலகிலும் பசி வாட்டும்.",
       en:"If clouds fail, hunger torments the ocean-bounded world.", en_x:"Even surrounded by vast oceans, drought brings suffering.",
       de:"Wenn der Regen ausbleibt, quält Hunger die ganze Welt.", de_x:"Selbst umgeben von Ozeanen bringt Dürre großes Leid."},
      {ta1:"ஏரின் உழாஅர் உழவர் புயல்என்னும்", ta2:"வாரி வளங்குன்றிக் கால்.",
       ta_x:"மழை என்னும் வருவாய் குன்றினால் உழவர் ஏர் உழ மாட்டார்.",
       en:"Farmers won't plough if rain's abundance declines.", en_x:"Agricultural work ceases when rainfall shrinks.",
       de:"Bauern pflügen nicht, wenn der Regen ausbleibt.", de_x:"Die Arbeit auf den Feldern ruht, wenn kein Regen fällt."},
      {ta1:"கெடுப்பதூஉம் கெட்டார்க்குச் சார்வாய்மற்று ஆங்கே", ta2:"எடுப்பதூஉம் எல்லாம் மழை.",
       ta_x:"வாழ்வைக் கெடுப்பதும் கெட்டவரை வாழ்விப்பதும் மழையே.",
       en:"Rain ruins and also restores those ruined.", en_x:"Rain has the power both to destroy and to revitalize prosperity.",
       de:"Regen zerstört und richtet Diejenigen wieder auf.", de_x:"Regen kann Wohlstand zerstören und ebenso wiederbelebe."},
      {ta1:"விசும்பின் துளிவீழின் அல்லால்மற்று ஆங்கே", ta2:"பசும்புல் தலைகாண்பு அரிது.",
       ta_x:"வானிலிருந்து மழைத்துளி வீழாவிட்டால் பசும்புல்லும் முளைக்காது.",
       en:"Without raindrops falling, even green grass cannot sprout.", en_x:"Even a blade of grass cannot grow without rain.",
       de:"Ohne Regentropfen kann kein Grashalm sprießen.", de_x:"Selbst ein Grashalm kann ohne Regen nicht wachsen."},
      {ta1:"நெடுங்கடலும் தன்நீர்மை குன்றும் தடிந்தெழிலி", ta2:"தான்நல்கா தாகி விடின்.",
       ta_x:"மேகம் மழை தராவிட்டால் விரிந்த கடலும் வளங்குன்றும்.",
       en:"Even the ocean shrinks if clouds withhold their rain.", en_x:"Vast seas lose their wealth when cloud showers cease.",
       de:"Selbst der Ozean schrumpft, wenn Wolken den Regen zurückhalten.", de_x:"Große Meere verlieren ihren Reichtum, wenn kein Regen fällt."},
      {ta1:"சிறப்பொடு பூசனை செல்லாது வானம்", ta2:"வறக்குமேல் வானோர்க்கும் ஈண்டு.",
       ta_x:"மழை பொய்த்தால் தேவர்க்கும் வழிபாடும் விழாவும் நடைபெறாது.",
       en:"Worship and festivals cease if the sky dries up.", en_x:"Even divine offerings wither when rains fail.",
       de:"Gottesdienste und Feste enden, wenn der Himmel austrocknet.", de_x:"Selbst göttliche Opfergaben versiegen bei Dürre."},
      {ta1:"தானம் தவம்இரண்டும் தங்கா வியனுலகம்", ta2:"வானம் வழங்கா தெனின்.",
       ta_x:"மழை பெய்யாவிட்டால் கொடையும் தவமும் உலகினில் நிலைக்காது.",
       en:"Charity and penance vanish if rain does not fall.", en_x:"Righteous virtues depend upon the blessings of water.",
       de:"Nächstenliebe und Buße schwinden ohne Regen.", de_x:"Rechtschaffene Tugenden hängen vom Segen des Wassers ab."},
      {ta1:"நீர்இன்று அமையாது உலகெனின் யார்யார்க்கும்", ta2:"வான்இன்று அமையாது ஒழுக்கு.",
       ta_x:"நீர் இன்றி உலகு இயங்காது; மழை இன்றி ஒழுக்கம் நிலைக்காது.",
       en:"As life needs water, virtue needs rain from above.", en_x:"No life exists without water; no order exists without rain.",
       de:"Ohne Wasser kein Leben; ohne Regen keine Ordnung.", de_x:"Kein Leben existiert ohne Wasser, keine Ordnung ohne Regen."}
    ]
  }
};

let currentChapter = 1;

// Gold Corner SVG Component
const cornerSVG = `
<svg class="corner-ornament top-left" viewBox="0 0 50 50">
  <path d="M2,2 L25,2 C15,2 10,6 8,8 C6,10 2,15 2,25 Z" opacity="0.3"/>
  <path d="M2,2 L48,2 C30,2 20,8 14,14 C8,20 2,30 2,48 L2,2 Z" fill="none" stroke="#966f2d" stroke-width="2"/>
  <path d="M6,6 L35,6 C25,6 16,10 12,12 C10,16 6,25 6,35 L6,6 Z" fill="none" stroke="#b8860b" stroke-width="1"/>
  <circle cx="10" cy="10" r="3"/>
</svg>
<svg class="corner-ornament top-right" viewBox="0 0 50 50">
  <path d="M2,2 L48,2 C30,2 20,8 14,14 C8,20 2,30 2,48 L2,2 Z" fill="none" stroke="#966f2d" stroke-width="2"/>
  <circle cx="10" cy="10" r="3"/>
</svg>
<svg class="corner-ornament bottom-left" viewBox="0 0 50 50">
  <path d="M2,2 L48,2 C30,2 20,8 14,14 C8,20 2,30 2,48 L2,2 Z" fill="none" stroke="#966f2d" stroke-width="2"/>
  <circle cx="10" cy="10" r="3"/>
</svg>
<svg class="corner-ornament bottom-right" viewBox="0 0 50 50">
  <path d="M2,2 L48,2 C30,2 20,8 14,14 C8,20 2,30 2,48 L2,2 Z" fill="none" stroke="#966f2d" stroke-width="2"/>
  <circle cx="10" cy="10" r="3"/>
</svg>`;

// HTML Generator for Page Face Content
function faceHTML(type) {
  const chData = chaptersData[currentChapter] || chaptersData[1];

  switch(type) {
    case 'cover':
      return `
        <div class="face-cover">
          <div class="cover-bracket top-left"></div>
          <div class="cover-bracket top-right"></div>
          <div class="cover-bracket bottom-left"></div>
          <div class="cover-bracket bottom-right"></div>
          
          <div class="portrait-container-23">
            <img src="data:image/jpeg;base64,${b64Image}" alt="Thiruvalluvar" class="portrait-img-23">
          </div>
          <div class="cover-title-group">
            <div class="cover-title-ta">திருக்குறள்</div>
            <div class="cover-title-en">THIRUKKURAL</div>
            <div class="cover-author-text">திருவள்ளுவர் (Thiruvalluvar)</div>
          </div>
        </div>`;
    case 'toc-ta':
      return `
        <div class="toc-container">
          <h3 class="toc-title">பொருளடக்கம் (TOC)</h3>
          <div class="toc-section-header">1. அறத்துப்பால் (Virtue) — 38 அதிகாரங்கள்</div>
          <ul class="toc-list">
            <li class="toc-item live" onclick="selectChapter(1)">
              <span>பாயிரவியல் · 1. கடவுள் வாழ்த்து</span> <span class="toc-badge">பக். 1</span>
            </li>
            <li class="toc-item live" onclick="selectChapter(2)">
              <span>2. வான் சிறப்பு</span> <span class="toc-badge">பக். 2</span>
            </li>
            <li class="toc-item soon">
              <span>3. நீத்தார் பெருமை</span> <span>விரைவில்</span>
            </li>
            <li class="toc-item soon">
              <span>4. அறன் வலியுறுத்தல்</span> <span>விரைவில்</span>
            </li>
            <li class="toc-item soon">
              <span>இல்லறவியல் / துறவறவியல் ...</span> <span>விரைவில்</span>
            </li>
          </ul>

          <div class="toc-section-header">2. பொருட்பால் (Wealth) — 70 அதிகாரங்கள்</div>
          <ul class="toc-list">
            <li class="toc-item soon">
              <span>அரசியலியல் / அமைச்சியல் ...</span> <span>விரைவில்</span>
            </li>
          </ul>

          <div class="toc-section-header">3. இன்பத்துப்பால் (Love) — 25 அதிகாரங்கள்</div>
          <ul class="toc-list">
            <li class="toc-item soon">
              <span>களவியல் / கற்பியல் ...</span> <span>விரைவில்</span>
            </li>
          </ul>
        </div>`;
    case 'toc-tr':
      return `
        <div class="toc-container">
          <h3 class="toc-title">
            <span class="only-en">Table of Contents</span>
            <span class="only-de">Inhaltsverzeichnis</span>
          </h3>
          <div class="toc-section-header">
            <span class="only-en">1. Book I — Aram (Virtue) — 38 Chapters</span>
            <span class="only-de">1. Buch I — Aram (Tugend) — 38 Kapitel</span>
          </div>
          <ul class="toc-list">
            <li class="toc-item live" onclick="selectChapter(1)">
              <span class="only-en">Prologue · 1. In praise of God</span>
              <span class="only-de">Prolog · 1. Lob Gottes</span>
              <span class="toc-badge">p. 1</span>
            </li>
            <li class="toc-item live" onclick="selectChapter(2)">
              <span class="only-en">2. The glory of rain</span>
              <span class="only-de">2. Die Herrlichkeit des Regens</span>
              <span class="toc-badge">p. 2</span>
            </li>
            <li class="toc-item soon">
              <span class="only-en">3. Greatness of ascetics</span>
              <span class="only-de">3. Größe der Asketen</span>
              <span class="only-en">Soon</span>
              <span class="only-de">Demnächst</span>
            </li>
            <li class="toc-item soon">
              <span class="only-en">Domestic / Ascetic Virtues ...</span>
              <span class="only-de">Häusliche / Asketische Tugenden ...</span>
              <span class="only-en">Soon</span>
              <span class="only-de">Demnächst</span>
            </li>
          </ul>

          <div class="toc-section-header">
            <span class="only-en">2. Book II — Porul (Wealth) — 70 Chapters</span>
            <span class="only-de">2. Buch II — Porul (Wohlstand) — 70 Kapitel</span>
          </div>
          <ul class="toc-list">
            <li class="toc-item soon">
              <span class="only-en">Royalty / Statehood ...</span>
              <span class="only-de">Königtum / Staatsführung ...</span>
              <span class="only-en">Soon</span>
              <span class="only-de">Demnächst</span>
            </li>
          </ul>

          <div class="toc-section-header">
            <span class="only-en">3. Book III — Inbam (Love) — 25 Chapters</span>
            <span class="only-de">3. Buch III — Inbam (Liebe) — 25 Kapitel</span>
          </div>
          <ul class="toc-list">
            <li class="toc-item soon">
              <span class="only-en">Pre-marital / Post-marital Love ...</span>
              <span class="only-de">Liebe vor/nach der Ehe ...</span>
              <span class="only-en">Soon</span>
              <span class="only-de">Demnächst</span>
            </li>
          </ul>
        </div>`;
    case 'tamil-list':
      return `
        <div class="kpage-header-nav">
          <span>${chData.title_ta}</span>
          <button class="chapter-nav-btn" onclick="nextChapter()">அடுத்த அதிகாரம் &#10095;</button>
        </div>
        <div class="klist">
          ${chData.kurals.map((k, i) => `
            <div class="krow" data-i="${i}">
              <div class="string-hole left"></div>
              <div class="string-hole right"></div>
              <div class="knum">${(currentChapter-1)*10 + i + 1}</div>
              <div class="taline">${k.ta1}</div>
              <div class="taline">${k.ta2}</div>
              <div class="kexp">${k.ta_x}</div>
            </div>
          `).join('')}
        </div>`;
    case 'translation-list':
      return `
        <div class="kpage-header-nav">
          <span class="only-en">${chData.title_en}</span>
          <span class="only-de">${chData.title_de}</span>
          <button class="chapter-nav-btn" onclick="nextChapter()">Next Ch. &#10095;</button>
        </div>
        <div class="klist">
          ${chData.kurals.map((k, i) => `
            <div class="krow" data-i="${i}">
              <div class="string-hole left"></div>
              <div class="string-hole right"></div>
              <div class="knum">${(currentChapter-1)*10 + i + 1}</div>
              <div class="trline">
                <span class="only-en">${k.en}</span>
                <span class="only-de">${k.de}</span>
              </div>
              <div class="kexp">
                <span class="only-en">${k.en_x}</span>
                <span class="only-de">${k.de_x}</span>
              </div>
            </div>
          `).join('')}
        </div>`;
    case 'back-cover':
      return `
        <div class="face-cover">
          <div class="cover-bracket top-left"></div>
          <div class="cover-bracket top-right"></div>
          <div class="cover-bracket bottom-left"></div>
          <div class="cover-bracket bottom-right"></div>
          
          <svg class="cover-ornament-center" viewBox="0 0 100 100" style="width:70px; height:70px; margin-bottom:15px;">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#d4af37" stroke-width="2"/>
            <polygon points="50,20 62,38 80,50 62,62 50,80 38,62 20,50 38,38" fill="#d4af37"/>
          </svg>
          <div class="cover-title-ta">முற்றிற்று</div>
          <div class="cover-title-en">The End</div>
          <div class="cover-subtitle">End of Chapter ${currentChapter}</div>
          <div class="cover-author">திருவள்ளுவர்</div>
        </div>`;
    default:
      return "";
  }
}

// Leaf Structure Configuration
const leaves = [
  { front: 'cover', back: 'toc-ta' },
  { front: 'toc-tr', back: 'tamil-list' },
  { front: 'translation-list', back: 'back-cover' }
];

const bookEl = document.getElementById('book');
const pageInfo = document.getElementById('pageInfo');

function renderBookContent() {
  bookEl.innerHTML = '';
  leaves.forEach((leaf, idx) => {
    const el = document.createElement('div');
    el.className = 'leaf';
    el.dataset.idx = idx;

    const isFrontCover = leaf.front === 'cover';
    const isBackCover = leaf.back === 'back-cover';

    const frontFrame = isFrontCover ? '' : `<div class="page-frame-border">${cornerSVG}</div>`;
    const backFrame = isBackCover ? '' : `<div class="page-frame-border">${cornerSVG}</div>`;

    el.innerHTML = `
      <div class="face face-front ${isFrontCover ? 'face-cover' : ''}">
        ${frontFrame}
        <div class="face-content">${faceHTML(leaf.front)}</div>
        <div class="corner corner-fwd"></div>
      </div>
      <div class="face face-back ${isBackCover ? 'face-cover' : ''}">
        ${backFrame}
        <div class="face-content">${faceHTML(leaf.back)}</div>
        <div class="corner corner-back"></div>
      </div>`;
    bookEl.appendChild(el);
  });
  updateLeaves();
}

let rightIndex = 0;
let dragging = null;

function updateLeaves() {
  const outerFrame = document.querySelector('.book-outer-frame');
  outerFrame.classList.toggle('closed-front', rightIndex === 0);
  outerFrame.classList.toggle('closed-back', rightIndex === leaves.length);

  leaves.forEach((l, i) => {
    if (dragging && dragging.idx === i) return;
    const el = bookEl.querySelector(`.leaf[data-idx="${i}"]`);
    if (!el) return;
    el.style.transition = 'transform 0.5s ease';
    const isFlipped = i < rightIndex;
    el.style.transform = isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)';
    el.style.zIndex = isFlipped ? (i + 1) : (leaves.length - i);
    
    const frontFace = el.querySelector('.face-front');
    const backFace = el.querySelector('.face-back');
    if (frontFace) frontFace.style.pointerEvents = isFlipped ? 'none' : 'auto';
    if (backFace) backFace.style.pointerEvents = isFlipped ? 'auto' : 'none';
  });

  const labels = [
    'closed · front cover',
    'contents · பொருளடக்கம் / table of contents',
    `reading · chapter ${currentChapter} (kurals ${(currentChapter-1)*10+1}–${currentChapter*10})`,
    'closed · back cover'
  ];
  pageInfo.textContent = labels[rightIndex] || '';
}

function selectChapter(chNum) {
  if (chaptersData[chNum]) {
    currentChapter = chNum;
    renderBookContent();
    rightIndex = 2; // Jump directly to reading spread for selected chapter!
    updateLeaves();
  }
}

function nextChapter() {
  if (chaptersData[currentChapter + 1]) {
    currentChapter++;
    renderBookContent();
    rightIndex = 2;
    updateLeaves();
  } else {
    selectChapter(1);
  }
}

renderBookContent();

// Navigation Helpers
function turnForward() {
  if (rightIndex < leaves.length) {
    rightIndex++;
    updateLeaves();
  }
}
function turnBackward() {
  if (rightIndex > 0) {
    rightIndex--;
    updateLeaves();
  }
}

// Pointer Drag & Click Turning Interaction
function startDrag(el, idx, direction, startX, pageWidth) {
  dragging = { el, idx, direction, startX, pageWidth, moved: 0, progress: 0 };
  el.style.transition = 'none';
  el.style.zIndex = 999;
  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', onDragEnd);
}

function onDragMove(e) {
  if (!dragging) return;
  const dx = e.clientX - dragging.startX;
  dragging.moved = Math.max(dragging.moved, Math.abs(dx));
  let progress, angle;
  if (dragging.direction === 'forward') {
    progress = Math.min(1, Math.max(0, -dx / dragging.pageWidth));
    angle = -180 * progress;
  } else {
    progress = Math.min(1, Math.max(0, dx / dragging.pageWidth));
    angle = -180 + 180 * progress;
  }
  dragging.progress = progress;
  dragging.el.style.transform = \`rotateY(\${angle}deg)\`;
}

function onDragEnd() {
  if (!dragging) return;
  const isTap = dragging.moved < 8;
  const commit = isTap ? true : dragging.progress > 0.4;
  const finalAngle = dragging.direction === 'forward' ? (commit ? -180 : 0) : (commit ? 0 : -180);
  
  dragging.el.style.transition = 'transform 0.4s ease';
  dragging.el.style.transform = \`rotateY(\${finalAngle}deg)\`;
  
  if (commit) {
    rightIndex += (dragging.direction === 'forward') ? 1 : -1;
    rightIndex = Math.max(0, Math.min(leaves.length, rightIndex));
  }
  
  dragging = null;
  window.removeEventListener('pointermove', onDragMove);
  window.removeEventListener('pointerup', onDragEnd);
  setTimeout(updateLeaves, 10);
}

// Corner Click & Drag Handler
bookEl.addEventListener('pointerdown', (e) => {
  const cornerEl = e.target.closest('.corner');
  const leafEl = e.target.closest('.leaf');
  if (!leafEl) return;

  const rect = bookEl.getBoundingClientRect();
  const localY = e.clientY - rect.top;
  const isBottomRegion = localY > rect.height * 0.70;

  if (!cornerEl && !isBottomRegion) return;

  const idx = parseInt(leafEl.dataset.idx);
  const pageWidth = rect.width / 2;
  const localX = e.clientX - rect.left;
  
  if (idx === rightIndex && localX > rect.width * 0.65) {
    startDrag(leafEl, idx, 'forward', e.clientX, pageWidth);
  } else if (idx === rightIndex - 1 && localX < rect.width * 0.35) {
    startDrag(leafEl, idx, 'backward', e.clientX, pageWidth);
  }
});

// Explicit Click Handler
bookEl.addEventListener('click', (e) => {
  const cornerFwd = e.target.closest('.corner-fwd');
  const cornerBack = e.target.closest('.corner-back');
  
  if (cornerFwd) {
    const leaf = cornerFwd.closest('.leaf');
    if (leaf && parseInt(leaf.dataset.idx) === rightIndex) {
      turnForward();
      return;
    }
  }
  if (cornerBack) {
    const leaf = cornerBack.closest('.leaf');
    if (leaf && parseInt(leaf.dataset.idx) === rightIndex - 1) {
      turnBackward();
      return;
    }
  }

  // Synchronized Accordion Expansion for Kurals
  const row = e.target.closest('.krow');
  if (!row) return;
  const i = row.dataset.i;
  const wasOpen = row.classList.contains('open');

  document.querySelectorAll('.krow.open').forEach(r => r.classList.remove('open'));
  if (!wasOpen) {
    document.querySelectorAll(\`.krow[data-i="\${i}"]\`).forEach(r => r.classList.add('open'));
  }
});

// Button Controls & Keyboard Shortcuts
document.getElementById('nextBtn').addEventListener('click', turnForward);
document.getElementById('prevBtn').addEventListener('click', turnBackward);
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') turnForward();
  if (e.key === 'ArrowLeft') turnBackward();
});

// Language Switcher
document.getElementById('btnDE').addEventListener('click', () => {
  document.documentElement.className = 'lang-de';
  document.body.className = 'lang-de';
  document.getElementById('btnDE').classList.add('active');
  document.getElementById('btnEN').classList.remove('active');
});
document.getElementById('btnEN').addEventListener('click', () => {
  document.documentElement.className = 'lang-en';
  document.body.className = 'lang-en';
  document.getElementById('btnEN').classList.add('active');
  document.getElementById('btnDE').classList.remove('active');
});
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent);
console.log('Successfully generated full book index.html with 2/3 cover portrait and multi-chapter dataset');

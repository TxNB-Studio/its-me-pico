/*
 * main.js - Core logic for It's Me Pico Gaming Website
 * Designed by Antigravity (Google DeepMind)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMiniGame();
  initCharacterShowcase();
  initCarousel();
  initContactForm();
});

/* ----------------------------------------------------
 * Navigation Logic
 * ---------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.main-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change navbar appearance on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  mobileToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    
    // Toggle icon lines animation
    const spans = mobileToggle.querySelectorAll('span');
    spans[0].style.transform = mainNav.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : '';
    spans[1].style.opacity = mainNav.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = mainNav.classList.contains('active') ? 'rotate(-45deg) translate(6px, -6px)' : '';
  });

  // Close nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      const spans = mobileToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    });
  });
}

/* ----------------------------------------------------
 * Simulated Gameplay Mini-Demo (Territory Battle)
 * ---------------------------------------------------- */
function initMiniGame() {
  const gridContainer = document.querySelector('.mini-gameplay-grid');
  const scoreLeft = document.querySelector('.mini-score-left');
  const scoreRight = document.querySelector('.mini-score-right');
  const scoreText = document.querySelector('.mini-score-text');
  const timerText = document.querySelector('.mini-timer');
  const coinsText = document.querySelector('.mini-coins-hud span');
  
  if (!gridContainer) return;

  const cols = 6;
  const rows = 10;
  const totalTiles = cols * rows;
  const tiles = [];
  
  // Create tiles in DOM
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement('div');
      tile.classList.add('mini-grid-tile');
      tile.dataset.row = r;
      tile.dataset.col = c;
      gridContainer.appendChild(tile);
      tiles.push({
        el: tile,
        row: r,
        col: c,
        color: null // 'yellow' | 'purple' | null
      });
    }
  }

  // Create two characters
  const charYellow = {
    el: document.createElement('div'),
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    color: 'yellow',
    class: 'yellow-char',
    symbol: 'P'
  };

  const charPurple = {
    el: document.createElement('div'),
    x: cols - 1,
    y: rows - 1,
    targetX: cols - 1,
    targetY: rows - 1,
    color: 'purple',
    class: 'purple-char',
    symbol: 'S'
  };

  // Set up character elements
  [charYellow, charPurple].forEach(char => {
    char.el.className = `mini-character ${char.class}`;
    char.el.innerText = char.symbol;
    gridContainer.appendChild(char.el);
    updateCharPos(char);
  });

  function updateCharPos(char) {
    // Math to position character centered on tile
    const tileW = gridContainer.clientWidth / cols;
    const tileH = gridContainer.clientHeight / rows;
    
    char.el.style.width = `${tileW - 8}px`;
    char.el.style.height = `${tileW - 8}px`; // Keep square
    char.el.style.left = `${char.x * tileW + 4}px`;
    char.el.style.top = `${char.y * tileH + 4}px`;
  }

  // Move character one step towards target
  function moveStep(char) {
    if (char.x === char.targetX && char.y === char.targetY) {
      // Find new target far from current position
      char.targetX = Math.floor(Math.random() * cols);
      char.targetY = Math.floor(Math.random() * rows);
    }

    // Step towards target
    if (char.x < char.targetX) char.x++;
    else if (char.x > char.targetX) char.x--;
    else if (char.y < char.targetY) char.y++;
    else if (char.y > char.targetY) char.y--;

    updateCharPos(char);

    // Color the current tile
    const index = char.y * cols + char.x;
    const tileObj = tiles[index];
    if (tileObj) {
      if (tileObj.color !== char.color) {
        tileObj.color = char.color;
        tileObj.el.className = 'mini-grid-tile';
        tileObj.el.classList.add(`colored-${char.color}`);
        
        // Brief scale jump animation
        tileObj.el.style.transform = 'scale(1.1)';
        setTimeout(() => {
          tileObj.el.style.transform = 'scale(1)';
        }, 150);

        // Update score
        recalculateScores();
      }
    }
  }

  let totalCoins = 142;
  function recalculateScores() {
    let yellowCount = 0;
    let purpleCount = 0;
    
    tiles.forEach(t => {
      if (t.color === 'yellow') yellowCount++;
      if (t.color === 'purple') purpleCount++;
    });

    const yellowPercent = Math.round((yellowCount / totalTiles) * 100);
    const purplePercent = Math.round((purpleCount / totalTiles) * 100);
    
    scoreLeft.style.width = `${yellowPercent}%`;
    scoreRight.style.width = `${purplePercent}%`;
    scoreText.innerHTML = `<span>PICO: ${yellowPercent}%</span><span>SHADOW: ${purplePercent}%</span>`;

    // Increment coin counts on scoring tiles
    if (Math.random() < 0.2) {
      totalCoins += Math.floor(Math.random() * 3) + 1;
      coinsText.innerText = totalCoins;
    }
  }

  // Timer loop
  let timeLeft = 60;
  setInterval(() => {
    timeLeft--;
    if (timeLeft < 0) {
      timeLeft = 60;
      // Reset arena tiles
      tiles.forEach(t => {
        t.color = null;
        t.el.className = 'mini-grid-tile';
      });
    }
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerText.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, 1000);

  // Main game loop (Character movement every 450ms)
  setInterval(() => {
    moveStep(charYellow);
    moveStep(charPurple);
  }, 450);

  // Keep size updated on window resize
  window.addEventListener('resize', () => {
    updateCharPos(charYellow);
    updateCharPos(charPurple);
  });
}

/* ----------------------------------------------------
 * Character Showcase Logic
 * ---------------------------------------------------- */
const charactersData = {
  'base-pico': {
    name: 'Base Pico',
    description: 'The hero of Pico\'s world! A energetic little yellow blob sporting his signature red cap. He is quick on his feet and ready to color the world.',
    bodyColor: 'Yellow',
    accessory: 'Red Cap',
    status: 'Unlocked',
    image: 'assets/images/base_pico.png',
    glow: 'rgba(255, 221, 0, 0.5)'
  },
  'shadow-pico': {
    name: 'Shadow Pico',
    description: 'Pico\'s mysterious rival from the dark purple world. Wears a cream beanie and a warm cream scarf. He moves stealthily, coloring tiles in deep purple.',
    bodyColor: 'Dark Blue',
    accessory: 'Cream Beanie & Scarf',
    status: 'Unlockable (500 Coins)',
    image: 'assets/images/shadow_pico.png',
    glow: 'rgba(155, 81, 224, 0.5)'
  },
  'angel-pico': {
    name: 'Angel Pico',
    description: 'Pure, divine, and floating high above. Angel Pico has an off-white body, a golden halo, and small feathered wings. She spreads bright light and wins with grace.',
    bodyColor: 'Off-White',
    accessory: 'Gold Halo & Wings',
    status: 'Unlockable (1000 Coins)',
    image: 'assets/images/angel_pico.png',
    glow: 'rgba(255, 255, 255, 0.4)'
  },
  'devil-pico': {
    name: 'Devil Pico',
    description: 'A fiery character from the volcanic core. Devil Pico has a bright red body, tiny horns, and a mischievous smile. Beware of his fast paint spreads!',
    bodyColor: 'Red',
    accessory: 'Devil Horns',
    status: 'Coming Soon',
    image: 'assets/images/devil_pico.png',
    glow: 'rgba(255, 71, 87, 0.5)'
  },
  'winter-pico': {
    name: 'Winter Pico',
    description: 'Wrapped up and ready for snow! Wearing a full winter coat and knit hat, Winter Pico loves sliding across frozen arenas, freezing tiles in ice-blue color.',
    bodyColor: 'Teal / Blue',
    accessory: 'Winter Outfit',
    status: 'Coming Soon',
    image: 'assets/images/winter_pico.png',
    glow: 'rgba(46, 213, 115, 0.5)'
  }
};

function initCharacterShowcase() {
  const cards = document.querySelectorAll('.char-thumbnail-card');
  const previewImg = document.querySelector('.char-preview-img');
  const previewGlow = document.querySelector('.char-preview-bg-glow');
  const charName = document.querySelector('.char-details-panel h3');
  const charDesc = document.querySelector('.char-details-panel p');
  const statsBody = document.querySelector('.stat-val-body');
  const statsAccessory = document.querySelector('.stat-val-accessory');
  const statsStatus = document.querySelector('.char-type-badge');

  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.char;
      const data = charactersData[id];
      if (!data) return;

      // Update active card class
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Update main showcase preview
      previewImg.style.opacity = '0';
      previewImg.style.transform = 'scale(0.8) translateY(10px)';
      
      setTimeout(() => {
        previewImg.src = data.image;
        previewImg.alt = data.name;
        previewImg.style.opacity = '1';
        previewImg.style.transform = 'scale(1) translateY(0)';
        previewGlow.style.background = data.glow;
      }, 200);

      // Update text values
      charName.innerText = data.name;
      charDesc.innerText = data.description;
      statsBody.innerText = data.bodyColor;
      statsAccessory.innerText = data.accessory;
      statsStatus.innerText = data.status;

      // Color coding the status badge
      if (data.status === 'Unlocked') {
        statsStatus.style.color = 'var(--pico-blue)';
      } else if (data.status.includes('Unlockable')) {
        statsStatus.style.color = 'var(--pico-yellow)';
      } else {
        statsStatus.style.color = 'var(--pico-red)';
      }
    });
  });
}

/* ----------------------------------------------------
 * Touch/Mouse Scrollable Carousel
 * ---------------------------------------------------- */
function initCarousel() {
  const carousel = document.querySelector('.screenshots-carousel');
  if (!carousel) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.classList.add('active');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    carousel.style.cursor = 'grabbing';
  });

  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.style.cursor = 'grab';
  });

  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.style.cursor = 'grab';
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2; // Scroll multiplier
    carousel.scrollLeft = scrollLeft - walk;
  });
}

/* ----------------------------------------------------
 * Contact Form Handler
 * ---------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  const statusMsg = document.querySelector('.form-status-msg');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      statusMsg.className = 'form-status-msg error';
      statusMsg.innerText = 'Please fill out all required fields!';
      return;
    }

    // Simulate sending message
    statusMsg.className = 'form-status-msg success';
    statusMsg.innerText = 'Winning! Your message has been sent successfully. TXnB will respond shortly.';
    form.reset();

    // Auto fade status
    setTimeout(() => {
      statusMsg.style.display = 'none';
    }, 6000);
  });
}

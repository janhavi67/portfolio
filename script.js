// ==================== DATABASE CONFIGURATION (SUPABASE) ====================
// Paste your Supabase Project URL and anon key here to connect your live Guestbook.
// If left blank, it will automatically fall back to browser localStorage.
const SUPABASE_URL = "https://uonekrkjfgmuscgajxqp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbmVrcmtqZmdtdXNjZ2FqeHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Nzk5NTQsImV4cCI6MjA5NzQ1NTk1NH0.uouCRjXFP1ZLepsKpuUTpiV0PzXSMYmmVxKUrqh92IQ";

document.addEventListener('DOMContentLoaded', () => {

  // ==================== 1. CUSTOM CURSOR FOLLOWER ====================
  // Create cursor elements dynamically so they are always present
  const cursorDot = document.createElement('div');
  cursorDot.id = 'customCursor';
  cursorDot.className = 'cursor-dot';
  const cursorFollower = document.createElement('div');
  cursorFollower.id = 'customCursorFollower';
  cursorFollower.className = 'cursor-follower';
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorFollower);

  let mouseX = 0;
  let mouseY = 0;
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';

      // Smooth follow effect using standard requestAnimationFrame or transition
      cursorFollower.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    // Delegated hover effects for any current or future interactive element
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, .nav-card, .coding-profile-tile, .skill-badge, .project-card-cyber, .cert-card-cyber');
      if (target) {
        cursorDot.classList.add('hovered');
        cursorFollower.classList.add('hovered');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('a, button, .nav-card, .coding-profile-tile, .skill-badge, .project-card-cyber, .cert-card-cyber');
      if (target) {
        cursorDot.classList.remove('hovered');
        cursorFollower.classList.remove('hovered');
      }
    });
  }

  // ==================== 2. MAGNETIC HOVER EFFECT ====================
  if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      const magneticEl = e.target.closest('.nav-card, .submit-btn-cyber, .quick-links a');
      if (magneticEl) {
        const rect = magneticEl.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        // Shift slightly towards mouse
        magneticEl.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        magneticEl.style.transition = 'transform 0.1s ease-out';
      }
    });

    document.addEventListener('mouseout', (e) => {
      const magneticEl = e.target.closest('.nav-card, .submit-btn-cyber, .quick-links a');
      if (magneticEl) {
        magneticEl.style.transform = '';
        magneticEl.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
      }
    });
  }

  // ==================== 3. SPLASH SCREEN TRANSITION ====================
  const splashScreen = document.getElementById('splashScreen');
  const portfolioContainer = document.getElementById('portfolioContainer');
  const logoTrigger = document.getElementById('logoClickTrigger');
  const splashPrompt = document.getElementById('splashPrompt');
  const splashVideo = document.getElementById('splashVideo');

  // Skip first 3 seconds of the video to go straight to logo formation loop
  if (splashVideo) {
    splashVideo.currentTime = 3.0;

    splashVideo.addEventListener('loadedmetadata', () => {
      splashVideo.currentTime = 3.0;
    });

    // Programmatic loop between 3.0s and 9.8s
    splashVideo.addEventListener('timeupdate', () => {
      if (splashVideo.currentTime >= 9.8) {
        splashVideo.currentTime = 3.0;
        splashVideo.play().catch(err => console.log('Autoplay play interrupted:', err));
      }
    });

    splashVideo.addEventListener('ended', () => {
      splashVideo.currentTime = 3.0;
      splashVideo.play().catch(err => console.log('Video ended play interrupted:', err));
    });
  }

  // Dynamic canvas pixel processor to render transparent video on a #22223b backdrop
  const logoCanvas = document.getElementById('logoCanvas');
  if (splashVideo && logoCanvas) {
    const ctx = logoCanvas.getContext('2d');
    
    function drawFrame() {
      if (splashVideo.paused || splashVideo.ended) {
        requestAnimationFrame(drawFrame);
        return;
      }
      
      // Copy current video frame
      ctx.drawImage(splashVideo, 0, 0, logoCanvas.width, logoCanvas.height);
      
      try {
        const frame = ctx.getImageData(0, 0, logoCanvas.width, logoCanvas.height);
        const data = frame.data;
        
        // Define logo color (solid bold white)
        const rL = 255, gL = 255, bL = 255;
        
        const W = logoCanvas.width;
        const H = logoCanvas.height;
        const xc = W / 2;
        const yc = H / 2;
        const R_start = 0.35; // Start blending from 35% radius onwards
        
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const idx = (y * W + x) * 4;
            const r = data[idx];
            const g = data[idx+1];
            const b = data[idx+2];
            
            // v represents brightness of the pixel (0.0 = pure black logo, 1.0 = pure white background)
            const v = (r + g + b) / 765.0;
            
            // Normalized elliptical coordinates from center (-1.0 to 1.0)
            const dx = (x - xc) / xc;
            const dy = (y - yc) / yc;
            const d = Math.sqrt(dx * dx + dy * dy);
            
            // Elliptical radial vignette scaling factor (1.0 at center, 0.0 at/beyond edges)
            const f = Math.max(0.0, Math.min(1.0, (1.0 - d) / (1.0 - R_start)));
            
            // Filter out fog/smoke by thresholding brightness v
            // v <= 0.55: fully opaque logo line (keeps textured parts of logo solid)
            // v >= 0.65: fully transparent (filters out light gray fog/smoke and white background)
            // 0.55 < v < 0.65: smooth gradient transition
            let w_base = 0.0;
            if (v <= 0.55) {
              w_base = 1.0;
            } else if (v < 0.65) {
              w_base = (0.65 - v) / (0.65 - 0.55);
            }
            const w = w_base * f;
            
            data[idx]     = rL;       // Red
            data[idx+1]   = gL;       // Green
            data[idx+2]   = bL;       // Blue
            data[idx+3]   = w * 255;  // Alpha (transparency)
          }
        }
        
        ctx.putImageData(frame, 0, 0);
      } catch (e) {
        console.error("Canvas pixel processing failed:", e);
      }
      
      requestAnimationFrame(drawFrame);
    }
    
    // Start drawing when playing
    splashVideo.addEventListener('play', () => {
      drawFrame();
    });
    
    // Fallback if already playing
    if (!splashVideo.paused) {
      drawFrame();
    }
  }

  // Decryption activation on click
  if (logoTrigger) {
    logoTrigger.addEventListener('click', enterSite);
  }

  function enterSite() {
    if (splashPrompt) {
      splashPrompt.style.opacity = "0";
      splashPrompt.style.transition = "opacity 0.3s ease";
    }

    const splashBg = document.getElementById('splashBg');
    if (splashBg) {
      splashBg.style.transform = 'translateY(-100%)';
      splashBg.style.transition = 'transform 1.2s cubic-bezier(0.85, 0, 0.15, 1)';
    }

    if (logoTrigger) {
      logoTrigger.style.transform = 'scale(0) translateY(-100px)';
      logoTrigger.style.opacity = '0';
      logoTrigger.style.transition = 'all 1s cubic-bezier(0.85, 0, 0.15, 1)';
    }

    splashScreen.classList.add('fade-out');
    portfolioContainer.classList.remove('hidden');

    setTimeout(() => {
      if (splashVideo) {
        splashVideo.pause();
      }
    }, 600);

    setTimeout(() => {
      splashScreen.style.display = 'none';
    }, 1200);

    // Initialize content load
    // Open nothing by default
  }

  // ==================== 4. DYNAMIC SECTIONS CONTENT DATABASE ====================
  // Live Feedback Comments list (local fallback)
  let feedbackData = [];

  // Fetch comments from Supabase or localStorage
  async function fetchFeedback() {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/feedback?select=*&order=created_at.desc`, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          feedbackData = data;
        } else {
          console.error("Supabase fetch failed, status:", res.status);
          loadLocalFeedback();
        }
      } catch (e) {
        console.error("Error fetching from Supabase:", e);
        loadLocalFeedback();
      }
    } else {
      loadLocalFeedback();
    }
  }

  function loadLocalFeedback() {
    const local = localStorage.getItem('portfolio_feedback');
    if (local) {
      try {
        feedbackData = JSON.parse(local);
      } catch (e) {
        feedbackData = [];
      }
    } else {
      // Default placeholder comments
      feedbackData = [
        { name: "Satoshi", time: "2 hours ago", text: "Incredibly fast load time and clean terminal design!" },
        { name: "Visitor", time: "1 day ago", text: "Nice work on the steganography project. Very impressive." }
      ];
    }
  }

  function saveLocalFeedback() {
    localStorage.setItem('portfolio_feedback', JSON.stringify(feedbackData));
  }

  async function postFeedback(name, text) {
    const timeStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const newItem = { name, text, time: timeStr };

    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(newItem)
        });
        if (res.ok) {
          await fetchFeedback(); // Refresh the list
          return;
        } else {
          console.error("Supabase insert failed, status:", res.status);
        }
      } catch (e) {
        console.error("Error inserting to Supabase:", e);
      }
    }
    
    // Fallback: add to local array and save to localStorage
    feedbackData.unshift(newItem);
    saveLocalFeedback();
  }

  const panelContentMap = {
    feedback: `
      <h3>Visitor Feedback Feed</h3>
      <div class="feedback-layout-cyber">
        <form class="feedback-form-cyber" id="feedbackForm">
          <div class="form-group-cyber">
            <label for="fbName">Name</label>
            <input type="text" id="fbName" required placeholder="Guest User">
          </div>
          <div class="form-group-cyber">
            <label for="fbMessage">Feedback Message</label>
            <textarea id="fbMessage" rows="3" required placeholder="Loved the terminal simulator!"></textarea>
          </div>
          <button type="submit" class="submit-btn-cyber">Post Feedback <i class="fa-solid fa-share"></i></button>
        </form>
        <div class="feedback-stack-container-cyber">
          <h4>Live Feed</h4>
          <div class="feedback-stack-cyber" id="feedbackStack">
            <!-- Feed items will be populated dynamically -->
          </div>
        </div>
      </div>
    `,
    skills: `
      <div class="skills-three-way-layout">
        <div class="skills-center-heading">
          <h3>Technical Skills</h3>
        </div>
        
        <div class="skills-box lang-box">
          <h4 class="skills-box-title"><i class="fa-solid fa-code"></i> Language & Scripting</h4>
          <div class="skills-badges-grid columns-3">
            <span class="skill-badge" title="C++"><i class="devicon-cplusplus-plain colored"></i> C++</span>
            <span class="skill-badge" title="Python"><i class="devicon-python-plain colored"></i> Python</span>
            <span class="skill-badge" title="Bash / Shell"><i class="devicon-bash-plain colored"></i> Bash</span>
            <span class="skill-badge" title="HTML5"><i class="devicon-html5-plain colored"></i> HTML5</span>
            <span class="skill-badge" title="CSS3"><i class="devicon-css3-plain colored"></i> CSS3</span>
            <span class="skill-badge" title="JavaScript"><i class="devicon-javascript-plain colored"></i> JS</span>
          </div>
        </div>

        <div class="skills-box ml-box">
          <h4 class="skills-box-title"><i class="fa-solid fa-brain"></i> Machine Learning</h4>
          <div class="skills-badges-grid columns-3">
            <span class="skill-badge" title="Python"><i class="devicon-python-plain colored"></i> Machine Learning</span>
            <span class="skill-badge" title="Scikit-Learn"><i class="fa-solid fa-microchip"></i> Scikit-Learn</span>
            <span class="skill-badge" title="Data Analysis"><i class="fa-solid fa-chart-simple"></i> Data Analysis</span>
            <span class="skill-badge" title="Pandas"><i class="devicon-pandas-plain colored"></i> Pandas</span>
            <span class="skill-badge" title="NumPy"><i class="devicon-numpy-plain colored"></i> NumPy</span>
            <span class="skill-badge" title="TensorFlow"><i class="devicon-tensorflow-original colored"></i> TensorFlow</span>
            <span class="skill-badge" title="Matplotlib"><i class="fa-solid fa-chart-area"></i> Matplotlib</span>
            <span class="skill-badge" title="Data Preprocessing"><i class="fa-solid fa-filter"></i> Preprocessing</span>
          </div>
        </div>

        <div class="skills-box devops-box">
          <h4 class="skills-box-title"><i class="fa-solid fa-gears"></i> DevOps & Tools</h4>
          <div class="skills-badges-grid columns-3">
            <span class="skill-badge" title="Git & GitHub"><i class="devicon-git-plain colored"></i> Git & GitHub</span>
            <span class="skill-badge" title="Linux / WSL"><i class="devicon-linux-plain colored"></i> Linux / WSL</span>
            <span class="skill-badge" title="Kaggle"><i class="devicon-kaggle-original colored"></i> Kaggle</span>
            <span class="skill-badge" title="Google Colab"><i class="devicon-googlecolab-plain colored"></i> Google Colab</span>
            <span class="skill-badge" title="VS Code"><i class="devicon-vscode-plain colored"></i> VS Code</span>
          </div>
        </div>
      </div>
    `,
    coding: `
      <h3>Coding Profiles</h3>
      <div class="coding-tiles-container">
        <a href="https://leetcode.com/u/janhavi27-06/" target="_blank" class="coding-profile-tile">
          <div class="tile-logo">
            <i class="devicon-leetcode-plain colored"></i>
          </div>
          <span class="tile-name">LeetCode</span>
        </a>
        <a href="https://www.hackerrank.com/profile/janhavikasture" target="_blank" class="coding-profile-tile">
          <div class="tile-logo">
            <svg viewBox="0 0 130 100" style="width: 54px; height: 54px; display: inline-block;">
              <path d="M10,20 H28 V43 H42 V20 H60 V80 H42 V57 H28 V80 H10 Z" fill="#FFFFFF" />
              <rect x="72" y="20" width="58" height="60" fill="#2EC866" rx="4" />
            </svg>
          </div>
          <span class="tile-name">HackerRank</span>
        </a>
      </div>
    `,
    experience: `
      <h3>Academic & Project Experience</h3>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-date">Current</div>
          <div class="timeline-content">
            <h4>B.Tech - Computer Science & Engineering (Cyber Security)</h4>
            <p class="institution">Vellore Institute of Technology (VIT)</p>
            <p class="timeline-desc">Computer science student specializing in cyber security.</p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-date">Extracurricular</div>
          <div class="timeline-content">
            <h4>Achievements & Leadership Roles</h4>
            <p class="institution">VIT Campus Involvement</p>
            <ul class="presentations-list" style="margin-top: 10px; margin-left: 20px; color: #c9ada7; font-size: 0.9rem; line-height: 1.6;">
              <li>Top academic grades in C++, Probability and Statistics, Computational Physics, Discrete Math, and Linear Algebra</li>
              <li>Active member of FYI Club Social Media Team, NSS Unit Volunteer, and Sponsorship Team in E-Cell</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    contact: `
      <div class="contact-layout-cyber">
        <div class="contact-details-cyber">
          <h3>Contact Info</h3>
          <p><i class="fa-solid fa-envelope"></i> <strong>Email:</strong> <a href="mailto:janhavikasture@gmail.com">janhavikasture@gmail.com</a></p>
          <p style="margin-top: 15px; color: #c9ada7;">Feel free to reach out for research collaborations, software security audits, or machine learning privacy projects.</p>
        </div>
        <form class="contact-form-cyber" id="contactForm">
          <h3>Visitor Registration</h3>
          <div class="form-group-cyber">
            <label for="contactEmail">Enter your email address</label>
            <input type="email" id="contactEmail" required placeholder="email@example.com">
          </div>
          <button type="submit" class="submit-btn-cyber">Submit Email <i class="fa-solid fa-paper-plane"></i></button>
          <div id="formStatus" class="form-status-cyber"></div>
        </form>
      </div>
    `,
    projects: `
      <h3>Selected Projects</h3>
      <div class="projects-grid-cyber">
        <div class="project-card-cyber">
          <div class="project-img-container">
            <img src="assets/cryptchat.png" alt="Crypt Chat">
            <span class="project-tag-badge">ACADEMIC PROJECT</span>
          </div>
          <div class="project-details">
            <h4>Crypt Chat</h4>
            <p>A powerful web application hiding secret messages within ordinary carrier images using steganography (LSB, DCT) and ciphers (AES-GCM, ChaCha20, RSA) in a secure offline-first environment.</p>
            <div class="project-tech-tags">
              <span>Python</span>
              <span>Flask</span>
              <span>Steganography</span>
              <span>Cryptography</span>
            </div>
            <div class="project-links">
              <a href="https://github.com/janhavi67/Crypt-Chat" target="_blank" title="GitHub Repository"><i class="fa-brands fa-github"></i></a>
            </div>
          </div>
        </div>
        <div class="project-card-cyber">
          <div class="project-img-container">
            <img src="assets/mia.png" alt="MIA Privacy Audit">
            <span class="project-tag-badge">PROJECT</span>
          </div>
          <div class="project-details">
            <h4>MIA Privacy Audit</h4>
            <p>Audits a Decision Tree Model trained on the UCI Adult Census Income dataset. Simulates an attacker trying to infer if an individual's private profile was inside the model's training set, using loss and entropy signals.</p>
            <div class="project-tech-tags">
              <span>Python</span>
              <span>Scikit-Learn</span>
              <span>Pandas</span>
            </div>
            <div class="project-links">
              <a href="https://github.com/janhavi67/MIA_Audit_Census.ipynb" target="_blank" title="GitHub Repository"><i class="fa-brands fa-github"></i></a>
            </div>
          </div>
        </div>
        <div class="project-card-cyber">
          <div class="project-img-container">
            <img src="assets/skinscan.png" alt="SkinScan AI Assessor">
            <span class="project-tag-badge">HACKATHON</span>
          </div>
          <div class="project-details">
            <h4>SkinScan AI Assessor</h4>
            <p>AI-powered Skin Cancer Risk Assessment System developed with VIT Bhopal & Johns Hopkins (Semi-Finalist). Integrates clinical data, Fitzpatrick type, Grad-CAM explanations, and CV sizing.</p>
            <div class="project-tech-tags">
              <span>FastAPI</span>
              <span>TensorFlow</span>
              <span>OpenCV</span>
              <span>Scikit-learn</span>
            </div>
            <div class="project-links">
              <a href="https://github.com/janhavi67/skincancer" target="_blank" title="GitHub Repository"><i class="fa-brands fa-github"></i></a>
              <a href="https://lnkd.in/g6xkR9E7" target="_blank" title="Model Demo"><i class="fa-solid fa-globe"></i></a>
            </div>
          </div>
        </div>
        <div class="project-card-cyber">
          <div class="project-img-container">
            <img src="assets/phishing.png" alt="Phishing Email Detector">
            <span class="project-tag-badge">HACKATHON</span>
          </div>
          <div class="project-details">
            <h4>Phishing Email Detector</h4>
            <p>A sophisticated ML-based system combining NLP (NLTK, TF-IDF) with ensemble models (Logistic Regression, Random Forest, XGBoost, LightGBM) to classify phishing emails with high accuracy.</p>
            <div class="project-tech-tags">
              <span>Python</span>
              <span>Flask</span>
              <span>ML</span>
              <span>NLP</span>
            </div>
            <div class="project-links">
              <a href="https://github.com/janhavi67/pyrodix_hackathon" target="_blank" title="GitHub Repository"><i class="fa-brands fa-github"></i></a>
            </div>
          </div>
        </div>
        <div class="project-card-cyber">
          <div class="project-img-container">
            <img src="assets/triotech.png" alt="Tech Advisor">
            <span class="project-tag-badge">HACKATHON</span>
          </div>
          <div class="project-details">
            <h4>Tech Advisor</h4>
            <p>AI Technical Advisor application developed during HackHazards Hackathon using the Groq API. Generates high-speed recommendations for software stacks and configurations.</p>
            <div class="project-tech-tags">
              <span>Groq API</span>
              <span>HTML5</span>
              <span>CSS3</span>
              <span>JavaScript</span>
            </div>
            <div class="project-links">
              <a href="https://github.com/janhavi67/Tech-Advisor" target="_blank" title="GitHub Repository"><i class="fa-brands fa-github"></i></a>
              <a href="https://lnkd.in/didcgh" target="_blank" title="Project Demo"><i class="fa-solid fa-globe"></i></a>
            </div>
          </div>
        </div>
        <div class="project-card-cyber">
          <div class="project-img-container">
            <img src="assets/amazon.png" alt="Amazon Layout Clone">
            <span class="project-tag-badge">PROJECT</span>
          </div>
          <div class="project-details">
            <h4>Amazon Layout Clone</h4>
            <p>A pixel-perfect responsive clone of the Amazon storefront. Showcases pure layout design, custom navigation bars, dropdown menus, and CSS image-grid structures.</p>
            <div class="project-tech-tags">
              <span>HTML5</span>
              <span>CSS3</span>
              <span>Flexbox / Grid</span>
            </div>
            <div class="project-links">
              <a href="https://github.com/janhavi67/amazon_clone" target="_blank" title="GitHub Repository"><i class="fa-brands fa-github"></i></a>
            </div>
          </div>
        </div>
      </div>
    `,
    certifications: `
      <h3>Certifications & Credentials</h3>
      <div class="certifications-grid-cyber">
        <!-- 1. IBM Machine Learning -->
        <div class="cert-card-cyber">
          <div class="cert-icon-cyber"><i class="fa-solid fa-graduation-cap"></i></div>
          <div class="cert-info-cyber">
            <div class="cert-header-cyber">
              <h4>Machine Learning with Python</h4>
              <span class="cert-date">May 2026</span>
            </div>
            <p class="issuer">IBM | Coursera</p>
            <p class="desc">Valued certification verifying deep-dives into regression, classification, clustering, and neural networks using Python libraries.</p>
            <a href="assets/ibm_ml.pdf" target="_blank" class="cert-link">Verify Credential <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
          </div>
        </div>

        <!-- 2. OpenCV Bootcamp -->
        <div class="cert-card-cyber">
          <div class="cert-icon-cyber"><i class="fa-solid fa-award"></i></div>
          <div class="cert-info-cyber">
            <div class="cert-header-cyber">
              <h4>OpenCV Bootcamp</h4>
              <span class="cert-date">Dec 2025</span>
            </div>
            <p class="issuer">OpenCV University</p>
            <p class="desc">Completed OpenCV Bootcamp with an outstanding grade of 100%, demonstrating mastery in computer vision basics, image processing, and algorithms.</p>
            <a href="assets/opencv_bootcamp.pdf" target="_blank" class="cert-link">Verify Credential <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
          </div>
        </div>

        <!-- 3. HackerRank Problem Solving (Basic) -->
        <div class="cert-card-cyber">
          <div class="cert-icon-cyber"><i class="fa-solid fa-laptop-code"></i></div>
          <div class="cert-info-cyber">
            <div class="cert-header-cyber">
              <h4>Problem Solving (Basic)</h4>
              <span class="cert-date">Mar 2025</span>
            </div>
            <p class="issuer">HackerRank</p>
            <p class="desc">Skills assessment certificate confirming proficiency in algorithms, data structures, and basic computational problem solving.</p>
            <a href="assets/hackerrank_problem_solving.pdf" target="_blank" class="cert-link">Verify Credential <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
          </div>
        </div>

        <!-- 4. HackerRank Python (Basic) -->
        <div class="cert-card-cyber">
          <div class="cert-icon-cyber"><i class="fa-brands fa-python"></i></div>
          <div class="cert-info-cyber">
            <div class="cert-header-cyber">
              <h4>Python (Basic)</h4>
              <span class="cert-date">Mar 2025</span>
            </div>
            <p class="issuer">HackerRank</p>
            <p class="desc">Skills assessment verifying clean syntax, scripting flow control, basic object structures, and functional features in Python.</p>
            <a href="assets/hackerrank_python.pdf" target="_blank" class="cert-link">Verify Credential <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
          </div>
        </div>

        <!-- 5. AcWoC'25 Open Source -->
        <div class="cert-card-cyber">
          <div class="cert-icon-cyber"><i class="fa-solid fa-code-branch"></i></div>
          <div class="cert-info-cyber">
            <div class="cert-header-cyber">
              <h4>AcWoC'25 - Open Source Program</h4>
              <span class="cert-date">2025</span>
            </div>
            <p class="issuer">Android Club | VIT Bhopal University</p>
            <p class="desc">Month-long contribution program verifying standard open-source project participation, git workflows, and pull requests.</p>
            <a href="assets/acwoc_25.jpg" target="_blank" class="cert-link">Verify Credential <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
          </div>
        </div>

        <!-- 6. GDGC Tech Winter Break -->
        <div class="cert-card-cyber">
          <div class="cert-icon-cyber"><i class="fa-brands fa-google"></i></div>
          <div class="cert-info-cyber">
            <div class="cert-header-cyber">
              <h4>Tech Winter Break</h4>
              <span class="cert-date">Dec 2024</span>
            </div>
            <p class="issuer">Google Developer Groups On Campus | VIT Bhopal</p>
            <p class="desc">Participated in the two-day Tech Winter Break developer events, workshops, and technical collaborative projects organized by GDGC.</p>
            <a href="assets/gdgc_tech_winter_break.jpg" target="_blank" class="cert-link">Verify Credential <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
          </div>
        </div>
      </div>
    `
  };

  // ==================== 5. LOAD SECTION & TAB SWITCHER LOGIC ====================
  const navCards = document.querySelectorAll('.nav-card');
  const contentPanel = document.querySelector('.content-panel');

  // Load a section by its target name
  function loadSection(target) {
    if (!contentPanel) return;

    // Remove active state from all nav grid cards
    navCards.forEach(c => {
      if (c.getAttribute('data-target') === target) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });



    // Populate the content panel
    const htmlContent = panelContentMap[target];
    if (htmlContent) {
      contentPanel.style.display = 'block';
      contentPanel.innerHTML = `<div class="panel-section active">${htmlContent}</div>`;
      
      // Post-rendering actions
      if (target === 'feedback') {
        renderFeedbackStack();
        // Fetch fresh comments from Supabase and re-render
        fetchFeedback().then(() => {
          renderFeedbackStack();
        });
      }
    }
  }

  // Add click listeners to cards
  navCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Prevent switching if clicking a link directly inside quick-links
      if (e.target.closest('.quick-links')) return;

      const target = card.getAttribute('data-target');
      if (target) {
        loadSection(target);
      }
    });
  });



  // ==================== 6. FEEDBACK LIVE RENDER LOGIC ====================
  function renderFeedbackStack() {
    const feedbackStack = document.getElementById('feedbackStack');
    if (!feedbackStack) return;

    feedbackStack.innerHTML = '';
    feedbackData.forEach(item => {
      const bubble = document.createElement('div');
      bubble.className = 'feedback-bubble-cyber';
      bubble.innerHTML = `
        <div class="bubble-header-cyber">
          <span class="bubble-author-cyber">${item.name}</span>
          <span class="bubble-time-cyber">${item.time}</span>
        </div>
        <p class="bubble-text-cyber">${item.text}</p>
      `;
      feedbackStack.appendChild(bubble);
    });
  }

  // ==================== 7. DELEGATED SUBMIT EVENTS (FOR DYNAMIC DOM) ====================
  document.addEventListener('submit', (e) => {
    // 1. Feedback Form submission
    if (e.target && e.target.id === 'feedbackForm') {
      e.preventDefault();
      const nameEl = document.getElementById('fbName');
      const msgEl = document.getElementById('fbMessage');

      const name = nameEl.value.trim();
      const text = msgEl.value.trim();

      if (name && text) {
        postFeedback(name, text).then(() => {
          renderFeedbackStack();
        });

        // Reset
        nameEl.value = '';
        msgEl.value = '';
      }
    }

    // 2. Contact form submission
    if (e.target && e.target.id === 'contactForm') {
      e.preventDefault();
      const emailEl = document.getElementById('contactEmail');
      const email = emailEl.value.trim();
      const statusEl = document.getElementById('formStatus');

      if (statusEl) {
        statusEl.style.color = '#c9ada7';
        statusEl.textContent = 'ESTABLISHING SECURE SSH TUNNEL...';

        // Prepare Netlify Forms body
        const bodyParams = new URLSearchParams();
        bodyParams.append('form-name', 'contact');
        bodyParams.append('email', email);

        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: bodyParams.toString()
        })
        .then(response => {
          if (response.ok) {
            statusEl.style.color = '#9a8c98';
            statusEl.innerHTML = `[SUCCESS] Secure package transmitted.<br>Email logged: <strong>${email}</strong>. Connection established!`;
            e.target.reset();
          } else {
            throw new Error('Server responded with status ' + response.status);
          }
        })
        .catch(error => {
          console.error("Form submission failed:", error);
          statusEl.style.color = '#ff6b6b';
          statusEl.innerHTML = `[ERROR] Secure connection failed. Please try again.`;
        });
      }
    }
  });

});

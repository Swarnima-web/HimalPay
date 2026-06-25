// STICKY HEADER
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// MOBILE MENU TOGGLE
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburger');
  menu.classList.toggle('active');
}

// EXCHANGE CALCULATOR
const rate = 0.625; // 1 NPR = 0.625 INR
function calcRate() {
  const sendInput = document.getElementById('sendAmount');
  const receiveInput = document.getElementById('receiveAmount');
  const totalCost = document.getElementById('totalCost');
  const sendValSpan = document.getElementById('calcSendVal');
  
  let val = parseFloat(sendInput.value);
  if (isNaN(val) || val < 0) val = 0;
  
  const inrVal = Math.round(val * rate * 100) / 100;
  receiveInput.value = inrVal;
  totalCost.innerText = `NPR ${val.toLocaleString()}`;
  sendValSpan.innerText = val.toLocaleString();
}

// ANIMATED COUNTERS FOR STATS
const stats = document.querySelectorAll('.stat-num');
stats.forEach(stat => {
  const target = parseInt(stat.getAttribute('data-target'));
  if (!target) return;
  let count = 0;
  const speed = target / 100;
  const updateCount = () => {
    if (count < target) {
      count += speed;
      stat.innerText = Math.floor(count).toLocaleString() + (stat.nextSibling && stat.nextSibling.textContent === 'min' ? '' : '+');
      setTimeout(updateCount, 15);
    } else {
      stat.innerText = target.toLocaleString();
    }
  };
  // Simple trigger when visible
  updateCount();
});

// INTERACTIVE APP SIMULATION
const modal = document.getElementById('appModal');
const screenContainer = document.getElementById('modalScreen');
let pinBuffer = [];
let currentPhoneNumber = '';
let currentName = '';
let selectedDoc = 'Citizenship';

// STATE MANAGEMENT
const STATE = {
  activeScreen: 'welcome',
  history: []
};

function openApp(targetScreen = 'welcome') {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  navigateTo(targetScreen);
}

function closeApp() {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  pinBuffer = [];
}

function navigateTo(screenId, pushHistory = true) {
  if (pushHistory && STATE.activeScreen) {
    STATE.history.push(STATE.activeScreen);
  }
  STATE.activeScreen = screenId;
  renderScreen(screenId);
}

function goBack() {
  if (STATE.history.length > 0) {
    const prev = STATE.history.pop();
    STATE.activeScreen = prev;
    renderScreen(prev);
  } else {
    closeApp();
  }
}

// SCREEN RENDERER
function renderScreen(screenId) {
  let html = '';
  
  switch(screenId) {
    case 'welcome':
      html = `
        <div class="app-screen">
          <div class="app-title-zone" style="text-align: center; margin-top: 40px;">
            <div style="width: 64px; height: 64px; background: var(--primary); color: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.5rem; margin: 0 auto 20px auto;">HP</div>
            <h2>Namaste & Welcome</h2>
            <p>Nepal's Premium Cross-Border Remittance App</p>
          </div>
          
          <div class="app-btn-group" style="margin-top: auto; margin-bottom: 40px;">
            <button class="btn-primary w-full" onclick="navigateTo('register')" style="padding: 14px;">पञ्जीकरण गर्नुहोस् (Register)</button>
            <button class="btn-outline w-full" onclick="navigateTo('login')" style="padding: 14px;">लग इन गर्नुहोस् (Log In)</button>
          </div>
        </div>
      `;
      break;
      
    case 'register':
      html = `
        <div class="app-screen">
          <button class="app-back-btn" onclick="goBack()">← Back</button>
          <div class="app-title-zone">
            <h2>सुरु गरौँ (Get Started)</h2>
            <p>Enter your Nepali mobile number to register.</p>
          </div>
          
          <div class="app-form-group">
            <label>Mobile Number</label>
            <div class="app-input-wrap">
              <span style="font-weight: 700;">🇳🇵 +977</span>
              <input type="tel" id="regPhone" placeholder="98XXXXXXXX" maxlength="10" value="${currentPhoneNumber}" />
            </div>
          </div>
          
          <div class="app-btn-group">
            <button class="btn-primary w-full" onclick="handleRegister()">OTP पठाउनुहोस् (Send OTP)</button>
          </div>
        </div>
      `;
      break;
      
    case 'otp':
      html = `
        <div class="app-screen">
          <button class="app-back-btn" onclick="goBack()">← Back</button>
          <div class="app-title-zone">
            <h2>OTP प्रमाणीकरण (Verify OTP)</h2>
            <p>Sent to +977 ${currentPhoneNumber}</p>
          </div>
          
          <div class="pin-dots">
            <span class="pin-dot" id="dot-0"></span>
            <span class="pin-dot" id="dot-1"></span>
            <span class="pin-dot" id="dot-2"></span>
            <span class="pin-dot" id="dot-3"></span>
            <span class="pin-dot" id="dot-4"></span>
            <span class="pin-dot" id="dot-5"></span>
          </div>
          
          <p style="text-align: center; font-size: 0.8rem; color: var(--text-muted-light); margin-bottom: 20px;">
            Simulating Auto-fill OTP: Enter any 6-digit pin below
          </p>
          
          <div class="pin-pad">
            <button class="pin-key" onclick="pressPin('1')">1</button>
            <button class="pin-key" onclick="pressPin('2')">2</button>
            <button class="pin-key" onclick="pressPin('3')">3</button>
            <button class="pin-key" onclick="pressPin('4')">4</button>
            <button class="pin-key" onclick="pressPin('5')">5</button>
            <button class="pin-key" onclick="pressPin('6')">6</button>
            <button class="pin-key" onclick="pressPin('7')">7</button>
            <button class="pin-key" onclick="pressPin('8')">8</button>
            <button class="pin-key" onclick="pressPin('9')">9</button>
            <button class="pin-key empty"></button>
            <button class="pin-key" onclick="pressPin('0')">0</button>
            <button class="pin-key" onclick="pressPin('back')">⌫</button>
          </div>
        </div>
      `;
      break;
      
    case 'setupName':
      html = `
        <div class="app-screen">
          <button class="app-back-btn" onclick="goBack()">← Back</button>
          <div class="app-title-zone">
            <h2>विवरण भर्नुहोस् (Add Details)</h2>
            <p>Set up your profile name and login PIN.</p>
          </div>
          
          <div class="app-form-group">
            <label>Full Name (as in Passport/Citizenship)</label>
            <div class="app-input-wrap">
              <input type="text" id="regName" placeholder="Priya Thapa" value="${currentName}" />
            </div>
          </div>
          
          <div class="app-btn-group">
            <button class="btn-primary w-full" onclick="handleSetupName()">अगाडि बढ्नुहोस् (Continue)</button>
          </div>
        </div>
      `;
      break;
      
    case 'kycIntro':
      html = `
        <div class="app-screen">
          <div class="app-title-zone">
            <div style="background: rgba(27, 63, 143, 0.1); color: var(--primary); padding: 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 700; margin-bottom: 16px; border: 1px solid rgba(27, 63, 143, 0.15);">
              📢 NRB Regulation Requirement
            </div>
            <h2>KYC परिचय (KYC Verification)</h2>
            <p>Verification is mandatory for Nepal-to-India remittance rules.</p>
          </div>
          
          <div class="kyc-timeline">
            <div class="kyc-step-item">
              <div class="kyc-step-marker">1</div>
              <div class="kyc-step-info">
                <h4>कागजातको प्रकार रोज्नुहोस्</h4>
                <p>Citizenship Card or Passport</p>
              </div>
            </div>
            <div class="kyc-step-item">
              <div class="kyc-step-marker">2</div>
              <div class="kyc-step-info">
                <h4>कागजातको तस्बिर खिच्नुहोस्</h4>
                <p>Scan both Front & Back pages</p>
              </div>
            </div>
            <div class="kyc-step-item">
              <div class="kyc-step-marker">3</div>
              <div class="kyc-step-info">
                <h4>सेल्फी प्रमाणीकरण</h4>
                <p>Selfie liveness check for anti-spoofing</p>
              </div>
            </div>
          </div>
          
          <div class="app-btn-group" style="margin-top: auto;">
            <button class="btn-primary w-full" onclick="navigateTo('docSelect')">KYC सुरु गर्नुहोस् (Start KYC)</button>
            <button class="btn-outline w-full" onclick="navigateTo('dashboard')">पछि गरौँला (Do It Later)</button>
          </div>
        </div>
      `;
      break;
      
    case 'docSelect':
      html = `
        <div class="app-screen">
          <button class="app-back-btn" onclick="goBack()">← Back</button>
          <div class="app-title-zone">
            <h2>कागजात छान्नुहोस्</h2>
            <p>Select your primary identity document.</p>
          </div>
          
          <div class="doc-select-cards">
            <div class="doc-card ${selectedDoc === 'Citizenship' ? 'active' : ''}" onclick="selectDoc('Citizenship')">
              <div class="doc-card-icon">🪪</div>
              <div class="doc-card-info">
                <h4>Citizenship Card (नागरिकता)</h4>
                <p>Fastest processing · Auto scan</p>
              </div>
            </div>
            <div class="doc-card ${selectedDoc === 'Passport' ? 'active' : ''}" onclick="selectDoc('Passport')">
              <div class="doc-card-icon">📕</div>
              <div class="doc-card-info">
                <h4>Passport (राहदानी)</h4>
                <p>Global standard verification</p>
              </div>
            </div>
          </div>
          
          <div class="app-btn-group" style="margin-top: auto;">
            <button class="btn-primary w-full" onclick="navigateTo('docCapture')">तस्बिर लिनुहोस् (Capture Photo)</button>
          </div>
        </div>
      `;
      break;
      
    case 'docCapture':
      html = `
        <div class="app-screen">
          <button class="app-back-btn" onclick="goBack()">← Back</button>
          <div class="app-title-zone">
            <h2>तस्बिर खिच्नुहोस् (Capture ID)</h2>
            <p>Place the Front of your ${selectedDoc} inside the box</p>
          </div>
          
          <div class="camera-viewport">
            <div class="camera-guide-box"></div>
            <div class="camera-label">Align card inside border</div>
          </div>
          
          <div class="camera-controls">
            <button class="shutter-btn" onclick="navigateTo('liveness')"></button>
          </div>
        </div>
      `;
      break;
      
    case 'liveness':
      html = `
        <div class="app-screen">
          <button class="app-back-btn" onclick="goBack()">← Back</button>
          <div class="app-title-zone">
            <h2>सेल्फी लिनुहोस् (Liveness Check)</h2>
            <p>Place your face in the oval frame and blink</p>
          </div>
          
          <div class="camera-viewport">
            <div class="camera-guide-oval"></div>
            <div class="camera-label">Blink to capture automatically</div>
          </div>
          
          <div class="camera-controls">
            <button class="shutter-btn" onclick="handleKycSuccess()"></button>
          </div>
        </div>
      `;
      break;
      
    case 'kycComplete':
      html = `
        <div class="app-screen" style="align-items: center; justify-content: center; text-align: center;">
          <div style="width: 80px; height: 80px; background: rgba(34, 197, 94, 0.1); color: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin-bottom: 24px; animation: scaleUp 0.5s ease;">✓</div>
          <h2>KYC Submitted!</h2>
          <p style="color: var(--text-muted-light); margin-bottom: 40px; font-size: 0.9rem;">
            Our automated scanner is verifying your details. This usually takes 1-2 minutes.
          </p>
          <button class="btn-primary w-full" onclick="navigateTo('dashboard')">Home Dashboard</button>
        </div>
      `;
      break;
      
    case 'login':
      html = `
        <div class="app-screen">
          <button class="app-back-btn" onclick="goBack()">← Back</button>
          <div class="app-title-zone">
            <h2>लग इन गर्नुहोस् (Welcome back)</h2>
            <p>Log in with your HimalPay PIN</p>
          </div>
          
          <div class="pin-dots">
            <span class="pin-dot" id="dot-0"></span>
            <span class="pin-dot" id="dot-1"></span>
            <span class="pin-dot" id="dot-2"></span>
            <span class="pin-dot" id="dot-3"></span>
            <span class="pin-dot" id="dot-4"></span>
            <span class="pin-dot" id="dot-5"></span>
          </div>
          
          <div class="pin-pad">
            <button class="pin-key" onclick="pressPin('1')">1</button>
            <button class="pin-key" onclick="pressPin('2')">2</button>
            <button class="pin-key" onclick="pressPin('3')">3</button>
            <button class="pin-key" onclick="pressPin('4')">4</button>
            <button class="pin-key" onclick="pressPin('5')">5</button>
            <button class="pin-key" onclick="pressPin('6')">6</button>
            <button class="pin-key" onclick="pressPin('7')">7</button>
            <button class="pin-key" onclick="pressPin('8')">8</button>
            <button class="pin-key" onclick="pressPin('9')">9</button>
            <button class="pin-key empty"></button>
            <button class="pin-key" onclick="pressPin('0')">0</button>
            <button class="pin-key" onclick="pressPin('back')">⌫</button>
          </div>
        </div>
      `;
      break;
      
    case 'dashboard':
      html = `
        <div class="app-screen">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 32px; height: 32px; background: var(--primary); color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem;">HP</div>
              <span style="font-weight: 800; font-size: 1rem; color: var(--primary-dark);">HimalPay</span>
            </div>
            <button onclick="navigateTo('welcome')" style="font-size: 0.85rem; font-weight: 600; color: var(--danger);">Logout</button>
          </div>
          
          <div style="background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 20px; border-radius: 20px; margin-bottom: 20px;">
            <div style="font-size: 0.75rem; opacity: 0.8;">Wallet Balance</div>
            <div style="font-size: 1.8rem; font-weight: 800; margin-top: 4px; font-family: var(--font-heading);">NPR 25,000</div>
            <div style="font-size: 0.85rem; opacity: 0.85; margin-top: 2px;">≈ INR 15,625</div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 20px;">
            <button class="btn-primary" onclick="navigateTo('sendMoney')" style="padding: 14px; font-size: 1rem; border-radius: 12px;">
              ↗ भारत पैसा पठाउनुहोस् (Send Money to India)
            </button>
          </div>
          
          <div style="background: #EFF6FF; border: 1px solid #DBEAFE; padding: 8px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; color: var(--primary); margin-bottom: 20px; display: flex; justify-content: space-between;">
            <span>🟢 Live rate: 1 NPR = 0.625 INR</span>
            <span>Zero Fees</span>
          </div>
          
          <div style="flex-grow: 1;">
            <div style="font-weight: 700; font-size: 0.85rem; color: var(--primary-dark); margin-bottom: 12px;">Recent Transactions</div>
            <div class="phone-tx-item">
              <div class="phone-tx-avatar">R</div>
              <div class="phone-tx-info">
                <div class="phone-tx-name">Ramesh Sharma</div>
                <div class="phone-tx-detail">Bank Account · SBI</div>
              </div>
              <div class="phone-tx-amount sent">-NPR 5,000</div>
            </div>
            <div class="phone-tx-item">
              <div class="phone-tx-avatar">S</div>
              <div class="phone-tx-info">
                <div class="phone-tx-name">Sunita Thapa</div>
                <div class="phone-tx-detail">UPI · sunita@paytm</div>
              </div>
              <div class="phone-tx-amount sent">-NPR 2,500</div>
            </div>
          </div>
        </div>
      `;
      break;
      
    case 'sendMoney':
      html = `
        <div class="app-screen">
          <button class="app-back-btn" onclick="goBack()">← Back</button>
          <div class="app-title-zone">
            <h2>Send Money (पठाउनुहोस्)</h2>
            <p>Enter Indian Recipient Details</p>
          </div>
          
          <div class="app-form-group">
            <label>Recipient Name</label>
            <div class="app-input-wrap">
              <input type="text" id="recipName" placeholder="E.g. Ramesh Kumar" />
            </div>
          </div>
          
          <div class="app-form-group">
            <label>UPI ID or Account Number</label>
            <div class="app-input-wrap">
              <input type="text" id="recipAccount" placeholder="E.g. ramesh@upi or 3042129384" />
            </div>
          </div>
          
          <div class="app-form-group">
            <label>Amount to Send (NPR)</label>
            <div class="app-input-wrap">
              <input type="number" id="sendAmtVal" placeholder="Max 1,000,000" />
              <span style="font-weight: 700;">NPR</span>
            </div>
          </div>
          
          <div class="app-btn-group" style="margin-top: auto;">
            <button class="btn-primary w-full" onclick="handleSendMoney()">Send Remittance</button>
          </div>
        </div>
      `;
      break;
      
    case 'receipt':
      html = `
        <div class="app-screen" style="align-items: center; justify-content: center; text-align: center;">
          <div style="width: 80px; height: 80px; background: rgba(34, 197, 94, 0.1); color: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin-bottom: 24px; animation: scaleUp 0.5s ease;">✓</div>
          <h2>Remittance Initiated</h2>
          <p style="color: var(--text-muted-light); margin-bottom: 30px; font-size: 0.9rem;">
            Your transaction has been securely processed. Ref: HP-${Math.floor(Math.random() * 899999 + 100000)}
          </p>
          
          <div style="width: 100%; background: white; border: 1px solid var(--border-light); border-radius: 16px; padding: 20px; text-align: left; margin-bottom: 32px; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: var(--text-muted-light);">Recipient:</span>
              <strong id="recipConfirmName"></strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: var(--text-muted-light);">Details:</span>
              <strong id="recipConfirmAcc"></strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: var(--text-muted-light);">Amount Sent:</span>
              <strong id="recipConfirmAmt"></strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted-light);">Fee:</span>
              <strong class="green">NPR 0</strong>
            </div>
          </div>
          
          <button class="btn-primary w-full" onclick="navigateTo('dashboard')">Home Dashboard</button>
        </div>
      `;
      break;
  }
  
  screenContainer.innerHTML = html;
}

// SIMULATION HANDLERS
function handleRegister() {
  const phone = document.getElementById('regPhone').value;
  if (phone.length < 10) {
    alert('Please enter a valid 10-digit mobile number.');
    return;
  }
  currentPhoneNumber = phone;
  navigateTo('otp');
}

function pressPin(key) {
  if (key === 'back') {
    pinBuffer.pop();
  } else if (pinBuffer.length < 6) {
    pinBuffer.push(key);
  }
  
  // Highlight dots
  for (let i = 0; i < 6; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) {
      if (i < pinBuffer.length) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    }
  }
  
  if (pinBuffer.length === 6) {
    // Navigate onward depending on active step
    setTimeout(() => {
      const active = STATE.activeScreen;
      pinBuffer = [];
      if (active === 'otp') {
        navigateTo('setupName');
      } else if (active === 'login') {
        navigateTo('dashboard');
      }
    }, 300);
  }
}

function handleSetupName() {
  const name = document.getElementById('regName').value;
  if (!name.trim()) {
    alert('Please enter your full profile name.');
    return;
  }
  currentName = name;
  navigateTo('kycIntro');
}

function selectDoc(docType) {
  selectedDoc = docType;
  const cards = document.querySelectorAll('.doc-card');
  cards.forEach(c => c.classList.remove('active'));
  // Update view
  navigateTo('docSelect', false);
}

function handleKycSuccess() {
  navigateTo('kycComplete');
}

let tempSendName = '';
let tempSendAcc = '';
let tempSendAmt = '';

function handleSendMoney() {
  const name = document.getElementById('recipName').value;
  const acc = document.getElementById('recipAccount').value;
  const amt = document.getElementById('sendAmtVal').value;
  
  if (!name || !acc || !amt) {
    alert('Please fill out all fields.');
    return;
  }
  
  tempSendName = name;
  tempSendAcc = acc;
  tempSendAmt = `NPR ${parseFloat(amt).toLocaleString()}`;
  
  navigateTo('receipt');
  
  // Inject confirmed values in next tick
  setTimeout(() => {
    document.getElementById('recipConfirmName').innerText = tempSendName;
    document.getElementById('recipConfirmAcc').innerText = tempSendAcc;
    document.getElementById('recipConfirmAmt').innerText = tempSendAmt;
  }, 50);
}

// Initial rate computation
calcRate();

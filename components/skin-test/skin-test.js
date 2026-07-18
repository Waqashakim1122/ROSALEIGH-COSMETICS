(function(){
  const profiles = {
    dry: {
      label: "Dry and sensitive",
      usage: "Apply a pea-sized amount morning and night, focusing on cheeks, hands, and any rough patches.",
      tip: "Patch test on your inner arm first, then build up to daily use over about a week."
    },
    normal: {
      label: "Balanced",
      usage: "Apply a light layer once a day, ideally at night, to lock in moisture while you sleep.",
      tip: "A little goes a long way — start with a small amount and add more only where needed."
    },
    combo: {
      label: "Combination",
      usage: "Apply to drier areas like cheeks and hands 2 to 3 times a week rather than all over daily.",
      tip: "Avoid layering on already-oily areas like the T-zone; focus the balm where skin feels tight."
    }
  };

  const panels = {
    choice: document.getElementById('stChoice'),
    quiz: document.getElementById('quizSection'),
    photoDirect: document.getElementById('photoDirectSection'),
    result: document.getElementById('resultSection')
  };

  function showPanel(name){
    Object.values(panels).forEach(p => p.classList.remove('active'));
    panels[name].classList.add('active');
    panels[name].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- Step 0: choice ----------
  document.getElementById('stChooseQuiz').addEventListener('click', () => showPanel('quiz'));
  document.getElementById('stChoosePhoto').addEventListener('click', () => showPanel('photoDirect'));
  document.getElementById('stSkipToPhoto').addEventListener('click', () => showPanel('photoDirect'));
  document.getElementById('stSkipToQuiz').addEventListener('click', () => showPanel('quiz'));
  document.getElementById('stStartOver').addEventListener('click', () => {
    currentQ = 0;
    scores = { dry: 0, normal: 0, combo: 0 };
    document.querySelectorAll('.st-question').forEach((q, i) => q.classList.toggle('active', i === 0));
    updateProgress();
    document.getElementById('stMessages').innerHTML = '';
    document.getElementById('stMessagesDirect').innerHTML = '';
    showPanel('choice');
  });

  // ---------- Step 1a: quiz ----------
  let scores = { dry: 0, normal: 0, combo: 0 };
  let currentQ = 0;
  const totalQ = 5;
  const progressFill = document.getElementById('stProgressFill');
  const progressLabel = document.getElementById('stProgress');

  function updateProgress(){
    const pct = Math.round(((currentQ + 1) / totalQ) * 100);
    progressFill.style.width = pct + '%';
    progressLabel.textContent = `Question ${currentQ + 1} of ${totalQ}`;
  }
  updateProgress();

  document.querySelectorAll('.st-question').forEach(qEl => {
    qEl.querySelectorAll('.st-option').forEach(btn => {
      btn.addEventListener('click', () => {
        scores[btn.dataset.score]++;
        currentQ++;
        if (currentQ < totalQ) {
          document.querySelector(`.st-question[data-q="${currentQ - 1}"]`).classList.remove('active');
          document.querySelector(`.st-question[data-q="${currentQ}"]`).classList.add('active');
          updateProgress();
        } else {
          const key = topProfile(scores);
          renderResult(key, "Based on your answers");
        }
      });
    });
  });

  function topProfile(s) {
    return Object.keys(s).reduce((a, b) => (s[a] >= s[b] ? a : b));
  }

  function renderResult(key, sourceText){
    const p = profiles[key];
    document.getElementById('stProfileBadge').textContent = p.label;
    document.getElementById('stResultSource').textContent = sourceText;
    document.getElementById('stUsageText').textContent = p.usage;
    document.getElementById('stTipText').textContent = p.tip;
    showPanel('result');
  }

  // ---------- Shared: photo analysis ----------
  function fileToBase64(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });
  }

  function keyFromSkin(s){
    if (s.dryness === 'high') return 'dry';
    if (s.oiliness === 'high') return 'combo';
    return 'normal';
  }

  async function analyzePhoto(file, messagesEl, onSuccess, onRestricted){
    messagesEl.innerHTML = '';
    try {
      const base64Data = await fileToBase64(file);
      const res = await fetch('/api/analyze-skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: base64Data, mediaType: file.type })
      });
      const data = await res.json();

      if (data.status === 'ok') {
        onSuccess(data.skin);
      } else if (data.status === 'retry') {
        messagesEl.innerHTML = `<div class="st-msg retry">${data.message}</div>`;
      } else if (data.status === 'restricted') {
        messagesEl.innerHTML = `<div class="st-msg restricted">${data.message}</div>`;
        if (onRestricted) onRestricted();
      } else {
        messagesEl.innerHTML = `<div class="st-msg error">${data.message || 'Something went wrong.'}</div>`;
      }
    } catch (err) {
      messagesEl.innerHTML = `<div class="st-msg error">Network error. Please try again.</div>`;
    }
  }

  // ---------- Step 1b: direct photo path ----------
  const photoInputDirect = document.getElementById('stPhotoInputDirect');
  const analyzeBtnDirect = document.getElementById('stAnalyzeBtnDirect');
  const messagesDirect = document.getElementById('stMessagesDirect');

  photoInputDirect.addEventListener('change', () => {
    analyzeBtnDirect.style.display = photoInputDirect.files.length ? 'block' : 'none';
    messagesDirect.innerHTML = '';
  });

  analyzeBtnDirect.addEventListener('click', async () => {
    const file = photoInputDirect.files[0];
    if (!file) return;
    analyzeBtnDirect.disabled = true;
    analyzeBtnDirect.textContent = 'Analyzing…';

    await analyzePhoto(file, messagesDirect, (skin) => {
      renderResult(keyFromSkin(skin), "Based on your photo");
    }, () => {
      // Restricted (likely under 18) — steer toward the quiz instead of a photo result
      setTimeout(() => showPanel('quiz'), 1800);
    });

    analyzeBtnDirect.disabled = false;
    analyzeBtnDirect.textContent = 'Analyze my photo';
  });

  // ---------- Result screen: optional photo refine (after quiz) ----------
  const photoInput = document.getElementById('stPhotoInput');
  const analyzeBtn = document.getElementById('stAnalyzeBtn');
  const messages = document.getElementById('stMessages');
  const photoArea = document.getElementById('stPhotoArea');

  photoInput.addEventListener('change', () => {
    analyzeBtn.style.display = photoInput.files.length ? 'block' : 'none';
    messages.innerHTML = '';
  });

  analyzeBtn.addEventListener('click', async () => {
    const file = photoInput.files[0];
    if (!file) return;
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyzing…';

    await analyzePhoto(file, messages, (skin) => {
      renderResult(keyFromSkin(skin), "Refined using your photo");
      messages.innerHTML = `<div class="st-msg ok">Result refined using your photo.</div>`;
    }, () => {
      photoArea.style.display = 'none';
    });

    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze my photo';
  });
})();
'use strict';
const letter = document.querySelector('#letter');
document.querySelector('#open-letter-section').addEventListener('click', () => letter.showModal());
document.querySelector('#close-letter').addEventListener('click', () => letter.close());
document.querySelector('#letter-done').addEventListener('click', () => letter.close());
letter.addEventListener('click', event => { if (event.target === letter) { const r = letter.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) letter.close(); } });
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
const content = window.BIRTHDAY_CONTENT;
const editing = new URLSearchParams(location.search).get('edit') === '1';
document.body.classList.toggle('editing', editing);
for (const group of content.wordGroups) {
  const section = document.createElement('section'); section.className = 'word-group';
  const heading = document.createElement('h3'); heading.textContent = group.name;
  const grid = document.createElement('div'); grid.className = 'word-grid';
  group.words.forEach((word, index) => {
    const card = document.createElement('button'); card.type = 'button'; card.className = 'word-card';
    const initial = document.createElement('span'); initial.className = 'word-initial'; initial.textContent = group.name[index];
    const text = document.createElement('span'); text.textContent = word;
    const note = document.createElement('span'); note.className = 'word-note'; note.id = `word-note-${group.name}-${index}`; note.hidden = true;
    note.textContent = group.notes?.[index] || content.wordNotes?.[word.split(' (')[0]] || 'Un petit mot pour te célébrer, aujourd’hui et tous les autres jours.';
    card.setAttribute('aria-expanded', 'false'); card.setAttribute('aria-controls', note.id);
    const plus = document.createElement('span'); plus.className = 'word-plus'; plus.textContent = '+'; plus.setAttribute('aria-hidden', 'true');
    card.append(initial, text, plus, note);
    card.addEventListener('click', () => { const opening = card.getAttribute('aria-expanded') !== 'true'; card.setAttribute('aria-expanded', String(opening)); note.hidden = !opening; plus.textContent = opening ? '−' : '+'; });
    grid.append(card);
  });
  section.append(heading, grid); document.querySelector('#word-groups').append(section);
}
// Les liens de partage Drive deviennent automatiquement des lecteurs intégrés.
function embedSource(media) {
  const src = typeof media === 'string' ? media : media?.src;
  if (!src) return '';
  let url;
  try { url = new URL(src); } catch { return ''; }
  if (url.protocol !== 'https:') return '';
  if (url.hostname === 'drive.google.com') {
    const id = url.pathname.match(/^\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1] || url.searchParams.get('id');
    if (id && /^[a-zA-Z0-9_-]+$/.test(id)) return `https://drive.google.com/file/d/${id}/preview`;
  }
  return media?.type === 'iframe' ? url.href : '';
}
function pausePageMedia() {
  document.querySelectorAll('audio, video').forEach(media => media.pause());
}
function createEmbed(src, title, deferred = false, english = false) {
  const container = document.createElement('div'); container.className = 'embedded-video';
  const iframe = document.createElement('iframe');
  iframe.title = title; iframe.allow = 'autoplay; fullscreen; picture-in-picture'; iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  const link = document.createElement('a'); link.href = src; link.target = '_blank'; link.rel = 'noopener noreferrer';
  link.className = 'embed-fallback'; link.textContent = english ? 'Open video ↗' : 'Ouvrir la vidéo ↗';
  const start = () => { pausePageMedia(); iframe.src = src; iframe.hidden = false; };
  if (deferred) {
    iframe.hidden = true;
    const button = document.createElement('button'); button.type = 'button'; button.className = 'primary embed-play';
    button.textContent = english ? '▷ Watch the video' : '▷ Voir la vidéo';
    button.addEventListener('click', () => { button.remove(); start(); }, { once: true });
    container.append(button);
  } else start();
  container.append(iframe, link);
  return container;
}
function setVideo(language, src) {
  const frame = document.querySelector(`[data-video="${language}"]`), video = frame.querySelector('video');
  frame.querySelector('.embedded-video')?.remove();
  video.pause(); video.removeAttribute('src'); video.load(); video.hidden = true;
  const embedded = embedSource(src);
  if (embedded) {
    frame.querySelector('.video-empty').hidden = true;
    frame.append(createEmbed(embedded, video.getAttribute('aria-label'), true, language === 'en'));
    return;
  }
  video.src = typeof src === 'string' ? src : src.src;
  video.hidden = false; frame.querySelector('.video-empty').hidden = true;
  const reportError = () => { video.hidden = true; frame.querySelector('.video-empty').hidden = false; frame.querySelector('.video-empty p').textContent = language === 'fr' ? 'Cette vidéo ne peut pas être lue. Choisis un autre fichier.' : 'This video cannot be played. Please choose another file.'; };
  video.onerror = reportError;
}
['fr', 'en'].forEach(language => {
  if (content.videos[language]) { setVideo(language, content.videos[language]); document.querySelector(`[data-video-input="${language}"]`).closest('label').hidden = true; }
  const input = document.querySelector(`[data-video-input="${language}"]`);
  input.addEventListener('change', () => {
    const file = input.files[0]; if (!file || !file.type.startsWith('video/')) return;
    if (input.dataset.objectUrl) URL.revokeObjectURL(input.dataset.objectUrl);
    input.dataset.objectUrl = URL.createObjectURL(file); setVideo(language, input.dataset.objectUrl);
  });
});
const memoryDialog = document.querySelector('#memory-dialog');
let currentMemory = 0;
const memoryVideo = document.querySelector('#memory-video');
function renderMemory(index) {
  const memory = content.memories[index], image = document.querySelector('#memory-photo');
  memoryDialog.querySelector('.embedded-video')?.remove();
  memoryVideo.pause(); memoryVideo.removeAttribute('src'); memoryVideo.load(); memoryVideo.hidden = true;
  image.hidden = true; image.removeAttribute('src');
  document.querySelector('#memory-title').textContent = memory.title;
  document.querySelector('#memory-caption').textContent = memory.caption;
  image.alt = memory.alt || memory.title;
  document.querySelector('#memory-empty').hidden = Boolean(memory.src);
  document.querySelector('#photo-picker').hidden = Boolean(memory.src && !memory.src.startsWith('blob:'));
  document.querySelector('#memory-input').value = '';
  const isVideo = memory.type === 'video' || (!memory.type && /\.(mp4|webm|mov|m4v|ogv)(?:[?#]|$)/i.test(memory.src));
  if (memory.src) {
    const embedded = embedSource(memory);
    if (embedded) { memoryDialog.querySelector('.memory-image').append(createEmbed(embedded, memory.alt || memory.title)); }
    else if (isVideo) { memoryVideo.src = memory.src; memoryVideo.hidden = false; memoryVideo.setAttribute('aria-label', memory.alt || memory.title); }
    else { image.src = memory.src; image.hidden = false; }
  }
  document.querySelector('#memory-empty p').textContent = 'Une photo ou une vidéo de nous prendra place ici.';
}
function memoryError() {
  document.querySelector('#memory-photo').hidden = true; memoryVideo.pause(); memoryVideo.hidden = true;
  document.querySelector('#memory-empty').hidden = false;
  document.querySelector('#memory-empty p').textContent = 'Ce souvenir ne peut pas être affiché. Essaie une autre photo ou vidéo.';
  document.querySelector('#photo-picker').hidden = false;
}
document.querySelector('#memory-photo').addEventListener('error', memoryError);
memoryVideo.addEventListener('error', memoryError);
function showMemory(index) {
  currentMemory = index; renderMemory(index);
  memoryDialog.showModal();
}
document.querySelectorAll('[data-memory]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); showMemory(Number(link.dataset.memory)); }));
function closeMemory() { memoryDialog.close(); }
memoryDialog.addEventListener('close', () => {
  memoryVideo.pause();
  memoryDialog.querySelector('.embedded-video')?.remove();
});
memoryDialog.addEventListener('cancel', () => memoryVideo.pause());
document.querySelector('#close-memory').addEventListener('click', closeMemory);
document.querySelector('#back-to-letter').addEventListener('click', closeMemory);
document.querySelector('#memory-input').addEventListener('change', event => {
  const file = event.target.files[0]; if (!file) return;
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    document.querySelector('#memory-empty p').textContent = 'Choisis un fichier photo ou vidéo.'; return;
  }
  const memory = content.memories[currentMemory]; if (memory.src.startsWith('blob:')) URL.revokeObjectURL(memory.src);
  memory.src = URL.createObjectURL(file); memory.type = file.type.startsWith('video/') ? 'video' : 'image';
  renderMemory(currentMemory);
});
const canvas = document.querySelector('#confetti'), ctx = canvas.getContext('2d');
let pieces = [], frame, lastTime;
function resize() { canvas.width = innerWidth * Math.min(devicePixelRatio || 1, 2); canvas.height = innerHeight * Math.min(devicePixelRatio || 1, 2); ctx.setTransform(Math.min(devicePixelRatio || 1, 2), 0, 0, Math.min(devicePixelRatio || 1, 2), 0, 0); }
window.addEventListener('resize', resize); resize();
function draw(time) {
  const step = Math.min((time - (lastTime || time)) / 16.67, 3); lastTime = time;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  pieces.forEach(p => { p.x += p.vx * step; p.y += p.vy * step; p.vy += .045 * step; p.angle += p.spin * step; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .5); ctx.restore(); });
  pieces = pieces.filter(p => p.y < innerHeight + 40);
  if (pieces.length) frame = requestAnimationFrame(draw); else { ctx.clearRect(0, 0, innerWidth, innerHeight); frame = null; lastTime = null; }
}
document.querySelector('#celebrate').addEventListener('click', () => {
  document.querySelector('#celebrate').dataset.blown = 'true';
  document.querySelector('#celebration-message').textContent = 'Joyeux anniversaire, Bebou ♡';
  document.querySelector('#final-message').hidden = false;
  playCelebrationAudio();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#DE8FF2', '#7C614B', '#E2E0D1'];
  pieces = Array.from({length: 160}, () => ({x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * .5, vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 3, size: 6 + Math.random() * 7, angle: Math.random() * Math.PI, spin: (Math.random() - .5) * .15, color: colors[Math.floor(Math.random() * colors.length)]}));
  if (!frame) frame = requestAnimationFrame(draw);
});
// Deux pistes personnalisées : musique de fond et message après les bougies.
const backgroundAudio = document.querySelector('#background-audio'); backgroundAudio.volume = .45;
const celebrationAudio = document.querySelector('#celebration-audio');
const soundButton = document.querySelector('#sound');
function showAudioStatus(message) { const status = document.querySelector('#audio-status'); status.textContent = message; status.hidden = !message; }
function updateSoundButton() { const playing = !backgroundAudio.paused; soundButton.setAttribute('aria-pressed', String(playing)); soundButton.querySelector('span').textContent = playing ? 'Couper la musique' : 'Activer la musique'; }
function setAudio(track, src) { const audio = track === 'background' ? backgroundAudio : celebrationAudio; audio.pause(); audio.src = src; audio.load(); updateSoundButton(); }
if (content.audio.background) setAudio('background', content.audio.background);
if (content.audio.celebration) setAudio('celebration', content.audio.celebration);
if (content.audio.background && content.audio.celebration) document.querySelector('#audio-settings').hidden = true;
backgroundAudio.addEventListener('play', updateSoundButton); backgroundAudio.addEventListener('pause', updateSoundButton);
backgroundAudio.addEventListener('error', () => { updateSoundButton(); showAudioStatus('La musique ne peut pas être lue. Essaie un autre fichier audio.'); });
celebrationAudio.addEventListener('error', () => showAudioStatus('Ton enregistrement ne peut pas être lu. Essaie un autre fichier audio.'));
['background', 'celebration'].forEach(track => {
  const input = document.querySelector(`#${track}-input`);
  if (content.audio[track]) input.closest('label').hidden = true;
  input.addEventListener('change', () => {
    const file = input.files[0]; if (!file || !file.type.startsWith('audio/')) return;
    if (input.dataset.objectUrl) URL.revokeObjectURL(input.dataset.objectUrl);
    input.dataset.objectUrl = URL.createObjectURL(file); setAudio(track, input.dataset.objectUrl);
    showAudioStatus(''); document.querySelector('#audio-selection-status').textContent = `${track === 'background' ? 'Musique de fond' : 'Son après les bougies'} : ${file.name}`;
  });
});
soundButton.addEventListener('click', () => {
  if (!backgroundAudio.getAttribute('src')) { if (editing) { document.querySelector('#audio-settings').open = true; document.querySelector('#background-input').click(); } else showAudioStatus('La musique sera bientôt prête. Profite de ta surprise ♡'); return; }
  if (!backgroundAudio.paused) backgroundAudio.pause();
  else { celebrationAudio.pause(); showAudioStatus(''); backgroundAudio.play().catch(() => showAudioStatus('La lecture n’a pas démarré. Réessaie avec le bouton musique.')); }
});
function playCelebrationAudio() {
  backgroundAudio.pause();
  if (!celebrationAudio.getAttribute('src')) return;
  document.querySelectorAll('video').forEach(video => video.pause());
  celebrationAudio.pause(); celebrationAudio.currentTime = 0;
  showAudioStatus('');
  // Appel synchrone depuis le clic : respecte les règles de lecture audio des navigateurs.
  celebrationAudio.play().catch(() => showAudioStatus('La lecture de ton enregistrement n’a pas démarré. Appuie à nouveau sur « Souffler mes bougies ».'));
}
const portrait = document.querySelector('#hero-photo');
function setPortrait(src) { portrait.src = src; portrait.hidden = false; document.querySelector('#portrait-empty').hidden = true; }
portrait.addEventListener('error', () => { portrait.hidden = true; document.querySelector('#portrait-empty').hidden = false; document.querySelector('#portrait-picker').hidden = false; });
if (content.portrait) { setPortrait(content.portrait); document.querySelector('#portrait-picker').hidden = true; }
document.querySelector('#portrait-input').addEventListener('change', event => {
  const input = event.target, file = input.files[0]; if (!file || !file.type.startsWith('image/')) return;
  if (input.dataset.objectUrl) URL.revokeObjectURL(input.dataset.objectUrl);
  input.dataset.objectUrl = URL.createObjectURL(file); setPortrait(input.dataset.objectUrl);
});
// La vidéo garde la priorité sur la musique pour ne pas couvrir la voix.
document.querySelectorAll('video').forEach(video => video.addEventListener('play', () => {
  backgroundAudio.pause(); celebrationAudio.pause();
  document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
}));
// Une seule entrée, sans imposer de musique avant un clic volontaire.
const welcome = document.querySelector('#welcome');
welcome.addEventListener('cancel', event => event.preventDefault());
document.querySelector('#discover').addEventListener('click', () => {
  welcome.close(); document.body.classList.add('discovered');
  if (backgroundAudio.getAttribute('src')) backgroundAudio.play().catch(() => showAudioStatus('Tu peux activer la musique avec le bouton en haut de la page.'));
  document.querySelector('#title').setAttribute('tabindex', '-1'); document.querySelector('#title').focus({preventScroll:true});
});
if (!editing) welcome.showModal();
document.querySelectorAll('.video-heading, .video-frame, .letter-section > div').forEach(el => { el.classList.add('reveal'); observer.observe(el); });

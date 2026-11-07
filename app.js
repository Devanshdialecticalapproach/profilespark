const form = document.getElementById('profile-form');
const bio = document.getElementById('bio');
const photoInput = document.getElementById('photo-input');
const photoPreview = document.getElementById('photo-preview');
const uploadZone = document.getElementById('upload-zone');
const uploadMain = document.getElementById('upload-main');
const uploadSub = document.getElementById('upload-sub');
const charCount = document.getElementById('char-count');
const errorMessage = document.getElementById('error-message');
const results = document.getElementById('results');
let selectedPhoto = false;
let currentScore = 0;

bio.addEventListener('input', () => {
  charCount.textContent = `${bio.value.length.toLocaleString()} / 1,500`;
});

photoInput.addEventListener('change', () => {
  const file = photoInput.files && photoInput.files[0];
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    errorMessage.textContent = 'Please choose a JPG, PNG, or WEBP image.';
    photoInput.value = '';
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    errorMessage.textContent = 'Please choose an image smaller than 8 MB.';
    photoInput.value = '';
    return;
  }
  errorMessage.textContent = '';
  const reader = new FileReader();
  reader.onload = event => {
    photoPreview.src = event.target.result;
    uploadZone.classList.add('has-image');
    uploadMain.textContent = file.name;
    uploadSub.textContent = 'Selected · preview stays on this device';
    selectedPhoto = true;
  };
  reader.readAsDataURL(file);
});

function evaluateBio(text, hasPhoto) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const lower = trimmed.toLowerCase();
  let score = 36;
  if (words.length >= 12) score += 10;
  if (words.length >= 25) score += 12;
  if (words.length >= 45) score += 8;
  if (/[.!?]/.test(trimmed)) score += 4;
  if (/(i love|i enjoy|i’m into|i'm into|i like|weekend|hobby|music|coffee|hiking|cooking|reading|travel|film|movies|art|football|books)/i.test(trimmed)) score += 10;
  if (/(because|especially|currently|recently|trying|learning|looking forward)/i.test(trimmed)) score += 7;
  if (/(you should|must be|no drama|don't be|do not be|swipe left)/i.test(trimmed)) score -= 5;
  if (hasPhoto) score += 8;
  if (!trimmed && !hasPhoto) score = 0;
  return Math.max(25, Math.min(96, score));
}

function getFeedback(text, hasPhoto, score) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!text.trim() && hasPhoto) {
    return {
      title: 'Start with a few words about you.',
      summary: 'You have added a photo. A short, specific bio can give people a natural reason to start a conversation.',
      tip: 'Add two or three details: something you enjoy, something you are curious about, and an ideal low-key weekend.'
    };
  }
  if (words.length < 12) {
    return {
      title: 'Give people a little more to connect with.',
      summary: 'Your bio is a starting point, but it may not yet show enough of your personality.',
      tip: 'Add one concrete detail about an interest or experience. “I like music” becomes more memorable when you mention what you have been listening to lately.'
    };
  }
  if (!/(i love|i enjoy|i’m into|i'm into|i like|weekend|hobby|music|coffee|hiking|cooking|reading|travel|film|movies|art|football|books)/i.test(text)) {
    return {
      title: 'Your next step is to add personality.',
      summary: 'Your bio has some substance. A specific interest could make it easier for someone to find common ground with you.',
      tip: 'Include one real interest and a detail that makes it yours: a favourite walking route, a book you recommend, or a dish you are learning to cook.'
    };
  }
  if (!hasPhoto) {
    return {
      title: 'Your bio has a clear starting point.',
      summary: 'You have shared useful details. Consider pairing them with a photo that feels natural and easy to see.',
      tip: 'Choose a recent, well-lit photo with your face clearly visible, a simple background, and no heavy filters.'
    };
  }
  return {
    title: score >= 75 ? 'You have a strong foundation.' : 'You are building a more expressive profile.',
    summary: 'Your profile includes personal details. Now make sure it gives someone an easy opening for a conversation.',
    tip: 'End with a low-pressure conversation hook, such as asking for a favourite local café, a book recommendation, or a weekend activity.'
  };
}

form.addEventListener('submit', event => {
  event.preventDefault();
  errorMessage.textContent = '';
  if (!document.getElementById('adult-check').checked) {
    errorMessage.textContent = 'Please confirm that you are 18 or older to use this dating-profile demo.';
    return;
  }
  if (!bio.value.trim() && !selectedPhoto) {
    errorMessage.textContent = 'Add a short bio, choose a photo, or both to get your profile snapshot.';
    return;
  }
  const score = evaluateBio(bio.value, selectedPhoto);
  const feedback = getFeedback(bio.value, selectedPhoto, score);
  currentScore = score;
  document.getElementById('score-number').textContent = score;
  document.getElementById('share-score').textContent = score;
  document.getElementById('score-meter-fill').style.width = `${score}%`;
  document.getElementById('score-verdict').textContent = score >= 80 ? 'A clear, engaging foundation' : score >= 60 ? 'A promising start' : 'Room to add more of you';
  document.getElementById('result-title').textContent = feedback.title;
  document.getElementById('result-summary').textContent = feedback.summary;
  document.getElementById('result-tip').textContent = feedback.tip;
  results.classList.remove('hidden');
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('edit-button').addEventListener('click', () => {
  document.getElementById('top').scrollIntoView({ behavior: 'smooth' });
  bio.focus({ preventScroll: true });
});

document.getElementById('share-button').addEventListener('click', async () => {
  const shareText = `I got a ${currentScore}/100 profile clarity score on ProfileSpark. What would yours be?`;
  const shareUrl = window.location.href.split('#')[0];
  const feedback = document.getElementById('share-feedback');
  try {
    if (navigator.share) {
      await navigator.share({ title: 'My ProfileSpark score', text: shareText, url: shareUrl });
      feedback.textContent = 'Thanks for sharing your profile snapshot.';
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      feedback.textContent = 'Share text and link copied.';
    } else {
      feedback.textContent = 'Sharing is not available in this browser. Copy the page link from your address bar.';
    }
  } catch (error) {
    if (error && error.name !== 'AbortError') feedback.textContent = 'Could not open sharing on this device. You can copy the page link instead.';
  }
});

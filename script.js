// Theme toggle
(function() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const holder = document.querySelector('.cigarette-svg line:first-of-type');

  function updateTheme(dark) {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggle.textContent = '☀︎';
      if (holder) holder.setAttribute('stroke', '#8a8580');
    } else {
      document.documentElement.removeAttribute('data-theme');
      toggle.textContent = '☽︎';
      if (holder) holder.setAttribute('stroke', '#1a1a1a');
    }
  }

  // Set initial state
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  updateTheme(isDark);

  toggle.addEventListener('click', () => {
    const nowDark = document.documentElement.getAttribute('data-theme') !== 'dark';
    updateTheme(nowDark);
    localStorage.setItem('theme', nowDark ? 'dark' : 'light');
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      updateTheme(e.matches);
    }
  });
});

// Load and render guest data
document.addEventListener('DOMContentLoaded', async () => {
  const directory = document.getElementById('directory');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalCategory = document.getElementById('modal-category');
  const modalAuthor = document.getElementById('modal-author');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');
  const modalMatches = document.getElementById('modal-matches');

  // Load guest data
  let guests = [];
  try {
    const response = await fetch('data.json');
    guests = await response.json();
  } catch (e) {
    directory.innerHTML = '<p style="text-align: center; font-style: italic;">No guest data found. Run the build script to generate data.json</p>';
    return;
  }

  // Sort alphabetically by name
  guests.sort((a, b) => a.name.localeCompare(b.name));

  // Render guest cards
  guests.forEach(guest => {
    directory.appendChild(createGuestCard(guest));
  });

  // Modal handlers
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  function openModal(category, author, title, content, url = null, urlAlt = null) {
    modalCategory.textContent = category;
    modalAuthor.textContent = author;
    modalTitle.textContent = title;
    // Split by newlines and wrap in paragraphs
    const paragraphs = content.split('\n').filter(p => p.trim());
    let html = '';
    if (url || urlAlt) {
      html += '<div class="modal-links">';
      if (url) html += `<a href="${url}" target="_blank" rel="noopener">View the work ↗︎</a>`;
      if (urlAlt) html += `<a href="${urlAlt}" target="_blank" rel="noopener">More on the work ↗︎</a>`;
      html += '</div>';
    }
    html += paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
    modalContent.innerHTML = html;
    modalMatches.innerHTML = '';
    modalMatches.style.display = 'none';
    modalOverlay.classList.add('active');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    // Convert _text_ to <em>text</em> for italics
    return div.innerHTML.replace(/_(.*?)_/g, '<em>$1</em>');
  }

  function openMatchesModal(guestName, matches) {
    modalCategory.textContent = 'conversational matches';
    modalAuthor.textContent = guestName;
    modalTitle.textContent = '';
    modalContent.textContent = '';

    const matchesHtml = matches.map(match => `
      <div class="modal-match-item">
        <div class="modal-match-name">${match.name}</div>
        <div class="modal-match-reason">${match.reason}</div>
        <div class="modal-match-question">${match.question}</div>
      </div>
    `).join('');

    modalMatches.innerHTML = matchesHtml;
    modalMatches.style.display = 'block';
    modalOverlay.classList.add('active');
  }

  function createGuestCard(guest) {
    const card = document.createElement('article');
    card.className = 'guest-card';

    // Photo
    let photoHtml;
    if (guest.photo) {
      photoHtml = `<img src="${guest.photo}" alt="${guest.name}" class="guest-photo">`;
    } else {
      const initials = guest.name.split(' ').map(n => n[0]).join('').toUpperCase();
      photoHtml = `<div class="guest-photo-placeholder">${initials}</div>`;
    }

    // Texts - handle single or multiple entries
    const intellectualItems = Array.isArray(guest.intellectual) ? guest.intellectual : [guest.intellectual];
    const emotionalItems = Array.isArray(guest.emotional) ? guest.emotional : [guest.emotional];

    // Build text items HTML
    const intellectualHtml = intellectualItems.map((item, i) => `
      <div class="text-item" data-type="intellectual" data-index="${i}">
        ${i === 0 ? '<div class="text-category">intellectual resonance</div>' : ''}
        <div class="text-title">${createTextHtml(item)}</div>
      </div>
    `).join('');

    const emotionalHtml = emotionalItems.map((item, i) => `
      <div class="text-item" data-type="emotional" data-index="${i}">
        ${i === 0 ? '<div class="text-category">emotional resonance</div>' : ''}
        <div class="text-title">${createTextHtml(item)}</div>
      </div>
    `).join('');

    card.innerHTML = `
      <header class="guest-header">
        ${photoHtml}
        <div class="guest-info">
          <h2 class="guest-name">${guest.name}</h2>
          ${guest.tagline ? `<div class="guest-tagline">${guest.tagline}</div>` : ''}
        </div>
      </header>
      <div class="texts">
        ${intellectualHtml}
        ${emotionalHtml}
      </div>
      <div class="matches">
        <button class="matches-toggle">
          <span>conversational matches</span>
        </button>
      </div>
    `;

    // Matches modal toggle
    const toggleBtn = card.querySelector('.matches-toggle');
    toggleBtn.addEventListener('click', () => {
      openMatchesModal(guest.name, guest.matches);
    });

    // Add click handlers for plaintext items and items with blurbs
    intellectualItems.forEach((item, i) => {
      if (!isUrl(item.content) || item.blurb) {
        const el = card.querySelector(`[data-type="intellectual"][data-index="${i}"] .text-title`);
        el.addEventListener('click', () => {
          const content = item.blurb || item.content;
          const url = item.blurb ? item.content : null;
          const urlAlt = item.contentAlt || null;
          openModal('intellectual resonance', guest.name, item.title, content, url, urlAlt);
        });
      }
    });

    emotionalItems.forEach((item, i) => {
      if (!isUrl(item.content) || item.blurb) {
        const el = card.querySelector(`[data-type="emotional"][data-index="${i}"] .text-title`);
        el.addEventListener('click', () => {
          const content = item.blurb || item.content;
          const url = item.blurb ? item.content : null;
          const urlAlt = item.contentAlt || null;
          openModal('emotional resonance', guest.name, item.title, content, url, urlAlt);
        });
      }
    });

    return card;
  }

  function createTextHtml(text) {
    const content = text.content;

    if (isUrl(content) && !text.blurb) {
      return `<a href="${content}" target="_blank" rel="noopener">${text.title}<span class="external-icon">↗︎</span></a>`;
    } else {
      return `<span>${text.title}</span>`;
    }
  }

  function isUrl(str) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }
});

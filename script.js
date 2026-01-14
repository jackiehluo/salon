// Load and render guest data
document.addEventListener('DOMContentLoaded', async () => {
  const directory = document.getElementById('directory');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalCategory = document.getElementById('modal-category');
  const modalAuthor = document.getElementById('modal-author');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');

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

  function openModal(category, author, title, content) {
    modalCategory.textContent = category;
    modalAuthor.textContent = author;
    modalTitle.textContent = title;
    modalContent.textContent = content;
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

    // Matches
    const matchesHtml = guest.matches.map(match => `
      <div class="match-item">
        <div class="match-name">${match.name}</div>
        <div class="match-reason">${match.reason}</div>
        <div class="match-question">${match.question}</div>
      </div>
    `).join('');

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
          ${guest.bio ? `<p class="guest-bio">${guest.bioUrl ? `<a href="${guest.bioUrl}" target="_blank" rel="noopener">${guest.bio}</a>` : guest.bio}</p>` : ''}
        </div>
      </header>
      <div class="texts">
        ${intellectualHtml}
        ${emotionalHtml}
      </div>
      <div class="matches">
        <button class="matches-toggle">
          <span>conversational matches</span>
          <span class="matches-toggle-icon">&#9662;</span>
        </button>
        <div class="matches-content">
          ${matchesHtml}
        </div>
      </div>
    `;

    // Accordion toggle
    const matchesSection = card.querySelector('.matches');
    const toggleBtn = card.querySelector('.matches-toggle');
    toggleBtn.addEventListener('click', () => {
      matchesSection.classList.toggle('open');
    });

    // Add click handlers for plaintext items
    intellectualItems.forEach((item, i) => {
      if (!isUrl(item.content)) {
        const el = card.querySelector(`[data-type="intellectual"][data-index="${i}"] .text-title`);
        el.addEventListener('click', () => {
          openModal('intellectual resonance', guest.name, item.title, item.content);
        });
      }
    });

    emotionalItems.forEach((item, i) => {
      if (!isUrl(item.content)) {
        const el = card.querySelector(`[data-type="emotional"][data-index="${i}"] .text-title`);
        el.addEventListener('click', () => {
          openModal('emotional resonance', guest.name, item.title, item.content);
        });
      }
    });

    return card;
  }

  function createTextHtml(text) {
    const content = text.content;

    if (isUrl(content)) {
      return `<a href="${content}" target="_blank" rel="noopener">${text.title}</a>`;
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

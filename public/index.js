async function loadInitialData() {
  try {
    const response = await fetch('/api/content');
    const data = await response.json();
    document.getElementById('content').value = data.content;

    const user = data.username;
    const isAdmin = data.isAdmin;

    document.getElementById('username').textContent = user;

    if (isAdmin) {
      document.getElementById('adminButton').classList.add('visible');
      lucide.createIcons();
    }
  } catch (err) {
    console.error('Erro ao carregar dados iniciais:', err);
  }
}

function sendContent() {
  const content = document.getElementById('content').value;
  fetch('/api/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  })
  .then(res => {
    if (res.ok) {
      showMessage('Enviado com sucesso!', '#4CAF50');
    } else if (res.status === 401) {
      showMessage('Sessão expirada. Recarregue a página.', '#f44336');
    } else if (res.status === 400) {
      showMessage('Conteúdo inválido', '#f44336');
    } else {
      showMessage('Erro ao enviar', '#f44336');
    }
  })
  .catch(err => {
    showMessage('Erro de conexão', '#f44336');
  });
}

function copyContent() {
  const content = document.getElementById('content').value;
  navigator.clipboard.writeText(content).then(() => {
    showMessage('Copiado para a área de transferência!', '#2196F3');
  }).catch(err => {
    showMessage('Erro ao copiar', '#f44336');
  });
}

function loadFile(event) {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 1024 * 1024) {
      showMessage('Arquivo muito grande (máx: 1MB)', '#f44336');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('content').value = e.target.result;
      showMessage('Arquivo carregado com sucesso!', '#FF9800');
      handleContentChange();
    };
    reader.onerror = function() {
      showMessage('Erro ao carregar arquivo', '#f44336');
    };
    reader.readAsText(file);
  }
}

function showMessage(text, color) {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.style.backgroundColor = color;
  messageEl.style.display = 'block';
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
}

let autoSaveTimeout = null;
let autoSaveEnabled = false;

function toggleAutoSave() {
  const checkbox = document.getElementById('autoSave');
  autoSaveEnabled = checkbox.checked;
  localStorage.setItem('autoSave', autoSaveEnabled);

  if (autoSaveEnabled) {
    sendContent();
  } else if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }
}

function handleContentChange() {
  if (!autoSaveEnabled) return;

  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }

  autoSaveTimeout = setTimeout(() => {
    sendContent();
    autoSaveTimeout = null;
  }, 1000);
}

function initializeApp() {
  const textarea = document.getElementById('content');

  const savedWordWrap = localStorage.getItem('wordWrap') === 'true';
  const savedAutoSave = localStorage.getItem('autoSave') === 'true';

  const wordWrapCheckbox = document.getElementById('wordWrap');
  const autoSaveCheckbox = document.getElementById('autoSave');

  if (savedWordWrap) {
    wordWrapCheckbox.checked = true;
    textarea.style.whiteSpace = 'pre-wrap';
    textarea.style.overflowX = 'hidden';
  }

  if (savedAutoSave) {
    autoSaveCheckbox.checked = true;
    autoSaveEnabled = true;
  }

  textarea.addEventListener('input', handleContentChange);

  textarea.addEventListener('dragover', (e) => {
    e.preventDefault();
    textarea.classList.add('drag-over');
  });

  textarea.addEventListener('dragleave', () => {
    textarea.classList.remove('drag-over');
  });

  textarea.addEventListener('drop', (e) => {
    e.preventDefault();
    textarea.classList.remove('drag-over');

    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        textarea.value = event.target.result;
        showMessage('Arquivo carregado com sucesso!', '#FF9800');
        handleContentChange();
      };
      reader.onerror = function() {
        showMessage('Erro ao carregar arquivo', '#f44336');
      };
      reader.readAsText(file);
    }
  });

  loadInitialData();
}

function toggleWordWrap() {
  const textareaEl = document.getElementById('content');
  const checkbox = document.getElementById('wordWrap');
  const isWrapped = checkbox.checked;
  textareaEl.style.whiteSpace = isWrapped ? 'pre-wrap' : 'pre';
  textareaEl.style.overflowX = isWrapped ? 'hidden' : 'auto';
  localStorage.setItem('wordWrap', isWrapped);
}

initializeApp();

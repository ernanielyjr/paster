// Load initial data
async function loadInitialData() {
  try {
    const response = await fetch('/api/content');
    const data = await response.json();
    document.getElementById('content').value = data.content;
    document.getElementById('username').textContent = data.username;
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
    // Limit file size to 1MB
    if (file.size > 1024 * 1024) {
      showMessage('Arquivo muito grande (máx: 1MB)', '#f44336');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('content').value = e.target.result;
      document.getElementById('fileInfo').textContent = `Arquivo carregado: ${file.name} (${formatFileSize(file.size)})`;
      showMessage('Arquivo carregado com sucesso!', '#FF9800');
    };
    reader.onerror = function() {
      showMessage('Erro ao carregar arquivo', '#f44336');
    };
    reader.readAsText(file);
  }
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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

// Initialize after DOM loads
function initializeApp() {
  const textarea = document.getElementById('content');

  // Drag and drop
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
        document.getElementById('fileInfo').textContent = `Arquivo carregado: ${file.name} (${formatFileSize(file.size)})`;
        showMessage('Arquivo carregado com sucesso!', '#FF9800');
      };
      reader.onerror = function() {
        showMessage('Erro ao carregar arquivo', '#f44336');
      };
      reader.readAsText(file);
    }
  });



  // Load initial data
  loadInitialData();
}

// Toggle word wrap
function toggleWordWrap() {
  const textareaEl = document.getElementById('content');
  const checkbox = document.getElementById('wordWrap');
  textareaEl.style.whiteSpace = checkbox.checked ? 'pre-wrap' : 'pre';
  textareaEl.style.overflowX = checkbox.checked ? 'hidden' : 'auto';
}

// Initialize app
initializeApp();

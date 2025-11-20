let currentUser = null;
let users = [];
let editingUserId = null;

async function init() {
  try {
    const response = await fetch('/api/content');
    if (!response.ok) {
      window.location.href = '/';
      return;
    }
    const data = await response.json();
    currentUser = data.username;
    document.getElementById('username').textContent = currentUser;

    await loadUsers();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    showMessage('Erro ao carregar dados', 'error');
  }
}

async function loadUsers() {
  try {
    const response = await fetch('/api/admin/users');
    if (response.status === 403) {
      showMessage('Acesso negado: você não é administrador', 'error');
      setTimeout(() => window.location.href = '/', 2000);
      return;
    }
    if (!response.ok) {
      throw new Error('Erro ao carregar usuários');
    }
    users = await response.json();
    renderUsers();
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    showMessage('Erro ao carregar usuários', 'error');
  }
}

function renderUsers() {
  const tbody = document.getElementById('usersTableBody');

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="no-users">Nenhum usuário cadastrado</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td><span class="badge ${user.is_admin ? 'badge-admin' : 'badge-user'}">${user.is_admin ? 'Admin' : 'Usuário'}</span></td>
      <td><span class="datetime">${formatDateTime(user.created_at)}</span></td>
      <td><span class="datetime">${user.last_login_at ? formatDateTime(user.last_login_at) : 'Nunca'}</span></td>
      <td class="actions">
        <button class="btn-secondary btn-small" onclick="openEditModal(${user.id})">
          <i data-lucide="edit"></i>
        </button>
        <button class="btn-danger btn-small" onclick="deleteUser(${user.id})">
          <i data-lucide="trash-2"></i>
        </button>
      </td>
    </tr>
  `).join('');

  lucide.createIcons();
}

function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function openCreateModal() {
  editingUserId = null;
  document.getElementById('modalTitle').textContent = 'Novo Usuário';
  document.getElementById('modalUsername').value = '';
  document.getElementById('modalPassword').value = '';
  document.getElementById('modalPassword').required = true;
  document.getElementById('modalIsAdmin').checked = false;
  document.getElementById('passwordHint').style.display = 'none';
  document.getElementById('userModal').style.display = 'block';
}

function openEditModal(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;

  editingUserId = userId;
  document.getElementById('modalTitle').textContent = 'Editar Usuário';
  document.getElementById('modalUsername').value = user.username;
  document.getElementById('modalPassword').value = '';
  document.getElementById('modalPassword').required = false;
  document.getElementById('modalIsAdmin').checked = user.is_admin === 1;
  document.getElementById('passwordHint').style.display = 'inline';
  document.getElementById('userModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('userModal').style.display = 'none';
}

document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('modalUsername').value;
  const password = document.getElementById('modalPassword').value;
  const isAdmin = document.getElementById('modalIsAdmin').checked;

  const payload = { username, isAdmin };
  if (password || !editingUserId) {
    payload.password = password;
  }

  try {
    let response;
    if (editingUserId) {
      response = await fetch(`/api/admin/users/${editingUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    if (response.ok) {
      showMessage(editingUserId ? 'Usuário atualizado com sucesso' : 'Usuário criado com sucesso', 'success');
      closeModal();
      await loadUsers();
    } else {
      const error = await response.json();
      showMessage(error.error || 'Erro ao salvar usuário', 'error');
    }
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    showMessage('Erro ao salvar usuário', 'error');
  }
});

async function deleteUser(userId) {
  if (!confirm('Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.')) {
    return;
  }

  try {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      showMessage('Usuário deletado com sucesso', 'success');
      await loadUsers();
    } else {
      const error = await response.json();
      showMessage(error.error || 'Erro ao deletar usuário', 'error');
    }
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    showMessage('Erro ao deletar usuário', 'error');
  }
}

function showMessage(text, type = 'success') {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.style.backgroundColor = type === 'success' ? '#5cb85c' : '#e74c3c';
  messageEl.style.display = 'block';

  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
}

window.onclick = function(event) {
  const modal = document.getElementById('userModal');
  if (event.target === modal) {
    closeModal();
  }
};

init();

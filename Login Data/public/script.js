async function fetchUsers() {
  const res = await fetch('/users');
  const users = await res.json();
  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = '';

  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input id="name-${user.id}" value="${user.name}" /></td>
      <td><input id="dept-${user.id}" value="${user.department}" /></td>
      <td>${new Date(user.startDate).toLocaleDateString()}</td>
      <td>
        <button onclick="updateUser('${user.id}')">Update</button>
        <button onclick="deleteUser('${user.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('createForm').onsubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const department = document.getElementById('department').value;

  await fetch('/users', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, department})
  });

  e.target.reset();
  fetchUsers();
};

function updateUser(id) {
  const name = document.getElementById(`name-${id}`).value;
  const department = document.getElementById(`dept-${id}`).value;

  fetch(`/users/${id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, department})
  }).then(fetchUsers);
}

async function deleteUser(id) {
  await fetch(`/users/${id}`, {method: 'DELETE'});
  fetchUsers();
}

fetchUsers();

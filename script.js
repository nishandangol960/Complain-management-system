// ═══════════════════════════════════════════
//  DATA LAYER
// ═══════════════════════════════════════════

const DB = {
  get users() { return JSON.parse(localStorage.getItem('cms_users') || '[]'); },
  set users(v) { localStorage.setItem('cms_users', JSON.stringify(v)); },
  get complaints() { return JSON.parse(localStorage.getItem('cms_complaints') || '[]'); },
  set complaints(v) { localStorage.setItem('cms_complaints', JSON.stringify(v)); },
  get session() { return JSON.parse(localStorage.getItem('cms_session') || 'null'); },
  set session(v) { localStorage.setItem('cms_session', JSON.stringify(v)); }
};

// Seed admin account
(function seed() {
  const users = DB.users;
  if (!users.find(u => u.email === 'admin@college.edu')) {
    users.push({
      id: 'admin-001',
      name: 'Administrator',
      email: 'admin@college.edu',
      password: 'admin123',
      role: 'admin',
      dept: 'Administration',
      studentId: 'ADMIN'
    });
    DB.users = users;
  }

  // Seed demo complaints if empty
  if (DB.complaints.length === 0) {
    const demoUser = users.find(u => u.role !== 'admin');
    if (demoUser) {
      DB.complaints = [
        { id: cid(), userId: demoUser.id, userName: demoUser.name,
          title: 'Wi-Fi not working in Block B', category: 'IT / Wi-Fi', priority: 'High',
          desc: 'Internet connectivity has been down for 3 days in Block B hostel rooms 201-210.',
          status: 'In Progress', date: new Date(Date.now()-3*864e5).toISOString(), note: 'IT team is investigating the router.' },
        { id: cid(), userId: demoUser.id, userName: demoUser.name,
          title: 'Library books not available', category: 'Library', priority: 'Normal',
          desc: 'Several reference books listed in the syllabus are missing from the library.',
          status: 'Resolved', date: new Date(Date.now()-7*864e5).toISOString(), note: 'New stock ordered and shelved.' },
      ];
    }
  }
})();

function cid() { return 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2,7); }

// ═══════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════

let currentUser = null;
let updatingId = null;
let deletingId = null;

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t, i) => t.classList.toggle('active', (i===0&&tab==='login')||(i===1&&tab==='register')));
  document.getElementById('login-form').style.display = tab==='login'?'':'none';
  document.getElementById('register-form').style.display = tab==='register'?'':'none';
}

function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pw = document.getElementById('login-password').value;
  const err = document.getElementById('login-error');
  err.style.display = 'none';

  const user = DB.users.find(u => u.email===email && u.password===pw);
  if (!user) { err.textContent='Invalid email or password.'; err.style.display='block'; return; }

  DB.session = { userId: user.id };
  bootApp(user);
}

function handleRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const sid = document.getElementById('reg-studentid').value.trim();
  const dept = document.getElementById('reg-dept').value;
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const pw = document.getElementById('reg-password').value;
  const err = document.getElementById('reg-error');
  const succ = document.getElementById('reg-success');
  err.style.display='none'; succ.style.display='none';

  if (!name||!sid||!dept||!email||!pw) { err.textContent='Please fill in all fields.'; err.style.display='block'; return; }
  if (pw.length < 6) { err.textContent='Password must be at least 6 characters.'; err.style.display='block'; return; }
  if (DB.users.find(u=>u.email===email)) { err.textContent='An account with this email already exists.'; err.style.display='block'; return; }

  const user = { id: 'u_'+Date.now(), name, email, password: pw, role: 'user', dept, studentId: sid };
  const users = DB.users; users.push(user); DB.users = users;

  succ.textContent='Account created! You can now sign in.'; succ.style.display='block';
  setTimeout(()=>{ switchAuthTab('login'); document.getElementById('login-email').value=email; }, 1500);
}

function bootApp(user) {
  currentUser = user;
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  // Set sidebar info
  document.getElementById('sidebar-avatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('sidebar-name').textContent = user.name;
  document.getElementById('sidebar-role').textContent = user.role === 'admin' ? 'Administrator' : 'Student';
  document.getElementById('profile-avatar').textContent = user.name.charAt(0).toUpperCase();

  // Show correct nav
  document.getElementById('user-nav').style.display = user.role==='admin'?'none':'';
  document.getElementById('admin-nav').style.display = user.role==='admin'?'':'none';

  if (user.role === 'admin') {
    showPage('admin-dashboard');
  } else {
    showPage('dashboard');
  }
}

function handleLogout() {
  DB.session = null;
  currentUser = null;
  document.getElementById('app').style.display = 'none';
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('login-email').value='';
  document.getElementById('login-password').value='';
  document.getElementById('login-error').style.display='none';
}

// Auto-login if session exists
window.addEventListener('DOMContentLoaded', () => {
  const sess = DB.session;
  if (sess) {
    const user = DB.users.find(u=>u.id===sess.userId);
    if (user) { bootApp(user); return; }
  }
});

// ═══════════════════════════════════════════
//  PAGE ROUTING
// ═══════════════════════════════════════════

const pageTitles = {
  'dashboard': 'Dashboard',
  'submit': 'Submit a Complaint',
  'my-complaints': 'My Complaints',
  'profile': 'My Profile',
  'admin-dashboard': 'Admin Dashboard',
  'all-complaints': 'All Complaints',
  'manage-users': 'Manage Users'
};

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-'+pageId);
  if (pg) pg.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.getAttribute('onclick') && n.getAttribute('onclick').includes(pageId)) n.classList.add('active');
  });

  document.getElementById('page-title').textContent = pageTitles[pageId] || '';
  document.getElementById('topbar-actions').innerHTML = '';

  // Render page data
  if (pageId==='dashboard') renderUserDashboard();
  if (pageId==='my-complaints') renderMyComplaints();
  if (pageId==='profile') renderProfile();
  if (pageId==='admin-dashboard') renderAdminDashboard();
  if (pageId==='all-complaints') renderAdminComplaints();
  if (pageId==='manage-users') renderUsersTable();

  // Topbar actions
  if (pageId==='submit') {
    document.getElementById('topbar-actions').innerHTML = `<button class="btn btn-ghost btn-sm" onclick="showPage('my-complaints')">← Back to My Complaints</button>`;
  }
  if (pageId==='my-complaints') {
    document.getElementById('topbar-actions').innerHTML = `<button class="btn btn-primary btn-sm" onclick="showPage('submit')">+ New Complaint</button>`;
  }
}

// ═══════════════════════════════════════════
//  USER: DASHBOARD
// ═══════════════════════════════════════════

function renderUserDashboard() {
  const all = DB.complaints.filter(c=>c.userId===currentUser.id);
  const pending = all.filter(c=>c.status==='Pending').length;
  const inprog = all.filter(c=>c.status==='In Progress').length;
  const resolved = all.filter(c=>c.status==='Resolved').length;

  document.getElementById('user-stats').innerHTML = `
    <div class="stat-card accent">
      <div class="stat-label">Total Submitted</div>
      <div class="stat-value">${all.length}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Pending</div>
      <div class="stat-value" style="color:var(--pending)">${pending}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">In Progress</div>
      <div class="stat-value" style="color:var(--inprogress)">${inprog}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Resolved</div>
      <div class="stat-value" style="color:var(--resolved)">${resolved}</div>
    </div>
  `;

  const recent = [...all].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
  const tbody = document.getElementById('recent-complaints-body');
  if (!recent.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">📭</div><h3>No complaints yet</h3><p>Submit your first complaint using the sidebar.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = recent.map(c=>`
    <tr>
      <td><div class="complaint-title">${esc(c.title)}</div></td>
      <td><span class="cat-badge">${esc(c.category)}</span></td>
      <td style="color:var(--text3);font-size:13px">${fmt(c.date)}</td>
      <td>${statusBadge(c.status)}</td>
    </tr>
  `).join('');
}

// ═══════════════════════════════════════════
//  USER: MY COMPLAINTS
// ═══════════════════════════════════════════

function renderMyComplaints() {
  const q = (document.getElementById('my-search')?.value||'').toLowerCase();
  const sf = document.getElementById('my-filter')?.value||'';
  let list = DB.complaints.filter(c=>c.userId===currentUser.id);
  if (sf) list = list.filter(c=>c.status===sf);
  if (q) list = list.filter(c=>c.title.toLowerCase().includes(q)||c.category.toLowerCase().includes(q));
  list.sort((a,b)=>new Date(b.date)-new Date(a.date));

  const tbody = document.getElementById('my-complaints-body');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">📭</div><h3>No complaints found</h3><p>Submit a new complaint or adjust your filters.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(c=>`
    <tr>
      <td>
        <div class="complaint-title">${esc(c.title)}</div>
        <div class="complaint-meta">#${c.id.slice(-6).toUpperCase()}</div>
      </td>
      <td><span class="cat-badge">${esc(c.category)}</span></td>
      <td><span style="font-size:13px;font-weight:500;color:${c.priority==='Urgent'?'var(--danger)':c.priority==='High'?'var(--pending)':'var(--text2)'}">${c.priority}</span></td>
      <td style="color:var(--text3);font-size:13px">${fmt(c.date)}</td>
      <td>${statusBadge(c.status)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-sm btn-ghost" onclick="viewComplaint('${c.id}')">View</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ═══════════════════════════════════════════
//  SUBMIT COMPLAINT
// ═══════════════════════════════════════════

function submitComplaint() {
  const title = document.getElementById('c-title').value.trim();
  const cat = document.getElementById('c-category').value;
  const priority = document.getElementById('c-priority').value;
  const desc = document.getElementById('c-desc').value.trim();
  const err = document.getElementById('submit-error');
  const succ = document.getElementById('submit-success');
  err.style.display='none'; succ.style.display='none';

  if (!title||!cat||!desc) { err.textContent='Please fill in all fields.'; err.style.display='block'; return; }

  const complaint = {
    id: cid(), userId: currentUser.id, userName: currentUser.name,
    title, category: cat, priority, desc,
    status: 'Pending', date: new Date().toISOString(), note: ''
  };
  const complaints = DB.complaints; complaints.push(complaint); DB.complaints = complaints;

  succ.textContent='Complaint submitted successfully! You can track it in My Complaints.';
  succ.style.display='block';
  clearComplaintForm();
  updatePendingBadge();
  toast('Complaint submitted!', 'success');
}

function clearComplaintForm() {
  ['c-title','c-desc'].forEach(id=>{document.getElementById(id).value='';});
  document.getElementById('c-category').value='';
  document.getElementById('c-priority').value='Normal';
}

// ═══════════════════════════════════════════
//  PROFILE
// ═══════════════════════════════════════════

function renderProfile() {
  const u = currentUser;
  document.getElementById('profile-avatar').textContent = u.name.charAt(0).toUpperCase();
  document.getElementById('profile-info').innerHTML = `
    <div style="margin-bottom:12px">
      <p style="font-size:20px;font-weight:600;letter-spacing:-0.3px">${esc(u.name)}</p>
      <p style="font-size:14px;color:var(--text2);margin-top:2px">${esc(u.email)}</p>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px;">
      ${u.role!=='admin'?`
        <div><div class="detail-label">Student ID</div><div class="detail-value">${esc(u.studentId||'—')}</div></div>
        <div><div class="detail-label">Department</div><div class="detail-value">${esc(u.dept||'—')}</div></div>
      `:''}
      <div><div class="detail-label">Role</div><div class="detail-value" style="text-transform:capitalize">${esc(u.role)}</div></div>
    </div>
  `;
}

function changePassword() {
  const cur = document.getElementById('pw-current').value;
  const nw = document.getElementById('pw-new').value;
  const err = document.getElementById('pw-error');
  const succ = document.getElementById('pw-success');
  err.style.display='none'; succ.style.display='none';

  if (cur !== currentUser.password) { err.textContent='Current password is incorrect.'; err.style.display='block'; return; }
  if (nw.length < 6) { err.textContent='New password must be at least 6 characters.'; err.style.display='block'; return; }

  const users = DB.users;
  const idx = users.findIndex(u=>u.id===currentUser.id);
  users[idx].password = nw;
  DB.users = users;
  currentUser = users[idx];
  DB.session = { userId: currentUser.id };

  succ.textContent='Password updated successfully.'; succ.style.display='block';
  document.getElementById('pw-current').value='';
  document.getElementById('pw-new').value='';
  toast('Password changed!', 'success');
}

// ═══════════════════════════════════════════
//  ADMIN: DASHBOARD
// ═══════════════════════════════════════════

function renderAdminDashboard() {
  const all = DB.complaints;
  const pending = all.filter(c=>c.status==='Pending').length;
  const inprog = all.filter(c=>c.status==='In Progress').length;
  const resolved = all.filter(c=>c.status==='Resolved').length;
  const users = DB.users.filter(u=>u.role!=='admin').length;

  document.getElementById('admin-stats').innerHTML = `
    <div class="stat-card accent">
      <div class="stat-label">Total Complaints</div>
      <div class="stat-value">${all.length}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Pending</div>
      <div class="stat-value" style="color:var(--pending)">${pending}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">In Progress</div>
      <div class="stat-value" style="color:var(--inprogress)">${inprog}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Resolved</div>
      <div class="stat-value" style="color:var(--resolved)">${resolved}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Students</div>
      <div class="stat-value">${users}</div>
    </div>
  `;

  updatePendingBadge();

  const recent = [...all].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6);
  const tbody = document.getElementById('admin-recent-body');
  if (!recent.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">📭</div><h3>No complaints yet</h3></div></td></tr>`;
    return;
  }
  tbody.innerHTML = recent.map(c=>`
    <tr>
      <td><div class="complaint-title">${esc(c.title)}</div></td>
      <td style="font-size:13px">${esc(c.userName)}</td>
      <td><span class="cat-badge">${esc(c.category)}</span></td>
      <td style="color:var(--text3);font-size:13px">${fmt(c.date)}</td>
      <td>${statusBadge(c.status)}</td>
    </tr>
  `).join('');
}

// ═══════════════════════════════════════════
//  ADMIN: ALL COMPLAINTS
// ═══════════════════════════════════════════

function renderAdminComplaints() {
  const q = (document.getElementById('admin-search')?.value||'').toLowerCase();
  const sf = document.getElementById('admin-filter-status')?.value||'';
  const cf = document.getElementById('admin-filter-cat')?.value||'';
  let list = DB.complaints;
  if (sf) list = list.filter(c=>c.status===sf);
  if (cf) list = list.filter(c=>c.category===cf);
  if (q) list = list.filter(c=>c.title.toLowerCase().includes(q)||c.userName.toLowerCase().includes(q)||c.category.toLowerCase().includes(q));
  list.sort((a,b)=>new Date(b.date)-new Date(a.date));

  const tbody = document.getElementById('admin-complaints-body');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">📭</div><h3>No complaints found</h3><p>Try adjusting your filters.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(c=>`
    <tr>
      <td>
        <div class="complaint-title">${esc(c.title)}</div>
        <div class="complaint-meta">#${c.id.slice(-6).toUpperCase()}</div>
      </td>
      <td style="font-size:13px">${esc(c.userName)}</td>
      <td><span class="cat-badge">${esc(c.category)}</span></td>
      <td><span style="font-size:12px;font-weight:500;color:${c.priority==='Urgent'?'var(--danger)':c.priority==='High'?'var(--pending)':'var(--text2)'}">${c.priority}</span></td>
      <td style="color:var(--text3);font-size:13px">${fmt(c.date)}</td>
      <td>${statusBadge(c.status)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-sm btn-outline" onclick="openUpdateModal('${c.id}')">Update</button>
          <button class="btn btn-sm btn-ghost" onclick="viewComplaint('${c.id}')">View</button>
          <button class="btn btn-sm btn-danger" onclick="openDeleteModal('${c.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ═══════════════════════════════════════════
//  ADMIN: USERS
// ═══════════════════════════════════════════

function renderUsersTable() {
  const q = (document.getElementById('user-search')?.value||'').toLowerCase();
  let users = DB.users;
  if (q) users = users.filter(u=>u.name.toLowerCase().includes(q)||u.email.toLowerCase().includes(q));

  const tbody = document.getElementById('users-table-body');
  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">👤</div><h3>No users found</h3></div></td></tr>`;
    return;
  }
  tbody.innerHTML = users.map(u=>{
    const count = DB.complaints.filter(c=>c.userId===u.id).length;
    return `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:32px;height:32px;border-radius:50%;background:${u.role==='admin'?'var(--accent)':'var(--surface2)'};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:${u.role==='admin'?'white':'var(--text2)'};flex-shrink:0">${u.name.charAt(0).toUpperCase()}</div>
          <span style="font-weight:500">${esc(u.name)}</span>
        </div>
      </td>
      <td style="font-size:13px;color:var(--text2)">${esc(u.email)}</td>
      <td style="font-size:13px">${esc(u.dept||'—')} ${u.studentId?'<span style="color:var(--text3)">· '+esc(u.studentId)+'</span>':''}</td>
      <td><span class="role-badge role-${u.role==='admin'?'admin':'user'}">${u.role==='admin'?'Admin':'Student'}</span></td>
      <td style="font-family:'DM Mono',monospace;font-size:13px">${count}</td>
      <td>
        ${u.role!=='admin'?`<button class="btn btn-sm btn-danger" onclick="deleteUser('${u.id}')">Remove</button>`:'<span style="font-size:12px;color:var(--text3)">Protected</span>'}
      </td>
    </tr>`;
  }).join('');
}

function deleteUser(uid) {
  const users = DB.users.filter(u=>u.id!==uid);
  DB.users = users;
  // Remove their complaints too
  DB.complaints = DB.complaints.filter(c=>c.userId!==uid);
  renderUsersTable();
  toast('User removed.', 'success');
}

// ═══════════════════════════════════════════
//  MODALS
// ═══════════════════════════════════════════

function viewComplaint(id) {
  const c = DB.complaints.find(x=>x.id===id);
  if (!c) return;
  const stages = ['Pending','In Progress','Resolved'];
  const si = stages.indexOf(c.status);

  document.getElementById('detail-content').innerHTML = `
    <div class="detail-section">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px;">
        <div>
          <div style="font-size:18px;font-weight:600;letter-spacing:-0.3px;margin-bottom:4px">${esc(c.title)}</div>
          <div style="font-size:12px;color:var(--text3)">ID: #${c.id.slice(-8).toUpperCase()} · Submitted ${fmt(c.date)}</div>
        </div>
        ${statusBadge(c.status)}
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px;">
      <div><div class="detail-label">Category</div><span class="cat-badge">${esc(c.category)}</span></div>
      <div><div class="detail-label">Priority</div><span style="font-weight:500;color:${c.priority==='Urgent'?'var(--danger)':c.priority==='High'?'var(--pending)':'var(--text2)'}">${c.priority}</span></div>
      ${currentUser.role==='admin'?`<div><div class="detail-label">Submitted By</div><div class="detail-value" style="font-size:14px">${esc(c.userName)}</div></div>`:''}
    </div>
    <div class="detail-section">
      <div class="detail-label">Description</div>
      <div style="font-size:14px;color:var(--text);background:var(--bg);border-radius:var(--radius);padding:14px;line-height:1.7;margin-top:6px">${esc(c.desc)}</div>
    </div>
    ${c.note?`<div class="detail-section">
      <div class="detail-label">Admin Note</div>
      <div style="font-size:14px;color:var(--text);background:var(--accent-light);border-radius:var(--radius);padding:14px;line-height:1.7;margin-top:6px;border-left:3px solid var(--accent)">${esc(c.note)}</div>
    </div>`:''}
    <div>
      <div class="detail-label" style="margin-bottom:8px">Progress</div>
      <div class="status-timeline">
        ${stages.map((s,i)=>`
          <div class="timeline-item ${i<=si?'done':''}" style="color:${i<=si?'var(--resolved)':'var(--text3)'}">
            <div class="timeline-dot"></div>
            <span style="font-size:13px;font-weight:${i<=si?'500':'400'}">${s}</span>
            ${i===si?'<span style="margin-left:auto;font-size:11px;background:var(--resolved-bg);color:var(--resolved);padding:2px 8px;border-radius:10px">Current</span>':''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
  openModal('detail-modal');
}

function openUpdateModal(id) {
  updatingId = id;
  const c = DB.complaints.find(x=>x.id===id);
  if (!c) return;
  document.getElementById('update-status').value = c.status;
  document.getElementById('update-note').value = c.note||'';
  openModal('update-modal');
}

function confirmUpdate() {
  const status = document.getElementById('update-status').value;
  const note = document.getElementById('update-note').value.trim();
  const complaints = DB.complaints;
  const idx = complaints.findIndex(c=>c.id===updatingId);
  if (idx<0) return;
  complaints[idx].status = status;
  complaints[idx].note = note;
  DB.complaints = complaints;
  closeModal('update-modal');
  renderAdminComplaints();
  updatePendingBadge();
  toast('Complaint updated!', 'success');
}

function openDeleteModal(id) {
  deletingId = id;
  openModal('delete-modal');
}

function confirmDelete() {
  DB.complaints = DB.complaints.filter(c=>c.id!==deletingId);
  closeModal('delete-modal');
  renderAdminComplaints();
  updatePendingBadge();
  toast('Complaint deleted.', 'error');
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(o=>{
  o.addEventListener('click', e=>{ if(e.target===o) o.classList.remove('open'); });
});

// ═══════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════

function statusBadge(s) {
  const cls = s==='Pending'?'pending':s==='In Progress'?'inprogress':'resolved';
  return `<span class="badge badge-${cls}">${s}</span>`;
}

function fmt(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function updatePendingBadge() {
  const n = DB.complaints.filter(c=>c.status==='Pending').length;
  const b = document.getElementById('pending-badge');
  if (b) { b.textContent=n; b.style.display=n?'':'none'; }
}

let toastTimer;
function toast(msg, type='') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show' + (type?' '+type:'');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ el.className='toast'; }, 3000);
}
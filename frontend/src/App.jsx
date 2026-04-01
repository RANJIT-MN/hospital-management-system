import { useState } from 'react';
import { loginUser } from './api/auth';
import { registerPatient, getAllPatients } from './api/patients';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('hms_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState('dashboard');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('hms_token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hms_token');
    setToken(null);
  };

  const navStyle = (p) => ({
    padding: '10px 18px', cursor: 'pointer', borderRadius: '8px',
    background: page === p ? '#0066cc' : 'transparent',
    color: page === p ? 'white' : '#475569', fontWeight: 500,
    border: 'none', fontSize: '14px', textAlign: 'left', width: '100%'
  });

  if (!token) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', background:'#f0f4f8', fontFamily:'sans-serif' }}>
      <div style={{ background:'white', padding:'40px', borderRadius:'16px',
        boxShadow:'0 4px 24px rgba(0,0,0,0.1)', width:'360px' }}>
        <h2 style={{ marginBottom:'8px', fontSize:'22px' }}>🏥 MedCore HMS</h2>
        <p style={{ color:'#64748b', marginBottom:'28px', fontSize:'14px' }}>Hospital Management System</p>
        {error && <p style={{ color:'#e63946', marginBottom:'16px', fontSize:'13px',
          background:'#fce8ea', padding:'10px', borderRadius:'8px' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:'14px' }}>
            <label style={{ fontSize:'12px', fontWeight:600, color:'#64748b' }}>EMAIL</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="admin@hospital.com" required
              style={{ width:'100%', padding:'10px 12px', marginTop:'4px',
                border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'14px',
                outline:'none', boxSizing:'border-box' }} />
          </div>
          <div style={{ marginBottom:'24px' }}>
            <label style={{ fontSize:'12px', fontWeight:600, color:'#64748b' }}>PASSWORD</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••" required
              style={{ width:'100%', padding:'10px 12px', marginTop:'4px',
                border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'14px',
                outline:'none', boxSizing:'border-box' }} />
          </div>
          <button type="submit" style={{ width:'100%', padding:'11px',
            background:'#0066cc', color:'white', border:'none',
            borderRadius:'8px', fontSize:'15px', fontWeight:600, cursor:'pointer' }}>
            Login →
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:'sans-serif', background:'#f0f4f8' }}>
      {/* Sidebar */}
      <div style={{ width:'220px', background:'white', borderRight:'1px solid #e2e8f0',
        display:'flex', flexDirection:'column', padding:'20px 10px' }}>
        <div style={{ padding:'0 10px 20px', borderBottom:'1px solid #e2e8f0', marginBottom:'12px' }}>
          <div style={{ fontSize:'18px', fontWeight:700 }}>🏥 MedCore</div>
          <div style={{ fontSize:'12px', color:'#94a3b8', marginTop:'2px' }}>HMS Dashboard</div>
        </div>
        <button style={navStyle('dashboard')} onClick={()=>setPage('dashboard')}>📊 Dashboard</button>
        <button style={navStyle('register')}  onClick={()=>setPage('register')}>➕ Register Patient</button>
        <button style={navStyle('patients')}  onClick={()=>setPage('patients')}>👥 View Patients</button>
        <div style={{ marginTop:'auto', padding:'10px' }}>
          <button onClick={handleLogout} style={{ width:'100%', padding:'9px',
            background:'#fce8ea', color:'#e63946', border:'none',
            borderRadius:'8px', cursor:'pointer', fontWeight:600, fontSize:'13px' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex:1, overflow:'auto', padding:'32px' }}>
        {page === 'dashboard' && <Dashboard />}
        {page === 'register'  && <RegisterForm onSuccess={()=>setPage('patients')} />}
        {page === 'patients'  && <PatientsList />}
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2 style={{ marginBottom:'24px', fontSize:'22px', fontWeight:700 }}>Dashboard</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
        {[
          { label:'Total Patients', value:'2,847', icon:'👥', color:'#e8f0fb' },
          { label:"Today's Appointments", value:'38', icon:'📅', color:'#e6f7f3' },
          { label:'Revenue Today', value:'₹1.4L', icon:'💰', color:'#fef3e8' },
        ].map((s,i) => (
          <div key={i} style={{ background:'white', borderRadius:'12px', padding:'24px',
            border:'1px solid #e2e8f0', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ width:'44px', height:'44px', background:s.color, borderRadius:'10px',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'20px', marginBottom:'14px' }}>{s.icon}</div>
            <div style={{ fontSize:'12px', color:'#94a3b8', fontWeight:600,
              letterSpacing:'.05em', textTransform:'uppercase' }}>{s.label}</div>
            <div style={{ fontSize:'28px', fontWeight:700, marginTop:'6px' }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:'24px', background:'white', borderRadius:'12px',
        padding:'24px', border:'1px solid #e2e8f0' }}>
        <h3 style={{ marginBottom:'16px' }}>⚡ Quick Actions</h3>
        <p style={{ color:'#64748b', fontSize:'14px' }}>
          Use the sidebar to Register a new patient or View all patients stored in MongoDB.
        </p>
      </div>
    </div>
  );
}

function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({
    firstName:'', lastName:'', phone:'', dob:'', gender:'',
    bloodGroup:'', department:'General Medicine', symptoms:''
  });
  const [msg, setMsg]       = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerPatient(form);
      setMsg('✅ Patient registered! ID: ' + res.data.patient.patientId);
      setForm({ firstName:'', lastName:'', phone:'', dob:'', gender:'',
        bloodGroup:'', department:'General Medicine', symptoms:'' });
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Error registering patient'));
    }
    setLoading(false);
  };

  const inp = { width:'100%', padding:'9px 12px', border:'1px solid #e2e8f0',
    borderRadius:'8px', fontSize:'14px', boxSizing:'border-box', marginTop:'4px' };
  const lbl = { fontSize:'12px', fontWeight:600, color:'#64748b' };

  return (
    <div>
      <h2 style={{ marginBottom:'24px', fontSize:'22px', fontWeight:700 }}>Register New Patient</h2>
      <div style={{ background:'white', borderRadius:'12px', padding:'28px',
        border:'1px solid #e2e8f0', maxWidth:'600px' }}>
        {msg && <div style={{ marginBottom:'16px', padding:'12px', borderRadius:'8px',
          background: msg.startsWith('✅') ? '#e6f7f3' : '#fce8ea',
          color: msg.startsWith('✅') ? '#007a58' : '#e63946', fontSize:'14px' }}>{msg}</div>}
        <form onSubmit={submit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            <div><label style={lbl}>First Name *</label>
              <input style={inp} name="firstName" value={form.firstName} onChange={handle} required /></div>
            <div><label style={lbl}>Last Name *</label>
              <input style={inp} name="lastName" value={form.lastName} onChange={handle} required /></div>
            <div><label style={lbl}>Phone *</label>
              <input style={inp} name="phone" value={form.phone} onChange={handle} required /></div>
            <div><label style={lbl}>Date of Birth *</label>
              <input style={inp} type="date" name="dob" value={form.dob} onChange={handle} required /></div>
            <div><label style={lbl}>Gender *</label>
              <select style={inp} name="gender" value={form.gender} onChange={handle} required>
                <option value="">Select</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select></div>
            <div><label style={lbl}>Blood Group</label>
              <select style={inp} name="bloodGroup" value={form.bloodGroup} onChange={handle}>
                <option value="">Select</option>
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
              </select></div>
            <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Department</label>
              <select style={inp} name="department" value={form.department} onChange={handle}>
                <option>General Medicine</option><option>Cardiology</option>
                <option>Neurology</option><option>Orthopedics</option>
                <option>Gynaecology</option><option>Paediatrics</option>
              </select></div>
            <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Symptoms / Notes</label>
              <textarea style={{ ...inp, minHeight:'80px', resize:'vertical' }}
                name="symptoms" value={form.symptoms} onChange={handle} /></div>
          </div>
          <button type="submit" disabled={loading}
            style={{ marginTop:'20px', padding:'11px 28px', background:'#0066cc',
              color:'white', border:'none', borderRadius:'8px',
              fontSize:'15px', fontWeight:600, cursor:'pointer' }}>
            {loading ? 'Registering...' : 'Register Patient →'}
          </button>
        </form>
      </div>
    </div>
  );
}

function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useState(() => {
    getAllPatients()
      .then(res => { setPatients(res.data); setLoading(false); })
      .catch(err => { setError('Failed to load patients'); setLoading(false); });
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom:'24px', fontSize:'22px', fontWeight:700 }}>All Patients</h2>
      <div style={{ background:'white', borderRadius:'12px', border:'1px solid #e2e8f0', overflow:'hidden' }}>
        {loading && <p style={{ padding:'24px', color:'#64748b' }}>Loading patients from MongoDB...</p>}
        {error   && <p style={{ padding:'24px', color:'#e63946' }}>{error}</p>}
        {!loading && !error && patients.length === 0 &&
          <p style={{ padding:'24px', color:'#64748b' }}>No patients yet. Register one first!</p>}
        {patients.length > 0 && (
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'14px' }}>
            <thead>
              <tr style={{ background:'#f8fafc' }}>
                {['Patient ID','Name','Phone','Gender','Department','Status'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left',
                    fontSize:'11px', fontWeight:700, color:'#94a3b8',
                    textTransform:'uppercase', borderBottom:'1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p._id} style={{ borderBottom:'1px solid #e2e8f0' }}>
                  <td style={{ padding:'12px 16px', fontWeight:600, color:'#0066cc' }}>{p.patientId}</td>
                  <td style={{ padding:'12px 16px', fontWeight:500 }}>{p.firstName} {p.lastName}</td>
                  <td style={{ padding:'12px 16px', color:'#64748b' }}>{p.phone}</td>
                  <td style={{ padding:'12px 16px', color:'#64748b' }}>{p.gender}</td>
                  <td style={{ padding:'12px 16px', color:'#64748b' }}>{p.department}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{ padding:'3px 10px', borderRadius:'100px', fontSize:'12px',
                      fontWeight:600, background:'#e6f7f3', color:'#007a58' }}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
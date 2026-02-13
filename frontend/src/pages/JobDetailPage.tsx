import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob, getInvites, getContractors, createInvite, updateInviteStatus, updateJobStatus } from '../api';

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [invites, setInvites] = useState<any[]>([]);
  const [contractors, setContractors] = useState<any[]>([]);
  const [selectedContractor, setSelectedContractor] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    if (!id) return;
    getJob(id).then(setJob).catch((e) => setError(e.message));
    getInvites(id).then(setInvites).catch(() => {});
    getContractors().then(setContractors).catch(() => {});
  };

  useEffect(load, [id]);

  const handleInvite = async () => {
    if (!id || !selectedContractor) return;
    setError('');
    try {
      await createInvite(id, selectedContractor);
      setSelectedContractor('');
      load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleInviteStatus = async (inviteId: string, status: string) => {
    try {
      await updateInviteStatus(inviteId, status);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      await updateJobStatus(id, newStatus);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const nextStatus: Record<string, string> = {
    DRAFT: 'ACTIVE',
    ACTIVE: 'CLOSED',
  };

  if (!job) return <div className="loading">Loading...</div>;

  const invitedIds = new Set(invites.map((i) => i.contractorId));
  const availableContractors = contractors.filter((c) => !invitedIds.has(c.id));

  return (
    <div>
      <button className="secondary small" onClick={() => navigate('/jobs')} style={{ marginBottom: '1rem' }}>
        &larr; Back to Jobs
      </button>

      <div className="detail-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <h1>{job.title}</h1>
          <span className={`badge ${job.status.toLowerCase()}`}>{job.status}</span>
        </div>
        <div className="meta">
          <span>Region: {job.region}</span>
          <span>Price: {job.price.toLocaleString()} rub</span>
          <span>Created: {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
        {job.description && <p style={{ marginTop: '0.5rem' }}>{job.description}</p>}
        {nextStatus[job.status] && (
          <div style={{ marginTop: '0.8rem' }}>
            <button className="small" onClick={() => handleStatusChange(nextStatus[job.status])}>
              {nextStatus[job.status] === 'ACTIVE' ? 'Activate Job' : 'Close Job'}
            </button>
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      <div className="form-section">
        <h2>Send Invite</h2>
        {availableContractors.length > 0 ? (
          <div className="invite-form">
            <select value={selectedContractor} onChange={(e) => setSelectedContractor(e.target.value)}>
              <option value="">Select contractor...</option>
              {availableContractors.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.region}, {c.type})</option>
              ))}
            </select>
            <button onClick={handleInvite} disabled={!selectedContractor}>Invite</button>
          </div>
        ) : (
          <p style={{ color: '#999' }}>All contractors already invited</p>
        )}
      </div>

      <h2 style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>
        Invites ({invites.length})
      </h2>

      {invites.map((inv) => (
        <div key={inv.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{inv.contractor?.name || inv.contractorId}</h3>
              <p>{inv.contractor?.phone} &middot; {inv.contractor?.region}</p>
            </div>
            <span className={`badge ${inv.status.toLowerCase()}`}>{inv.status}</span>
          </div>
          {inv.status === 'PENDING' && (
            <div className="actions">
              <button className="small success" onClick={() => handleInviteStatus(inv.id, 'ACCEPTED')}>Accept</button>
              <button className="small danger" onClick={() => handleInviteStatus(inv.id, 'DECLINED')}>Decline</button>
            </div>
          )}
        </div>
      ))}

      {!invites.length && <p style={{ color: '#999' }}>No invites yet</p>}
    </div>
  );
}

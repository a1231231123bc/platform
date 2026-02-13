import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs, createJob, updateJobStatus } from '../api';

export function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const navigate = useNavigate();

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [price, setPrice] = useState('');

  const load = () => {
    const params: Record<string, string> = {};
    if (filterStatus) params.status = filterStatus;
    if (filterRegion) params.region = filterRegion;
    getJobs(Object.keys(params).length ? params : undefined)
      .then(setJobs)
      .catch((e) => setError(e.message));
  };

  useEffect(load, [filterStatus, filterRegion]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createJob({ title, description: description || undefined, region, price: Number(price) });
      setTitle(''); setDescription(''); setRegion(''); setPrice('');
      load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
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

  return (
    <div>
      <div className="page-header">
        <h1>Jobs</h1>
      </div>

      <div className="form-section">
        <h2>New Job</h2>
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} required />
            <input placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="form-row">
            <input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} style={{ flex: 2 }} />
            <button type="submit">Create</button>
          </div>
        </form>
      </div>

      <div className="filter-bar">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="CLOSED">Closed</option>
        </select>
        <input placeholder="Filter by region..." value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} />
      </div>

      {error && <div className="error">{error}</div>}

      {jobs.map((j) => (
        <div key={j.id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs/${j.id}`)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>{j.title}</h3>
            <span className={`badge ${j.status.toLowerCase()}`}>{j.status}</span>
          </div>
          <p>{j.region} &middot; {j.price.toLocaleString()} rub</p>
          {j.description && <p>{j.description}</p>}
          <div className="actions" onClick={(e) => e.stopPropagation()}>
            {nextStatus[j.status] && (
              <button className="small secondary" onClick={() => handleStatusChange(j.id, nextStatus[j.status])}>
                {nextStatus[j.status] === 'ACTIVE' ? 'Activate' : 'Close'}
              </button>
            )}
          </div>
        </div>
      ))}

      {!jobs.length && <p style={{ color: '#999' }}>No jobs found</p>}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { getContractors, createContractor } from '../api';

export function ContractorsPage() {
  const [contractors, setContractors] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterType, setFilterType] = useState('');

  // Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('INDIVIDUAL');
  const [region, setRegion] = useState('');

  const load = () => {
    const params: Record<string, string> = {};
    if (filterRegion) params.region = filterRegion;
    if (filterType) params.type = filterType;
    getContractors(Object.keys(params).length ? params : undefined)
      .then(setContractors)
      .catch((e) => setError(e.message));
  };

  useEffect(load, [filterRegion, filterType]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createContractor({ name, phone, type, region });
      setName(''); setPhone(''); setRegion('');
      load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Contractors</h1>
      </div>

      <div className="form-section">
        <h2>New Contractor</h2>
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="form-row">
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="INDIVIDUAL">Individual</option>
              <option value="IP">IP</option>
              <option value="COMPANY">Company</option>
            </select>
            <input placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} required />
            <button type="submit">Create</button>
          </div>
        </form>
      </div>

      <div className="filter-bar">
        <input placeholder="Filter by region..." value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All types</option>
          <option value="INDIVIDUAL">Individual</option>
          <option value="IP">IP</option>
          <option value="COMPANY">Company</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      {contractors.map((c) => (
        <div key={c.id} className="card">
          <h3>{c.name}</h3>
          <p>{c.phone} &middot; {c.region}</p>
          <span className={`badge ${c.type.toLowerCase()}`}>{c.type}</span>
        </div>
      ))}

      {!contractors.length && <p style={{ color: '#999' }}>No contractors found</p>}
    </div>
  );
}

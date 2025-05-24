import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './LeadForm.css';

function LeadForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lead, setLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    product_interest: '',
    status: 'New',
    follow_up_date: null,
    notes: ''
  });

  useEffect(() => {
    if (id) {
      fetchLead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchLead = async () => {
    try {
      const res = await axios.get(`/api/leads/${id}`);
      const data = res.data;
      setLead({ ...data, follow_up_date: data.follow_up_date ? new Date(data.follow_up_date) : null });
    } catch {
      toast.error('Error fetching lead');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...lead };
      if (lead.follow_up_date) {
        payload.follow_up_date = lead.follow_up_date.toISOString();
      }
      if (id) {
        await axios.put(`/api/leads/${id}`, payload);
        toast.success('Lead updated successfully');
      } else {
        await axios.post('/api/leads/', payload);
        toast.success('Lead created successfully');
      }
      navigate('/leads');
    } catch {
      toast.error('Error saving lead');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLead(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="lead-form">
      <h2>{id ? 'Edit Lead' : 'New Lead'}</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              value={lead.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={lead.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              value={lead.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company</label>
            <input
              type="text"
              name="company"
              value={lead.company}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product Interest</label>
            <input
              type="text"
              name="product_interest"
              value={lead.product_interest}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={lead.status}
              onChange={handleChange}
              className="form-input"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Follow-up Date</label>
            <DatePicker
              selected={lead.follow_up_date}
              onChange={date => setLead(prev => ({ ...prev, follow_up_date: date }))}
              className="form-input"
              dateFormat="MM/dd/yyyy"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              value={lead.notes}
              onChange={handleChange}
              className="form-input"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {id ? 'Update Lead' : 'Create Lead'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/leads')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeadForm;
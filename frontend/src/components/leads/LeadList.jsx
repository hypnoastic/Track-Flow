import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './LeadList.css';

function LeadList() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get('/api/leads/');
      setLeads(res.data);
    } catch {
      toast.error('Error fetching leads');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`/api/leads/${id}`);
        setLeads(leads.filter(lead => lead.id !== id));
        toast.success('Lead deleted successfully');
      } catch {
        toast.error('Error deleting lead');
      }
    }
  };

  return (
    <div className="leads-list">
      <div className="header">
        <h2>Leads</h2>
        <Link to="/leads/new" className="btn btn-primary">
          <FaPlus /> New Lead
        </Link>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Product Interest</th>
              <th>Status</th>
              <th>Follow-up Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>{lead.company}</td>
                <td>{lead.product_interest}</td>
                <td>
                  <span className={`status-badge status-${lead.status.toLowerCase()}`}>
                    {lead.status}
                  </span>
                </td>
                <td>{lead.follow_up_date ? new Date(lead.follow_up_date).toLocaleDateString() : '-'}</td>
                <td>
                  <Link to={`/leads/edit/${lead.id}`} className="btn btn-small">
                    <FaEdit />
                  </Link>
                  <button onClick={() => handleDelete(lead.id)} className="btn btn-small btn-danger">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeadList;
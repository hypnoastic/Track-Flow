import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './OrderForm.css';

function OrderForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState({
    lead_id: '',
    status: 'Order Received',
    product_details: '',
    amount: '',
    courier: '',
    tracking_number: '',
    estimated_delivery: null,
    notes: ''
  });
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
    if (id) {
      fetchOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchLeads = async () => {
    try {
      const res = await axios.get('/api/leads/');
      setLeads(res.data);
    } catch {
      toast.error('Error fetching leads');
    }
  };

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/api/orders/${id}`);
      const data = res.data;
      setOrder({ ...data, estimated_delivery: data.estimated_delivery ? new Date(data.estimated_delivery) : null });
    } catch {
      toast.error('Error fetching order');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...order };
      if (order.estimated_delivery) {
        payload.estimated_delivery = order.estimated_delivery.toISOString();
      }
      if (id) {
        await axios.put(`/api/orders/${id}`, payload);
        toast.success('Order updated successfully');
      } else {
        await axios.post('/api/orders/', payload);
        toast.success('Order created successfully');
      }
      navigate('/orders');
    } catch {
      toast.error('Error saving order');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    }));
  };

  return (
    <div className="order-form">
      <h2>{id ? 'Edit Order' : 'New Order'}</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Lead</label>
            <select
              name="lead_id"
              value={order.lead_id}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select a lead</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} - {lead.company}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Product Details</label>
            <textarea
              name="product_details"
              value={order.product_details}
              onChange={handleChange}
              className="form-input"
              required
              rows="3"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              type="number"
              name="amount"
              value={order.amount}
              onChange={handleChange}
              className="form-input"
              required
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={order.status}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Order Received">Order Received</option>
              <option value="In Development">In Development</option>
              <option value="Ready to Dispatch">Ready to Dispatch</option>
              <option value="Dispatched">Dispatched</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Courier</label>
            <input
              type="text"
              name="courier"
              value={order.courier}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tracking Number</label>
            <input
              type="text"
              name="tracking_number"
              value={order.tracking_number}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estimated Delivery</label>
            <DatePicker
              selected={order.estimated_delivery}
              onChange={date => setOrder(prev => ({ ...prev, estimated_delivery: date }))}
              className="form-input"
              dateFormat="MM/dd/yyyy"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              value={order.notes}
              onChange={handleChange}
              className="form-input"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {id ? 'Update Order' : 'Create Order'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/orders')}
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

export default OrderForm;
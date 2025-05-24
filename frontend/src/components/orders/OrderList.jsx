import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './OrderList.css';

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/');
      setOrders(res.data);
    } catch {
      toast.error('Error fetching orders');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`/api/orders/${id}`);
        setOrders(orders.filter(order => order.id !== id));
        toast.success('Order deleted successfully');
      } catch {
        toast.error('Error deleting order');
      }
    }
  };

  return (
    <div className="orders-list">
      <div className="header">
        <h2>Orders</h2>
        <Link to="/orders/new" className="btn btn-primary">
          <FaPlus /> New Order
        </Link>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Lead</th>
              <th>Product Details</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Tracking</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id.slice(0, 8)}</td>
                <td>{order.lead_id}</td>
                <td>{order.product_details}</td>
                <td>${order.amount.toFixed(2)}</td>
                <td>
                  <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.tracking_number || '-'}</td>
                <td>
                  <Link to={`/orders/edit/${order.id}`} className="btn btn-small">
                    <FaEdit />
                  </Link>
                  <button onClick={() => handleDelete(order.id)} className="btn btn-small btn-danger">
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

export default OrderList;
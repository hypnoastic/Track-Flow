import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Set axios base URL to backend server
axios.defaults.baseURL = 'http://127.0.0.1:8000';

function Dashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    wonLeads: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [leadsRes, ordersRes] = await Promise.all([
          axios.get('/api/leads/'),
          axios.get('/api/orders/')
        ]);
        const leads = leadsRes.data;
        const orders = ordersRes.data;
        setStats({
          totalLeads: leads.length,
          activeLeads: leads.filter(lead => !['Won', 'Lost'].includes(lead.status)).length,
          wonLeads: leads.filter(lead => lead.status === 'Won').length,
          totalOrders: orders.length,
          pendingOrders: orders.filter(order => order.status !== 'Dispatched').length,
          completedOrders: orders.filter(order => order.status === 'Dispatched').length
        });
      } catch {
        // Optionally handle error
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="dashboard-section">
        <h3 className="dashboard-section-title">Leads</h3>
        <div className="dashboard-stats-row">
          <div className="stat-card">
            <h4>Total Leads</h4>
            <div className="value">{stats.totalLeads}</div>
          </div>
          <div className="stat-card">
            <h4>Active Leads</h4>
            <div className="value">{stats.activeLeads}</div>
          </div>
          <div className="stat-card">
            <h4>Won Leads</h4>
            <div className="value">{stats.wonLeads}</div>
          </div>
        </div>
      </div>
      <div className="dashboard-section">
        <h3 className="dashboard-section-title">Orders</h3>
        <div className="dashboard-stats-row">
          <div className="stat-card">
            <h4>Total Orders</h4>
            <div className="value">{stats.totalOrders}</div>
          </div>
          <div className="stat-card">
            <h4>Pending Orders</h4>
            <div className="value">{stats.pendingOrders}</div>
          </div>
          <div className="stat-card">
            <h4>Completed Orders</h4>
            <div className="value">{stats.completedOrders}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';

function AllocatorForm({ supabase, onSuccess }) {
  const [formData, setFormData] = useState({
    customer_id: '',
    pickup_customer_name: '',
    pickup_suburb: '',
    pickup_address: '',
    dropoff_customer_name: '',
    dropoff_suburb: '',
    dropoff_address: '',
    driver_id: '',
    driver_type: 'company',
    vehicle_id: '',
    pay_rate: '',
  });

  const [customers, setCustomers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [custRes, drvRes] = await Promise.all([
        supabase.from('customers').select('*'),
        supabase.from('drivers').select('*'),
      ]);

      setCustomers(custRes.data || []);
      setDrivers(drvRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('jobs').insert([formData]);
      if (error) throw error;

      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          customer_id: '',
          pickup_customer_name: '',
          pickup_suburb: '',
          pickup_address: '',
          dropoff_customer_name: '',
          dropoff_suburb: '',
          dropoff_address: '',
          driver_id: '',
          driver_type: 'company',
          vehicle_id: '',
          pay_rate: '',
        });
        setSubmitted(false);
        onSuccess();
      }, 2000);
    } catch (err) {
      console.error('Error:', err);
      alert('Error creating allocation');
      setLoading(false);
    }
  };

  const inputClasses = 'w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:shadow-neon transition-all';
  const labelClasses = 'block text-sm font-bold text-neon-cyan mb-2';
  const selectClasses = 'w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-all';

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Customer Select */}
      <div>
        <label className={labelClasses}>Customer</label>
        <select
          name="customer_id"
          value={formData.customer_id}
          onChange={handleChange}
          required
          className={selectClasses}
        >
          <option value="">Select customer...</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Pickup Details */}
      <motion.div className="space-y-3 pt-4 border-t border-dark-border" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <h3 className="text-sm font-bold text-neon-cyan">📍 Pickup Location</h3>
        <input type="text" name="pickup_customer_name" placeholder="Customer name" value={formData.pickup_customer_name} onChange={handleChange} required className={inputClasses} />
        <input type="text" name="pickup_suburb" placeholder="Suburb" value={formData.pickup_suburb} onChange={handleChange} required className={inputClasses} />
        <input type="text" name="pickup_address" placeholder="Address" value={formData.pickup_address} onChange={handleChange} required className={inputClasses} />
      </motion.div>

      {/* Dropoff Details */}
      <motion.div className="space-y-3 pt-4 border-t border-dark-border" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <h3 className="text-sm font-bold text-neon-pink">🎯 Dropoff Location</h3>
        <input type="text" name="dropoff_customer_name" placeholder="Customer name" value={formData.dropoff_customer_name} onChange={handleChange} required className={inputClasses} />
        <input type="text" name="dropoff_suburb" placeholder="Suburb" value={formData.dropoff_suburb} onChange={handleChange} required className={inputClasses} />
        <input type="text" name="dropoff_address" placeholder="Address" value={formData.dropoff_address} onChange={handleChange} required className={inputClasses} />
      </motion.div>

      {/* Driver & Vehicle */}
      <motion.div className="space-y-3 pt-4 border-t border-dark-border" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h3 className="text-sm font-bold text-neon-lime">👤 Assignment</h3>
        <select name="driver_type" value={formData.driver_type} onChange={handleChange} className={selectClasses}>
          <option value="company">Company Driver</option>
          <option value="subcontractor">Subcontractor</option>
        </select>
        <select name="driver_id" value={formData.driver_id} onChange={handleChange} required className={selectClasses}>
          <option value="">Select driver...</option>
          {drivers.filter(d => d.driver_type === formData.driver_type).map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <input type="number" name="pay_rate" placeholder="Pay rate" value={formData.pay_rate} onChange={handleChange} step="0.01" className={inputClasses} />
      </motion.div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading || submitted}
        whileHover={{ scale: submitted ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 mt-6 transition-all ${
          submitted
            ? 'bg-neon-lime/20 text-neon-lime border border-neon-lime/50'
            : 'bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-lime text-dark-bg hover:shadow-neon border border-transparent'
        }`}
      >
        {submitted ? (
          <>
            <CheckCircle size={20} /> Allocation Created
          </>
        ) : loading ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-5 h-5 border-2 border-dark-bg border-t-transparent rounded-full" />
            Creating...
          </>
        ) : (
          <>
            <Send size={20} /> Create Allocation
          </>
        )}
      </motion.button>
    </motion.form>
  );
}

export default AllocatorForm;
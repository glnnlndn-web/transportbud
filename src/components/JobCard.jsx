import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, MapPin, User, DollarSign } from 'lucide-react';

function JobCard({ job, onDelete, supabase, itemVariants }) {
  const handleDelete = async () => {
    if (confirm('Delete this allocation?')) {
      try {
        await supabase.from('jobs').delete().eq('id', job.id);
        onDelete();
      } catch (err) {
        console.error('Error deleting job:', err);
      }
    }
  };

  const statusColors = {
    pending: 'text-neon-pink',
    completed: 'text-neon-lime',
    in_progress: 'text-neon-cyan',
  };

  return (
    <motion.div
      variants={itemVariants}
      layout
      className="bg-dark-card border border-dark-border rounded-xl p-6 backdrop-blur-sm hover:border-neon-cyan/50 transition-all neon-glow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-neon-lime mb-1">Job {job.id.slice(0, 8).toUpperCase()}</h3>
          <p className={`text-sm font-semibold uppercase ${statusColors[job.status] || 'text-gray-400'}`}>{job.status}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.15, rotate: -10 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleDelete}
          className="p-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all hover:shadow-lg"
        >
          <Trash2 size={20} />
        </motion.button>
      </div>

      <div className="space-y-3 text-sm">
        {/* Locations */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div whileHover={{ x: 4 }} className="group">
            <p className="text-gray-500 mb-1 flex items-center gap-1">
              <MapPin size={14} /> Pickup
            </p>
            <p className="text-neon-cyan font-semibold group-hover:text-neon-cyan/80 transition-colors">{job.pickup_suburb}</p>
            <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors">{job.pickup_address}</p>
          </motion.div>
          <motion.div whileHover={{ x: -4 }} className="group">
            <p className="text-gray-500 mb-1 flex items-center gap-1">
              <MapPin size={14} /> Dropoff
            </p>
            <p className="text-neon-pink font-semibold group-hover:text-neon-pink/80 transition-colors">{job.dropoff_suburb}</p>
            <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors">{job.dropoff_address}</p>
          </motion.div>
        </div>

        {/* Details Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 pt-3 border-t border-dark-border"
        >
          <div className="group">
            <p className="text-gray-500 mb-1 flex items-center gap-1">
              <User size={14} />
            </p>
            <p className="text-neon-lime text-xs font-semibold uppercase group-hover:text-neon-lime/80 transition-colors">{job.driver_type}</p>
          </div>
          <div className="group">
            <p className="text-gray-500 mb-1 flex items-center gap-1">
              <DollarSign size={14} />
            </p>
            <p className="text-neon-cyan font-semibold group-hover:text-neon-cyan/80 transition-colors">${job.pay_rate || 'TBD'}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1 text-xs">Time</p>
            <p className="text-gray-400 text-xs">{new Date(job.created_at).toLocaleDateString()}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default JobCard;
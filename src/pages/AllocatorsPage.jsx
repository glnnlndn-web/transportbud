import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Zap, TrendingUp } from 'lucide-react';
import AllocatorForm from '../components/AllocatorForm';
import JobCard from '../components/JobCard';

function AllocatorsPage({ supabase }) {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setJobs(data || []);
      
      setStats({
        total: data?.length || 0,
        pending: data?.filter(j => j.status === 'pending').length || 0,
        completed: data?.filter(j => j.status === 'completed').length || 0,
      });
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      {/* Header with Gradient */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="text-neon-cyan"
          >
            <Zap size={32} />
          </motion.div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-lime bg-clip-text text-transparent">
            Transport Allocators
          </h1>
        </div>
        <p className="text-gray-400 text-lg ml-11">Real-time job management with precision</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        {[
          { label: 'Total Jobs', value: stats.total, icon: '📊', color: 'cyan' },
          { label: 'Pending', value: stats.pending, icon: '⏳', color: 'pink' },
          { label: 'Completed', value: stats.completed, icon: '✓', color: 'lime' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className={`bg-dark-card border border-dark-border rounded-xl p-6 backdrop-blur-sm neon-${stat.color}-glow`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-gray-400 text-sm font-medium mb-2`}>{stat.label}</p>
                <p className={`text-4xl font-black text-neon-${stat.color}`}>{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <motion.div 
            className="bg-dark-card border border-dark-border rounded-2xl p-6 backdrop-blur-sm sticky top-8 neon-glow"
            whileHover={{ borderColor: '#00d9ff' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neon-cyan">New Allocation</h2>
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowForm(!showForm)}
                className="p-3 rounded-lg bg-gradient-to-br from-neon-cyan/30 to-neon-pink/20 hover:from-neon-cyan/50 hover:to-neon-pink/40 text-neon-cyan transition-all neon-glow"
              >
                <Plus size={24} />
              </motion.button>
            </div>
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AllocatorForm 
                    supabase={supabase} 
                    onSuccess={() => { 
                      setShowForm(false); 
                      fetchJobs(); 
                    }} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Jobs List */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div>
            <h2 className="text-2xl font-bold text-neon-pink mb-6 flex items-center gap-2">
              <TrendingUp size={28} />
              Active Allocations
            </h2>
            
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="inline-block w-12 h-12 border-3 border-neon-cyan border-t-transparent rounded-full"
                />
                <p className="text-gray-400 mt-4">Loading allocations...</p>
              </motion.div>
            ) : jobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-dark-card border-2 border-dashed border-dark-border rounded-xl p-12 text-center backdrop-blur-sm"
              >
                <p className="text-gray-400 text-lg mb-2">No allocations yet</p>
                <p className="text-gray-500 text-sm">Click the + button to create your first job allocation</p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <AnimatePresence mode="popLayout">
                  {jobs.map((job) => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      onDelete={() => fetchJobs()}
                      supabase={supabase}
                      itemVariants={itemVariants}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AllocatorsPage;
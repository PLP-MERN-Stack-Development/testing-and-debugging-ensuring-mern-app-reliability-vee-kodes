import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BugForm from '../components/BugForm';

const EditBug = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBug = async () => {
      try {
        const res = await fetch(`/api/bugs/${id}`);
        if (!res.ok) throw new Error('Failed to fetch bug');
        const bugData = await res.json();
        setBug(bugData);
      } catch (error) {
        console.error(error);
        alert('Failed to load bug data');
      } finally {
        setLoading(false);
      }
    };

    fetchBug();
  }, [id]);

  const handleSubmit = async (err, payload) => {
    if (err) return alert(err.error || 'Validation error');

    try {
      const res = await fetch(`/api/bugs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update bug');
      alert('Bug updated successfully!');
      navigate('/bug-list');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6"><div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-8">Loading...</div></div>;
  if (!bug) return <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6"><div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-8">Bug not found</div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-2 sm:mb-0">
            Edit Bug #{id}
          </h2>
          <Link
            to="/bug-list"
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-base"
          >
            ← Back to Bugs
          </Link>
        </div>
        <BugForm onSubmit={handleSubmit} initialData={bug} />
      </div>
    </div>
  );
};

export default EditBug;

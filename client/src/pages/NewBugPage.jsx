import React from 'react';
import BugForm from '../components/BugForm';

const NewBugPage = () => {
  const submitToApi = async (err, payload) => {
    if (err) return alert(err.error || 'Validation error');

    try {
      const res = await fetch('/api/bugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create bug');
      alert('Bug reported successfully!');

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Report a New Bug</h2>
      <BugForm onSubmit={submitToApi} />
    </div>
  );
};

export default NewBugPage;

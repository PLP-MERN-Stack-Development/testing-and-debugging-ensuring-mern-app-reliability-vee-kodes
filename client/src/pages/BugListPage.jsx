import React, { useEffect, useState } from 'react';
import BugList from '../components/BugList';

const BugListPage = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const res = await fetch('/api/bugs');
        const data = await res.json();
        setBugs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBugs();
  }, []);

  if (loading) return <p>Loading bugs...</p>;
  if (!bugs.length) return <p>No bugs reported yet.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">All Reported Bugs</h2>
      <BugList bugs={bugs} />
    </div>
  );
};

export default BugListPage;

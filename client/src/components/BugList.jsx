import React from 'react';
import Button from './Button';
import {Link} from 'react-router-dom';

const BugList = ({ bugs = [] }) => {
  if (!bugs.length) {
    return <p className="text-gray-500">No bugs reported yet.</p>;
  }

  return (
    <div className="space-y-4">
      {bugs.map((bug) => (
        <div
          key={bug._id}
          className="bg-white shadow-md rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
        >
          <div className="flex-1">
            <h3 className="text-lg font-bold">{bug.title}</h3>
            <p className="text-gray-700">{bug.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              Status: <span className="font-medium">{bug.status}</span> | Priority: <span className="font-medium">{bug.priority}</span> | Category: <span className="font-medium">{bug.category}</span>
            </p>
          </div>
          <div className="mt-2 md:mt-0 flex space-x-2">
            <Link to={`/edit/${bug._id}`}>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </Link>
            <Button variant="danger" size="sm">
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BugList;

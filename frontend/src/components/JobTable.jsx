import React, { useState } from "react";

const JobTable = ({ jobs, onUpdateJob, onDeleteJob }) => {
  const [editId, setEditId] = useState(null);
  const [editJob, setEditJob] = useState({ role: "", company: "", description: "", status: "" });

  const startEdit = (job) => {
    setEditId(job.id);
    setEditJob({ ...job });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditJob({ role: "", company: "", description: "", status: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditJob((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Company</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-50">
              {editId === job.id ? (
                <>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      name="company"
                      value={editJob.company}
                      onChange={handleChange}
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      name="role"
                      value={editJob.role}
                      onChange={handleChange}
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <select name="status" value={editJob.status} onChange={handleChange}>
                      <option>Open</option>
                      <option>Closed</option>
                      <option>Pending</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      name="description"
                      value={editJob.description}
                      onChange={handleChange}
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button onClick={() => { onUpdateJob(editJob); cancelEdit(); }}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border border-gray-300 px-4 py-2">{job.company}</td>
                  <td className="border border-gray-300 px-4 py-2">{job.role}</td>
                  <td className="border border-gray-300 px-4 py-2">{job.status}</td>
                  <td className="border border-gray-300 px-4 py-2">{job.description}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button onClick={() => startEdit(job)}>Edit</button>
                    <button onClick={() => onDeleteJob(job.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;

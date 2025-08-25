import React, { useState } from "react";

const JobTable = ({ jobs, onUpdateJob, onDeleteJob }) => {
  const [editId, setEditId] = useState(null);
  const [editJob, setEditJob] = useState({
    id: null,
    role: "",
    company: "",
    description: "",
    status: "Open",
    location: "",
    job_type: "",
    salary: "",
    tags: ""
  });

  // ------------------------
  // Helpers
  // ------------------------
  const startEdit = (job) => {
    setEditId(job.id);
    setEditJob({
      id: job.id,
      role: job.role || "",
      company: job.company || "",
      description: job.description || "",
      status: job.status || "Open",
      location: job.location || "",
      job_type: job.job_type || "",
      salary: job.salary || "",
      tags: job.tags || ""
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditJob({
      id: null,
      role: "",
      company: "",
      description: "",
      status: "Open",
      location: "",
      job_type: "",
      salary: "",
      tags: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditJob((prev) => ({ ...prev, [name]: value }));
  };

  // ------------------------
  // Render
  // ------------------------
  return (
    <div className="overflow-x-auto p-4">
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Company</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Job Type</th>
            <th className="border px-4 py-2">Salary</th>
            <th className="border px-4 py-2">Tags</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-50">
              {/* ---------------- Edit Mode ---------------- */}
              {editId === job.id ? (
                <>
                  <td className="border px-4 py-2">
                    <input
                      name="company"
                      value={editJob.company}
                      onChange={handleChange}
                    />
                  </td>

                  <td className="border px-4 py-2">
                    <input
                      name="role"
                      value={editJob.role}
                      onChange={handleChange}
                    />
                  </td>

                  <td className="border px-4 py-2">
                    <select
                      name="status"
                      value={editJob.status}
                      onChange={handleChange}
                    >
                      <option>Open</option>
                      <option>Closed</option>
                      <option>Pending</option>
                    </select>
                  </td>

                  <td className="border px-4 py-2">
                    <input
                      name="description"
                      value={editJob.description}
                      onChange={handleChange}
                    />
                  </td>

                  <td className="border px-4 py-2">
                    <input
                      name="location"
                      value={editJob.location}
                      onChange={handleChange}
                    />
                  </td>

                  <td className="border px-4 py-2">
                    <input
                      name="job_type"
                      value={editJob.job_type}
                      onChange={handleChange}
                    />
                  </td>

                  <td className="border px-4 py-2">
                    <input
                      name="salary"
                      value={editJob.salary}
                      onChange={handleChange}
                    />
                  </td>

                  <td className="border px-4 py-2">
                    <input
                      name="tags"
                      value={editJob.tags}
                      onChange={handleChange}
                    />
                  </td>

                  <td className="border px-4 py-2 space-x-1">
                    <button
                      onClick={() => {
                        const tagsArray = editJob.tags
                          ? editJob.tags.split(",").map((tag) => tag.trim())
                          : null;

                        onUpdateJob({ ...editJob, tags: tagsArray });
                        cancelEdit();
                      }}
                    >
                      Save
                    </button>

                    <button onClick={cancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                /* ---------------- View Mode ---------------- */
                <>
                  <td className="border px-4 py-2">{job.company || ""}</td>
                  <td className="border px-4 py-2">{job.role || ""}</td>
                  <td className="border px-4 py-2">{job.status || ""}</td>
                  <td className="border px-4 py-2">{job.description || ""}</td>
                  <td className="border px-4 py-2">{job.location || ""}</td>
                  <td className="border px-4 py-2">{job.job_type || ""}</td>
                  <td className="border px-4 py-2">{job.salary || ""}</td>
                  <td className="border px-4 py-2">{job.tags || ""}</td>

                  <td className="border px-4 py-2 space-x-1">
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

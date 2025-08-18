import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobTable from "./components/JobTable";

export default function JobsPage({ setToken }) {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:4000/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: title, company, description, status: "Open" }),
      });
      if (!res.ok) throw new Error("Failed to post job");
      const newJob = await res.json();
      setJobs([...jobs, newJob]);
      setTitle("");
      setCompany("");
      setDescription("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateJob = async (updatedJob) => {
    try {
      const res = await fetch(`http://localhost:4000/jobs/${updatedJob.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedJob),
      });
      if (!res.ok) throw new Error("Failed to update job");
      const data = await res.json();
      setJobs(jobs.map((job) => (job.id === data.id ? data : job)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete job");
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Job Board</h2>
      <button onClick={handleLogout}>Logout</button>
      <form onSubmit={handlePostJob}>
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <textarea
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Post Job</button>
      </form>
      <JobTable
        jobs={jobs}
        onUpdateJob={handleUpdateJob}
        onDeleteJob={handleDeleteJob}
      />
    </div>
  );
}

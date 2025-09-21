import { useEffect, useState } from "react";
import useAuth from "./hooks/useAuth";
import JobTable from "./components/JobTable";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);

  // Job posting form state
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");
  const [tags, setTags] = useState("");

  // useAuth returns [token, saveToken, handleLogout]
  const [token, , handleLogout] = useAuth();
  

  // Fetch jobs
  useEffect(() => {
    if (!token) return;

    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:4000/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          handleLogout(); // invalid/expired token → logout
          return;
        }

        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, [token, handleLogout]);

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: title,
          company,
          description,
          status: "Open",
          location,
          job_type: jobType,
          salary,
          tags,
        }),
      });

      if (!res.ok) throw new Error("Failed to post job");
      const newJob = await res.json();
      setJobs((prev) => [...prev, newJob]);

      // Clear form
      setTitle("");
      setCompany("");
      setDescription("");
      setLocation("");
      setJobType("");
      setSalary("");
      setTags("");
    } catch (err) {
      console.error("Error posting job:", err);
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
      setJobs((prev) => prev.map((job) => (job.id === data.id ? data : job)));
    } catch (err) {
      console.error("Error updating job:", err);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete job");
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  return (
    <div>
      <h2>Job Board</h2>
      <button onClick={handleLogout}>Logout</button>

      {/* Job Posting Form */}
      <form onSubmit={handlePostJob} className="space-y-2">
        <input type="text" placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} required />
        <textarea placeholder="Description..." value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input type="text" placeholder="Job Type" value={jobType} onChange={(e) => setJobType(e.target.value)} />
        <input type="text" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
        <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <button type="submit">Post Job</button>
      </form>

      {/* Job Table */}
      <JobTable jobs={jobs} onUpdateJob={handleUpdateJob} onDeleteJob={handleDeleteJob} />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobTable from "./components/JobTable";

export default function JobsPage({ setToken }) {
  const [jobs, setJobs] = useState([]);

  // Fields for posting a job
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");
  const [tags, setTags] = useState("");

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
        body: JSON.stringify({
          role: title || "",
          company: company || "",
          description: description || "",
          status: "Open",
          location: location || "",
          job_type: jobType || "",
          salary: salary || "",
          tags: tags || ""
        }),
      });
      if (!res.ok) throw new Error("Failed to post job");
      const newJob = await res.json();
      setJobs([...jobs, newJob]);

      // Clear form
      setTitle("");
      setCompany("");
      setDescription("");
      setLocation("");
      setJobType("");
      setSalary("");
      setTags("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateJob = async (updatedJob) => {
    try {
      // Only send fields that are defined
      const body = {
        role: updatedJob.role || "",
        company: updatedJob.company || "",
        description: updatedJob.description || "",
        status: updatedJob.status || "Open",
        location: updatedJob.location || "",
        job_type: updatedJob.job_type || "",
        salary: updatedJob.salary || "",
        tags: updatedJob.tags || ""
      };

      const res = await fetch(`http://localhost:4000/jobs/${updatedJob.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
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

      {/* Job Posting Form */}
      <form onSubmit={handlePostJob} className="space-y-2">
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
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Job Type"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button type="submit">Post Job</button>
      </form>

      {/* Job Table */}
      <JobTable
        jobs={jobs || []} // ensure jobs is always an array
        onUpdateJob={handleUpdateJob}
        onDeleteJob={handleDeleteJob}
      />
    </div>
  );
}

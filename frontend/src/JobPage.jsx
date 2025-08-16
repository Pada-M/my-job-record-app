import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobsPage({ setToken }) {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:4000/jobs", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(""); // update App state
    navigate("/login");
  };

  return (
    <div>
      <h2>Job Board</h2>
      <button onClick={handleLogout}>Logout</button>
      {jobs.length === 0 ? (
        <p>No jobs available</p>
      ) : (
        jobs.map((job) => (
          <div key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
          </div>
        ))
      )}
    </div>
  );
}

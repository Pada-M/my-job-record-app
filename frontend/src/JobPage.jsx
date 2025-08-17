import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobsPage({ setToken }) {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
 /* 
 since the useEffect does not have dependcies it is rendered once

 */
  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:4000/jobs", {
          headers: {
            "Content-Type": "application/json", //telling the API call that the content type is going to be JSON
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

  const handlePostJob = async (e) => {
  e.preventDefault(); // prevent page refresh

  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:4000/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, company, description }),
    });

    if (!res.ok) throw new Error("Failed to post job");

    const newJob = await res.json();

    setJobs([...jobs, newJob]); // update state to show new job
    setTitle(""); // clear form
    setCompany("");
    setDescription("");

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

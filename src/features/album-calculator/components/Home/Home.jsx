import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [isAuth, setIsAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('albumCalculatorAuthed');
    setIsAuth(auth === 'true');
  }, []);
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch(`/json/projects.json`);
        if (!res.ok) {
          throw new Error("Kunde inte hämta projektlistan");
        }
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (err) {
        setError(err.message || "Något gick fel");
      }
    }
    loadProjects();
  }, []);

  function showCalculator(project) {
    navigate(`/album-calculator/calculator/${encodeURIComponent(project.albumName)}`);
  }

  if (!isAuth) {
    return <div>Du är inte inloggad.</div>;
  }
  return (
    <div>
      <h1>Välj ett projekt:</h1>
      {error && <div>{error}</div>}
      <ul className="project-list">
        {projects.map((project, index) => (
          <li
            key={`${project.artist}-${project.albumName}-${index}`}
            onClick={() => showCalculator(project)}
          >
            <div
              className="album-art"
              style={
                project.albumArtUrl
                  ? { backgroundImage: `url(${project.albumArtUrl})` }
                  : { backgroundColor: "none" }
              }
            >
              {!project.albumArtUrl && project.albumName}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;

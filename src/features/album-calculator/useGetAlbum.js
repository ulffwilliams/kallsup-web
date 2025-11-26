import { useEffect, useState } from "react";

export default function useGetAlbum(albumName) {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAlbum() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/json/projects.json`);
        if (!res.ok) {
          throw new Error("Kunde inte hämta album-data");
        }
        const data = await res.json();
        const foundAlbum = data.projects.find((project) => project.albumName === albumName);
        if (foundAlbum) {
          setAlbum(foundAlbum);
        } else {
          setError("Album hittades inte");
        }
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchAlbum();
  }, [albumName]);

  return { album, loading, error };
}

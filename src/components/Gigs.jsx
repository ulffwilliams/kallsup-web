import React, { useState, useEffect } from 'react'

function Gigs() {
    const [shows, setShows] = useState([]);

    useEffect(() => {

        async function fetchShows() {
            const url = "./json/shows.json";
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Något gick fel med att hämta spelningar");
                }

                const json = await response.json();
                const today = new Date();

                // Filtrera ut gamla spelningar och sortera efter datum.
                const filteredShows = json.shows
                    .filter((show) => {
                        const showDate = new Date(show.date); // Directly parse ISO 8601 date
                        return showDate > today;
                    })
                    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending
                setShows(filteredShows);
            } catch (error) {
                console.error("Error fetching shows:", error);
            }
        }

        fetchShows();
    }, []);

    return (
        <div id='gigs-wrapper'>
            <h2>Kommande spelningar</h2>
                <ul>
                    {Array.isArray(shows) && shows.map((show) => {
                        const showDate = new Date(show.date);
                        const formattedDate = `${String(showDate.getDate()).padStart(2, '0')}/${String(showDate.getMonth() + 1).padStart(2, '0')}-${String(showDate.getFullYear()).slice(-2)}`;
                        return (
                            <li key={show.id}>
                                <p>{formattedDate}</p>
                                <p>{show.location},</p>
                                <p>{show.venue}</p>
                                <a href={show.ticketLink} id='ticket-button'>Info</a>
                            </li>
                        );
                    })}
                </ul>
        </div>
    );
}

export default Gigs;

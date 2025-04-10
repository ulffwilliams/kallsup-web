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

                // Filtrera ut gamla spelningar.
                const filteredShows = json.shows.filter((show) => {
                    const showDate = new Date(show.date); // Use Date constructor directly
                    if (isNaN(showDate)) {
                        console.error(`Invalid date format: ${show.date}`);
                        return false;
                    }
                    return showDate >= today;
                });
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
                    {Array.isArray(shows) && shows.map((show) => (
                        <li key={show.id}>
                            <p>{show.date}</p>
                            <p>{show.location},</p>
                            <p>{show.venue}</p>
                            <a href={show.ticketLink} id='ticket-button'>Info</a>
                        </li>
                    ))}
                </ul>
        </div>
    );
}

export default Gigs;

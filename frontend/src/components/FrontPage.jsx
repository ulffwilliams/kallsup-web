import React from 'react'
import { useState } from 'react'
import Contact from './Contact'
import Gigs from './Gigs'
import '/src/scss/frontpage.scss'

function FrontPage() {

  const [showContact, setShowContact] = useState(false);
  const [showGigs, setShowGigs] = useState(false);

  function handleClick(url){
    location.href=url;
  }

  return (
    <div>
      <div id="frontpage-wrapper">
        <div id="logo-wrapper">
          <img src="./images/loggavit.png" alt="logo" id="logo" />
        </div>
        {!showContact && !showGigs ? (
          <>
          <div id="button-container">
            <a href="https://shop.aloaded.com/sv-se/collections/kallsup?srsltid=AfmBOopUT8BtbM7q-Fn8tiUcALLI8-2nhuV7hTbXJRuq72aaUDisQ7_y&fbclid=PAZXh0bgNhZW0CMTEAAafguvgJmludAR5oFQpeNTpfQiUeyNuJ21KQzDwV8cgassRzSKK2gTJe_i3LFA_aem_20KlWrZOku3Cb4Ns4mMnLA">
              Merch
            </a>
            <a href="https://varorecords.bandcamp.com/album/en-sista-r-ddning">Köp skivan</a>
            <a href="#" onClick={() => setShowGigs(true)}>Gigg</a>
            <a href="#" onClick={() => setShowContact(true)}>Kontakt</a>
          </div>
                  <div id="socials-wrapper">
                  <img
                    src="./images/spotify.png"
                    alt="spotify"
                    height={"32px"}
                    width={"32px"}
                    onClick={() =>
                      handleClick(
                        "https://open.spotify.com/artist/0lksP63BacYDmZCjWyNWnz?si=NingIZdDR2m1etGIhMmgew"
                      )
                    }
                  />
                  <img
                    src="./images/instagram.png"
                    alt="instagram"
                    height={"32px"}
                    width={"32px"}
                    onClick={() => handleClick("https://www.instagram.com/kallsup909/")}
                  />
                  <img
                    src="./images/facebook.png"
                    alt="facebook"
                    height={"32px"}
                    width={"32px"}
                    onClick={() => handleClick("https://www.facebook.com/kallsup909")}
                  />
                </div>
                </>
        ) : showContact ? (
          <div className="component-anim">
          <Contact />
          <p className='p-return' onClick={() => setShowContact(false)}>Tillbaka</p>
          </div>
        ) : (
          <div className='component-anim'>
          <Gigs />
          <p className='p-return' onClick={() => setShowGigs(false)}>Tillbaka</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default FrontPage

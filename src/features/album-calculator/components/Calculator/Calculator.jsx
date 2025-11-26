import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useGetAlbum from '../../useGetAlbum.js';
import DragLayer from './DragLayer.jsx';
import './Calculator.css';

const SIDE_LENGTH_LIMIT_SECONDS = 22 * 60;

function getTotalSeconds(songs) {
  return songs.reduce((acc, song) => {
    const [min, sec] = song.length.split(':').map(Number);
    return acc + min * 60 + sec;
  }, 0);
}

function sumSongLengths(songs) {
  const totalSeconds = getTotalSeconds(songs);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function sumIntensity(songs) {
  return songs.reduce((acc, song) => acc + (song.intensity || 0), 0);
}

function Calculator() {
  const navigate = useNavigate();
  const { albumName } = useParams();
  const selectedAlbumName = albumName ? decodeURIComponent(albumName) : '';
  const { album, loading, error } = useGetAlbum(selectedAlbumName);
  const [pool, setPool] = useState([]);
  const [sideOne, setSideOne] = useState([]);
  const [sideTwo, setSideTwo] = useState([]);
  const [isAuth, setIsAuth] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('albumCalculatorAuthed');
    setIsAuth(auth === 'true');
  }, []);

  useEffect(() => {
    if (album) {
      setPool(album.songs);
      setSideOne([]);
      setSideTwo([]);
    }
  }, [album]);

  function resetBoard() {
    if (!album) return;
    setPool(album.songs);
    setSideOne([]);
    setSideTwo([]);
  }

  const sideTwoOffset = sideOne.length + 1;
  const sideOneSeconds = getTotalSeconds(sideOne);
  const sideTwoSeconds = getTotalSeconds(sideTwo);
  const sideOneLength = sumSongLengths(sideOne);
  const sideTwoLength = sumSongLengths(sideTwo);
  const sideOneOverLimit = sideOneSeconds > SIDE_LENGTH_LIMIT_SECONDS;
  const sideTwoOverLimit = sideTwoSeconds > SIDE_LENGTH_LIMIT_SECONDS;

  function formatExportText() {
    const formatLines = (songs, startIndex) =>
      songs.map((song, idx) => `${startIndex + idx}. ${song.title}, ${song.length}`).join('\n');

    const sideAText = formatLines(sideOne, 1);
    const sideBText = formatLines(sideTwo, sideTwoOffset);

    return [
      'Sida A:',
      sideAText,
      '',
      `Total tid: ${sideOneLength}`,
      `Total peppar: ${sumIntensity(sideOne)}`,
      '',
      'Sida B:',
      sideBText,
      '',
      `Total tid: ${sideTwoLength}`,
      `Total peppar: ${sumIntensity(sideTwo)}`,
    ].join('\n');
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(formatExportText());
    } catch (err) {
      console.error('Kunde inte kopiera', err);
    }
  }

  function allowDrop(e) {
    e.preventDefault();
  }

  function computeInsertIndex(containerId, clientY) {
    const el = document.getElementById(containerId);
    if (!el) return 0;
    const items = Array.from(el.querySelectorAll('[data-song-item="true"]'));
    for (let i = 0; i < items.length; i++) {
      const rect = items[i].getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      if (clientY < midY) return i;
    }
    return items.length;
  }

  function moveSong(songTitle, from, to, targetIndex) {
    const lists = { pool, sideOne, sideTwo };
    const setters = { pool: setPool, sideOne: setSideOne, sideTwo: setSideTwo };

    const fromList = lists[from];
    const toList = lists[to];
    if (!fromList || !toList) return;

    const fromIdx = fromList.findIndex((s) => s.title === songTitle);
    if (fromIdx === -1) return;

    if (from === to) {
      const newList = [...fromList];
      const [song] = newList.splice(fromIdx, 1);
      const insertAt =
        targetIndex === undefined ? newList.length : Math.max(0, Math.min(targetIndex, newList.length));
      newList.splice(insertAt, 0, song);
      setters[from](newList);
      return;
    }

    const sourceList = [...fromList];
    const [song] = sourceList.splice(fromIdx, 1);
    const destList = [...toList];
    const insertAt =
      targetIndex === undefined ? destList.length : Math.max(0, Math.min(targetIndex, destList.length));
    destList.splice(insertAt, 0, song);

    setters[from](sourceList);
    setters[to](destList);
  }

  function onDrop(e, to, cleanup) {
    e.preventDefault();
    const songTitle = e.dataTransfer.getData('songTitle');
    const from = e.dataTransfer.getData('from');
    const containerId =
      to === 'pool' ? 'song-pool-container' : to === 'sideOne' ? 'side-one-container' : 'side-two-container';
    const targetIndex = computeInsertIndex(containerId, e.clientY);
    moveSong(songTitle, from, to, targetIndex);
    cleanup();
  }

  if (!isAuth) return <div>Du är inte inloggad.</div>;
  if (!selectedAlbumName) return <div>Ingen skiva vald</div>;
  if (loading) return <div>Laddar...</div>;
  if (error) return <div>{error}</div>;
  if (!album) return <div>Ingen skiva hittades</div>;

  return (
    <>
      <DragLayer
        onDropWithIndex={({ songTitle, from, to, targetIndex }) =>
          moveSong(songTitle, from, to, targetIndex)
        }
      >
        {({ floatingSong, getDragHandlers, resetDrag }) => (
          <div id="calculator">
            <h3 id="return-button" onClick={() => navigate('/album-calculator')}>
              Tillbaka
            </h3>
            {floatingSong}
            <div id="calc-title">
              {album.albumName} - {album.artist}
            </div>
            <div id="calc-header">
              <div id="song-pool-head">Låtpool</div>
              <div id="side-one-head">Sida A</div>
              <div id="side-two-head">Sida B</div>
            </div>
            <div id="calc-container">
              <div id="song-pool-container" onDrop={(e) => onDrop(e, 'pool', resetDrag)} onDragOver={allowDrop}>
                {pool.map((song) => (
                  <div
                    key={song.title}
                    id="song-container"
                    data-song-item="true"
                    {...getDragHandlers(song, 'pool')}
                  >
                    {song.title} - {song.length} | 🌶️{song.intensity}
                  </div>
                ))}
              </div>

              <div id="side-one-container" onDrop={(e) => onDrop(e, 'sideOne', resetDrag)} onDragOver={allowDrop}>
                {sideOne.length === 0 ? (
                  <div className="empty-drop-hint">Dra en låt hit..</div>
                ) : (
                  sideOne.map((song, idx) => (
                    <div
                      key={song.title}
                      id="song-container"
                      data-song-item="true"
                      {...getDragHandlers(song, 'sideOne')}
                    >
                      {idx + 1}. {song.title} - {song.length} | 🌶️{song.intensity}
                    </div>
                  ))
                )}
              </div>

              <div id="side-two-container" onDrop={(e) => onDrop(e, 'sideTwo', resetDrag)} onDragOver={allowDrop}>
                {sideTwo.length === 0 ? (
                  <div className="empty-drop-hint">Dra en låt hit..</div>
                ) : (
                  sideTwo.map((song, idx) => (
                    <div
                      key={song.title}
                      id="song-container"
                      data-song-item="true"
                      {...getDragHandlers(song, 'sideTwo')}
                    >
                      {sideTwoOffset + idx}. {song.title} - {song.length} | 🌶️{song.intensity}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div id="calc-footer">
              <div id="song-pool-foot">
                Tid kvar i pool: {sumSongLengths(pool)} <br /> 🌶️ i pool: {sumIntensity(pool)}
              </div>
              <div id="side-one-foot">
                <span className={`side-length-text${sideOneOverLimit ? ' over-limit' : ''}`}>
                  Längd på sida A: {sideOneLength}
                </span>
                <br /> 🌶️ {sumIntensity(sideOne)}
              </div>
              <div id="side-two-foot">
                <span className={`side-length-text${sideTwoOverLimit ? ' over-limit' : ''}`}>
                  Längd på sida B: {sideTwoLength}
                </span>
                <br /> 🌶️ {sumIntensity(sideTwo)}
              </div>
            </div>
            <div className="button-row">
              <button onClick={resetBoard}>Återställ brädet</button>
              <button onClick={copyToClipboard}>Kopiera till urklipp</button>
            </div>
          </div>
        )}
      </DragLayer>
    </>
  );
}

export default Calculator;

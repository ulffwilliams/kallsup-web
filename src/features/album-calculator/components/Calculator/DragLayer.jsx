import { useMemo, useState } from 'react';

const dropTargets = [
  { id: 'song-pool-container', to: 'pool' },
  { id: 'side-one-container', to: 'sideOne' },
  { id: 'side-two-container', to: 'sideTwo' },
];

function calcIndexForContainer(containerId, clientY) {
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

function DragLayer({ onDropWithIndex, children }) {
  const [draggedSong, setDraggedSong] = useState(null);
  const [dragPos, setDragPos] = useState(null);
  const transparentImage = useMemo(() => {
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    return img;
  }, []);

  const resetDrag = () => {
    setDraggedSong(null);
    setDragPos(null);
  };

  const handleTouchEnd = () => {
    if (!draggedSong || !dragPos) {
      resetDrag();
      return;
    }
    for (const target of dropTargets) {
      const el = document.getElementById(target.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (dragPos.x >= rect.left && dragPos.x <= rect.right && dragPos.y >= rect.top && dragPos.y <= rect.bottom) {
          const index = calcIndexForContainer(target.id, dragPos.y);
          onDropWithIndex({
            songTitle: draggedSong.song.title,
            from: draggedSong.from,
            to: target.to,
            clientY: dragPos.y,
            targetIndex: index,
          });
          break;
        }
      }
    }
    resetDrag();
  };

  const getDragHandlers = (song, from) => ({
    draggable: true,
    onDragStart: (e) => {
      e.dataTransfer.setData('songTitle', song.title);
      e.dataTransfer.setData('from', from);
      e.dataTransfer.setDragImage(transparentImage, 0, 0);
      setDraggedSong({ song, from });
      setDragPos({ x: e.clientX, y: e.clientY });
    },
    onDrag: (e) => {
      if (draggedSong) {
        setDragPos({ x: e.clientX, y: e.clientY });
      }
    },
    onDragEnd: resetDrag,
    onTouchStart: (e) => {
      setDraggedSong({ song, from });
      setDragPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    },
    onTouchMove: (e) => {
      if (draggedSong) {
        setDragPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    },
    onTouchEnd: handleTouchEnd,
  });

  const floatingSong =
    draggedSong && dragPos ? (
      <div
        style={{
          position: 'fixed',
          left: dragPos.x,
          top: dragPos.y,
          pointerEvents: 'none',
          background: '#419999ff',
          padding: '8px 12px',
          borderRadius: '6px',
          zIndex: 9999,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {draggedSong.song.title} - {draggedSong.song.length} - {draggedSong.song.intensity}
      </div>
    ) : null;

  return <>{children({ floatingSong, getDragHandlers, resetDrag })}</>;
}

export default DragLayer;

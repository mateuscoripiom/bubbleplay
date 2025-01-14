
import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    fetch('http://localhost:44741/api/videos')
      .then((response) => response.json())
      .then((data) => setVideos(data));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Catálogo de Vídeos</h1>
      </header>
      <div className="video-list">
        {videos.map((video) => (
          <div
            key={video.id}
            className="video-item"
            onClick={() => setCurrentVideo(video.filePath)}
          >
            {video.title}
          </div>
        ))}
      </div>
      {currentVideo && (
        <div className="video-player">
          <video controls autoPlay>
            <source src={`http://localhost:3001${currentVideo}`} type="application/x-mpegURL" />
            Seu navegador não suporta reprodução de vídeo.
          </video>
        </div>
      )}
    </div>
  );
};

export default App;
        

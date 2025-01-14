
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const app = express();
const PORT = 44741;
const videosDir = path.join(__dirname, 'videos'); // Diretório onde os vídeos .mkv estão armazenados

app.use(cors());
app.use(express.json());

// Rota para listar vídeos
app.get('/api/videos', (req, res) => {
  const videos = fs.readdirSync(videosDir).filter(file => file.endsWith('.mkv'));
  const videoList = videos.map((file, index) => ({
    id: index,
    title: path.basename(file, path.extname(file)),
    filePath: `/api/stream/${file}`,
    detailsPath: `/api/video-details/${file}`
  }));
  res.json(videoList);
});

// Rota para detalhes do vídeo (faixas de legendas e áudios)
app.get('/api/video-details/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(videosDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Arquivo não encontrado');
  }

  ffmpeg.ffprobe(filePath, (err, metadata) => {
    if (err) {
      return res.status(500).send('Erro ao analisar o arquivo');
    }

    const audioTracks = metadata.streams.filter(stream => stream.codec_type === 'audio').map((track, index) => ({
      index,
      language: track.tags?.language || 'Desconhecido',
      codec: track.codec_name,
    }));

    const subtitleTracks = metadata.streams.filter(stream => stream.codec_type === 'subtitle').map((track, index) => ({
      index,
      language: track.tags?.language || 'Desconhecido',
    }));

    res.json({ audioTracks, subtitleTracks });
  });
});

// Rota para streaming de vídeo (HLS)
app.get('/api/stream/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(videosDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Arquivo não encontrado');
  }

  // Converte para HLS em tempo real
  ffmpeg(filePath)
    .outputOptions([
      '-preset fast',
      '-g 48',
      '-sc_threshold 0',
      '-map 0',
      '-map 0:s?',
      '-map 0:a?',
      '-map 0:v?',
      '-c:v libx264',
      '-c:a aac',
      '-f hls',
      '-hls_time 4',
      '-hls_list_size 0',
      '-hls_segment_filename', path.join(videosDir, 'segments_%03d.ts'),
    ])
    .on('error', (err) => console.error('Erro no FFmpeg:', err))
    .pipe(res, { end: true });
});

app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
        

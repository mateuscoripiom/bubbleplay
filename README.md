# BubblePlay

🇧🇷 Servidor de streaming de video local, funcional: lista arquivos .mkv de uma pasta, usa ffprobe (via fluent-ffmpeg) pra detectar faixas de audio/legenda de cada video, e transcodifica sob demanda pra HLS em tempo real com um pipe direto do FFmpeg pra resposta HTTP. Frontend em React consome a API e lista/reproduz os videos. Pequeno (~9KB) mas real -- foi o protótipo que deu origem a um projeto bem maior, que hoje roda como aplicação privada em produção com integração a servidor de mídia (Emby), bitrate adaptativo e armazenamento em nuvem.

🇬🇧 A functional local video streaming server: lists .mkv files in a folder, uses ffprobe (via fluent-ffmpeg) to detect each video audio/subtitle tracks, and transcodes on demand to HLS in real time, piping FFmpeg output directly into the HTTP response. A React frontend consumes the API to list and play videos. Small (~9KB) but real -- this was the prototype that grew into a much larger project, now running as a private production application with media-server integration (Emby), adaptive bitrate, and cloud storage.

**Stack:** Node.js, Express, fluent-ffmpeg, React
**Contexto:** projeto pessoal (2025), não e trabalho de curso.

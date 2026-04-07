const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');
const idx = content.indexOf('  return (\n    <main');

if (idx === -1) {
  console.log("Could not find return block");
  process.exit(1);
}

const prefix = content.slice(0, idx);
const suffix = `  const handleCobaltSearch = (url: string, mode: SearchMode) => {
    if (mode === 'youtube') {
      setCurrentUrl(url);
      handleFetch(url);
    } else {
      setCurrentSpotifyUrl(url);
      handleSpotifyFetch(url);
    }
  };

  const hasContent = showDownloadOptions || isSpotifyTrack || isSpotifyPlaylist;
  const isGlobalLoading = fetchState === 'fetching' || spotifyFetchState === 'fetching';

  return (
    <main className="relative min-h-screen bg-black text-white font-mono selection:bg-white/30 overflow-hidden">
      {/* Top absolute header */}
      <div className="absolute top-4 left-0 w-full flex justify-center text-[10px] text-white/50 tracking-widest gap-2">
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
          <span className="w-2 h-2 rounded-full bg-white/80"></span>
          <span>supported services</span>
        </div>
      </div>

      <div
        ref={containerRef}
        className={\`relative flex flex-col items-center px-4 sm:px-6 w-full min-h-screen transition-all duration-700 ease-in-out \${
          hasContent ? "pt-24 sm:pt-32 justify-start block" : "justify-center"
        }\`}
      >
        {/* Logo & Input Wrapper */}
        <motion.div 
          layout
          className="w-full flex flex-col items-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <CobaltCat />
          
          <CobaltInput 
            onSearch={handleCobaltSearch} 
            isLoading={isGlobalLoading} 
          />

          {/* Error displays floating under the input */}
          <AnimatePresence>
            {(fetchError || spotifyFetchError) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-red-500 text-xs px-4 py-2 bg-red-500/10 rounded border border-red-500/20"
              >
                {fetchError || spotifyFetchError}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ─── Results Area ─── */}
        <motion.div 
          layout
          className="w-full max-w-2xl mt-12 flex flex-col items-center gap-5 z-0"
        >
          {/* YouTube Results */}
          <AnimatePresence mode="wait">
            {videoInfo && fetchState !== 'idle' && (
              <motion.div
                key="video-card"
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <VideoCard videoInfo={videoInfo} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {showDownloadOptions && (
              <motion.div
                key="download-options"
                className="w-full"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                <DownloadOptions
                  videoInfo={videoInfo}
                  onDownload={handleDownload}
                  audioBusy={isAudioBusy}
                  videoBusy={isVideoBusy}
                  audioComplete={audioDownload.status === 'complete'}
                  videoComplete={videoDownload.status === 'complete'}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* YouTube Progress Bars */}
          <AnimatePresence mode="wait">
            {audioDownload.status !== 'idle' && (
              <motion.div
                key="audio-progress"
                className="w-full"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ProgressBar
                  label="MP3 Audio"
                  progress={audioDownload.progress}
                  status={audioDownload.statusText}
                  jobId={audioDownload.jobId}
                  error={audioDownload.error}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {videoDownload.status !== 'idle' && (
              <motion.div
                key="video-progress"
                className="w-full"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ProgressBar
                  label="MP4 Video"
                  progress={videoDownload.progress}
                  status={videoDownload.statusText}
                  jobId={videoDownload.jobId}
                  error={videoDownload.error}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spotify Results */}
          <AnimatePresence mode="wait">
            {isSpotifyTrack && spotifyFetchState !== 'idle' && (
              <motion.div
                key="spotify-info-card"
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <VideoCard videoInfo={spotifyInfo} />
              </motion.div>
            )}
            
            {isSpotifyPlaylist && spotifyFetchState !== 'idle' && (
              <motion.div
                key="spotify-playlist-card"
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <PlaylistCard 
                  playlistInfo={spotifyInfo} 
                  onDownloadTrack={handleDownloadTrack}
                  onDownloadAll={handleDownloadAll}
                  isDownloadingAll={isDownloadingAll}
                  zipStatus={zipStatus}
                  downloadsState={playlistDownloads}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
             {isSpotifyTrack && spotifyFetchState === 'ready' && (
              <motion.div
                key="spotify-download-options"
                className="w-full"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                <SpotifyDownloadOptions
                  videoInfo={spotifyInfo}
                  onDownload={handleSpotifyDownload}
                  isBusy={isSpotifyBusy}
                  isComplete={spotifyDownload.status === 'complete'}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isSpotifyTrack && spotifyDownload.status !== 'idle' && (
              <motion.div
                key="spotify-progress"
                className="w-full"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ProgressBar
                  label="Spotify MP3"
                  progress={spotifyDownload.progress}
                  status={spotifyDownload.statusText}
                  jobId={spotifyDownload.jobId}
                  error={spotifyDownload.error}
                />
              </motion.div>
            )}
           </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.footer
          layout
          className="mt-auto pt-16 pb-6 text-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-white/30 text-[10px] hover:text-white/50 transition-colors">
            by continuing, you agree to <span className="underline cursor-pointer">terms and ethics of use</span>
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
`;
fs.writeFileSync('src/app/page.tsx', prefix + suffix);
console.log("Done");

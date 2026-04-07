const fs = require('fs');
fetch('https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M')
  .then(r => r.text())
  .then(t => {
    fs.writeFileSync('spotify_html_dump.html', t);
    console.log('Dumped HTML');
  });

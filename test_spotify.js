const fs = require('fs');

fetch('https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M')
  .then(r => r.text())
  .then(t => {
    let match = t.match(/<script(?:\s+[^>]*?)?\s+id="initial-state"(?:\s+[^>]*?)?>(.*?)<\/script>/si);

    if (match) {
      console.log('Found structured data script!');
      try {
        const data = JSON.parse(Buffer.from(match[1], 'base64').toString('utf-8'));
        console.log('Keys:', Object.keys(data));
      } catch (e) {
        try {
          const data = JSON.parse(match[1]);
          console.log('Keys (direct JSON):', Object.keys(data));
        } catch (e2) {
          console.log('Failed to parse data');
        }
      }
    } else {
      console.log('No state script found, searching for other track markers...');
      const trackMatches = t.match(/<meta property="music:song" content="([^"]+)"/gi);
      console.log(`Found ${trackMatches ? trackMatches.length : 0} track OG tags.`);
      if (trackMatches) {
        console.log(trackMatches.slice(0, 5));
      }
    }
  });

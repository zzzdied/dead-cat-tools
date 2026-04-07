fetch('https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
  }
}).then(async r => {
  const html = await r.text();
  const parts = html.split('id="initialState"');
  if (parts.length > 1) {
    console.log('Found initialState');
    const b64Data = parts[1].split('</script>')[0].split('>')[1];
    try {
      const data = JSON.parse(Buffer.from(b64Data, 'base64').toString('utf8'));
      if (data.entities && data.entities.items) {
        let trackItems = [];
        Object.values(data.entities.items).forEach(v => {
          if (v.__typename === 'Playlist' && v.content && v.content.items) {
            v.content.items.forEach(t => {
              if (t.itemV2?.data?.__typename === 'Track') {
                trackItems.push(t.itemV2.data);
              }
            });
          }
        });
        console.log('Extracted tracks:', trackItems.length);
        if (trackItems.length > 0) {
           console.log('Example:', trackItems[0].name, trackItems[0].duration);
        }
      } else { console.log('No entities items'); }
    } catch(e) { console.error('Decode Err:', e.message); }
  } else {
    console.log('No initialState found in HTML response');
  }
});

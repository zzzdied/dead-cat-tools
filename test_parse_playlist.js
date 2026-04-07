const fs = require('fs');
const html = fs.readFileSync('spotify_html_dump.html', 'utf8');

const id1 = '<script id="initialState" type="text/plain">';
const parts = html.split(id1);

if (parts.length > 1) {
    const textAfter = parts[1];
    const b64Data = textAfter.split('</script>')[0];
    fs.writeFileSync('b64.txt', b64Data);
    console.log("Dumped b64Data");
    
    // Attempt parsing
    try {
        const decoded = Buffer.from(b64Data, 'base64').toString('utf8');
        fs.writeFileSync('decoded.txt', decoded);
        console.log("Dumped decoded");
        
        try {
            const data = JSON.parse(decoded);
            console.log("Parsed successfully!");
        } catch(e) {
            console.log("JSON Parse Error:", e.message);
        }
    } catch(e) {
        console.log("Decode Error:", e.message);
    }
}

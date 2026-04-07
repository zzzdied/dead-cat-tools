import sys
import instaloader
import json
import warnings

warnings.filterwarnings("ignore")

L = instaloader.Instaloader()
try:
    post = instaloader.Post.from_shortcode(L.context, sys.argv[1])
    print(json.dumps({
        "desc": post.caption or f"Instagram Reel/Post - {sys.argv[1]}",
        "thumbnail": post.url,
        "owner": post.owner_username,
        "video_duration": getattr(post, 'video_duration', 0)
    }))
except Exception as e:
    print(json.dumps({"error": str(e)}))

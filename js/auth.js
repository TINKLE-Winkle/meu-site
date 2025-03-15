const CLIENT_ID = "0a5c9c8b66d143cbb5d5925a5b198bac";
const REDIRECT_URI = "http://127.0.0.1:5500/surprise/index.html"; // Ou a URL do seu site
const SCOPES = "streaming user-read-email user-read-private";

function loginSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES}`;
    window.location.href = authUrl;
}

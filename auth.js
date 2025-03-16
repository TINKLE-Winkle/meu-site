const CLIENT_ID = "0a5c9c8b66d143cbb5d5925a5b198bac";
const REDIRECT_URI = "https://tinkle-winkle.github.io/meu-site/"; // Ou a URL do seu site
const SCOPES = "streaming user-read-email user-read-private";

function loginSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES}`;
    window.location.href = authUrl;
}

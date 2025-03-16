// Função para calcular tempo juntos e animar a exibição do texto
function calcularTempoJuntos() {
    const dataInicio = new Date("2024-07-14"); // Troque essa data pela real
    const hoje = new Date();

    let anos = hoje.getFullYear() - dataInicio.getFullYear();
    let meses = hoje.getMonth() - dataInicio.getMonth();
    let dias = hoje.getDate() - dataInicio.getDate();

    if (dias < 0) {
        const ultimoDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate();
        dias += ultimoDiaMesAnterior;
        meses--;
    }

    if (meses < 0) {
        meses += 12;
        anos--;
    }

    const contador = document.getElementById("contador");
    if (contador) {
        const texto = `${anos} anos, ${meses} meses e ${dias} dias`;
        contador.innerText = "";
        let i = 0;

        function animarTexto() {
            if (i < texto.length) {
                contador.innerText += texto.charAt(i);
                i++;
                setTimeout(animarTexto, 50);
            }
        }
        animarTexto();
    }
}

const CLIENT_ID = "0a5c9c8b66d143cbb5d5925a5b198bac";
const REDIRECT_URI = "https://tinkle-winkle.github.io/meu-site/"; // URL simples (não precisa de /callback)
const SCOPES = "streaming user-read-email user-read-private";

function loginSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES}`;
    window.location.href = authUrl;
}

// Função para obter o token da URL após a autenticação
function getSpotifyTokenFromUrl() {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get("access_token");
    return token;
}

// Se o token estiver presente na URL, inicializa o player
window.onload = function() {
    const token = getSpotifyTokenFromUrl();
    if (token) {
        localStorage.setItem("spotify_access_token", token);
        iniciarPlayer(token);  // Iniciar o player com o token obtido
    }
};

// Função para iniciar o player
function iniciarPlayer(token) {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    document.body.appendChild(script);

    script.onload = () => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new Spotify.Player({
                name: "Meu Player do Casal",
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            player.addListener("ready", async ({ device_id }) => {
                console.log("Player pronto:", device_id);
                
                // Ativar o device no Spotify
                await fetch("https://api.spotify.com/v1/me/player", {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        device_ids: [device_id],
                        play: true
                    })
                });
            });

            player.connect();
        };
    };
}

// Função para carregar configurações do usuário
function aplicarConfiguracoes() {
    const notificacoes = localStorage.getItem("notificacoes") === "true";
    const modoEscuro = localStorage.getItem("modoEscuro") === "true";

    document.getElementById("notificacoes").checked = notificacoes;
    document.getElementById("modoEscuro").checked = modoEscuro;

    if (modoEscuro) {
        document.body.classList.add("modo-escuro");
    } else {
        document.body.classList.remove("modo-escuro");
    }
}

// Função para salvar configurações do usuário
document.getElementById("salvarConfigBtn").addEventListener("click", function() {
    const notificacoes = document.getElementById("notificacoes").checked;
    const modoEscuro = document.getElementById("modoEscuro").checked;

    localStorage.setItem("notificacoes", notificacoes);
    localStorage.setItem("modoEscuro", modoEscuro);

    aplicarConfiguracoes();
});

// Função para alternar entre editar e salvar perfil
document.getElementById("editarPerfilBtn").addEventListener("click", function editarPerfil() {
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const dataNascimento = document.getElementById("dataNascimento");
    const botao = document.getElementById("editarPerfilBtn");

    if (botao.value === "Editar Perfil") {
        nome.contentEditable = true;
        email.contentEditable = true;
        dataNascimento.contentEditable = true;
        botao.value = "Salvar Perfil";
    } else {
        nome.contentEditable = false;
        email.contentEditable = false;
        dataNascimento.contentEditable = false;

        localStorage.setItem("nome", nome.innerText);
        localStorage.setItem("email", email.innerText);
        localStorage.setItem("dataNascimento", dataNascimento.innerText);

        botao.value = "Editar Perfil";
    }
});

// Função para mudar de seção
function mudarRota(secao) {
    const todasSecoes = document.querySelectorAll(".section");
    todasSecoes.forEach(sec => sec.style.display = "none");

    const secaoAtual = document.getElementById(secao);
    if (secaoAtual) {
        secaoAtual.style.display = "block";
    } else {
        console.error("Seção não encontrada:", secao);
    }
}

// Função para enviar mensagem
document.getElementById("enviarMensagemBtn").addEventListener("click", function() {
    const mensagem = document.getElementById("mensagem").value;

    if (mensagem.trim() !== "") {
        const mensagensEnviadas = document.getElementById("mensagensEnviadas");

        const novaMensagem = document.createElement("div");
        novaMensagem.classList.add("mensagem");
        novaMensagem.innerText = mensagem;
        mensagensEnviadas.appendChild(novaMensagem);

        document.getElementById("mensagem").value = "";
    }
});

// Mostrar mensagem de amor
function mostrarMensagem() {
    const mensagem = document.getElementById("mensagemSurpresa");
    mensagem.innerText = "Você é o amor da minha vida! 💕";
    mensagem.style.display = "block";
}

// Carregar configurações ao iniciar a página
window.onload = function () {
    setTimeout(() => {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const token = params.get("access_token");

        if (token) {
            localStorage.setItem("spotify_access_token", token);
            iniciarPlayer(token);
        }
    }, 1000);

    aplicarConfiguracoes();
};

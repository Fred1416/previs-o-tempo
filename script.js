/*
Logica de programação
Fluxo Basico

[x]Descobrir quando o botão foi clicado
[x]Pegar o nome da cidade no input
[x]Enviar a cidade para o servidor
[x]Pegar a resposta e colocar na tela 

Fluxo de Voz

[x]Descobrir quando o botão foi clicado
[x]Começar a ouvir e enviar a transcrição para o servidor
[x]Pegar a resposta e colocar na tela

Fluxo da IA

[x]Pegar os dados da cidade
[x]Enviar para IA
[x]Colocar os dados na tela

*/



async function pesquisar() {
    let cidade = document.querySelector(".input-cidade").value;
    let caixa = document.querySelector(".caixa-menor");
    let dadosJson;

    // Detecta se estamos rodando localmente ou na Vercel
    const isLocal = window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    if (isLocal) {
        let chave = CONFIG.CHAVE_OPEN_WEATHER;
        let endereco = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chave}&units=metric&lang=pt_br`;
        let respostaServidor = await fetch(endereco);
        dadosJson = await respostaServidor.json();
    } else {
        let respostaServidor = await fetch(`/api/weather?cidade=${cidade}`);
        dadosJson = await respostaServidor.json();
    }

    caixa.innerHTML = `
    <p class="cidade">${dadosJson.name}</p>
    <p class="temp">${Math.floor(dadosJson.main.temp)} °C</p>
    <img src="https://openweathermap.org/img/wn/${dadosJson.weather[0].icon}@2x.png" alt="icone" class="icone">
    <p class="descricao">Descrição: ${dadosJson.weather[0].description}</p>
    <p class="umidade">Umidade: ${dadosJson.main.humidity} %</p>
    <p class="vento">Vento: ${dadosJson.wind.speed} km/h</p>
    <p class="sensacao">Sensação: ${Math.floor(dadosJson.main.feels_like)} °C</p>
    <button class="botao-ia" onclick="pedirSugestaoRoupa()">Sugestão de Roupa</button>
    <p class="resposta-ia">Resposta da IA</p>
    `;
}

function detectaVoz() {
    let reconhecimento = new window.webkitSpeechRecognition();
    reconhecimento.lang = "pt-BR";
    reconhecimento.start();

    reconhecimento.onresult = function(event) {
        let texto = event.results[0][0].transcript;
        document.querySelector(".input-cidade").value = texto;
        pesquisar();
    };
}

async function pedirSugestaoRoupa() {
    let cidade = document.querySelector(".cidade").textContent;
    let temp = document.querySelector(".temp").textContent;
    let umidade = document.querySelector(".umidade").textContent;
    let vento = document.querySelector(".vento").textContent;
    let sensacao = document.querySelector(".sensacao").textContent;
    let dadosJson;

    const isLocal = window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    if (isLocal) {
        let resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + CONFIG.CHAVE_GROQ_IA
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b",
                messages: [
                    {
                        role: "user",
                        content: `Dê uma sugestão de roupa para ${cidade} com ${temp} e ${umidade} e ${vento} e ${sensacao},Me de sugestão em frase de 2 linhas simples e rapido.`
                    }
                ]
            })
        });
        dadosJson = await resposta.json();
    } else {
        let resposta = await fetch("/api/groq", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ cidade, temp, umidade, vento, sensacao })
        });
        dadosJson = await resposta.json();
    }

    document.querySelector(".resposta-ia").textContent = dadosJson.choices[0].message.content;
}

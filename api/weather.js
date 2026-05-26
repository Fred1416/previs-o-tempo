
// api/weather.js
module.exports = async (req, res) => {
    const { cidade } = req.query;
    // O servidor lê a chave salva nas configurações da Vercel
    const chave = process.env.CHAVE_OPEN_WEATHER;
    const endereco = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chave}&units=metric&lang=pt_br`;

    try {
        const respostaServidor = await fetch(endereco);
        const dadosJson = await respostaServidor.json();
        res.status(200).json(dadosJson);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
};

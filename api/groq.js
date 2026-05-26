
// api/groq.js
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ erro: 'Método não permitido' });
    }

    const { cidade, temp, umidade, vento, sensacao } = req.body;
    const chaveIA = process.env.CHAVE_GROQ_IA;

    try {
        const resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + chaveIA
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b",
                messages: [
                    {
                        role: "user",
                        content: `Dê uma sugestão de roupa para ${cidade} com ${temp} e ${umidade} e ${vento} e ${sensacao}. Me dê a sugestão em uma frase de 2 linhas, de forma simples e rápida.`
                    }
                ]
            })
        });
        const dadosJson = await resposta.json();
        res.status(200).json(dadosJson);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
};

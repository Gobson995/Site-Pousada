import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const emailDeDestino = process.env.SEU_EMAIL_DE_DESTINO;

export default async function handler(req, res) {
    
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Método não permitido.' });
    }

    const { nome, email, telefone, checkin, checkout, hospedes, mensagem } = req.body;

    if (!nome || !email || !telefone || !checkin || !checkout) {
        return res.status(400).json({ status: 'error', message: 'Por favor, preencha todos os campos obrigatórios.' });
    }

    const htmlBody = `
        <h1>Nova Solicitação de Reserva da Pousada!</h1>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>Check-in:</strong> ${checkin}</p>
        <p><strong>Check-out:</strong> ${checkout}</p>
        <p><strong>Hóspedes:</strong> ${hospedes}</p>
        <p><strong>Mensagem:</strong> ${mensagem || 'Nenhuma.'}</p>
    `;

    try {
        const { data, error } = await resend.emails.send({
            from: 'Pousada Nonno Fiorindo <onboarding@resend.dev>',
            to: [emailDeDestino],
            subject: `Nova Reserva (Site) - ${nome}`,
            html: htmlBody,
            headers: { 'Reply-To': email },
        });

        if (error) {
            console.error(error);
            return res.status(500).json({ status: 'error', message: 'Houve um erro ao enviar sua mensagem.' });
        }
        
        res.status(200).json({ status: 'success', message: 'Mensagem enviada com sucesso!' });

    } catch (e) {
        console.error(e);
        res.status(500).json({ status: 'error', message: 'Houve um erro no servidor.' });
    }
}
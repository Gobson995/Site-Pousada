<?php

require 'vendor/autoload.php';

use Dotenv\Dotenv;
use Resend; 

header('Content-Type: application/json');

function send_json_response($status, $message) {
    echo json_encode(['status' => $status, 'message' => $message]);
    exit;
}

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$apiKey = $_ENV['RESEND_API_KEY'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response('error', 'Acesso negado.');
}

$nome = htmlspecialchars($_POST['nome']);
$email = htmlspecialchars($_POST['email']);
$telefone = htmlspecialchars($_POST['telefone']);
$checkin = htmlspecialchars($_POST['checkin']);
$checkout = htmlspecialchars($_POST['checkout']);
$hospedes = htmlspecialchars($_POST['hospedes']);
$mensagem = htmlspecialchars($_POST['mensagem'] ?? 'Nenhuma.');

if (empty($nome) || empty($email) || empty($telefone)) {
    send_json_response('error', 'Por favor, preencha todos os campos obrigatórios.'); // MUDOU
}

$htmlBody = <<<HTML
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { width: 90%; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        h1 { color: #2c5c3b; }
        strong { color: #2c5c3b; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Nova Solicitação de Reserva da Pousada!</h1>
        <p>Você recebeu um novo pedido de reserva pelo site.</p>
        <hr>
        <p><strong>Nome:</strong> $nome</p>
        <p><strong>E-mail:</strong> $email</p>
        <p><strong>Telefone:</strong> $telefone</p>
        <br>
        <p><strong>Check-in:</strong> $checkin</p>
        <p><strong>Check-out:</strong> $checkout</p>
        <p><strong>Hóspedes:</strong> $hospedes</p>
        <br>
        <p><strong>Mensagem:</strong></p>
        <p>$mensagem</p>
    </div>
</body>
</html>
HTML;

$resend = Resend::client($apiKey);

try {
    $result = $resend->emails->send([
        'from'    => 'Pousada Nonno Fiorindo <onboarding@resend.dev>',
        'to'      => [$_ENV['SEU_EMAIL_DE_DESTINO']],
        'subject' => "Nova Reserva (Site) - $nome",
        'html'    => $htmlBody,
        'headers' => [ 'Reply-To' => $email, ],
    ]);

    send_json_response('success', 'Mensagem enviada com sucesso!');

} catch (Exception $e) {
    send_json_response('error', 'Houve um erro ao enviar sua mensagem. Tente novamente.');
}
?>
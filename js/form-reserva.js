document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.reserva-form');
    const messageDiv = document.getElementById('form-message');
    const submitButton = document.getElementById('submit-button');
    const originalButtonText = submitButton.innerHTML;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.innerHTML = 'Enviando...';
        messageDiv.style.display = 'none';
        messageDiv.className = 'form-message';
        const formData = new FormData(form);

        fetch('/enviar-reserva', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            messageDiv.innerHTML = data.message;
            messageDiv.style.display = 'block';

            if (data.status === 'success') {
                messageDiv.classList.add('success');
                form.reset();
                submitButton.innerHTML = 'Enviado!';

                setTimeout(() => {
                    messageDiv.style.display = 'none';
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                }, 5000);

            } else {
                messageDiv.classList.add('error');
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        })
        .catch(error => {
            console.error('Erro de Fetch:', error);
            messageDiv.innerHTML = 'Erro de conexão. Tente novamente.';
            messageDiv.classList.add('error');
            messageDiv.style.display = 'block';
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
    });
});
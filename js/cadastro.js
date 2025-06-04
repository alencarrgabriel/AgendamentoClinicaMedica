document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const cpfInput = document.getElementById('cpf');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const emailInput = document.getElementById('email');

    // Aplicar formatação aos campos
    cpfInput.addEventListener('input', () => {
        validationUtils.formatCPF(cpfInput);
    });

    phoneInput.addEventListener('input', () => {
        validationUtils.formatPhone(phoneInput);
    });

    // Validação em tempo real
    cpfInput.addEventListener('blur', () => {
        if (!validationUtils.validateCPF(cpfInput.value)) {
            validationUtils.showError(cpfInput, 'CPF inválido');
        } else {
            validationUtils.removeError(cpfInput);
        }
    });

    phoneInput.addEventListener('blur', () => {
        if (!validationUtils.validatePhone(phoneInput.value)) {
            validationUtils.showError(phoneInput, 'Telefone inválido');
        } else {
            validationUtils.removeError(phoneInput);
        }
    });

    emailInput.addEventListener('blur', () => {
        if (!validationUtils.validateEmail(emailInput.value)) {
            validationUtils.showError(emailInput, 'E-mail inválido');
        } else {
            validationUtils.removeError(emailInput);
        }
    });

    passwordInput.addEventListener('input', () => {
        if (!validationUtils.validatePassword(passwordInput.value)) {
            validationUtils.showError(passwordInput, 'A senha deve conter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais');
        } else {
            validationUtils.removeError(passwordInput);
        }
    });

    confirmPasswordInput.addEventListener('input', () => {
        if (confirmPasswordInput.value !== passwordInput.value) {
            validationUtils.showError(confirmPasswordInput, 'As senhas não coincidem');
        } else {
            validationUtils.removeError(confirmPasswordInput);
        }
    });

    // Submissão do formulário
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar todos os campos
        const isValidCPF = validationUtils.validateCPF(cpfInput.value);
        const isValidPhone = validationUtils.validatePhone(phoneInput.value);
        const isValidEmail = validationUtils.validateEmail(emailInput.value);
        const isValidPassword = validationUtils.validatePassword(passwordInput.value);
        const passwordsMatch = passwordInput.value === confirmPasswordInput.value;

        if (!isValidCPF) validationUtils.showError(cpfInput, 'CPF inválido');
        if (!isValidPhone) validationUtils.showError(phoneInput, 'Telefone inválido');
        if (!isValidEmail) validationUtils.showError(emailInput, 'E-mail inválido');
        if (!isValidPassword) validationUtils.showError(passwordInput, 'Senha inválida');
        if (!passwordsMatch) validationUtils.showError(confirmPasswordInput, 'As senhas não coincidem');

        if (!isValidCPF || !isValidPhone || !isValidEmail || !isValidPassword || !passwordsMatch) {
            return;
        }

        // Coletar dados do formulário
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: emailInput.value,
            cpf: cpfInput.value,
            phone: phoneInput.value,
            address: document.getElementById('address').value,
            gender: document.getElementById('gender').value,
            password: passwordInput.value
        };

        try {
            // Aqui você implementaria a chamada real para sua API de registro
            const response = await mockRegisterAPI(formData);
            
            if (response.success) {
                alert('Cadastro realizado com sucesso!');
                window.location.href = 'index.html';
            } else {
                alert(response.message || 'Erro ao realizar cadastro');
            }
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao realizar cadastro. Tente novamente mais tarde.');
        }
    });
});

// Mock API para simulação
const mockRegisterAPI = async (formData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simula validação de CPF/email já cadastrado
            if (formData.cpf === '123.456.789-00') {
                resolve({
                    success: false,
                    message: 'CPF já cadastrado'
                });
                return;
            }

            if (formData.email === 'teste@teste.com') {
                resolve({
                    success: false,
                    message: 'E-mail já cadastrado'
                });
                return;
            }

            resolve({
                success: true,
                message: 'Cadastro realizado com sucesso'
            });
        }, 1000);
    });
}; 
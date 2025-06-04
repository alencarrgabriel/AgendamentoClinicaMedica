// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const registerModal = document.getElementById('registerModal');
const registerForm = document.getElementById('registerForm');
const registerLink = document.getElementById('registerLink');
const closeBtn = document.querySelector('.close');
const forgotPasswordLink = document.getElementById('forgotPassword');

// Funções de validação
const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
        sum = sum + parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum = sum + parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
};

const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

// Formatação de campos
const formatCPF = (input) => {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = value;
};

const formatPhone = (input) => {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 2) value = `(${value.slice(0,2)}) ${value.slice(2)}`;
    if (value.length > 9) value = `${value.slice(0,9)}-${value.slice(9)}`;
    input.value = value;
};

// Event Listeners
document.getElementById('cpf').addEventListener('input', (e) => formatCPF(e.target));
document.getElementById('phone').addEventListener('input', (e) => formatPhone(e.target));

registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    registerModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
});

// Manipulação de formulários
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    try {
        // Aqui você implementaria a chamada real para sua API de autenticação
        const response = await mockLoginAPI(username, password);
        
        if (response.success) {
            if (rememberMe) {
                localStorage.setItem('userToken', response.token);
            } else {
                sessionStorage.setItem('userToken', response.token);
            }
            window.location.href = 'dashboard.html';
        } else {
            alert('Usuário ou senha inválidos');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login. Tente novamente mais tarde.');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        gender: document.getElementById('gender').value,
        password: document.getElementById('registerPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };
    
    // Validações
    if (!validateCPF(formData.cpf)) {
        alert('CPF inválido');
        return;
    }
    
    if (formData.password !== formData.confirmPassword) {
        alert('As senhas não coincidem');
        return;
    }
    
    if (!validatePassword(formData.password)) {
        alert('A senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais');
        return;
    }
    
    try {
        // Aqui você implementaria a chamada real para sua API de registro
        const response = await mockRegisterAPI(formData);
        
        if (response.success) {
            alert('Cadastro realizado com sucesso!');
            registerModal.style.display = 'none';
            loginForm.reset();
        } else {
            alert(response.message || 'Erro ao realizar cadastro');
        }
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        alert('Erro ao realizar cadastro. Tente novamente mais tarde.');
    }
});

forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = prompt('Digite seu e-mail para recuperar a senha:');
    if (email) {
        // Aqui você implementaria a chamada real para sua API de recuperação de senha
        alert('Se o e-mail estiver cadastrado, você receberá as instruções para recuperação de senha.');
    }
});

// Mock APIs para demonstração
const mockLoginAPI = async (username, password) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                token: 'mock-jwt-token'
            });
        }, 1000);
    });
};

const mockRegisterAPI = async (formData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Usuário registrado com sucesso'
            });
        }, 1000);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPassword');

    if (!loginForm) {
        console.error('Formulário de login não encontrado');
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        try {
            console.log('Tentando fazer login com:', username);
            const response = await mockLoginAPI(username, password);
            
            if (response.success) {
                console.log('Login bem-sucedido, redirecionando...');
                // Armazenar token de autenticação
                if (rememberMe) {
                    localStorage.setItem('userToken', response.token);
                } else {
                    sessionStorage.setItem('userToken', response.token);
                }
                
                // Redirecionar para a página de agendamento
                window.location.href = 'agendamento.html';
            } else {
                console.log('Login falhou:', response.message);
                alert(response.message || 'Usuário ou senha inválidos');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login. Tente novamente mais tarde.');
        }
    });

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = prompt('Digite seu e-mail para recuperar a senha:');
            
            if (email) {
                alert('Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.');
            }
        });
    }
});

// Mock API para simulação
const mockLoginAPI = async (username, password) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Verificando credenciais:', username);
            // Simular credenciais válidas para teste
            if (username === 'teste@teste.com' && password === 'senha123') {
                resolve({
                    success: true,
                    token: 'mock-jwt-token',
                    message: 'Login realizado com sucesso'
                });
            } else {
                resolve({
                    success: false,
                    message: 'Usuário ou senha inválidos'
                });
            }
        }, 1000);
    });
}; 
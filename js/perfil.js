document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const profileForm = document.getElementById('profileForm');
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    const logoutBtn = document.getElementById('logout');
    const cpfInput = document.getElementById('cpf');
    const phoneInput = document.getElementById('phone');
    const cepInput = document.getElementById('cep');

    // Carregar dados do perfil
    loadProfileData();

    // Event Listeners
    profileForm.addEventListener('submit', handleProfileSubmit);
    changeAvatarBtn.addEventListener('click', handleAvatarChange);
    logoutBtn.addEventListener('click', handleLogout);
    cepInput.addEventListener('blur', handleCepSearch);

    // Formatação de campos
    cpfInput.addEventListener('input', () => {
        let value = cpfInput.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        cpfInput.value = value;
    });

    phoneInput.addEventListener('input', () => {
        let value = phoneInput.value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        phoneInput.value = value;
    });

    cepInput.addEventListener('input', () => {
        let value = cepInput.value.replace(/\D/g, '');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        cepInput.value = value;
    });

    function loadProfileData() {
        // Carregar dados do localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Preencher campos do formulário
        if (Object.keys(userData).length > 0) {
            document.getElementById('profileName').textContent = userData.fullName || 'Nome do Usuário';
            document.getElementById('profileEmail').textContent = userData.email || 'email@exemplo.com';
            document.getElementById('userName').textContent = userData.fullName || 'Nome do Usuário';

            for (const [key, value] of Object.entries(userData)) {
                const input = document.getElementById(key);
                if (input) {
                    input.value = value;
                }
            }
        } else {
            // Dados mockados para demonstração
            const mockData = {
                fullName: 'João da Silva',
                email: 'joao.silva@email.com',
                cpf: '123.456.789-00',
                phone: '(11) 98765-4321',
                birthdate: '1990-01-01',
                gender: 'M',
                cep: '01234-567',
                street: 'Rua Exemplo',
                number: '123',
                complement: 'Apto 45',
                neighborhood: 'Centro',
                city: 'São Paulo',
                state: 'SP'
            };

            // Preencher campos com dados mockados
            document.getElementById('profileName').textContent = mockData.fullName;
            document.getElementById('profileEmail').textContent = mockData.email;
            document.getElementById('userName').textContent = mockData.fullName;

            for (const [key, value] of Object.entries(mockData)) {
                const input = document.getElementById(key);
                if (input) {
                    input.value = value;
                }
            }
        }
    }

    async function handleCepSearch() {
        const cep = cepInput.value.replace(/\D/g, '');
        
        if (cep.length !== 8) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                document.getElementById('street').value = data.logradouro;
                document.getElementById('neighborhood').value = data.bairro;
                document.getElementById('city').value = data.localidade;
                document.getElementById('state').value = data.uf;
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        }
    }

    async function handleProfileSubmit(e) {
        e.preventDefault();

        // Validar campos obrigatórios
        const requiredFields = profileForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        if (!isValid) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Validar senha se estiver sendo alterada
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword || confirmPassword || currentPassword) {
            if (!currentPassword) {
                alert('Digite sua senha atual para alterá-la.');
                return;
            }
            if (newPassword !== confirmPassword) {
                alert('As senhas não coincidem.');
                return;
            }
            if (newPassword.length < 6) {
                alert('A nova senha deve ter pelo menos 6 caracteres.');
                return;
            }
        }

        try {
            // Coletar dados do formulário
            const formData = new FormData(profileForm);
            const userData = Object.fromEntries(formData.entries());

            // Remover campos de senha se não estiverem sendo alterados
            if (!currentPassword) {
                delete userData.currentPassword;
                delete userData.newPassword;
                delete userData.confirmPassword;
            }

            // Salvar no localStorage
            localStorage.setItem('userData', JSON.stringify(userData));

            // Atualizar exibição
            document.getElementById('profileName').textContent = userData.fullName;
            document.getElementById('profileEmail').textContent = userData.email;
            document.getElementById('userName').textContent = userData.fullName;

            alert('Perfil atualizado com sucesso!');

            // Limpar campos de senha
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';

        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            alert('Erro ao salvar as alterações. Tente novamente.');
        }
    }

    function handleAvatarChange() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.querySelector('.profile-avatar').src = e.target.result;
                    localStorage.setItem('userAvatar', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        };

        input.click();
    }

    function handleLogout(e) {
        e.preventDefault();
        localStorage.removeItem('userToken');
        sessionStorage.removeItem('userToken');
        window.location.href = 'index.html';
    }
}); 
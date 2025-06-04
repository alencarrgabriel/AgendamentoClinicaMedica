document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // Carregar consultas iniciais
    carregarConsultas();
});

// Função para carregar consultas
async function carregarConsultas() {
    try {
        const consultas = await mockBuscarConsultas();
        exibirConsultas(consultas);
    } catch (error) {
        console.error('Erro ao carregar consultas:', error);
        alert('Erro ao carregar consultas. Tente novamente mais tarde.');
    }
}

// Função para filtrar consultas
async function filtrarConsultas() {
    const status = document.getElementById('filtroStatus').value;
    const data = document.getElementById('filtroData').value;

    try {
        const consultas = await mockBuscarConsultas();
        
        // Aplicar filtros
        const consultasFiltradas = consultas.filter(consulta => {
            const matchStatus = !status || consulta.status === status;
            const matchData = !data || consulta.data === data;
            return matchStatus && matchData;
        });

        exibirConsultas(consultasFiltradas);
    } catch (error) {
        console.error('Erro ao filtrar consultas:', error);
        alert('Erro ao filtrar consultas. Tente novamente mais tarde.');
    }
}

// Função para exibir consultas na tela
function exibirConsultas(consultas) {
    const listaConsultas = document.getElementById('listaConsultas');
    listaConsultas.innerHTML = '';

    if (consultas.length === 0) {
        listaConsultas.innerHTML = '<p>Nenhuma consulta encontrada.</p>';
        return;
    }

    consultas.forEach(consulta => {
        const consultaElement = document.createElement('div');
        consultaElement.className = 'consulta-item';
        consultaElement.innerHTML = `
            <h3>${consulta.especialidade}</h3>
            <p class="consulta-info">Médico: ${consulta.medico}</p>
            <p class="consulta-info">Data: ${formatarData(consulta.data)}</p>
            <p class="consulta-info">Horário: ${consulta.horario}</p>
            <p class="consulta-info">Status: ${consulta.status}</p>
            ${consulta.status === 'agendada' ? `
                <button onclick="cancelarConsulta(${consulta.id})">Cancelar</button>
            ` : ''}
        `;
        listaConsultas.appendChild(consultaElement);
    });
}

// Função para cancelar consulta
async function cancelarConsulta(id) {
    if (!confirm('Tem certeza que deseja cancelar esta consulta?')) {
        return;
    }

    try {
        await mockCancelarConsulta(id);
        alert('Consulta cancelada com sucesso!');
        carregarConsultas();
    } catch (error) {
        console.error('Erro ao cancelar consulta:', error);
        alert('Erro ao cancelar consulta. Tente novamente mais tarde.');
    }
}

// Função auxiliar para formatar data
function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Mock API
function mockBuscarConsultas() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    especialidade: 'Cardiologia',
                    medico: 'Dr. Carlos Silva',
                    data: '2024-03-20',
                    horario: '14:30',
                    status: 'agendada'
                },
                {
                    id: 2,
                    especialidade: 'Clínico Geral',
                    medico: 'Dra. Maria Santos',
                    data: '2024-03-15',
                    horario: '09:00',
                    status: 'realizada'
                },
                {
                    id: 3,
                    especialidade: 'Ortopedia',
                    medico: 'Dr. João Lima',
                    data: '2024-03-25',
                    horario: '11:00',
                    status: 'agendada'
                }
            ]);
        }, 500);
    });
}

function mockCancelarConsulta(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 500);
    });
} 
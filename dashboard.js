// Elementos do DOM
const appointmentModal = document.getElementById('appointmentModal');
const newAppointmentBtn = document.querySelector('.new-appointment-btn');
const closeBtn = document.querySelector('.close');
const appointmentForm = document.getElementById('appointmentForm');
const appointmentsList = document.querySelector('.appointments-list');
const specialtySelect = document.getElementById('specialty');
const doctorSelect = document.getElementById('doctor');
const timeSelect = document.getElementById('time');
const dateInput = document.getElementById('date');
const logoutBtn = document.getElementById('logout');

// Dados mockados
const mockDoctors = {
    ginecologista: [
        { id: 1, name: 'Dra. Ana Silva' },
        { id: 2, name: 'Dra. Maria Santos' }
    ],
    urologista: [
        { id: 3, name: 'Dr. João Oliveira' },
        { id: 4, name: 'Dr. Pedro Costa' }
    ],
    cardiologista: [
        { id: 5, name: 'Dr. Carlos Souza' },
        { id: 6, name: 'Dra. Paula Lima' }
    ],
    clinico: [
        { id: 7, name: 'Dr. Roberto Alves' },
        { id: 8, name: 'Dra. Luciana Ferreira' }
    ]
};

const mockAppointments = [
    {
        id: 1,
        specialty: 'Cardiologista',
        doctor: 'Dr. Carlos Souza',
        date: '2024-03-20',
        time: '14:30',
        status: 'Agendado'
    },
    {
        id: 2,
        specialty: 'Clínico Geral',
        doctor: 'Dra. Luciana Ferreira',
        date: '2024-03-25',
        time: '10:00',
        status: 'Agendado'
    }
];

// Funções auxiliares
const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};

const generateTimeSlots = () => {
    const times = [];
    for (let hour = 8; hour <= 17; hour++) {
        times.push(`${hour.toString().padStart(2, '0')}:00`);
        times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return times;
};

const populateTimeSlots = () => {
    const times = generateTimeSlots();
    timeSelect.innerHTML = '<option value="">Selecione um horário</option>';
    times.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
};

const populateDoctors = (specialty) => {
    const doctors = mockDoctors[specialty] || [];
    doctorSelect.innerHTML = '<option value="">Selecione um médico</option>';
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = doctor.name;
        doctorSelect.appendChild(option);
    });
};

const createAppointmentCard = (appointment) => {
    const card = document.createElement('div');
    card.className = 'appointment-card';
    card.innerHTML = `
        <h3>${appointment.specialty}</h3>
        <p class="appointment-info">Médico: ${appointment.doctor}</p>
        <p class="appointment-info">Data: ${formatDate(appointment.date)}</p>
        <p class="appointment-info">Horário: ${appointment.time}</p>
        <p class="appointment-info">Status: ${appointment.status}</p>
        <div class="appointment-actions">
            <button class="action-button reschedule-btn" data-id="${appointment.id}">Remarcar</button>
            <button class="action-button cancel-btn" data-id="${appointment.id}">Cancelar</button>
        </div>
    `;
    return card;
};

const loadAppointments = () => {
    appointmentsList.innerHTML = '';
    mockAppointments.forEach(appointment => {
        const card = createAppointmentCard(appointment);
        appointmentsList.appendChild(card);
    });
};

// Event Listeners
newAppointmentBtn.addEventListener('click', () => {
    appointmentModal.style.display = 'block';
    populateTimeSlots();
});

closeBtn.addEventListener('click', () => {
    appointmentModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === appointmentModal) {
        appointmentModal.style.display = 'none';
    }
});

specialtySelect.addEventListener('change', (e) => {
    populateDoctors(e.target.value);
});

appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        specialty: specialtySelect.options[specialtySelect.selectedIndex].text,
        doctor: doctorSelect.options[doctorSelect.selectedIndex].text,
        date: dateInput.value,
        time: timeSelect.value,
        notes: document.getElementById('notes').value
    };

    try {
        // Aqui você implementaria a chamada real para sua API
        const response = await mockScheduleAppointment(formData);
        
        if (response.success) {
            alert('Consulta agendada com sucesso!');
            appointmentModal.style.display = 'none';
            appointmentForm.reset();
            loadAppointments(); // Recarrega a lista de agendamentos
        } else {
            alert(response.message || 'Erro ao agendar consulta');
        }
    } catch (error) {
        console.error('Erro ao agendar consulta:', error);
        alert('Erro ao agendar consulta. Tente novamente mais tarde.');
    }
});

appointmentsList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('cancel-btn')) {
        const appointmentId = e.target.dataset.id;
        if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
            try {
                // Aqui você implementaria a chamada real para sua API
                const response = await mockCancelAppointment(appointmentId);
                if (response.success) {
                    alert('Consulta cancelada com sucesso!');
                    loadAppointments(); // Recarrega a lista de agendamentos
                }
            } catch (error) {
                console.error('Erro ao cancelar consulta:', error);
                alert('Erro ao cancelar consulta. Tente novamente mais tarde.');
            }
        }
    } else if (e.target.classList.contains('reschedule-btn')) {
        const appointmentId = e.target.dataset.id;
        // Implementar lógica de remarcação
        alert('Funcionalidade de remarcação em desenvolvimento');
    }
});

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Limpar dados da sessão
    localStorage.removeItem('userToken');
    sessionStorage.removeItem('userToken');
    window.location.href = 'index.html';
});

// Mock APIs
const mockScheduleAppointment = async (formData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            mockAppointments.push({
                id: mockAppointments.length + 1,
                ...formData,
                status: 'Agendado'
            });
            resolve({
                success: true,
                message: 'Consulta agendada com sucesso'
            });
        }, 1000);
    });
};

const mockCancelAppointment = async (appointmentId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = mockAppointments.findIndex(app => app.id === parseInt(appointmentId));
            if (index !== -1) {
                mockAppointments.splice(index, 1);
            }
            resolve({
                success: true,
                message: 'Consulta cancelada com sucesso'
            });
        }, 1000);
    });
};

// Verificação de autenticação
const checkAuth = () => {
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    if (!token) {
        window.location.href = 'index.html';
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadAppointments();
    
    // Definir data mínima como hoje
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}); 
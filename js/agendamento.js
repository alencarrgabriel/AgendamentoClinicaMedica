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
    ],
    ortopedista: [
        { id: 9, name: 'Dr. Ricardo Silva' },
        { id: 10, name: 'Dra. Fernanda Lima' }
    ],
    dermatologista: [
        { id: 11, name: 'Dra. Camila Costa' },
        { id: 12, name: 'Dr. Marcelo Santos' }
    ]
};

// Elementos do DOM
const appointmentForm = document.getElementById('appointmentForm');
const specialtySelect = document.getElementById('specialty');
const doctorSelect = document.getElementById('doctor');
const dateInput = document.getElementById('appointmentDate');
const timeSelect = document.getElementById('appointmentTime');
const appointmentsList = document.getElementById('appointmentsList');
const logoutBtn = document.getElementById('logout');

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
    timeSelect.innerHTML = '<option value="">Selecione um horário</option>';
    timeSelect.disabled = true;

    if (!dateInput.value) return;

    const times = generateTimeSlots();
    times.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
    timeSelect.disabled = false;
};

const populateDoctors = (specialty) => {
    doctorSelect.innerHTML = '<option value="">Selecione um médico</option>';
    doctorSelect.disabled = true;

    if (!specialty) return;

    const doctors = mockDoctors[specialty] || [];
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = doctor.name;
        doctorSelect.appendChild(option);
    });
    doctorSelect.disabled = false;
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

// Event Listeners
specialtySelect.addEventListener('change', () => {
    populateDoctors(specialtySelect.value);
});

dateInput.addEventListener('change', () => {
    populateTimeSlots();
});

appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        specialty: specialtySelect.options[specialtySelect.selectedIndex].text,
        doctor: doctorSelect.options[doctorSelect.selectedIndex].text,
        date: dateInput.value,
        time: timeSelect.value,
        reason: document.getElementById('reason').value
    };

    try {
        const response = await mockScheduleAppointment(formData);
        
        if (response.success) {
            alert('Consulta agendada com sucesso!');
            appointmentForm.reset();
            loadAppointments();
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
                const response = await mockCancelAppointment(appointmentId);
                if (response.success) {
                    alert('Consulta cancelada com sucesso!');
                    loadAppointments();
                }
            } catch (error) {
                console.error('Erro ao cancelar consulta:', error);
                alert('Erro ao cancelar consulta. Tente novamente mais tarde.');
            }
        }
    } else if (e.target.classList.contains('reschedule-btn')) {
        const appointmentId = e.target.dataset.id;
        alert('Funcionalidade de remarcação em desenvolvimento');
    }
});

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('userToken');
    sessionStorage.removeItem('userToken');
    window.location.href = 'index.html';
});

// Mock APIs
const mockScheduleAppointment = async (formData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
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
    
    // Definir data mínima como hoje
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}); 
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

document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const appointmentForm = document.getElementById('appointmentForm');
    const specialtySelect = document.getElementById('specialty');
    const doctorSelect = document.getElementById('doctor');
    const dateInput = document.getElementById('appointmentDate');
    const timeSelect = document.getElementById('appointmentTime');
    const appointmentsList = document.getElementById('appointmentsList');
    const logoutBtn = document.getElementById('logout');

    // Definir data mínima como hoje
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // Mock de médicos por especialidade
    const doctorsBySpecialty = {
        'ginecologista': ['Dra. Maria Silva', 'Dra. Ana Santos'],
        'urologista': ['Dr. João Costa', 'Dr. Pedro Lima'],
        'cardiologista': ['Dr. Carlos Oliveira', 'Dra. Paula Souza'],
        'clinico': ['Dr. Roberto Alves', 'Dra. Camila Lima'],
        'ortopedista': ['Dr. Marcos Santos', 'Dra. Julia Costa'],
        'dermatologista': ['Dra. Beatriz Oliveira', 'Dr. Ricardo Silva']
    };

    // Mock de horários disponíveis
    const availableTimes = [
        '08:00', '09:00', '10:00', '11:00',
        '14:00', '15:00', '16:00', '17:00'
    ];

    // Event Listeners
    specialtySelect.addEventListener('change', updateDoctors);
    dateInput.addEventListener('change', updateTimes);
    
    function updateDoctors() {
        const specialty = specialtySelect.value;
        doctorSelect.innerHTML = '<option value="">Selecione um médico</option>';
        doctorSelect.disabled = !specialty;

        if (specialty) {
            doctorsBySpecialty[specialty].forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor;
                option.textContent = doctor;
                doctorSelect.appendChild(option);
            });
        }
    }

    function updateTimes() {
        const selectedDate = dateInput.value;
        timeSelect.innerHTML = '<option value="">Selecione um horário</option>';
        timeSelect.disabled = !selectedDate;

        if (selectedDate) {
            availableTimes.forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                timeSelect.appendChild(option);
            });
        }
    }

    // Carregar consultas existentes
    loadAppointments();

    // Manipular envio do formulário
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const appointment = {
            specialty: specialtySelect.value,
            doctor: doctorSelect.value,
            date: dateInput.value,
            time: timeSelect.value,
            reason: document.getElementById('reason').value,
            status: 'scheduled',
            id: Date.now().toString()
        };

        try {
            // Salvar no localStorage
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            appointments.push(appointment);
            localStorage.setItem('appointments', JSON.stringify(appointments));

            // Atualizar a lista de consultas
            loadAppointments();

            // Limpar formulário
            appointmentForm.reset();
            doctorSelect.disabled = true;
            timeSelect.disabled = true;

            alert('Consulta agendada com sucesso!');
        } catch (error) {
            console.error('Erro ao agendar consulta:', error);
            alert('Erro ao agendar consulta. Tente novamente mais tarde.');
        }
    });

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('userToken');
        sessionStorage.removeItem('userToken');
        window.location.href = 'index.html';
    });

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    function loadAppointments() {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const currentAppointments = appointments.filter(app => app.status === 'scheduled');
        
        appointmentsList.innerHTML = '';

        if (currentAppointments.length === 0) {
            appointmentsList.innerHTML = `
                <div class="no-appointments">
                    <p>Nenhuma consulta agendada</p>
                </div>
            `;
            return;
        }

        currentAppointments.forEach(appointment => {
            const appointmentElement = document.createElement('div');
            appointmentElement.className = 'appointment-item';
            appointmentElement.innerHTML = `
                <div class="appointment-info">
                    <h3>Consulta com ${appointment.doctor}</h3>
                    <div class="appointment-details">
                        <p><i class="fas fa-stethoscope"></i> ${appointment.specialty}</p>
                        <p><i class="fas fa-calendar"></i> ${formatDate(appointment.date)}</p>
                        <p><i class="fas fa-clock"></i> ${appointment.time}</p>
                        ${appointment.reason ? `<p><i class="fas fa-comment"></i> ${appointment.reason}</p>` : ''}
                    </div>
                </div>
                <div class="appointment-actions">
                    <button onclick="cancelAppointment('${appointment.id}')" class="cancel-appointment-btn">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            `;
            appointmentsList.appendChild(appointmentElement);
        });
    }

    // Função global para cancelar consulta
    window.cancelAppointment = function(appointmentId) {
        if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            const appointmentIndex = appointments.findIndex(app => app.id === appointmentId);
            
            if (appointmentIndex !== -1) {
                appointments[appointmentIndex].status = 'cancelled';
                localStorage.setItem('appointments', JSON.stringify(appointments));
                loadAppointments();
            }
        }
    };
}); 
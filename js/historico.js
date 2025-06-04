document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const historyList = document.getElementById('historyList');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');

    // Carregar histórico inicial
    loadHistory();

    // Adicionar listeners para os filtros
    statusFilter.addEventListener('change', loadHistory);
    dateFilter.addEventListener('change', loadHistory);

    function loadHistory() {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const status = statusFilter.value;
        const date = dateFilter.value;

        // Filtrar consultas
        let filteredAppointments = appointments;
        if (status !== 'all') {
            filteredAppointments = filteredAppointments.filter(app => app.status === status);
        }
        if (date) {
            filteredAppointments = filteredAppointments.filter(app => app.date === date);
        }

        // Ordenar por data (mais recentes primeiro)
        filteredAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Limpar lista atual
        historyList.innerHTML = '';

        if (filteredAppointments.length === 0) {
            historyList.innerHTML = `
                <div class="no-appointments">
                    <i class="fas fa-calendar-times"></i>
                    <p>Nenhuma consulta encontrada</p>
                </div>
            `;
            return;
        }

        // Renderizar consultas
        filteredAppointments.forEach(appointment => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const statusClass = `status-${appointment.status}`;
            const statusText = {
                'scheduled': 'Agendada',
                'completed': 'Realizada',
                'cancelled': 'Cancelada'
            }[appointment.status];

            historyItem.innerHTML = `
                <div class="history-info">
                    <h3>Consulta com Dr(a). ${appointment.doctor}</h3>
                    <div class="history-details">
                        <div class="history-detail-item">
                            <i class="fas fa-stethoscope"></i>
                            <span>${appointment.specialty}</span>
                        </div>
                        <div class="history-detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>${formatDate(appointment.date)}</span>
                        </div>
                        <div class="history-detail-item">
                            <i class="fas fa-clock"></i>
                            <span>${appointment.time}</span>
                        </div>
                        ${appointment.reason ? `
                        <div class="history-detail-item">
                            <i class="fas fa-comment"></i>
                            <span>${appointment.reason}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="history-status ${statusClass}">
                    ${statusText}
                </div>
            `;

            historyList.appendChild(historyItem);
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}); 
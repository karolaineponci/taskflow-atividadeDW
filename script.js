const form = document.getElementById('formTarefa');
const listaContainer = document.getElementById('listaTarefas');

const getTarefas = () => JSON.parse(localStorage.getItem('tarefas')) || [];

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const tarefas = getTarefas();
        const novaTarefa = {
            id: Date.now(),
            nome: document.getElementById('nometarefa').value,
            descricao: document.getElementById('descricaotarefa').value,
            data: document.getElementById('data').value,
            prioridade: document.getElementById('prioridade').value,
            status: document.querySelector('input[name="status"]:checked').value
        };

        tarefas.push(novaTarefa);
        localStorage.setItem('tarefas', JSON.stringify(tarefas));

        const alerta = document.getElementById('alertaSucesso');
        if (alerta) {
            alerta.classList.remove('d-none');
            form.reset();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => { window.location.href = 'tarefas.html'; }, 2000);
        } else {
            window.location.href = 'tarefas.html';
        }
    });
}

const renderizarTarefas = (filtro = 'todas') => {
    if (!listaContainer) return;
    
    const tarefas = getTarefas();
    listaContainer.innerHTML = '';

    const tarefasFiltradas = tarefas.filter(t => {
    if (filtro === 'todas') return true;

    const statusTarefa = t.status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const statusFiltro = filtro.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    return statusTarefa === statusFiltro;
});

    if (tarefasFiltradas.length === 0) {
        listaContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="p-5 border rounded bg-white shadow-sm">
                    <h4 class="text-muted mb-4">Sua lista está vazia!</h4>
                    <p class="text-secondary mb-4">Comece agora a organizar seu dia criando sua primeira tarefa.</p>
                    <a href="cadastro.html" class="btn btn-salvar text-white px-4 py-2">
                        Criar Nova Tarefa
                    </a>
                </div>
            </div>`;
        return;
    }

    tarefasFiltradas.forEach(tarefa => {
        const dataBr = tarefa.data.split('-').reverse().join('/');

        let corPrioridade = '';
        switch (tarefa.prioridade) {
            case 'Alta': corPrioridade = 'text-danger'; break;   
            case 'Média': corPrioridade = 'text-warning'; break; 
            case 'Baixa': corPrioridade = 'text-success'; break; 
            default: corPrioridade = 'text-muted';
        }

        const bordaStatus = tarefa.status === 'Concluída' ? 'border-success' : 'border-warning';
        
        listaContainer.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-start border-4 ${bordaStatus}">
                    <div class="card-body">
                        <h5 class="fw-bold text-dark">${tarefa.nome}</h5>
                        <p class="small text-secondary mb-3">${tarefa.descricao}</p>
                        
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <span class="small fw-bold ${corPrioridade}">
                                <i class="bi bi-circle-fill me-1" style="font-size: 8px;"></i>${tarefa.prioridade}
                            </span>
                            <span class="badge bg-light text-dark border fw-normal">${dataBr}</span>
                        </div>
                    </div>
                    <div class="card-footer bg-white border-0 d-flex gap-2 pb-3">
                        <button onclick="alternarStatus(${tarefa.id})" class="btn btn-sm btn-outline-success flex-grow-1">
                            ${tarefa.status === 'Concluída' ? 'Reabrir' : 'Concluir'}
                        </button>
                        <button onclick="excluirTarefa(${tarefa.id})" class="btn btn-sm btn-outline-danger">
                             Excluir
                        </button>
                    </div>
                </div>
            </div>`;
    });
};

window.alternarStatus = (id) => {
    let tarefas = getTarefas();
    const index = tarefas.findIndex(t => t.id === id);
    tarefas[index].status = tarefas[index].status === 'Concluída' ? 'Pendente' : 'Concluída';
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    renderizarTarefas();
};

window.excluirTarefa = (id) => {
    if (confirm('Deseja excluir esta tarefa?')) {
        const tarefas = getTarefas().filter(t => t.id !== id);
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
        renderizarTarefas();
    }
};

window.filtrarTarefas = (tipo) => {
    const botoes = document.querySelectorAll('.btn-group .btn');
    botoes.forEach(btn => btn.classList.remove('active'));

    if (window.event) {
        window.event.target.classList.add('active');
    }

    renderizarTarefas(tipo);
};

document.addEventListener('DOMContentLoaded', () => renderizarTarefas());
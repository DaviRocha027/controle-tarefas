var items = [];

document.querySelector('input[type=submit]')
.addEventListener("click", () => {
    var nometarefa = document.querySelector('input[name=nome_tarefa]'); 
    var datatarefa = document.querySelector('input[name=calendario]');
    var horatarefa = document.querySelector('input[name=horario]');

    if(nometarefa.value && datatarefa.value && horatarefa.value) {
        var tarefa = {
            nome: nometarefa.value,
            data: datatarefa.value,
            horario: horatarefa.value,
            concluida: false
        };
        items.push(tarefa);
        adicionarTarefaNaLista(tarefa);
        nometarefa.value = '';
        datatarefa.value = '';
        horatarefa.value = '';
    }
});

function adicionarTarefaNaLista(tarefa) {
    var listaTarefas = document.querySelector('.lista-tarefas');
    var div = document.createElement('div');
    div.classList.add('lista-produto-single');

    // Formatando a data para o modelo brasileiro
    var dataFormatada = new Date(tarefa.data).toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
    });

    // Definindo a cor do texto com base no status da tarefa
    var corTexto = tarefa.concluida ? 'green' : 'black';

    div.innerHTML = `
        <h3 class="tarefa-nome" style="color: ${corTexto};">${tarefa.nome}</h3>
        <p>Data: ${dataFormatada} </p>
        <p>|Horário: ${tarefa.horario} </p>
        <button name="concluir_tarefa" onclick="concluirTarefa('${tarefa.nome}', this)">Concluir</button>
    `;
    listaTarefas.appendChild(div);
}

function concluirTarefa(nome, botao) {
    var divTarefa = botao.parentElement;
    var tituloTarefa = divTarefa.querySelector('.tarefa-nome');

    // Mudando a cor da letra
    tituloTarefa.style.color = 'green';

    // Atualizando o estado da tarefa no array `items`
    items = items.map(tarefa => 
        tarefa.nome === nome ? { ...tarefa, concluida: true } : tarefa
    );
}

document.querySelector('button[name=consultar]')
.addEventListener("click", (e) => {
    e.preventDefault();
    var mesSelecionado = document.querySelector('input[name=mes]').value;
    var listaTarefas = document.querySelector('.lista-tarefas');
    listaTarefas.innerHTML = '';  // Limpa a lista antes de adicionar os itens filtrados

    items.forEach(tarefa => {
        if(tarefa.data.startsWith(mesSelecionado)) {
            adicionarTarefaNaLista(tarefa);
        }
    });
});








document.querySelector('button[name=gerar_excel]')
.addEventListener("click", () => {
    const wb = XLSX.utils.book_new();
    const ws_data = [["Tarefa", "Data", "Horário", "Status"]]; // Cabeçalhos das colunas

    const dataHoje = new Date().toISOString().split('T')[0];

    items.forEach(tarefa => {
        if (tarefa.data === dataHoje) {
            const status = tarefa.concluida ? 'Concluída' : 'Pendentes';
            ws_data.push([tarefa.nome, tarefa.data, tarefa.horario, status]);
        }
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "Tarefas do Dia");
    XLSX.writeFile(wb, 'tarefas_do_dia.xlsx');
});


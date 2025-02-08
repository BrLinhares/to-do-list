document.addEventListener("DOMContentLoaded", () => {
    // Seleciona os elementos do HTML
    const taskInput = document.getElementById("taskInput"); // Campo de texto da tarefa
    const startTimeInput = document.getElementById("startTimeInput"); // Campo de horário de início
    const endTimeInput = document.getElementById("endTimeInput"); // Campo de horário de fim
    const addTaskBtn = document.getElementById("addTaskBtn"); // Botão de adicionar tarefa
    const taskList = document.getElementById("taskList"); // Lista de tarefas
    const filterSelect = document.getElementById("filter"); // Filtro de tarefas (todas, concluídas, pendentes)


    console.log(taskInput, startTimeInput, endTimeInput);

    // Carrega as tarefas salvas no LocalStorage ao iniciar
    loadTasks();

    // Adiciona eventos aos botões
    addTaskBtn.addEventListener("click", addTask);
    filterSelect.addEventListener("change", filterTasks);

    // Função para adicionar uma nova tarefa
    function addTask() {
        const taskText = taskInput.value.trim();
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;

        // Valida se os campos foram preenchidos
        if (taskText === "" || startTime === "" || endTime === "") {
            alert("Preencha todos os campos antes de adicionar a tarefa!");
            return;
        }

        // Obtém a data atual formatada
        const now = new Date();
        const date = formatDate(now);

        // Cria um objeto com os dados da tarefa
        const taskData = {
            text: taskText,
            completed: false, // Por padrão, a tarefa não está concluída
            startTime: startTime,
            endTime: endTime,
            date: date
        };

        // Cria o elemento da tarefa e adiciona à lista
        const taskItem = createTaskElement(taskData);
        taskList.appendChild(taskItem);

        // Salva a lista de tarefas no LocalStorage
        saveTasks();

        // Limpa os campos de entrada após adicionar a tarefa
        taskInput.value = "";
        startTimeInput.value = "";
        endTimeInput.value = "";
    }

    // Função para criar um elemento de tarefa no HTML
    function createTaskElement(taskData) {
        const li = document.createElement("li");
        li.classList.add("task-item");

        // Define o conteúdo da tarefa com nome, data, horário de início e fim
        li.innerHTML = `
            <strong>${taskData.text}</strong> <br>
            📅 <strong>Data:</strong> ${taskData.date} <br>
            ⏳ <strong>Início:</strong> ${taskData.startTime} <br>
            ✅ <strong>Fim:</strong> ${taskData.endTime}
        `;

        // Adiciona evento para marcar/desmarcar a tarefa como concluída
        li.addEventListener("click", () => {
            li.classList.toggle("completed");
            taskData.completed = li.classList.contains("completed");
            saveTasks();
            filterTasks(); // Atualiza o filtro após marcar a tarefa
        });

        // Botão de excluir tarefa
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");

        // Evento para remover a tarefa ao clicar no botão
        deleteBtn.addEventListener("click", () => {
            li.remove();
            saveTasks();
            filterTasks();
        });

        li.appendChild(deleteBtn);
        return li;
    }

    // Função para salvar as tarefas no LocalStorage
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll(".task-item").forEach(li => {
            const [taskText, dateText, startText, endText] = li.innerText.split("\n");

            const date = dateText.replace("📅 Data: ", "").trim();
            const startTime = startText.replace("⏳ Início: ", "").trim();
            const endTime = endText.replace("✅ Fim: ", "").trim();

            tasks.push({
                text: taskText.trim(),
                completed: li.classList.contains("completed"),
                startTime: startTime,
                endTime: endTime,
                date: date
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks)); // Salva no LocalStorage
    }

    // Função para carregar as tarefas salvas no LocalStorage ao iniciar a página
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            const taskItem = createTaskElement(task);
            if (task.completed) taskItem.classList.add("completed");
            taskList.appendChild(taskItem);
        });
    }

    // Função para filtrar as tarefas com base na opção selecionada
    function filterTasks() {
        const filter = filterSelect.value;
        document.querySelectorAll(".task-item").forEach(li => {
            switch (filter) {
                case "all":
                    li.style.display = "flex";
                    break;
                case "completed":
                    li.style.display = li.classList.contains("completed") ? "flex" : "none";
                    break;
                case "pending":
                    li.style.display = !li.classList.contains("completed") ? "flex" : "none";
                    break;
            }
        });
    }

    // Função para formatar a data no formato DD/MM/AAAA
    function formatDate(date) {
        return date.toLocaleDateString("pt-BR");
    }
});

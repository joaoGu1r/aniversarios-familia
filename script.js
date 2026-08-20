// 📋 LISTA FIXA DE ANIVERSARIANTES
// Observação: Os meses em JavaScript iniciam em 0 (0 = Janeiro, 10 = Novembro, 11 = Dezembro)
const baseBirthdays = [
    { month: 0, day: 8, name: "Luciano", emoji: "👨", relation: "Filho" },  
    { month: 1, day: 10, name: "Daniel", emoji: "👦", relation: "Neto" },
    { month: 2, day: 5, name: "Miguel", emoji: "👶", relation: "Neto" },
    { month: 3, day: 3, name: "Von", emoji: "🧑", relation: "Neto" },
    { month: 4, day: 3, name: "Rafael", emoji: "👨", relation: "Neto" },
    { month: 5, day: 16, name: "Alisson", emoji: "👨", relation: "Neto" },
    { month: 6, day: 16, name: "Carmem", emoji: "👩", relation: "Filha" },
    { month: 7, day: 11, name: "Seve", emoji: "🧓", relation: "Filho" },
    { month: 8, day: 30, name: "Maria", emoji: "👩", relation: "Matriarca" },
    { month: 9, day: 7, name: "Luan", emoji: "🧑", relation: "Bisneto" },
    { month: 10, day: 3, name: "Guilherme", emoji: "👨", relation: "Bisneto" },
    { month: 10, day: 3, name: "Pedro", emoji: "👨", relation: "Bisneto" },
    { month: 11, day: 10, name: "Josina", emoji: "👩", relation: "Esposa" }
];

// Nomes dos 12 meses do ano
const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// 🎯 Função para verificar se a data é exatamente hoje
function isToday(month, day) {
    const today = new Date();
    return today.getMonth() === Number(month) && today.getDate() === Number(day);
}

// 🔍 Função para verificar se o aniversário está próximo (nos próximos 7 dias)
function isSoon(month, day) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let birthdayDate = new Date(today.getFullYear(), Number(month), Number(day));
    if (birthdayDate < today) {
        birthdayDate.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = birthdayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
}

// 📊 Atualiza as métricas da barra superior
function updateStats() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // 1. Total de pessoas cadastradas na lista
    document.getElementById('totalPessoas').textContent = baseBirthdays.length;
    
    // 2. Total de pessoas que fazem aniversário neste mês
    const thisMonthList = baseBirthdays.filter(b => Number(b.month) === currentMonth);
    document.getElementById('aniversariosMes').textContent = thisMonthList.length;
    
    // 3. Cálculo do próximo aniversário mais próximo
    let minDiffDays = Infinity;
    let nextPerson = null;
    
    baseBirthdays.forEach(b => {
        let bDate = new Date(today.getFullYear(), Number(b.month), Number(b.day));
        if (bDate < today) {
            bDate.setFullYear(today.getFullYear() + 1);
        }
        const diffDays = Math.ceil((bDate - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 0 && diffDays < minDiffDays) {
            minDiffDays = diffDays;
            nextPerson = b;
        }
    });
    
    const proximoEl = document.getElementById('proximoAniversario');
    if (nextPerson) {
        proximoEl.textContent = minDiffDays === 0 ? 'Hoje! 🎉' : `${minDiffDays}d (${nextPerson.name})`;
    } else {
        proximoEl.textContent = '-';
    }
}

// 🏗️ Constrói a interface com os blocos de cada mês
function buildCalendar() {
    const container = document.getElementById('monthAccordion');
    if (!container) return;
    
    container.innerHTML = '';
    const currentMonth = new Date().getMonth();
    
    monthNames.forEach((monthName, monthIndex) => {
        // Filtra e ordena os aniversariantes do mês atual
        const monthBirthdays = baseBirthdays
            .filter(b => Number(b.month) === monthIndex)
            .sort((a, b) => Number(a.day) - Number(b.day));
        
        const isCurrent = monthIndex === currentMonth;
        
        const item = document.createElement('div');
        item.className = 'month-item';
        
        // Cabeçalho do mês
        const header = document.createElement('div');
        header.className = 'month-header-accordion';
        header.onclick = () => toggleMonth(monthIndex);
        
        const title = document.createElement('div');
        title.className = 'month-title';
        title.innerHTML = `
            ${monthName}
            <span class="month-badge">${monthBirthdays.length}</span>
            ${isCurrent ? '<span title="Mês Atual">📍</span>' : ''}
        `;
        
        const arrow = document.createElement('span');
        arrow.className = 'month-arrow';
        arrow.textContent = '▼';
        arrow.id = `arrow-${monthIndex}`;
        
        header.appendChild(title);
        header.appendChild(arrow);
        item.appendChild(header);
        
        // Conteúdo com os aniversariantes
        const content = document.createElement('div');
        content.className = 'month-content-accordion';
        content.id = `content-${monthIndex}`;
        
        // O mês atual já começa aberto para facilitar
        if (isCurrent) {
            content.classList.add('open');
            arrow.classList.add('open');
        }
        
        if (monthBirthdays.length === 0) {
            content.innerHTML = '<p style="color: #a0aec0; padding: 10px 0; font-size: 0.9em;">😴 Nenhum aniversário neste mês.</p>';
        } else {
            // Agrupar pessoas que fazem aniversário no mesmo dia
            const groupedByDay = {};
            monthBirthdays.forEach(b => {
                const dayKey = b.day;
                if (!groupedByDay[dayKey]) groupedByDay[dayKey] = [];
                groupedByDay[dayKey].push(b);
            });
            
            Object.keys(groupedByDay).sort((a, b) => Number(a) - Number(b)).forEach(day => {
                const people = groupedByDay[day];
                const dayFormatted = String(day).padStart(2, '0');
                
                if (people.length > 1) {
                    // Quando há mais de uma pessoa no mesmo dia
                    const groupDiv = document.createElement('div');
                    groupDiv.className = 'birthday-group';
                    
                    const groupHeader = document.createElement('div');
                    groupHeader.className = 'group-header';
                    groupHeader.innerHTML = `
                        <span>📅 Dia ${dayFormatted}</span>
                        <span style="font-size:0.8em; font-weight:normal; color:#718096;">${people.length} aniversariantes</span>
                    `;
                    groupDiv.appendChild(groupHeader);
                    
                    people.forEach(person => {
                        const pDiv = document.createElement('div');
                        pDiv.className = 'group-person';
                        pDiv.innerHTML = `
                            <span class="emoji">${person.emoji || '🎂'}</span>
                            <span style="flex:1; font-weight: 500;">${person.name}</span>
                            <span style="font-size: 0.75em; color: #718096; background:#edf2f7; padding:2px 8px; border-radius:8px;">${person.relation || ''}</span>
                            ${isToday(person.month, person.day) ? '<span style="color:#38a169; font-weight:bold; font-size:0.8em; margin-left:6px;">🎁 HOJE!</span>' : ''}
                        `;
                        groupDiv.appendChild(pDiv);
                    });
                    
                    content.appendChild(groupDiv);
                } else {
                    // Quando há apenas uma pessoa no dia
                    const person = people[0];
                    const div = document.createElement('div');
                    div.className = 'birthday-item-list';
                    
                    if (isToday(person.month, person.day)) {
                        div.classList.add('today');
                    } else if (isSoon(person.month, person.day)) {
                        div.classList.add('soon');
                    }
                    
                    div.innerHTML = `
                        <span class="day">Dia ${dayFormatted}</span>
                        <span class="name">${person.name}</span>
                        <span class="relation">${person.relation || ''}</span>
                        <span class="emoji">${person.emoji || '🎂'}</span>
                        ${isToday(person.month, person.day) ? '<span style="color:#38a169; font-weight:bold; font-size:0.8em;">🎁 HOJE!</span>' : ''}
                    `;
                    
                    content.appendChild(div);
                }
            });
        }
        
        item.appendChild(content);
        container.appendChild(item);
    });
}

// 🔽 Alterna a visualização do mês (abrir/fechar)
function toggleMonth(index) {
    const content = document.getElementById(`content-${index}`);
    const arrow = document.getElementById(`arrow-${index}`);
    
    if (content) {
        content.classList.toggle('open');
        if (arrow) {
            arrow.classList.toggle('open');
        }
    }
}

// 🚀 Inicializa a aplicação assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    buildCalendar();
    updateStats();
});

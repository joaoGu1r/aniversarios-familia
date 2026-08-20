// 📋 LISTA BASE DE ANIVERSARIANTES (Mês: 0 = Janeiro ... 10 = Novembro, 11 = Dezembro)
const baseBirthdays = [
    { month: 0, day: 8, name: "Luciano", emoji: "👨", relation: "" },  
    { month: 1, day: 10, name: "Daniel", emoji: "👦", relation: "" },
    { month: 2, day: 5, name: "Miguel", emoji: "👶", relation: "" },
    { month: 3, day: 3, name: "Von", emoji: "🧑", relation: "" },
    { month: 4, day: 3, name: "Rafael", emoji: "👨", relation: "" },
    { month: 5, day: 16, name: "Alisson", emoji: "👨", relation: "" },
    { month: 6, day: 16, name: "Carmem", emoji: "👩", relation: "" },
    { month: 7, day: 11, name: "Seve", emoji: "🧓", relation: "" },
    { month: 8, day: 30, name: "Maria", emoji: "👩", relation: "" },
    { month: 9, day: 7, name: "Luan", emoji: "🧑", relation: "" },
    
    // ⭐ SEPARADOS EM 2 OBJETOS: Isso faz a contagem somar 2 em Novembro
    { month: 10, day: 3, name: "Guilherme", emoji: "👨", relation: "" },
    { month: 10, day: 3, name: "Pedro", emoji: "👨", relation: "" },
    
    { month: 11, day: 10, name: "Josina", emoji: "👩", relation: "" }
];

const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Chave com versão atualizada para limpar dados legados do navegador
const STORAGE_KEY = 'family_birthdays_v4_relations';

// 🔄 Carregar lista do LocalStorage com fallback para baseBirthdays
function getBirthdayList() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed.map(person => ({
                    ...person,
                    month: Number(person.month),
                    day: Number(person.day)
                }));
            }
        } catch (e) {
            console.error("Erro ao ler dados salvos:", e);
        }
    }
    // Salva a lista inicial corrigida
    saveBirthdayList(baseBirthdays);
    return [...baseBirthdays];
}

// 💾 Salvar dados atualizados
function saveBirthdayList(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ➕ Adicionar novo familiar
function addPerson(event) {
    event.preventDefault();
    
    const name = document.getElementById('personName').value.trim();
    const dateInput = document.getElementById('personDate').value;
    const relation = document.getElementById('personRelation').value;
    const emoji = document.getElementById('personEmoji').value;
    
    if (!name || !dateInput) {
        alert('⚠️ Preencha todos os campos!');
        return;
    }
    
    const [, monthStr, dayStr] = dateInput.split('-');
    const month = parseInt(monthStr, 10) - 1; // Ajuste para base 0 (0-11)
    const day = parseInt(dayStr, 10);
    
    const newPerson = {
        month: month,
        day: day,
        name: name,
        emoji: emoji || '🎂',
        relation: relation
    };
    
    const list = getBirthdayList();
    list.push(newPerson);
    saveBirthdayList(list);
    
    closeAddModal();
    buildCalendar();
    updateStats();
    
    alert(`✅ ${name} adicionado(a) com sucesso!`);
}

// 🎯 Verificações de data
function isToday(month, day) {
    const today = new Date();
    return today.getMonth() === Number(month) && today.getDate() === Number(day);
}

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

// 📊 Atualizar a contagem total e o próximo aniversariante
function updateStats() {
    const list = getBirthdayList();
    const now = new Date();
    const currentMonth = now.getMonth();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Total geral
    document.getElementById('totalPessoas').textContent = list.length;
    
    // Aniversários no mês atual
    const thisMonthList = list.filter(b => Number(b.month) === currentMonth);
    document.getElementById('aniversariosMes').textContent = thisMonthList.length;
    
    // Próximo aniversário
    let minDiffDays = Infinity;
    let nextPerson = null;
    
    list.forEach(b => {
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

// 🏗️ Montar o Accordion dos Meses
function buildCalendar() {
    const container = document.getElementById('monthAccordion');
    if (!container) return;
    
    container.innerHTML = '';
    const list = getBirthdayList();
    const currentMonth = new Date().getMonth();
    
    monthNames.forEach((monthName, monthIndex) => {
        const monthBirthdays = list
            .filter(b => Number(b.month) === monthIndex)
            .sort((a, b) => Number(a.day) - Number(b.day));
        
        const isCurrent = monthIndex === currentMonth;
        
        const item = document.createElement('div');
        item.className = 'month-item';
        
        // Cabeçalho do mês com a badge de contagem real
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
        
        // Área expansível do mês
        const content = document.createElement('div');
        content.className = 'month-content-accordion';
        content.id = `content-${monthIndex}`;
        
        if (isCurrent) {
            content.classList.add('open');
            arrow.classList.add('open');
        }
        
        if (monthBirthdays.length === 0) {
            content.innerHTML = '<p style="color: #a0aec0; padding: 10px 0; font-size: 0.9em;">😴 Nenhum aniversário neste mês.</p>';
        } else {
            // Agrupar pessoas por dia
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
                    // Quando há 2 ou mais pessoas no mesmo dia (Ex: Guilherme e Pedro)
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
                    // Quando há apenas 1 pessoa no dia
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

// 🔽 Toggle da sanfona
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

// 📌 Funções do Modal
function openAddModal() {
    document.getElementById('addModal').classList.add('active');
    document.getElementById('personName').focus();
}

function closeAddModal() {
    document.getElementById('addModal').classList.remove('active');
    document.getElementById('addForm').reset();
}

// 🚀 Inicialização
document.addEventListener('DOMContentLoaded', () => {
    buildCalendar();
    updateStats();
});

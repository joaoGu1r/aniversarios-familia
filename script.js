// ==========================================
// 📋 LISTA DE ANIVERSARIANTES - FAMÍLIA LUCENA E SILVA
// ==========================================
// Nota sobre os meses:
// 0 = Janeiro   | 1 = Fevereiro | 2 = Março     | 3 = Abril
// 4 = Maio      | 5 = Junho     | 6 = Julho     | 7 = Agosto
// 8 = Setembro  | 9 = Outubro   | 10 = Novembro | 11 = Dezembro

const baseBirthdays = [
    // Janeiro 
    { month: 0, day: 8, name: "Luciano", emoji: "👨", relation: "" }, 
    {month: 0 ,day: 16, name:"João", emoji:"👨", relation:""},
    {month: 0 ,day: 20, name:"Jorge", emoji:"👨", relation:""},
    
    // Fevereiro 
     { month: 1, day: 10, name: "Daniel", emoji: "👦", relation: "" },
    
    // Março
     { month: 2, day: 5, name: "Miguel", emoji: "👶", relation: "" },
    { month: 2, day: 11, name: "Cândida", emoji: "👩", relation: "" },
    { month: 2, day: 28, name: "Andrea", emoji: "👩", relation: "" },
    
    // Abril
     { month: 3, day: 3, name: "Von", emoji: "🧑", relation: "" },
    { month: 3, day: 4, name: "Vitória", emoji: "👩", relation: "" },
    { month: 3, day: 19, name: "Severino", emoji: "👨", relation: "" },
    { month: 3, day: 29, name: "Juliana", emoji: "👩", relation: "" },
    // Maio
    { month: 4, day: 3, name: "Rafael", emoji: "👨", relation: "" },
    { month: 4, day: 11, name: "Paulina", emoji: "👩", relation: "" },
    { month: 4, day: 15, name: "Gustavo", emoji: "👨", relation: "" },
    { month: 4, day: 16, name: "Zita", emoji: "👩", relation: "" },
    // Junho
    { month: 5, day: 16, name: "Alisson", emoji: "👨", relation: "" },
    { month: 5, day: 16, name: "Lívia", emoji: "👶", relation: "" },
    { month: 5, day: 16, name: "Antônio", emoji: "👨", relation: "" },
    
    // Julho
    { month: 6, day: 16, name: "Carmem", emoji: "👩", relation: "" },
    { month: 6, day: 26, name: "Joelma", emoji: "👩", relation: "" },
    { month: 6, day: 26, name: "Arthur", emoji: "🧑", relation: "" },
    
    // Agosto
    { month: 7, day: 11, name: "Seve", emoji: "👩", relation: "" },
    { month: 7, day: 21, name: "Clara", emoji: "👩", relation: "" },
    { month: 7, day: 21, name: "Gael", emoji: "🧑", relation: "" },
    { month: 7, day: 29, name: "Vovó Maria", emoji: "🧓", relation: "" },
    
   // Setembro
    { month: 8, day: 30, name: "Maria", emoji: "💰", relation: "pode me dá o presente em pix" },
    // Outubro
    { month: 9, day: 7, name: "Luan", emoji: "🧑", relation: "" },
    { month: 9, day: 8, name: "Gabriel", emoji: "👶", relation: "" },
    { month: 9, day: 19, name: "Priscila", emoji: "👩", relation: "" },
    { month: 9, day: 27, name: "Ceci", emoji: "👩", relation: "" },
    
    // Novembro
    { month: 10, day: 3, name: "Guilherme", emoji: "👨", relation: "" },
    { month: 10, day: 3, name: "Pedro", emoji: "🧑", relation: "" },
    { month: 10, day: 8, name: "Jonas", emoji: "👴", relation: "" },
    { month: 10, day: 13, name: "Kauã", emoji: "🧑", relation: "" },
    { month: 10, day: 27, name: "Cristovão", emoji: "👨", relation: "" },
    { month: 10, day: 30, name: "Maria", emoji: "👩", relation: "" },
    
    // Dezembro
    { month: 11, day: 10, name: "Josina", emoji: "👩", relation: "" },
    { month: 11, day: 17, name: "Hugo Lima", emoji: "🎻", relation: "" },
    { month: 11, day: 21, name: "Ray", emoji: "👩", relation: "" },
    { month: 11, day: 22, name: "Guigui", emoji: "🧒", relation: "" },
    { month: 11, day: 25, name: "Welligton", emoji: "🎅", relation: "" }
    
    
    
];

// Nomes dos 12 meses
const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// 🎯 Função auxiliar para identificar se o aniversário é hoje
function isToday(month, day) {
    const today = new Date();
    return today.getMonth() === Number(month) && today.getDate() === Number(day);
}

// 🔍 Função auxiliar para identificar se falta até 7 dias
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

// 📊 Atualiza os 3 blocos numéricos do topo
function updateStats() {
    const totalEl = document.getElementById('totalPessoas');
    const mesEl = document.getElementById('aniversariosMes');
    const proxEl = document.getElementById('proximoAniversario');

    if (!totalEl || !mesEl || !proxEl) return;

    const now = new Date();
    const currentMonth = now.getMonth();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Total de membros cadastrados
    totalEl.textContent = baseBirthdays.length;

    // 2. Aniversários deste mês
    const thisMonthList = baseBirthdays.filter(b => Number(b.month) === currentMonth);
    mesEl.textContent = thisMonthList.length;

    // 3. Cálculo do aniversariante mais próximo
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

    if (nextPerson) {
        proxEl.textContent = minDiffDays === 0 ? 'Hoje! 🎉' : `${minDiffDays}d (${nextPerson.name})`;
    } else {
        proxEl.textContent = '-';
    }
}

// 🏗️ Monta e renderiza os 12 meses na tela
function buildCalendar() {
    const container = document.getElementById('monthAccordion');
    if (!container) return;

    container.innerHTML = '';
    const currentMonth = new Date().getMonth();

    monthNames.forEach((monthName, monthIndex) => {
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

        // Bloco de conteúdo do mês
        const content = document.createElement('div');
        content.className = 'month-content-accordion';
        content.id = `content-${monthIndex}`;

        // O mês corrente começa aberto por padrão
        if (isCurrent) {
            content.classList.add('open');
            arrow.classList.add('open');
        }

        if (monthBirthdays.length === 0) {
            content.innerHTML = '<p style="color: #a0aec0; padding: 10px 0; font-size: 0.9em;">😴 Nenhum aniversário neste mês.</p>';
        } else {
            // Agrupar aniversariantes do mesmo dia
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
                    // Grupo com 2 ou mais pessoas no mesmo dia
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
                    // Apenas 1 pessoa no dia
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

// 🔽 Alterna expansão de cada mês
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

// 🚀 Execução automática ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    buildCalendar();
    updateStats();
});

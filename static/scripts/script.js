
console.log("Hello World")
const maxDays = 90;
function getCurrentTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


function formatDate(date) {
        const day = date.getDate();
        const suffix = (d) => {
            if (d > 3 && d < 21) return 'th';
            switch (d % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        return `It's the ${day}${suffix(day)} of ${months[date.getMonth()]} ${date.getFullYear()}`;
    }

function filterMVP(button) {
    const allCards = document.querySelectorAll('.agent-card-base');
    setActiveButton(button);
    allCards.forEach(card => {
        // Check if the card has the 'agent-card-mvp' class (which signifies Best Friend)
        if (card.classList.contains('agent-card-mvp')) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterFamily(button) {
    const allCards = document.querySelectorAll('.agent-card-base');
    setActiveButton(button);
    allCards.forEach(card => {
        // Check if the card has the 'agent-card-mvp' class (which signifies Best Friend)
        if (card.classList.contains('agent-card-fam')) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterLowHealth(button) {
    const allCards = document.querySelectorAll('.agent-card-base');
    setActiveButton(button);
    allCards.forEach(card => {
        // Check if the card has the 'agent-card-mvp' class (which signifies Best Friend)
        const daysElement = card.querySelector('.days-since');
        if (daysElement) {
            const days = parseInt(daysElement.textContent.trim());

            if (!isNaN(days)) {
                // Show cards where days since contacted is greater than 45
                if (days >= 45) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        }
    });
}


function setActiveButton(activeBtn) {
    const buttons = document.querySelectorAll('.filter-buttons');
    buttons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}


function unfilterAll() {
    // Show all cards
    const allCards = document.querySelectorAll('.agent-card-base');
    allCards.forEach(card => {
        card.style.display = 'block';
    });

    // Deactivate all toggle buttons
    document.querySelectorAll('.filter-buttons').forEach(btn => btn.classList.remove('active'));
}

// Set formatted date on page load
    document.addEventListener('DOMContentLoaded', () => {
        const dateElement = document.getElementById('dateintro');
        const numPeople = document.getElementById('numPeople');
        if (dateElement) {
            dateElement.textContent = formatDate(new Date());
        }
        const form = document.querySelector('form[action="/update_person"]');

        if (form) {
        form.addEventListener("submit", function() {
        document.getElementById("last_contacted_input").value =  getCurrentTimestamp();
            });
        }

    document.querySelectorAll('.agent-card-base').forEach(card => {
    // Get the <h6 class="days-since"> element
    const daysElement = card.querySelector('.days-since');
    const fillBar = card.querySelector('.bar .fill');

    if (daysElement && fillBar) {
        // Get numeric value from text
        const days = parseInt(daysElement.textContent.trim());

        if (!isNaN(days)) {
            // Calculate width based on freshness (0% if > maxDays)
            const maxDays = 240;
            let widthPercent = Math.max(0, 100 - (days / maxDays) * 100);

            // Update fill bar width
            fillBar.style.width = `${widthPercent}%`;
            console.log(`Card: ${card.dataset.priority}, Days: ${days}, Width: ${widthPercent}%`);

            // Optional: color coding
            if (days >= (maxDays/3)) {
                fillBar.style.backgroundColor = '#ff4d4d'; // red
            } else if (days >= (maxDays/6)) {
                fillBar.style.backgroundColor = '#ffa500'; // orange
            }
        }
        }   
    });





    });
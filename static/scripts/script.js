
console.log("Hello World")
console.log("Max days is:", window.maxDays);

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

function openSettingsModal() {
    console.log("Opening modal...");
    const modal = document.getElementById('settingsModal');
    if (!modal) {
        console.error("Modal not found in DOM!");
        return;
    }
    document.getElementById('maxDaysInput').value = window.maxDays || 90;
    modal.classList.add('show');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('show');
}


document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    const newMaxDays = parseInt(document.getElementById('maxDaysInput').value);

    if (!isNaN(newMaxDays) && newMaxDays > 0) {
        fetch('/update_setting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'maxDays',
                value: newMaxDays
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("maxDays updated in DB");
                location.reload();  // Optional: Reload page to reflect new value
            } else {
                alert("Failed to update setting: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error updating maxDays:", error);
        });
    }
});

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
    //document.getElementById("numberofCards").textContent =  countVisibleCards();
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

function countVisibleCards() {
    const allCards = document.querySelectorAll('.agent-card-base');
    let visibleCount = 0;

    allCards.forEach(card => {
        const style = window.getComputedStyle(card);
        if (style.display !== 'none') {
            visibleCount++;
        }
    });

    return visibleCount.toString();
}

// Set formatted date on page load
    document.addEventListener('DOMContentLoaded', () => {
        const dateElement = document.getElementById('dateintro');      
                
        if (dateElement) {
            dateElement.textContent = formatDate(new Date());
        }        
        
        const form = document.querySelector('form[action="/update_person"]');

        if (form) {
        form.addEventListener("submit", function() {
        console.log(getCurrentTimestamp())
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
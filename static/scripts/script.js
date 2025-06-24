console.log("Hello World");


//Super cool data function to give you a string
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
    console.log("Attempting to open Modal");
    const modal = document.getElementById('settingsModal');
    if (!modal) {
        console.error("Modal not found");
        return;
    }
    document.getElementById('maxDaysInput').value = window.maxDays || 90;
    modal.classList.add('show');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('show');
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
        if (card.classList.contains('agent-card-fam')) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function sortHealth(button) {
    const container = document.querySelector('.agent-container-horizontal');
    const cards = Array.from(container.querySelectorAll('.agent-card-base'));    
    
    setActiveButton(button);

    cards.sort((a, b) => {
        const daysA = parseInt(a.querySelector('.days-since').textContent.trim()) || 0;
        const daysB = parseInt(b.querySelector('.days-since').textContent.trim()) || 0;
        return daysB - daysA;
    });
    cards.forEach(card => container.appendChild(card));

        
}

function filterLowHealth(button) {
    const allCards = document.querySelectorAll('.agent-card-base');
    setActiveButton(button);
    allCards.forEach(card => {
        const daysElement = card.querySelector('.days-since');
        if (daysElement) {
            const days = parseInt(daysElement.textContent.trim());
            if (!isNaN(days)) {
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
    const allCards = document.querySelectorAll('.agent-card-base');

    const container = document.querySelector('.agent-container-horizontal');
    if (container && container.dataset.originalHTML) {
        container.innerHTML = container.dataset.originalHTML;
    }
    allCards.forEach(card => {
        card.style.display = 'block';
    });
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


document.addEventListener('DOMContentLoaded', () => {

    const dateElement = document.getElementById('dateintro');      
    if (dateElement) {
        dateElement.textContent = formatDate(new Date());
    }
    
    const scrollContainer = document.querySelector(".horizontal-scroll");
    if (scrollContainer) {
        // Remember scroll position
        const savedScroll = localStorage.getItem("scrollXPosition");
        if (savedScroll !== null) {
            scrollContainer.scrollLeft = parseInt(savedScroll, 10);
        }

        
        scrollContainer.addEventListener("scroll", () => {
            localStorage.setItem("scrollXPosition", scrollContainer.scrollLeft);
        });
    }     
    
    const updateForm = document.getElementById('updatePersonForm');
    console.log("Form found?", updateForm);
    if (updateForm) {
        updateForm.addEventListener("submit", function () {
            const timestamp = getCurrentTimestamp();
            const input = document.getElementById("last_contacted_input");
            input.value = timestamp;
            console.log("Setting last_contacted to:", timestamp);
        });
    }

    // Form Settings Submits Handler
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newMaxDays = parseInt(document.getElementById('maxDaysInput').value);
            const newGoldLabel = document.getElementById('goldInput').value.trim()
            const newDiamondLabel = document.getElementById('diamondInput').value.trim()

            const updates = [];

            if (!isNaN(newMaxDays) && newMaxDays > 0) {
            updates.push({ name: 'maxDays', value: newMaxDays });
            }

            if (newGoldLabel) {
                updates.push({ name: 'goldLabel', value: newGoldLabel });
            }

            if (newDiamondLabel) {
                updates.push({ name: 'diamondLabel', value: newDiamondLabel });
            }
            // Parallel processing ftw
            Promise.all(
                updates.map(setting =>
                    fetch('/update_setting', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(setting)
                    })
                    .then(response => response.json())
                )
            )
            .then(results => {
                const anyFailures = results.some(result => !result.success);
                if (anyFailures) {
                    alert("Some settings failed to update.");
                } else {
                    console.log("All settings updated.");
                    location.reload();
                }
            })
            .catch(error => {
                console.error("Error updating settings:", error);
                alert("There was an error updating the settings.");
            });
        });
    }


    // Update Relation Level Bar for all cards
    document.querySelectorAll('.agent-card-base').forEach(card => {
        const daysElement = card.querySelector('.days-since');
        const fillBar = card.querySelector('.bar .fill');
        if (daysElement && fillBar) {
            const days = parseInt(daysElement.textContent.trim());
            if (!isNaN(days)) {
                let widthPercent = Math.max(0, 100 - (days / window.maxDays) * 100);
                fillBar.style.width = `${widthPercent}%`;
                if (days >= (window.maxDays / 3)) {
                    fillBar.style.backgroundColor = '#ff4d4d';
                } else if (days >= (window.maxDays / 6)) {
                    fillBar.style.backgroundColor = '#ffa500';
                }
            }
        }   
    });
    const container = document.querySelector('.agent-container-horizontal');
    if (container) {
        container.dataset.originalHTML = container.innerHTML;
        }
});
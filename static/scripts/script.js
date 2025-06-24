console.log("Hello World");
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

// Run DOM-dependent code after full HTML load
document.addEventListener('DOMContentLoaded', () => {
    // Format date
    const dateElement = document.getElementById('dateintro');      
    if (dateElement) {
        dateElement.textContent = formatDate(new Date());
    }
    
    const scrollContainer = document.querySelector(".horizontal-scroll");
    if (scrollContainer) {
        // Restore scroll position
        const savedScroll = localStorage.getItem("scrollXPosition");
        if (savedScroll !== null) {
            scrollContainer.scrollLeft = parseInt(savedScroll, 10);
        }

        // Save scroll position on scroll
        scrollContainer.addEventListener("scroll", () => {
            localStorage.setItem("scrollXPosition", scrollContainer.scrollLeft);
        });
    }     
    // Update last_contacted timestamp on contact form submission
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

    // Handle settings form submit
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
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
                        location.reload();
                    } else {
                        alert("Failed to update setting: " + data.message);
                    }
                })
                .catch(error => {
                    console.error("Error updating maxDays:", error);
                });
            }
        });
    }

    // Update freshness bars
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
});
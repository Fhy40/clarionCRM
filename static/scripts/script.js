
console.log("Hello World")

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

// Set formatted date on page load
    document.addEventListener('DOMContentLoaded', () => {
        const dateElement = document.getElementById('dateintro');
        if (dateElement) {
            dateElement.textContent = formatDate(new Date());
        }
        const form = document.querySelector('form[action="/update_person"]');
        form.addEventListener("submit", function() {
        document.getElementById("last_contacted_input").value =  getCurrentTimestamp();
        });
    });
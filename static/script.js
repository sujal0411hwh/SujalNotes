// // document.addEventListener('DOMContentLoaded', () => {
    
// //     // --- THEME TOGGLE ---
// //     const themeToggle = document.getElementById('theme-toggle');
// //     const body = document.body;
// //     const icon = themeToggle ? themeToggle.querySelector('i') : null;
    
// //     // 1. Load Saved Theme
// //     const currentTheme = localStorage.getItem('theme');
// //     if (currentTheme === 'dark') {
// //         body.setAttribute('data-theme', 'dark');
// //         if(icon) icon.classList.replace('fa-moon', 'fa-sun');
// //     }

// //     // 2. Toggle Logic
// //     if(themeToggle){
// //         themeToggle.addEventListener('click', () => {
// //             if (body.hasAttribute('data-theme')) {
// //                 // Switch to Light
// //                 body.removeAttribute('data-theme');
// //                 icon.classList.replace('fa-sun', 'fa-moon');
// //                 localStorage.setItem('theme', 'light');
// //             } else {
// //                 // Switch to Dark
// //                 body.setAttribute('data-theme', 'dark');
// //                 icon.classList.replace('fa-moon', 'fa-sun');
// //                 localStorage.setItem('theme', 'dark');
// //             }
// //         });
// //     }

// //     // --- FILTER & SEARCH ---
// //     const filterBtns = document.querySelectorAll('.filter-btn');
// //     const noteCards = document.querySelectorAll('.note-card');
// //     const searchInput = document.getElementById('searchInput');

// //     if (filterBtns) {
// //         filterBtns.forEach(btn => {
// //             btn.addEventListener('click', () => {
// //                 filterBtns.forEach(b => b.classList.remove('active'));
// //                 btn.classList.add('active');
// //                 const filterValue = btn.getAttribute('data-filter');

// //                 noteCards.forEach(card => {
// //                     const cardCategory = card.getAttribute('data-category');
// //                     if (filterValue === 'all' || filterValue === cardCategory) {
// //                         card.style.display = 'flex';
// //                     } else {
// //                         card.style.display = 'none';
// //                     }
// //                 });
// //             });
// //         });
// //     }

// //     if (searchInput) {
// //         searchInput.addEventListener('input', (e) => {
// //             const searchText = e.target.value.toLowerCase();
// //             noteCards.forEach(card => {
// //                 const title = card.querySelector('h3').innerText.toLowerCase();
// //                 if (title.includes(searchText)) {
// //                     card.style.display = 'flex';
// //                 } else {
// //                     card.style.display = 'none';
// //                 }
// //             });
// //         });
// //     }

// //     // --- ANTI-SCREENSHOT LOGIC ---
// //     const blackout = document.getElementById("blackout");

// //     function triggerBlackout() {
// //         if(blackout) {
// //             blackout.style.display = "block";
// //             alert("Protected Content: Screenshots Disabled.");
// //             navigator.clipboard.writeText(''); 
// //             setTimeout(() => { blackout.style.display = "none"; }, 1000);
// //         }
// //     }


// // // --- AUTO-HIDE FLASH MESSAGES AFTER 5 SECONDS ---
// //     const flashMessages = document.querySelector('.flash-messages');
// //     if (flashMessages) {
// //         setTimeout(() => {
// //             // Add a fade-out effect (optional, requires CSS) or just remove it
// //             flashMessages.style.transition = "opacity 1s ease";
// //             flashMessages.style.opacity = "0";
            
// //             // Remove from DOM after fade out
// //             setTimeout(() => {
// //                 flashMessages.remove();
// //             }, 1000); 
// //         }, 5000); // 5000 milliseconds = 5 seconds
// //     }






// //     document.addEventListener('keyup', (e) => {
// //         if (e.key === 'PrintScreen') triggerBlackout();
// //     });

// //     document.addEventListener('keydown', (e) => {
// //         if (e.metaKey && e.shiftKey && e.key === 's') {
// //             e.preventDefault();
// //             triggerBlackout();
// //         }
// //     });

// //     document.addEventListener('contextmenu', event => event.preventDefault());
// // });



// document.addEventListener('DOMContentLoaded', () => {
    
//     // THEME TOGGLE
//     const themeToggle = document.getElementById('theme-toggle');
//     const body = document.body;
//     const icon = themeToggle ? themeToggle.querySelector('i') : null;
    
//     if (localStorage.getItem('theme') === 'dark') {
//         body.setAttribute('data-theme', 'dark');
//         if(icon) icon.classList.replace('fa-moon', 'fa-sun');
//     }

//     if(themeToggle){
//         themeToggle.addEventListener('click', () => {
//             if (body.hasAttribute('data-theme')) {
//                 body.removeAttribute('data-theme');
//                 if(icon) icon.classList.replace('fa-sun', 'fa-moon');
//                 localStorage.setItem('theme', 'light');
//             } else {
//                 body.setAttribute('data-theme', 'dark');
//                 if(icon) icon.classList.replace('fa-moon', 'fa-sun');
//                 localStorage.setItem('theme', 'dark');
//             }
//         });
//     }

//     // AUTO HIDE MESSAGES
//     const flashMessages = document.querySelector('.flash-messages');
//     if (flashMessages) {
//         setTimeout(() => {
//             flashMessages.style.transition = "opacity 1s ease";
//             flashMessages.style.opacity = "0";
//             setTimeout(() => flashMessages.remove(), 1000); 
//         }, 5000);
//     }


















    
//     // ANTI-SCREENSHOT
//     const blackout = document.getElementById("blackout");
//     function triggerBlackout() {
//         if(blackout) {
//             blackout.style.display = "block";
//             alert("Protected Content");
//             navigator.clipboard.writeText(''); 
//             setTimeout(() => { blackout.style.display = "none"; }, 1000);
//         }
//     }
//     document.addEventListener('keyup', (e) => { if (e.key === 'PrintScreen') triggerBlackout(); });
//     document.addEventListener('contextmenu', event => event.preventDefault());
// });



document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. THEME TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;
    
    // Load Saved Theme
    if (localStorage.getItem('theme') === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if(icon) icon.classList.replace('fa-moon', 'fa-sun');
    }

    // Toggle Logic
    if(themeToggle){
        themeToggle.addEventListener('click', () => {
            if (body.hasAttribute('data-theme')) {
                body.removeAttribute('data-theme');
                if(icon) icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                if(icon) icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- 2. FILTER & SEARCH LOGIC (Restored) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const noteCards = document.querySelectorAll('.note-card');
    const searchInput = document.getElementById('searchInput');

    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');

                noteCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === cardCategory) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();
            noteCards.forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                if (title.includes(searchText)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // --- 3. AUTO HIDE FLASH MESSAGES ---
    const flashMessages = document.querySelector('.flash-messages');
    if (flashMessages) {
        setTimeout(() => {
            flashMessages.style.transition = "opacity 1s ease";
            flashMessages.style.opacity = "0";
            setTimeout(() => flashMessages.remove(), 1000); 
        }, 5000);
    }

    // --- 4. REAL-TIME AUTO UNLOCK (NEW) ---
    // This reads the data passed from index.html
    if (window.userData && window.userData.isAuthenticated) {
        let currentAccess = window.userData.currentAccess;

        setInterval(() => {
            fetch('/api/check_status')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // If database info is different from what page loaded with...
                        if (data.allowed !== currentAccess) {
                            // Reload page to unlock buttons!
                            location.reload(); 
                        }
                    }
                })
                .catch(err => console.error("Auto-check failed:", err));
        }, 3000); // Check every 3 seconds
    }

    // --- 5. ANTI-SCREENSHOT LOGIC ---
    const blackout = document.getElementById("blackout");
    function triggerBlackout() {
        if(blackout) {
            blackout.style.display = "block";
            alert("Protected Content");
            navigator.clipboard.writeText(''); 
            setTimeout(() => { blackout.style.display = "none"; }, 1000);
        }
    }
    
    // Key Listeners
    document.addEventListener('keyup', (e) => { if (e.key === 'PrintScreen') triggerBlackout(); });
    
    document.addEventListener('keydown', (e) => {
        if (e.metaKey && e.shiftKey && e.key === 's') {
            e.preventDefault();
            triggerBlackout();
        }
    });

    document.addEventListener('contextmenu', event => event.preventDefault());
});
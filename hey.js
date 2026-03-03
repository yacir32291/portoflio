// ===== ATTENTE CHARGEMENT DOM =====
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initTheme();
    initHackerMode(); // AJOUTÉ
    initReveal();
    initTerminal();
    initTyping();
    initRSS();
    initMobileMenu();
    initSmoothScroll();
    initForm();
    initBackToTop(); // AJOUTÉ
    initMonitor(); // AJOUTÉ
    initNetworkNodes(); // AJOUTÉ
    initChart(); // AJOUTÉ
});

// ===== Nettoyage au chargement =====
window.addEventListener('load', () => {
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100);
});

// ===== Nettoyage à la fermeture =====
window.addEventListener('beforeunload', () => {
    removeMatrixEffect();
});

// ===== Nettoyage du mode Matrix si actif =====
window.addEventListener('popstate', () => {
    if (document.body.classList.contains('hacker-mode')) {
        removeMatrixEffect();
    }
});

// ===== NAVBAR SCROLL EFFECT =====
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== THÈME (clair/sombre) =====
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// ===== MODE HACKER (NOUVEAU) =====
function initHackerMode() {
    // Créer le bouton hacker s'il n'existe pas
    if (!document.getElementById('hackerMode')) {
        const navbarActions = document.querySelector('.navbar__container');
        if (navbarActions) {
            const hackerBtn = document.createElement('button');
            hackerBtn.id = 'hackerMode';
            hackerBtn.className = 'hacker-toggle';
            hackerBtn.setAttribute('aria-label', 'Mode Hacker');
            hackerBtn.textContent = '👾';
            
            // Ajouter après le bouton theme
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle && themeToggle.parentNode) {
                themeToggle.parentNode.appendChild(hackerBtn);
            } else {
                navbarActions.appendChild(hackerBtn);
            }
        }
    }
    
    const hackerBtn = document.getElementById('hackerMode');
    if (!hackerBtn) return;
    
    hackerBtn.addEventListener('click', () => {
        document.body.classList.toggle('hacker-mode');
        
        if (document.body.classList.contains('hacker-mode')) {
            hackerBtn.textContent = '💻';
            hackerBtn.style.background = '#00ff00';
            hackerBtn.style.color = '#000000';
            hackerBtn.style.borderColor = '#00ff00';
            createMatrixEffect();
            
            // Sauvegarder le mode
            localStorage.setItem('hackerMode', 'active');
        } else {
            hackerBtn.textContent = '👾';
            hackerBtn.style.background = '';
            hackerBtn.style.color = '';
            hackerBtn.style.borderColor = '';
            removeMatrixEffect();
            
            // Sauvegarder le mode
            localStorage.setItem('hackerMode', 'inactive');
        }
    });
    
    // Vérifier si le mode hacker était actif
    if (localStorage.getItem('hackerMode') === 'active') {
        document.body.classList.add('hacker-mode');
        hackerBtn.textContent = '💻';
        hackerBtn.style.background = '#00ff00';
        hackerBtn.style.color = '#000000';
        hackerBtn.style.borderColor = '#00ff00';
        createMatrixEffect();
    }
}

function createMatrixEffect() {
    removeMatrixEffect();
    
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -100);
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff00';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    window.matrixInterval = setInterval(draw, 33);
}

function removeMatrixEffect() {
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) canvas.remove();
    if (window.matrixInterval) {
        clearInterval(window.matrixInterval);
        window.matrixInterval = null;
    }
}

// ===== REVEAL ANIMATIONS =====
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== TERMINAL INTERACTIF =====
function initTerminal() {
    const output = document.getElementById('terminalOutput');
    const input = document.getElementById('terminalInput');
    
    if (!output || !input) return;
    
    const commands = {
        help: `
            📚 Commandes disponibles :<br>
            • <span style="color: #fbbf24">help</span> - Afficher cette aide<br>
            • <span style="color: #fbbf24">about</span> - À propos de moi<br>
            • <span style="color: #fbbf24">skills</span> - Mes compétences<br>
            • <span style="color: #fbbf24">projects</span> - Mes projets<br>
            • <span style="color: #fbbf24">contact</span> - Me contacter<br>
            • <span style="color: #fbbf24">hacker</span> - Activer le mode hacker<br>
            • <span style="color: #fbbf24">cv</span> - Télécharger mon CV<br>
            • <span style="color: #fbbf24">clear</span> - Nettoyer le terminal
        `,
        
        about: `
            👨‍💻 <strong>Yacir</strong> - Étudiant en Systèmes & Réseaux<br>
            🎓 2ème année d'informatique<br>
            🔍 Recherche alternance BAC+3<br>
            💻 Passionné par Linux et la cybersécurité
        `,
        
        skills: `
            🖧 <strong>Réseau</strong> : TCP/IP, VLAN, Cisco, Wireshark<br>
            🐧 <strong>Systèmes</strong> : Linux, Windows Server, Active Directory<br>
            📦 <strong>Virtualisation</strong> : VMware, VirtualBox, Hyper-V<br>
            🔒 <strong>Sécurité</strong> : Firewall, Kali Linux, SQLi/XSS<br>
            ⚙️ <strong>Programmation</strong> : Python, Bash, PowerShell
        `,
        
        projects: `
            📁 <strong>Serveur Linux</strong> : Apache, utilisateurs, permissions<br>
            🌐 <strong>Infrastructure réseau</strong> : VLAN, routage, ACLs<br>
            💻 <strong>Portfolio</strong> : Site web interactif avec terminal
        `,
        
        contact: `
            📧 Email : yacirbrahimi33@gmail.com<br>
            📱 Téléphone : +33 6 62 44 81 14<br>
            💼 LinkedIn : /in/yacir-brahimi-6719a4325<br>
            
        `,
        
        hacker: `
            👾 Mode Hacker activé !<br>
            Tapez 'hacker' à nouveau pour désactiver.<br>
            Ou utilisez le bouton 👾 dans la navigation.
        `,
        
        cv: '<a href="CV Technicien-Systemes-et-Reseaux.pdf" download style="color:#4ade80; text-decoration:underline">📥 Télécharger mon CV (PDF)</a>'
    };
    
    output.innerHTML = `
        <div class="terminal__line">
            <span class="terminal__prompt">$</span>
            <span class="terminal__command">Bienvenue dans mon terminal !</span>
        </div>
        <div class="terminal__line">
            <span class="terminal__prompt">$</span>
            <span class="terminal__command">Tapez <span style="color:#fbbf24">help</span> pour voir les commandes</span>
        </div>
    `;
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            
            output.innerHTML += `
                <div class="terminal__line">
                    <span class="terminal__prompt">$</span>
                    <span class="terminal__command">${cmd}</span>
                </div>
            `;
            
            if (cmd === 'clear') {
                output.innerHTML = '';
            } else if (cmd === 'hacker') {
                // Activer/désactiver le mode hacker depuis le terminal
                const hackerBtn = document.getElementById('hackerMode');
                if (hackerBtn) {
                    hackerBtn.click();
                }
                output.innerHTML += `
                    <div class="terminal__line">
                        <span class="terminal__prompt">></span>
                        <span class="terminal__command">Mode hacker ${document.body.classList.contains('hacker-mode') ? 'activé' : 'désactivé'} !</span>
                    </div>
                `;
            } else if (commands[cmd]) {
                output.innerHTML += `
                    <div class="terminal__line">
                        <span class="terminal__prompt">></span>
                        <span class="terminal__command">${commands[cmd]}</span>
                    </div>
                `;
            } else if (cmd !== '') {
                output.innerHTML += `
                    <div class="terminal__line">
                        <span class="terminal__prompt">❌</span>
                        <span class="terminal__command">Commande inconnue. Tapez <span style="color:#fbbf24">help</span></span>
                    </div>
                `;
            }
            
            output.scrollTop = output.scrollHeight;
            input.value = '';
        }
    });
}

// ===== TYPING EFFECT =====
function initTyping() {
    const typingElement = document.getElementById('typing');
    if (!typingElement) return;
    
    const texts = [
        "Recherche alternance BAC+3 — Infrastructure & Sécurité",
        "Administrateur systèmes en devenir",
        "Passionné par Linux et la cybersécurité",
        "Prêt à relever de nouveaux défis !",
        "Disponible pour une alternance dès Septembre"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    function typeEffect() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isWaiting = true;
            setTimeout(() => {
                isDeleting = true;
                isWaiting = false;
            }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        if (!isWaiting) {
            const speed = isDeleting ? 50 : 100;
            setTimeout(typeEffect, speed);
        } else {
            setTimeout(typeEffect, 100);
        }
    }
    
    typeEffect();
}

// ===== RSS CYBERSÉCURITÉ =====
function initRSS() {
    const rssContainer = document.getElementById('rss');
    if (!rssContainer) return;
    
    const fakeNews = [
        {
            title: "Nouvelle vulnérabilité critique dans Linux Kernel",
            link: "#",
            date: "2024-01-15",
            source: "The Hacker News"
        },
        {
            title: "ANSSI : Guide de sécurisation des infrastructures",
            link: "#",
            date: "2024-01-14",
            source: "CERT-FR"
        },
        {
            title: "Les bonnes pratiques pour sécuriser son réseau",
            link: "#",
            date: "2024-01-13",
            source: "ZDNet"
        }
    ];
    
    rssContainer.innerHTML = fakeNews.map(news => `
        <article class="project-card">
            <div class="project-card__content">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                    <span class="tag">${news.source}</span>
                    <small style="color: var(--text-muted);">${news.date}</small>
                </div>
                <h3 class="project-card__title" style="font-size:1.1rem;">${news.title}</h3>
                <a href="${news.link}" class="project-card__link" target="_blank">
                    Lire l'article →
                </a>
            </div>
        </article>
    `).join('');
}

// ===== MENU MOBILE =====
function initMobileMenu() {
    const toggle = document.querySelector('.navbar__toggle');
    const menu = document.querySelector('.navbar__menu');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true' ? false : true;
        toggle.setAttribute('aria-expanded', expanded);
        menu.classList.toggle('active');
        
        toggle.classList.toggle('active');
    });
    
    menu.querySelectorAll('.navbar__link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.classList.remove('active');
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.classList.remove('active');
        }
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== FORMULAIRE DE CONTACT =====
function initForm() {
    const form = document.querySelector('.contact__form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        if (!data.name || !data.email || !data.message) {
            showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            showNotification('Email invalide', 'error');
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';
        
        setTimeout(() => {
            showNotification('Message envoyé avec succès !', 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1500);
    });
}

// ===== BOUTON RETOUR EN HAUT =====
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== MONITEUR SERVEUR =====
function initMonitor() {
    const cpuValue = document.getElementById('cpuValue');
    const cpuBar = document.getElementById('cpuBar');
    const ramValue = document.getElementById('ramValue');
    const ramBar = document.getElementById('ramBar');
    const diskValue = document.getElementById('diskValue');
    const diskBar = document.getElementById('diskBar');
    const networkValue = document.getElementById('networkValue');
    const networkBar = document.getElementById('networkBar');
    
    if (!cpuValue) return;
    
    setInterval(() => {
        const cpu = Math.floor(Math.random() * 40) + 20;
        const ram = Math.floor(Math.random() * 30) + 30;
        const disk = Math.floor(Math.random() * 20) + 40;
        const network = Math.floor(Math.random() * 50) + 10;
        
        cpuValue.textContent = cpu + '%';
        cpuBar.style.width = cpu + '%';
        
        const ramUsed = (ram * 8 / 100).toFixed(1);
        ramValue.textContent = ramUsed + '/8 GB';
        ramBar.style.width = ram + '%';
        
        diskValue.textContent = disk + '/100 GB';
        diskBar.style.width = disk + '%';
        
        const networkSpeed = (network / 10).toFixed(1);
        networkValue.textContent = networkSpeed + ' MB/s';
        networkBar.style.width = network + '%';
    }, 3000);
}

// ===== ANIMATION DES NŒUDS RÉSEAU =====
function initNetworkNodes() {
    const nodes = document.querySelectorAll('.network-node');
    const lines = document.querySelectorAll('.network-lines line');
    
    if (!nodes.length) return;
    
    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            lines.forEach(line => {
                line.style.stroke = 'var(--accent-secondary)';
                line.style.strokeWidth = '3';
            });
        });
        
        node.addEventListener('mouseleave', () => {
            lines.forEach(line => {
                line.style.stroke = 'var(--accent-primary)';
                line.style.strokeWidth = '2';
            });
        });
    });
}

// ===== GRAPHIQUE D'ÉVOLUTION =====
function initChart() {
    const canvas = document.getElementById('skillsChart');
    if (!canvas) return;
    
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2023', '2024', '2025', '2026'],
            datasets: [
                {
                    label: 'Linux',
                    data: [30, 55, 75, 85],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#f59e0b',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    tension: 0.4
                },
                {
                    label: 'Réseau',
                    data: [25, 50, 70, 80],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    tension: 0.4
                },
                {
                    label: 'Sécurité',
                    data: [10, 30, 50, 65],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() || '#cbd5e1',
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue('--border-color').trim() || '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-muted').trim() || '#94a3b8',
                        stepSize: 20,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-muted').trim() || '#94a3b8'
                    }
                }
            }
        }
    });
}

// ===== UTILITAIRES =====
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <span>${message}</span>
            <button class="notification__close">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}
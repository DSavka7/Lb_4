document.addEventListener('DOMContentLoaded', () => {
    
    const posts = document.querySelectorAll('.post');
    posts.forEach((post, index) => {
        setTimeout(() => {
            post.classList.add('visible');
        }, index * 300);
    });


    const userGreeting = document.getElementById('user-greeting');
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userEmail = sessionStorage.getItem('userEmail');

    if (userEmail && userGreeting && loginBtn && registerBtn && logoutBtn) {
        userGreeting.textContent = `Вітаємо, ${userEmail}!`;
        userGreeting.style.display = 'inline';
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'inline';
    } else if (loginBtn && registerBtn && logoutBtn) {
        loginBtn.style.display = 'inline';
        registerBtn.style.display = 'inline';
        logoutBtn.style.display = 'none';
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('userEmail');
            window.location.href = '/';
        });
    }

   
    const promoForm = document.getElementById('promo-form');
    if (promoForm) {
        promoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const promoInput = promoForm.querySelector('input').value;
            alert(`Промокод "${promoInput}" відправлено! Перевірте нагороди на офіційному сайті.`);
        });
    }

   
    const calcBtn = document.getElementById('calc-btn');
    if (calcBtn) {
        const jadeInput = document.getElementById('jade-input');
        const calcResult = document.getElementById('calc-result');
        calcBtn.addEventListener('click', () => {
            const jade = parseInt(jadeInput.value) || 0;
            const pulls = Math.floor(jade / 160);
            calcResult.textContent = `Ви можете зробити ${pulls} витягувань (pulls) з ${jade} Звёздного нефриту.`;
        });
    }

 
    const galleryImg = document.querySelector('.gallery-img');
    if (galleryImg) {
        const prevBtn = document.querySelector('.gallery-prev');
        const nextBtn = document.querySelector('.gallery-next');
        const characters = [
            '/images/hyacinth.png',
            '/images/kafka.png',
            '/images/silverwolf.png'
        ];
        let currentIndex = 0;

        function updateGallery() {
            galleryImg.style.opacity = 0;
            setTimeout(() => {
                galleryImg.src = characters[currentIndex];
                galleryImg.style.opacity = 1;
            }, 500);
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + characters.length) % characters.length;
            updateGallery();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % characters.length;
            updateGallery();
        });
    }

   
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const message = document.getElementById('login-message');

          
            if (!email || !password) {
                message.textContent = 'Заповніть усі поля!';
                message.classList.add('show');
                return;
            }

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                message.textContent = result.message;
                message.classList.add('show');
                if (response.ok) {
                    sessionStorage.setItem('userEmail', email);
                    setTimeout(() => window.location.href = '/', 1000);
                }
            } catch (error) {
                console.error('Error:', error);
                message.textContent = 'Не вдалося підключитися до сервера. Перевірте, чи сервер запущено.';
                message.classList.add('show');
            }
        });
    }

 
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const message = document.getElementById('register-message');

        
            if (!email || !password || !confirmPassword) {
                message.textContent = 'Заповніть усі поля!';
                message.classList.add('show');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                message.textContent = 'Невірний формат email!';
                message.classList.add('show');
                return;
            }
            if (password.length < 8) {
                message.textContent = 'Пароль має містити щонайменше 8 символів!';
                message.classList.add('show');
                return;
            }
            if (password !== confirmPassword) {
                message.textContent = 'Паролі не збігаються!';
                message.classList.add('show');
                return;
            }

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                message.textContent = result.message;
                message.classList.add('show');
                if (response.ok) {
                    sessionStorage.setItem('userEmail', email);
                    setTimeout(() => window.location.href = '/', 1000);
                }
            } catch (error) {
                console.error('Error:', error);
                message.textContent = 'Не вдалося підключитися до сервера. Перевірте, чи сервер запущено.';
                message.classList.add('show');
            }
        });
    }
});
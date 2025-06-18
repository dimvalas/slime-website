window.addEventListener('DOMContentLoaded', function() {
    const bar = document.querySelector('.loading-bar-inner');
    const overlay = document.getElementById('loading-overlay');
    const main = document.querySelector('main');

    setTimeout(() => {
        bar.style.width = '100%';
    }, 100);

    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            if (main) {
                main.style.opacity = '1';
                main.style.pointerEvents = 'auto';
                main.focus && main.focus();
            }
        }, 400);
    }, 1200);

    const copyBtn = document.getElementById('copy-ip-btn');
    const ipText = document.getElementById('server-ip-text');
    if (copyBtn && ipText) {
        copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(ipText.textContent.trim()).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Click to Copy IP';
                }, 1000);
            });
        });
    }

    const shopItems = [
        { id: 'vip', name: 'VIP', price: 6, desc: '2 Homes, VIP tag, chat color, and more!' },
        { id: 'slime', name: 'Slime', price: 15, desc: 'All VIP perks plus /hat, /workbench, and exclusive Slime tag!' },
        { id: 'knight', name: 'Knight Slime', price: 25, desc: 'All Slime perks plus /fly, /disguise, and Knight Slime chat badge!' },
        { id: 'royal', name: 'Royal Slime', price: 44, desc: 'All Knight Slime perks plus /heal, /feed, and Royal Slime chat badge!' },
        { id: 'king', name: 'Slime King', price: 62, desc: 'All Royal Slime perks plus /god, /repair all, and Slime King chat badge!' },
        { id: 'divine', name: 'Divine Slime', price: 93, desc: 'All Slime King perks plus /vanish, /invsee, and Divine Slime chat badge!' }
    ];

    function renderShop() {
        const cards = document.querySelector('.rank-cards');
        if (!cards) return;
        cards.innerHTML = '';
        shopItems.forEach(item => {
            const card = document.createElement('div');
            card.className = `rank-card ${item.id}`;
            card.innerHTML = `
                <div class="rank-card-header">
                    <h2>${item.name}</h2>
                    <button class="buy-btn" data-id="${item.id}">Buy ${item.name}</button>
                </div>
                <div class="rank-card-desc">${item.desc}</div>
                <span class="price">$${item.price.toFixed(2)}</span>
            `;
            cards.appendChild(card);
        });
    }

    function getBasket() {
        return JSON.parse(localStorage.getItem('basket') || '[]');
    }

    function setBasket(basket) {
        localStorage.setItem('basket', JSON.stringify(basket));
    }

    function updateBasketCount() {
        const basket = getBasket();
        const count = basket.length;
        const badge = document.getElementById('basket-count');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    function showBasketMenu() {
        const basketMenu = document.getElementById('basket-menu');
        const basketList = document.getElementById('basket-list');
        const basketTotal = document.getElementById('basket-total');
        const basket = getBasket();
        if (!basketMenu || !basketList || !basketTotal) return;

        if (basket.length === 0) {
            basketList.innerHTML = '<li style="color:#aaffaa;background:none;box-shadow:none;">Your basket is empty.</li>';
            basketTotal.textContent = '';
        } else {
            basketList.innerHTML = basket.map((item, idx) =>
                `<li>${sanitize(item.name)} - $${item.price} <button data-remove="${idx}">Remove</button></li>`
            ).join('');
            const total = basket.reduce((sum, item) => sum + item.price, 0);
            basketTotal.textContent = `Total: $${total.toFixed(2)}`;
        }
        basketMenu.classList.add('open');
    }

    function hideBasketMenu() {
        const basketMenu = document.getElementById('basket-menu');
        if (basketMenu) basketMenu.classList.remove('open');
    }

    function addToBasket(itemId) {
        const item = shopItems.find(i => i.id === itemId);
        if (!item) return;
        let basket = getBasket();
        if (!basket.some(i => i.id === itemId)) {
            basket.push(item);
            setBasket(basket);
            updateBasketCount();
        }
    }

    function removeFromBasket(idx) {
        let basket = getBasket();
        basket.splice(idx, 1);
        setBasket(basket);
        updateBasketCount();
        showBasketMenu();
    }

    function setupShopEvents() {
        document.body.addEventListener('click', e => {
            if (e.target.classList.contains('buy-btn')) {
                addToBasket(e.target.dataset.id);
            }
            if (e.target.dataset.remove !== undefined) {
                removeFromBasket(Number(e.target.dataset.remove));
            }
            if (e.target.id === 'basket-icon') {
                showBasketMenu();
            }
            if (e.target.id === 'basket-close-btn') {
                hideBasketMenu();
            }
            if (e.target.id === 'basket-checkout-btn') {
                const basket = getBasket();
                if (basket.length === 0) {
                    alert('Your basket is empty!');
                    return;
                }
                const username = localStorage.getItem('minecraftUsername');
                if (!username) {
                    alert('Please set your Minecraft username first!');
                    return;
                }
                const item = basket[0];
                const solWallet = 'FQh4V7yMZ4pR5VYpiwfWnuFZa1QgTuqrCiaV9P3An7s7';
                const usdToSol = 144;
                const solAmount = (item.price / usdToSol).toFixed(4);

                const paymentModal = document.getElementById('payment-modal');
                const paymentInfo = document.getElementById('solana-payment-info');
                const txidInput = document.getElementById('solana-txid-input');
                paymentInfo.innerHTML = `
                    <b>Step 1:</b> Send <b>${solAmount} SOL</b> to:<br>
                    <span style="word-break:break-all;">${solWallet}</span><br><br>
                    <b>Step 2:</b> <span style="color:#00ff99;">Include your Minecraft username as the memo:</span><br>
                    <span style="background:#222;padding:4px 10px;border-radius:6px;color:#00ff99;font-family:monospace;">${username}</span><br><br>
                    <b>Step 3:</b> After payment, paste your transaction ID below.
                `;
                txidInput.value = '';
                paymentModal.classList.add('open');
            }
        });

        document.addEventListener('mousedown', function(e) {
            const basketMenu = document.getElementById('basket-menu');
            if (basketMenu && basketMenu.classList.contains('open')) {
                if (!basketMenu.contains(e.target) && e.target.id !== 'basket-icon') {
                    hideBasketMenu();
                }
            }
        });
    }

    function updateProfileDisplay() {
        const username = localStorage.getItem('minecraftUsername');
        const badge = document.getElementById('profile-username');
        if (badge) {
            if (username) {
                badge.textContent = sanitize(username);
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    function openProfileModal() {
        document.getElementById('profile-modal').classList.add('open');
        document.getElementById('minecraft-username-input').value = localStorage.getItem('minecraftUsername') || '';
        setTimeout(() => {
            document.getElementById('minecraft-username-input').focus();
        }, 100);
    }
    function closeProfileModal() {
        document.getElementById('profile-modal').classList.remove('open');
    }

    document.getElementById('profile-nav')?.addEventListener('click', openProfileModal);

    document.getElementById('profile-modal-close')?.addEventListener('click', closeProfileModal);
    document.getElementById('save-username-btn')?.addEventListener('click', function() {
        const input = document.getElementById('minecraft-username-input');
        const username = input.value.trim();
        if (!/^[a-zA-Z0-9_]{3,16}$/.test(username)) {
            input.style.borderColor = '#ff4444';
            input.value = '';
            input.placeholder = 'Invalid username!';
            setTimeout(() => {
                input.style.borderColor = '#00ff99';
                input.placeholder = 'Minecraft Username';
            }, 1000);
            return;
        }
        fetch(`https://corsproxy.io/?https://api.mojang.com/users/profiles/minecraft/${username}`)
            .then(res => {
                if (res.ok) {
                    localStorage.setItem('minecraftUsername', username);
                    updateProfileDisplay();
                    closeProfileModal();
                } else {
                    input.style.borderColor = '#ff4444';
                    input.value = '';
                    input.placeholder = 'Username not found!';
                    setTimeout(() => {
                        input.style.borderColor = '#00ff99';
                        input.placeholder = 'Minecraft Username';
                    }, 1000);
                }
            })
            .catch(() => {
                input.style.borderColor = '#ff4444';
                input.value = '';
                input.placeholder = 'Error checking username!';
                setTimeout(() => {
                    input.style.borderColor = '#00ff99';
                    input.placeholder = 'Minecraft Username';
                }, 1000);
            });
    });

    document.getElementById('minecraft-username-input')?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('save-username-btn').click();
        }
    });

    document.getElementById('profile-modal')?.addEventListener('mousedown', function(e) {
        if (e.target === this) closeProfileModal();
    });

    document.getElementById('payment-modal-close')?.addEventListener('click', function() {
        document.getElementById('payment-modal').classList.remove('open');
    });

    document.getElementById('submit-txid-btn')?.addEventListener('click', function() {
        const txid = document.getElementById('solana-txid-input').value.trim();
        if (txid) {
            alert("Thank you! We will verify your payment and deliver your rank soon.");
            setBasket([]);
            updateBasketCount();
            hideBasketMenu();
            document.getElementById('payment-modal').classList.remove('open');
        }
    });

    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) e.preventDefault();
    });

    function sanitize(str) {
        return str.replace(/[<>&"'`]/g, c => ({
            '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;','`':'&#96;'
        }[c]));
    }

    if (window.location.pathname.endsWith('shop.html')) {
        renderShop();
    }
    updateBasketCount();
    setupShopEvents();
    updateProfileDisplay();
});

// ========================================
// UI LAYER - all DOM access lives here
// State mutations go through `game` (GameState instance).
// ========================================

let game;             // GameState instance, assigned in main.js
let currentLang = 'en';

// Snapshots used to detect deltas for the particle burst effect.
const prev = {
    cupsSold: 0, profit: 0, day: 0, reputation: 0,
    angry: 0, happy: 0, waiting: 0, expensive: 0
};

// ----------------------------------------
// Particle effect on icon updates
// ----------------------------------------
function createParticleEffect(elementId, icon) {
    const container = document.getElementById(elementId);
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    for (let i = 0; i < 10; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.textContent = icon;
        p.style.left = `${startX}px`;
        p.style.top  = `${startY}px`;
        p.style.setProperty('--x', `${(Math.random() - 0.5) * 80}px`);
        p.style.setProperty('--y', `${(Math.random() - 0.5) * 80 - 40}px`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1500);
    }
}

// ----------------------------------------
// Activity log
// ----------------------------------------
function addLog(message, type = '') {
    const log = document.getElementById('logContent');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[Day ${game.day}] ${message}`;
    log.insertBefore(entry, log.firstChild);
    log.scrollTop = 0;
}

// ----------------------------------------
// Achievements
// ----------------------------------------
function showAchievementToast(achievement) {
    const t = translations[currentLang];
    const name = t['ach' + capitalizeId(achievement.id)] || achievement.id;
    const notif = document.getElementById('achievementNotif');
    notif.textContent = `🏆 ${name} ${t.unlocked}`;
    notif.style.display = 'block';
    setTimeout(() => { notif.style.display = 'none'; }, 3000);
}

function capitalizeId(id) {
    // first_sale -> FirstSale
    return id.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

function updateAchievementsList() {
    const list = document.getElementById('achievementsList');
    const t = translations[currentLang];
    list.innerHTML = '';

    const achTranslations = [
        { name: t.achFirstSale, desc: t.achFirstSaleDesc },
        { name: t.achBigDay,    desc: t.achBigDayDesc },
        { name: t.achRich,      desc: t.achRichDesc },
        { name: t.achTycoon,    desc: t.achTycoonDesc },
        { name: t.achWeek,      desc: t.achWeekDesc },
        { name: t.achMonth,     desc: t.achMonthDesc },
        { name: t.achPopular,   desc: t.achPopularDesc },
        { name: t.achPerfect,   desc: t.achPerfectDesc },
        { name: t.achMonopoly,  desc: t.achMonopolyDesc },
        { name: t.achUpgraded,  desc: t.achUpgradedDesc }
    ];

    ACHIEVEMENTS.forEach((achievement, index) => {
        const unlocked = game.unlockedAchievements.includes(achievement.id);
        const item = document.createElement('div');
        item.className = `achievement-item ${unlocked ? 'achievement-unlocked' : 'achievement-locked'}`;
        const achText = achTranslations[index];
        item.innerHTML = `
            <div class="achievement-header">${achievement.icon} ${achText.name}</div>
            <div class="achievement-progress">${achText.desc}</div>
            <div style="text-align: center; font-weight: bold; color: ${unlocked ? '#FFD700' : '#999'};">
                ${unlocked ? t.unlocked : t.locked}
            </div>
        `;
        list.appendChild(item);
    });
}

function processNewAchievements() {
    const newly = game.checkAchievements();
    newly.forEach(ach => {
        showAchievementToast(ach);
        SoundManager.play('achievement');
    });
}

// ----------------------------------------
// Main display refresh
// ----------------------------------------
function updateDisplay() {
    // Resources
    document.getElementById('money').textContent  = Math.floor(game.money);
    document.getElementById('lemons').textContent = game.lemons;
    document.getElementById('sugar').textContent  = game.sugar;
    document.getElementById('ice').textContent    = game.ice;

    const pitcherLevels = ['N', 'G', 'P'];
    document.getElementById('pitcher-display').textContent = pitcherLevels[game.upgrades.pitcher];

    const weather = WEATHER_TYPES.find(w => w.type === game.weather);
    document.getElementById('weatherIcon').textContent = weather.icon;

    // Bottom icons + particle effect on delta
    const setWithBurst = (id, value, prevKey, icon) => {
        const el = document.querySelector(`#${id} .icon-display-value`);
        const current = typeof value === 'number' ? value : parseFloat(value);
        if (current > prev[prevKey]) createParticleEffect(id, icon);
        el.textContent = value;
        prev[prevKey] = current;
    };

    setWithBurst('cupsSoldDisplay',  game.cupsSold,                       'cupsSold',  '🥤');
    setWithBurst('profitDisplay',    game.totalProfit.toFixed(2) + ' $',  'profit',    '🪙');
    setWithBurst('dayDisplay',       game.day,                            'day',       '📅');
    setWithBurst('reputationDisplay',game.reputation + '%',               'reputation','👍');
    setWithBurst('angryDisplay',     game.feedback.angry,                 'angry',     '😡');
    setWithBurst('happyDisplay',     game.feedback.happy,                 'happy',     '😊');
    setWithBurst('waitingDisplay',   game.feedback.waiting,               'waiting',   '⏳');
    setWithBurst('expensiveDisplay', game.feedback.expensive,             'expensive', '💵');

    updateSuppliesModalButtons();
    game.save();
    processNewAchievements();
}

// ----------------------------------------
// Modals & drawers
// ----------------------------------------
function toggleSettingsDrawer() {
    SoundManager.play('click');
    const drawer    = document.getElementById('settingsDrawer');
    const container = document.getElementById('imageContainer');
    const toggleBtn = document.getElementById('settingsToggleBtn');
    const descDrawer= document.getElementById('descriptionDrawer');
    const descBtn   = document.getElementById('descriptionToggleBtn');

    if (descDrawer.classList.contains('open')) {
        descDrawer.classList.remove('open');
        container.classList.remove('desc-open');
        descBtn.textContent = '❔';
    }
    drawer.classList.toggle('open');
    container.classList.toggle('drawer-open');
    toggleBtn.textContent = drawer.classList.contains('open') ? '❌' : '⚙️';
}

function toggleDescriptionDrawer() {
    SoundManager.play('click');
    const drawer        = document.getElementById('descriptionDrawer');
    const toggleBtn     = document.getElementById('descriptionToggleBtn');
    const container     = document.getElementById('imageContainer');
    const settingsDrawer= document.getElementById('settingsDrawer');
    const settingsBtn   = document.getElementById('settingsToggleBtn');

    if (settingsDrawer.classList.contains('open')) {
        settingsDrawer.classList.remove('open');
        container.classList.remove('drawer-open');
        settingsBtn.textContent = '⚙️';
    }
    drawer.classList.toggle('open');
    container.classList.toggle('desc-open');
    toggleBtn.textContent = drawer.classList.contains('open') ? '❌' : '❔';
}

function showUpgrades() {
    SoundManager.play('click');
    document.getElementById('upgradesModal').style.display = 'block';
    updateUpgradeDisplay();
}
function closeUpgrades() {
    SoundManager.play('click');
    document.getElementById('upgradesModal').style.display = 'none';
}

function showAchievements() {
    SoundManager.play('click');
    document.getElementById('achievementsModal').style.display = 'block';
    updateAchievementsList();
}
function closeAchievements() {
    SoundManager.play('click');
    document.getElementById('achievementsModal').style.display = 'none';
}

function showRecipe() {
    SoundManager.play('click');
    const lemons = document.getElementById('lemonSlider').value;
    const sugar  = document.getElementById('sugarSlider').value;
    const ice    = document.getElementById('iceSlider').value;
    const price  = document.getElementById('priceSlider').value;
    addLog(`📋 Recipe: ${lemons}🍋 + ${sugar}🍯 + ${ice}🧊 = ${price}$`, 'info');
}

function showSuppliesModal() {
    SoundManager.play('click');
    document.getElementById('suppliesModal').style.display = 'block';
    updateSuppliesModalButtons();
}
function closeSuppliesModal() {
    SoundManager.play('click');
    document.getElementById('suppliesModal').style.display = 'none';
}

function updateSuppliesModalButtons() {
    const buttons = document.querySelectorAll('#supplyList .supply-buy-btn');
    buttons.forEach(btn => {
        const type   = btn.getAttribute('data-type');
        const amount = parseInt(btn.getAttribute('data-amount'));
        const cost   = game.supplyPrices[type][amount];
        const costId = btn.getAttribute('data-cost-id');
        if (costId) document.getElementById(costId).textContent = cost;
        btn.disabled = game.money < cost;
    });
}

function buySupplyPack(event) {
    const btn    = event.target;
    const type   = btn.getAttribute('data-type');
    const amount = parseInt(btn.getAttribute('data-amount'));
    const result = game.buySupplyPack(type, amount);

    if (result.ok) {
        SoundManager.play('sell');
        const icon = type === 'lemons' ? '🍋' : type === 'sugar' ? '🍯' : '🧊';
        addLog(`🛒 Bought ${amount} ${icon} for ${result.cost}$.`, 'success');
        updateDisplay();
    } else {
        addLog('❌ Not enough money!', 'error');
    }
}

// ----------------------------------------
// Upgrades modal
// ----------------------------------------
function updateUpgradeDisplay() {
    const t = translations[currentLang];

    const pitcherLevels = [t.pitcherBasic, t.pitcherGood, t.pitcherExcellent];
    const pitcherCosts  = UPGRADE_COSTS.pitcher;
    document.getElementById('pitcherLevel').textContent = pitcherLevels[game.upgrades.pitcher];
    const pitcherBtn = document.getElementById('pitcherUpgradeBtn');
    if (game.upgrades.pitcher >= 2) {
        pitcherBtn.textContent = t.maxLevel;
        pitcherBtn.disabled = true;
    } else {
        pitcherBtn.textContent = `${t.upgrade} (${pitcherCosts[game.upgrades.pitcher]} $)`;
        pitcherBtn.disabled = game.money < pitcherCosts[game.upgrades.pitcher];
    }

    const signLevels = [t.signNone, t.signSmall, t.signLarge];
    const signCosts  = UPGRADE_COSTS.sign;
    document.getElementById('signLevel').textContent = signLevels[game.upgrades.sign];
    const signBtn = document.getElementById('signUpgradeBtn');
    if (game.upgrades.sign >= 2) {
        signBtn.textContent = t.maxLevel;
        signBtn.disabled = true;
    } else {
        signBtn.textContent = `${t.upgrade} (${signCosts[game.upgrades.sign]} $)`;
        signBtn.disabled = game.money < signCosts[game.upgrades.sign];
    }

    const tableLevels = [t.tableBasic, t.tableGood, t.tableLuxury];
    const tableCosts  = UPGRADE_COSTS.table;
    document.getElementById('tableLevel').textContent = tableLevels[game.upgrades.table];
    const tableBtn = document.getElementById('tableUpgradeBtn');
    if (game.upgrades.table >= 2) {
        tableBtn.textContent = t.maxLevel;
        tableBtn.disabled = true;
    } else {
        tableBtn.textContent = `${t.upgrade} (${tableCosts[game.upgrades.table]} $)`;
        tableBtn.disabled = game.money < tableCosts[game.upgrades.table];
    }

    document.getElementById('umbrellaStatus').textContent = game.upgrades.umbrella ? t.owned : t.notOwned;
    const umbrellaBtn = document.getElementById('umbrellaUpgradeBtn');
    if (game.upgrades.umbrella) {
        umbrellaBtn.textContent = t.purchased;
        umbrellaBtn.disabled = true;
    } else {
        umbrellaBtn.textContent = `${t.buy} (${UPGRADE_COSTS.umbrella} $)`;
        umbrellaBtn.disabled = game.money < UPGRADE_COSTS.umbrella;
    }
}

function buyUpgrade(type) {
    const result = game.buyUpgrade(type);
    if (result.ok) {
        SoundManager.play('upgrade');
        if (type === 'umbrella') {
            addLog('☂️ Purchased umbrella! Better sales in hot weather.', 'success');
        } else {
            const names = { pitcher: 'Pitcher', sign: 'Sign', table: 'Table' };
            addLog(`⬆️ Upgraded ${names[type]} to level ${result.newLevel + 1}!`, 'success');
        }
    }
    updateDisplay();
    updateUpgradeDisplay();
}

// ----------------------------------------
// Event banner
// ----------------------------------------
function updateEventBanner() {
    const banner = document.getElementById('eventBanner');
    const event = game.lastEvent;
    if (!event) { banner.style.display = 'none'; return; }

    const t = translations[currentLang];
    const map = {
        festival: t.eventFestival,
        competition: t.eventCompetition,
        celebrity: t.eventCelebrity,
        roadwork: t.eventRoadwork
    };
    const eventName = map[event.type] || event.name;
    banner.style.display = 'block';
    banner.textContent = `${event.icon} ${t.eventLabel} ${eventName}`;
}

// ----------------------------------------
// Day simulation orchestration
// ----------------------------------------
function startDay() {
    SoundManager.play('click');

    const lemons = parseInt(document.getElementById('lemonSlider').value);
    const sugar  = parseInt(document.getElementById('sugarSlider').value);
    const ice    = parseInt(document.getElementById('iceSlider').value);
    const price  = parseInt(document.getElementById('priceSlider').value);

    if (!game.canBrew(lemons, sugar, ice)) {
        addLog('❌ Not enough supplies!', 'error');
        return;
    }

    game.resetFeedback();
    const plan = game.planDay({ lemons, sugar, ice, price });

    window.updatePhaserStand(game.upgrades);
    document.getElementById('simDayDisplay').textContent = game.day;
    document.getElementById('startDayBtn').disabled = true;
    document.getElementById('liveSimulationModal').style.display = 'block';
    window.startPhaserSimulation(plan.maxCups, plan.satisfactionRate);

    const simulationDuration = plan.maxCups * 1500 + 3000;
    const timeoutId = setTimeout(() => {
        finalizeDay(plan, { lemons, sugar, ice, price });
        document.getElementById('startDayBtn').disabled = false;
    }, simulationDuration);

    document.getElementById('skipDayBtn').onclick = function () {
        clearTimeout(timeoutId);
        window.skipPhaserDay();
        finalizeDay(plan, { lemons, sugar, ice, price });
        document.getElementById('startDayBtn').disabled = false;
    };
}

function finalizeDay(plan, recipe) {
    const summary = game.applyDayResult({ ...plan, ...recipe });

    if (summary.tier === 'no_supplies') {
        addLog('⚠️ Demand exists, but no supplies!', 'error');
    } else if (summary.tier === 'no_customers') {
        addLog('📉 No customers today.', 'warning');
    } else {
        const m = summary.maxCups;
        switch (summary.tier) {
            case 'love':
                addLog(`⭐⭐⭐ Customers love it! Sold ${m} cups! Rep +10`, 'success'); break;
            case 'very_happy':
                addLog(`⭐⭐ Very happy! Sold ${m} cups! Rep +7`, 'success'); break;
            case 'satisfied':
                addLog(`⭐ Satisfied. Sold ${m} cups. Rep +3`, 'success'); break;
            case 'unhappy':
                addLog(`😞 Customers unhappy. Rep -5`, 'error'); break;
            default:
                addLog(`✅ Good day! Sold ${m} cups.`, 'info');
        }
        addLog(`💰 Earned ${summary.revenue}$ selling ${m} cups.`, 'success');
    }

    if (summary.competitorChange === 'only_stand') addLog('🏆 You are the only stand!', 'success');
    else if (summary.competitorChange === 'closed') addLog('👋 A competitor closed!', 'success');
    else if (summary.competitorChange === 'new')    addLog('🏪 New competitor opened!', 'warning');

    document.getElementById('liveSimulationModal').style.display = 'none';
    updateEventBanner();
    updateDisplay();
}

function quickBuySupplies() {
    SoundManager.play('click');
    const result = game.quickBuySupplies();
    if (!result.ok) {
        addLog('❌ Not enough money! Need 30$.', 'error');
        return;
    }
    SoundManager.play('sell');
    addLog(`🛒 QUICK BUY: ${result.items}🍋 ${result.items}🍯 ${result.items}🧊 (-${result.cost}$)`, 'success');
    updateDisplay();
}

// ----------------------------------------
// Sound toggle
// ----------------------------------------
function toggleSound() {
    const enabled = SoundManager.toggle();
    document.getElementById('soundToggle').textContent = enabled ? '🔊' : '🔇';
}

// ----------------------------------------
// Language toggle
// ----------------------------------------
function toggleLanguage() {
    SoundManager.play('click');
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.documentElement.setAttribute('dir',  currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang === 'ar' ? 'ar' : 'en');
    updateTexts();
    document.getElementById('langIcon').textContent = currentLang === 'ar' ? 'AR' : 'EN';
}

function updateTexts() {
    const t = translations[currentLang];

    document.getElementById('startDayBtn').innerHTML    = t.startDay;
    document.getElementById('buySuppliesBtn').innerHTML = t.buySupplies;

    document.querySelectorAll('.menu-btn-text')[0].textContent = t.upgrades;
    document.querySelectorAll('.menu-btn-text')[1].textContent = t.supplies;
    document.querySelectorAll('.menu-btn-text')[2].textContent = t.recipe;
    document.querySelectorAll('.menu-btn-text')[3].textContent = t.achievements;

    document.querySelector('.log-title').textContent = t.logTitle;

    document.querySelector('.settings-title').textContent = t.settingsTitle;
    document.querySelectorAll('.setting-label')[0].textContent = t.lemonsPerCup;
    document.querySelectorAll('.setting-label')[1].textContent = t.sugarPerCup;
    document.querySelectorAll('.setting-label')[2].textContent = t.icePerCup;
    document.querySelectorAll('.setting-label')[3].textContent = t.cupPrice;

    document.querySelector('.description-title').textContent = t.descTitle;
    document.querySelector('.description-section p').textContent = t.descText;

    document.getElementById('angryDisplay').setAttribute('title', t.angry);
    document.getElementById('happyDisplay').setAttribute('title', t.happy);
    document.getElementById('waitingDisplay').setAttribute('title', t.waiting);
    document.getElementById('expensiveDisplay').setAttribute('title', t.expensive);
    document.getElementById('cupsSoldDisplay').setAttribute('title', t.cupsSold);
    document.getElementById('profitDisplay').setAttribute('title', t.profit);
    document.getElementById('dayDisplay').setAttribute('title', t.day);
    document.getElementById('reputationDisplay').setAttribute('title', t.reputation);

    const upgradesModal = document.getElementById('upgradesModal');
    upgradesModal.querySelector('.modal-title').textContent = t.upgradesTitle;
    upgradesModal.querySelectorAll('.upgrade-header')[0].textContent = t.pitcherQuality;
    upgradesModal.querySelectorAll('.upgrade-header')[1].textContent = t.sign;
    upgradesModal.querySelectorAll('.upgrade-header')[2].textContent = t.table;
    upgradesModal.querySelectorAll('.upgrade-header')[3].textContent = t.umbrella;
    document.getElementById('closeUpgradesBtn').textContent = t.close;

    const suppliesModal = document.getElementById('suppliesModal');
    suppliesModal.querySelector('.modal-title').textContent = t.suppliesTitle;
    suppliesModal.querySelectorAll('.supply-header')[0].textContent = t.lemons;
    suppliesModal.querySelectorAll('.supply-header')[1].textContent = t.sugar;
    suppliesModal.querySelectorAll('.supply-header')[2].textContent = t.ice;
    document.querySelectorAll('.supply-buy-btn').forEach(btn => { btn.textContent = t.buyBtn; });
    document.getElementById('closeSuppliesBtn').textContent = t.close;

    document.getElementById('achievementsModal').querySelector('.modal-title').textContent = t.achievementsTitle;
    document.getElementById('closeAchievementsBtn').textContent = t.close;

    updateUpgradeDisplay();
    if (document.getElementById('achievementsModal').style.display === 'block') {
        updateAchievementsList();
    }
    updateEventBanner();
}

// Expose what main.js needs
window.UI = {
    setGame(instance) { game = instance; },
    addLog,
    updateDisplay,
    updateEventBanner,
    toggleSettingsDrawer,
    toggleDescriptionDrawer,
    showUpgrades, closeUpgrades,
    showAchievements, closeAchievements,
    showRecipe,
    showSuppliesModal, closeSuppliesModal,
    buySupplyPack,
    buyUpgrade,
    startDay,
    quickBuySupplies,
    toggleSound,
    toggleLanguage,
    syncPrevSnapshot() {
        prev.cupsSold   = game.cupsSold;
        prev.profit     = game.totalProfit;
        prev.day        = game.day;
        prev.reputation = game.reputation;
        prev.angry      = game.feedback.angry;
        prev.happy      = game.feedback.happy;
        prev.waiting    = game.feedback.waiting;
        prev.expensive  = game.feedback.expensive;
    }
};

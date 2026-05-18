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
// Achievements — toast queue (no overwrite when multiple unlock at once)
// ----------------------------------------
const toastQueue = [];
let toastActive = false;

function showAchievementToast(achievement) {
    toastQueue.push(achievement);
    processToastQueue();
}

function processToastQueue() {
    if (toastActive || toastQueue.length === 0) return;
    const achievement = toastQueue.shift();
    const t = translations[currentLang];
    const name = t['ach' + capitalizeId(achievement.id)] || achievement.id;
    const notif = document.getElementById('achievementNotif');
    notif.textContent = `${achievement.icon} ${name} — ${t.unlockedToast || t.unlocked}`;
    notif.style.display = 'block';
    toastActive = true;
    const dismiss = () => {
        notif.style.display = 'none';
        notif.onclick = null;
        toastActive = false;
        processToastQueue();
    };
    notif.onclick = dismiss;
    setTimeout(dismiss, 3000);
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
    document.getElementById('loyalCount').textContent = game.loyalCustomers || 0;

    const pitcherLevels = ['N', 'G', 'P'];
    document.getElementById('pitcher-display').textContent = pitcherLevels[game.upgrades.pitcher];

    const weather = WEATHER_TYPES.find(w => w.type === game.weather);
    document.getElementById('weatherIcon').textContent = weather.icon;

    updateCrowdBanner();
    updateChallengeBanner();
    updateRivalWidget();
    if (window.updatePhaserAmbience) {
        window.updatePhaserAmbience(game.weather, game.getTimeOfDay());
    }

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
    flashSaveIndicator();
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

    // ---- Advanced (tech tree) ----
    renderAdvancedUpgrade('industrialPress', t.upgradeIndustrialPress, t.reqPitcher2);
    renderAdvancedUpgrade('neonSign',        t.upgradeNeonSign,        t.reqSign2);
    renderAdvancedUpgrade('lounge',          t.upgradeLounge,          t.reqTableUmbrella);
    document.getElementById('advancedDivider').textContent = t.advancedUpgradesTitle;
}

function renderAdvancedUpgrade(key, label, requirementLabel) {
    const t = translations[currentLang];
    const item   = document.getElementById(`${key}Item`);
    const header = document.getElementById(`${key}Header`);
    const status = document.getElementById(`${key}Status`);
    const btn    = document.getElementById(`${key}Btn`);
    const owned  = !!game.upgrades[key];
    const unlocked = game.isAdvancedUnlocked(key);

    header.textContent = label;
    item.classList.toggle('locked', !owned && !unlocked);

    if (owned) {
        status.textContent = t.owned;
        btn.textContent = t.purchased;
        btn.disabled = true;
    } else if (!unlocked) {
        status.textContent = `${t.upgradeLocked} ${requirementLabel}`;
        btn.textContent = `${t.buy} (${UPGRADE_COSTS[key]} $)`;
        btn.disabled = true;
    } else {
        status.textContent = t.notOwned;
        btn.textContent = `${t.buy} (${UPGRADE_COSTS[key]} $)`;
        btn.disabled = game.money < UPGRADE_COSTS[key];
    }
}

function buyUpgrade(type) {
    const result = game.buyUpgrade(type);
    if (result.ok) {
        SoundManager.play('upgrade');
        if (type === 'umbrella') {
            addLog('☂️ Purchased umbrella! Better sales in hot weather.', 'success');
        } else if (type === 'industrialPress') {
            addLog('🏭 Industrial Press installed — pitcher quality boosted!', 'success');
        } else if (type === 'neonSign') {
            addLog('💡 Neon Sign lit — crowds notice from afar!', 'success');
        } else if (type === 'lounge') {
            addLog('🛋️ Lounge built — customers stay longer and tip better!', 'success');
        } else {
            const names = { pitcher: 'Pitcher', sign: 'Sign', table: 'Table' };
            addLog(`⬆️ Upgraded ${names[type]} to level ${result.newLevel + 1}!`, 'success');
        }
    }
    updateDisplay();
    updateUpgradeDisplay();
}

// ----------------------------------------
// Rival stand widget (price + trend + time of day)
// ----------------------------------------
function updateRivalWidget() {
    const t = translations[currentLang];
    const labelEl = document.getElementById('rivalLabel');
    const priceEl = document.getElementById('rivalPrice');
    const trendEl = document.getElementById('rivalTrend');
    const timeEl  = document.getElementById('rivalTime');
    if (!priceEl) return;

    if (labelEl) labelEl.textContent = t.rivalLabel || '🏪 Rival';
    priceEl.textContent = game.competitorPrice ?? 5;

    trendEl.classList.remove('up', 'down');
    if (game.competitorTrend > 0) {
        trendEl.textContent = t.rivalTrendUp || '↑';
        trendEl.classList.add('up');
    } else if (game.competitorTrend < 0) {
        trendEl.textContent = t.rivalTrendDown || '↓';
        trendEl.classList.add('down');
    } else {
        trendEl.textContent = t.rivalTrendStable || '—';
    }

    const timeMap = {
        morning: t.timeMorning, noon: t.timeNoon,
        evening: t.timeEvening, night: t.timeNight
    };
    timeEl.textContent = timeMap[game.getTimeOfDay()] || '';
}

// ----------------------------------------
// Today's crowd banner (hints at dominant demographic preferences)
// ----------------------------------------
function updateCrowdBanner() {
    const banner = document.getElementById('crowdBanner');
    const labelEl = document.getElementById('crowdLabel');
    const valueEl = document.getElementById('crowdValue');
    if (!banner || !valueEl) return;
    const t = translations[currentLang];
    const type = game.todaysCustomerType;
    if (!type) { banner.style.display = 'none'; return; }
    const map = {
        child: t.crowdChild, teen: t.crowdTeen, adult: t.crowdAdult,
        elder: t.crowdElder, woman: t.crowdWoman, man: t.crowdMan
    };
    labelEl.textContent = t.crowdLabel;
    valueEl.textContent = map[type] || t.crowdAdult;
    banner.style.display = 'flex';
}

// ----------------------------------------
// Daily challenge banner
// ----------------------------------------
function challengeDescription(ch) {
    const t = translations[currentLang];
    if (!ch) return '';
    switch (ch.type) {
        case 'minCups':   return (t.challengeMinCups   || '').replace('{n}', ch.target);
        case 'minProfit': return (t.challengeMinProfit || '').replace('{n}', ch.target);
        case 'maxAngry':  return t.challengeMaxAngry || '';
        case 'minHappy':  return (t.challengeMinHappy  || '').replace('{n}', ch.target);
        case 'maxPrice':  return (t.challengeMaxPrice  || '').replace('{n}', ch.target);
        case 'minTier':   return (t.challengeMinTier   || '').replace('{tier}', ch.target);
        default: return '';
    }
}

function updateChallengeBanner() {
    const banner = document.getElementById('challengeBanner');
    if (!banner) return;
    const ch = game.currentChallenge;
    if (!ch) { banner.style.display = 'none'; return; }
    const t = translations[currentLang];
    document.getElementById('challengeLabel').textContent = t.challengeBannerLabel || '🎯 Challenge:';
    document.getElementById('challengeText').textContent = challengeDescription(ch);
    document.getElementById('challengeReward').textContent =
        `+${ch.reward.money || 0}$` + (ch.reward.rep ? ` +${ch.reward.rep}🪙` : '');
    banner.classList.toggle('completed', !!ch.completed);
    banner.style.display = 'flex';
}

// ----------------------------------------
// Story mode modal
// ----------------------------------------
function showStoryModal() {
    SoundManager.play('click');
    renderStoryList();
    document.getElementById('storyModal').style.display = 'block';
}
function closeStoryModal() {
    SoundManager.play('click');
    document.getElementById('storyModal').style.display = 'none';
}

function renderStoryList() {
    const t = translations[currentLang];
    document.getElementById('storyTitleEl').textContent = t.storyTitle;
    const list = document.getElementById('storyList');
    list.innerHTML = '';
    const total = 8;
    for (let i = 0; i < total; i++) {
        const idx = i + 1;
        const isDone   = game.storyProgress > i;
        const isActive = game.storyProgress === i;
        const stateLabel = isDone ? t.storyChapterDone : (isActive ? t.storyChapterActive : t.storyChapterLocked);
        const cls = isDone ? 'done' : (isActive ? 'active' : 'locked');
        const description = t[`storyChapter${idx}`] || `Chapter ${idx}`;
        const div = document.createElement('div');
        div.className = `story-chapter ${cls}`;
        div.innerHTML = `
            <div><b>${t.storyChapterLabel} ${idx}</b> — ${description}
                <span class="story-chapter-state">${stateLabel}</span>
            </div>
        `;
        list.appendChild(div);
    }
    if (game.storyProgress >= total) {
        const done = document.createElement('div');
        done.className = 'story-chapter done';
        done.innerHTML = `<div>${t.storyAllDone}</div>`;
        list.appendChild(done);
    }
}

// ----------------------------------------
// Leaderboard modal
// ----------------------------------------
function showLeaderboardModal() {
    SoundManager.play('click');
    const t = translations[currentLang];
    const lb = GameState.getLeaderboard();

    document.getElementById('leaderboardTitleEl').textContent = t.leaderboardTitle;
    document.getElementById('recBestDayLabel').textContent     = t.recBestDayProfit;
    document.getElementById('recBestTotalLabel').textContent   = t.recBestTotalProfit;
    document.getElementById('recBestStreakLabel').textContent  = t.recBestStreak;
    document.getElementById('recBestLoyalLabel').textContent   = t.recBestLoyal;
    document.getElementById('recBestDayLabelDays').textContent = t.recBestDay;

    document.getElementById('recBestDayProfit').textContent   = `$${(lb.bestDayProfit || 0).toFixed(2)}`;
    document.getElementById('recBestTotalProfit').textContent = `$${(lb.bestTotalProfit || 0).toFixed(2)}`;
    document.getElementById('recBestStreak').textContent      = lb.bestStreak || 0;
    document.getElementById('recBestLoyal').textContent       = lb.bestLoyal || 0;
    document.getElementById('recBestDay').textContent         = lb.bestDay || 0;

    document.getElementById('leaderboardModal').style.display = 'block';
}
function closeLeaderboardModal() {
    SoundManager.play('click');
    document.getElementById('leaderboardModal').style.display = 'none';
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
        roadwork: t.eventRoadwork,
        lemonShortage: t.eventLemonShortage,
        viral: t.eventViral,
        heatwave: t.eventHeatwave
    };
    const eventName = map[event.type] || event.name;
    banner.style.display = 'block';
    banner.textContent = `${event.icon} ${t.eventLabel} ${eventName}`;
}

// ----------------------------------------
// Day simulation orchestration
// ----------------------------------------
function readRecipeFromSliders() {
    return {
        lemons: parseInt(document.getElementById('lemonSlider').value),
        sugar:  parseInt(document.getElementById('sugarSlider').value),
        ice:    parseInt(document.getElementById('iceSlider').value),
        price:  parseInt(document.getElementById('priceSlider').value)
    };
}

function persistRecipe() {
    game.recipe = readRecipeFromSliders();
    game.save();
}

function resetProgressBar() {
    const fill = document.getElementById('simProgressFill');
    const text = document.getElementById('simTimer');
    if (fill) fill.style.width = '0%';
    if (text) text.textContent = '0%';
}

function startDay() {
    SoundManager.play('click');

    const recipe = readRecipeFromSliders();

    if (!game.canBrew(recipe.lemons, recipe.sugar, recipe.ice)) {
        addLog('❌ Not enough supplies!', 'error');
        return;
    }

    game.recipe = recipe; // persist last-used recipe alongside game state
    game.resetFeedback();
    const plan = game.planDay(recipe);

    window.updatePhaserStand(game.upgrades);
    document.getElementById('simDayDisplay').textContent = game.day;
    document.getElementById('startDayBtn').disabled = true;
    document.getElementById('liveSimulationModal').style.display = 'block';
    resetProgressBar();
    window.startPhaserSimulation(plan.maxCups, plan.satisfactionRate, plan.primaryType);

    const simulationDuration = Math.max(plan.maxCups * 1500 + 3000, 3000);
    const timeoutId = setTimeout(() => {
        finalizeDay(plan, recipe);
        document.getElementById('startDayBtn').disabled = false;
    }, simulationDuration);

    document.getElementById('skipDayBtn').onclick = function () {
        clearTimeout(timeoutId);
        window.skipPhaserDay();
        finalizeDay(plan, recipe);
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

    const t = translations[currentLang];
    if (summary.loyaltyDelta > 0) {
        addLog((t.loyaltyGained || '🤝 +{n} regulars').replace('{n}', summary.loyaltyDelta), 'success');
    } else if (summary.loyaltyDelta < 0) {
        addLog((t.loyaltyLost || '💔 Lost {n} regulars').replace('{n}', Math.abs(summary.loyaltyDelta)), 'warning');
    }
    if (summary.spoilage) {
        const s = summary.spoilage;
        addLog((t.spoilageLog || '🗑️ Spoiled: {l}🍋 {s}🍯 {i}🧊')
                .replace('{l}', s.lemons || 0)
                .replace('{s}', s.sugar  || 0)
                .replace('{i}', s.ice    || 0), 'warning');
    }

    // Challenge result for the day just finished
    if (summary.challenge) {
        const ch = summary.challenge;
        const desc = challengeDescription(ch);
        if (ch.completed) {
            addLog((t.challengeDone || '✅ Challenge complete! +{m}$ +{r}🪙')
                .replace('{m}', ch.reward.money || 0)
                .replace('{r}', ch.reward.rep || 0), 'success');
            SoundManager.play('achievement');
        } else {
            addLog((t.challengeFailed || '❌ Challenge missed: {desc}').replace('{desc}', desc), 'warning');
        }
    }

    // Story chapter advances
    (summary.storyAdvances || []).forEach(ch => {
        addLog((t.storyAdvance || '📜 Chapter {n} complete! +{m}$ +{r}🪙')
            .replace('{n}', ch.id)
            .replace('{m}', ch.reward.money || 0)
            .replace('{r}', ch.reward.rep || 0), 'success');
        SoundManager.play('achievement');
    });

    // New personal records
    (summary.records || []).forEach(key => {
        const labelMap = {
            bestDayProfit: t.recBestDayProfit,
            bestTotalProfit: t.recBestTotalProfit,
            bestStreak: t.recBestStreak,
            bestLoyal: t.recBestLoyal,
            bestDay: t.recBestDay
        };
        const what = labelMap[key] || key;
        addLog((t.newRecord || '🏅 NEW RECORD: {what}!').replace('{what}', what), 'success');
    });

    document.getElementById('liveSimulationModal').style.display = 'none';
    updateEventBanner();
    updateDisplay();
    showDailyReport(summary);
}

// ----------------------------------------
// Daily report modal + profit chart
// ----------------------------------------
function showDailyReport(summary) {
    const t = translations[currentLang];

    // Title contents
    document.getElementById('reportDay').textContent = summary.day;

    // Tier label
    const tierMap = {
        love:          t.tierLove,
        very_happy:    t.tierVeryHappy,
        satisfied:     t.tierSatisfied,
        unhappy:       t.tierUnhappy,
        good:          t.tierGood,
        no_supplies:   t.tierNoSupplies,
        no_customers:  t.tierNoCustomers
    };
    document.getElementById('reportTier').textContent = tierMap[summary.tier] || '—';

    // Stat rows
    document.getElementById('reportCups').textContent     = summary.maxCups;
    document.getElementById('reportRevenue').textContent  = `$${summary.revenue.toFixed(2)}`;
    document.getElementById('reportCost').textContent     = `$${summary.cost.toFixed(2)}`;
    document.getElementById('reportProfit').textContent   = `$${summary.profit.toFixed(2)}`;
    const repSign = summary.reputationDelta >= 0 ? '+' : '';
    document.getElementById('reportRep').textContent      = `${repSign}${summary.reputationDelta}`;

    // Localized labels
    document.getElementById('reportCupsLabel').textContent     = t.reportCups;
    document.getElementById('reportRevenueLabel').textContent  = t.reportRevenue;
    document.getElementById('reportCostLabel').textContent     = t.reportCost;
    document.getElementById('reportProfitLabel').textContent   = t.reportProfit;
    document.getElementById('reportRepLabel').textContent      = t.reportRep;
    document.getElementById('reportChartTitle').textContent    = t.reportChartTitle;
    document.getElementById('closeReportBtn').textContent      = t.reportContinue;

    // Chart
    renderProfitChart();

    document.getElementById('dailyReportModal').style.display = 'block';
}

function renderProfitChart() {
    const chart = document.getElementById('reportChart');
    chart.innerHTML = '';
    const history = game.dailyHistory;
    if (history.length === 0) {
        chart.innerHTML = '<div style="color:#888;font-size:0.85em;margin:auto;">—</div>';
        return;
    }
    const maxAbs = Math.max(1, ...history.map(d => Math.abs(d.profit)));
    history.forEach(d => {
        const bar = document.createElement('div');
        const height = Math.max(2, Math.round((Math.abs(d.profit) / maxAbs) * 70));
        bar.className = 'chart-bar' + (d.profit < 0 ? ' negative' : '');
        bar.style.height = `${height}px`;
        bar.title = `Day ${d.day}: $${d.profit.toFixed(2)}`;
        bar.dataset.label = (d.profit >= 0 ? '+' : '') + d.profit.toFixed(0);
        chart.appendChild(bar);
    });
}

function closeDailyReport() {
    SoundManager.play('click');
    document.getElementById('dailyReportModal').style.display = 'none';
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
// Reset game
// ----------------------------------------
function resetGame() {
    SoundManager.play('click');
    const t = translations[currentLang];
    if (!confirm(t.resetConfirm)) return;
    GameState.clearAll();
    toastQueue.length = 0;
    location.reload();
}

// ----------------------------------------
// Save indicator (subtle visual cue when game saves)
// ----------------------------------------
let saveIndicatorTimer = null;
function flashSaveIndicator() {
    const el = document.getElementById('saveIndicator');
    if (!el) return;
    const t = translations[currentLang];
    el.textContent = t.savedIndicator || '💾 Saved';
    el.classList.add('visible');
    clearTimeout(saveIndicatorTimer);
    saveIndicatorTimer = setTimeout(() => el.classList.remove('visible'), 900);
}

// ----------------------------------------
// Difficulty selection (first run)
// ----------------------------------------
function showDifficultyModal() {
    document.getElementById('difficultyModal').style.display = 'block';
}

function pickDifficulty(diff) {
    SoundManager.play('click');
    const newGame = new GameState(diff);
    newGame.rollWeather();
    newGame.rollEvent();
    newGame.rollCustomerMix();
    newGame.rollChallenge();
    newGame.applyEventSupplyEffects();
    newGame.save();

    window.game = newGame;
    game = newGame;
    syncPrevSnapshot();
    updateDisplay();
    updateEventBanner();
    restoreRecipeToSliders();
    updateDifficultyDisplay();

    document.getElementById('difficultyModal').style.display = 'none';
    startTutorial();
}

function updateDifficultyDisplay() {
    const t = translations[currentLang];
    const labelEl = document.getElementById('currentDifficultyLabel');
    const valEl = document.getElementById('currentDifficultyValue');
    if (!labelEl || !valEl) return;
    labelEl.textContent = t.currentDifficulty;
    const diffMap = { easy: t.diffEasy, normal: t.diffNormal, hard: t.diffHard };
    valEl.textContent = diffMap[game.difficulty] || t.diffNormal;
}

// ----------------------------------------
// Tutorial overlay
// ----------------------------------------
const TUTORIAL_STEPS = [
    { target: null,                  titleKey: 'tutWelcomeTitle',   textKey: 'tutWelcomeText'   },
    { target: '.resources-bar',      titleKey: 'tutResourcesTitle', textKey: 'tutResourcesText' },
    { target: '#settingsToggleBtn',  titleKey: 'tutRecipeTitle',    textKey: 'tutRecipeText'    },
    { target: '#buySuppliesBtn',     titleKey: 'tutSuppliesTitle',  textKey: 'tutSuppliesText'  },
    { target: '#startDayBtn',        titleKey: 'tutStartTitle',     textKey: 'tutStartText'     }
];
let tutStep = 0;

function startTutorial() {
    tutStep = 0;
    document.getElementById('tutorialOverlay').classList.add('visible');
    showTutorialStep();
}

function showTutorialStep() {
    document.querySelectorAll('.tut-highlight').forEach(el => el.classList.remove('tut-highlight'));

    const step = TUTORIAL_STEPS[tutStep];
    const t = translations[currentLang];

    document.getElementById('tutStep').textContent = tutStep + 1;
    document.getElementById('tutStepLabel').textContent = t.tutorialStep;
    document.getElementById('tutTitle').textContent = t[step.titleKey];
    document.getElementById('tutText').textContent = t[step.textKey];

    const nextBtn = document.getElementById('tutNextBtn');
    nextBtn.textContent = (tutStep === TUTORIAL_STEPS.length - 1) ? t.tutorialDone : t.tutorialNext;
    document.getElementById('tutSkipBtn').textContent = t.tutorialSkip;

    if (step.target) {
        const el = document.querySelector(step.target);
        if (el) el.classList.add('tut-highlight');
    }
}

function nextTutorialStep() {
    SoundManager.play('click');
    tutStep++;
    if (tutStep >= TUTORIAL_STEPS.length) {
        endTutorial();
    } else {
        showTutorialStep();
    }
}

function endTutorial() {
    SoundManager.play('click');
    document.querySelectorAll('.tut-highlight').forEach(el => el.classList.remove('tut-highlight'));
    document.getElementById('tutorialOverlay').classList.remove('visible');
    GameState.markOnboarded();
}

// ----------------------------------------
// Colorblind mode (visual cues independent of color)
// ----------------------------------------
const COLORBLIND_KEY = 'lemonadeTycoonColorblind';

function applyColorblind(enabled) {
    document.body.classList.toggle('colorblind', enabled);
    const btn = document.getElementById('colorblindBtn');
    if (btn) {
        const t = translations[currentLang];
        btn.textContent = enabled ? t.colorblindOn : t.colorblindOff;
    }
}

function toggleColorblind() {
    SoundManager.play('click');
    const enabled = localStorage.getItem(COLORBLIND_KEY) !== '1';
    localStorage.setItem(COLORBLIND_KEY, enabled ? '1' : '0');
    applyColorblind(enabled);
    if (document.getElementById('dailyReportModal').style.display === 'block') {
        renderProfitChart();
    }
}

function initColorblind() {
    applyColorblind(localStorage.getItem(COLORBLIND_KEY) === '1');
}

// ----------------------------------------
// Slider <-> game.recipe sync
// ----------------------------------------
function restoreRecipeToSliders() {
    const r = game.recipe || { lemons: 3, sugar: 3, ice: 3, price: 5 };
    document.getElementById('lemonSlider').value = r.lemons;
    document.getElementById('lemonValue').textContent = r.lemons;
    document.getElementById('sugarSlider').value = r.sugar;
    document.getElementById('sugarValue').textContent = r.sugar;
    document.getElementById('iceSlider').value = r.ice;
    document.getElementById('iceValue').textContent = r.ice;
    document.getElementById('priceSlider').value = r.price;
    document.getElementById('priceValue').textContent = r.price + ' $';
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

    document.getElementById('resetGameBtn').textContent = t.resetButton;
    document.getElementById('replayTutorialBtn').textContent = t.tutorialBtn;

    // Refresh colorblind button label
    const cbEnabled = document.body.classList.contains('colorblind');
    document.getElementById('colorblindBtn').textContent = cbEnabled ? t.colorblindOn : t.colorblindOff;

    updateDifficultyDisplay();
    updateCrowdBanner();
    updateChallengeBanner();
    updateRivalWidget();
    updateUpgradeDisplay();
    // Re-localize labels on bottom buttons + modal labels
    const storyBtn = document.getElementById('storyBtn');
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    if (storyBtn) storyBtn.textContent = t.storyBtn;
    if (leaderboardBtn) leaderboardBtn.textContent = t.leaderboardBtn;
    if (document.getElementById('storyModal').style.display === 'block')      renderStoryList();
    if (document.getElementById('leaderboardModal').style.display === 'block') showLeaderboardModal();
    if (document.getElementById('achievementsModal').style.display === 'block') {
        updateAchievementsList();
    }
    updateEventBanner();
}

function syncPrevSnapshot() {
    prev.cupsSold   = game.cupsSold;
    prev.profit     = game.totalProfit;
    prev.day        = game.day;
    prev.reputation = game.reputation;
    prev.angry      = game.feedback.angry;
    prev.happy      = game.feedback.happy;
    prev.waiting    = game.feedback.waiting;
    prev.expensive  = game.feedback.expensive;
}

function onPhaserReady() {
    if (game && window.updatePhaserAmbience) {
        window.updatePhaserAmbience(game.weather, game.getTimeOfDay());
    }
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
    resetGame,
    restoreRecipeToSliders,
    persistRecipe,
    closeDailyReport,
    syncPrevSnapshot,
    updateDifficultyDisplay,
    showDifficultyModal,
    pickDifficulty,
    startTutorial,
    nextTutorialStep,
    endTutorial,
    toggleColorblind,
    initColorblind,
    onPhaserReady,
    showStoryModal,
    closeStoryModal,
    showLeaderboardModal,
    closeLeaderboardModal
};

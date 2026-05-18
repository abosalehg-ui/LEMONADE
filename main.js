// ========================================
// MAIN - entry point, wires GameState + UI + sounds + Phaser
// ========================================

(function init() {
    SoundManager.init();

    const hadSave = !!localStorage.getItem('lemonadeTycoonSave');
    const game = GameState.load();
    window.game = game; // exposed for game.js / Phaser scene compatibility

    UI.setGame(game);
    if (hadSave) UI.addLog('💾 Game loaded successfully!', 'success');
    game.rollWeather();
    game.rollEvent();

    // Seed the prev-snapshot so the first updateDisplay doesn't trigger particles.
    UI.syncPrevSnapshot();
    UI.updateDisplay();
    UI.updateEventBanner();

    // ---- Button wiring ----
    document.getElementById('upgradesBtn').onclick     = UI.showUpgrades;
    document.getElementById('suppliesBtn').onclick     = UI.showSuppliesModal;
    document.getElementById('recipeBtn').onclick       = UI.showRecipe;
    document.getElementById('achievementsBtn').onclick = UI.showAchievements;
    document.getElementById('startDayBtn').onclick     = UI.startDay;
    document.getElementById('buySuppliesBtn').onclick  = UI.quickBuySupplies;
    document.getElementById('closeUpgradesBtn').onclick     = UI.closeUpgrades;
    document.getElementById('closeSuppliesBtn').onclick     = UI.closeSuppliesModal;
    document.getElementById('closeAchievementsBtn').onclick = UI.closeAchievements;
    document.getElementById('soundToggle').onclick          = UI.toggleSound;
    document.getElementById('languageToggle').onclick       = UI.toggleLanguage;
    document.getElementById('settingsToggleBtn').onclick    = UI.toggleSettingsDrawer;
    document.getElementById('descriptionToggleBtn').onclick = UI.toggleDescriptionDrawer;

    document.querySelectorAll('.supply-buy-btn').forEach(btn => {
        btn.onclick = UI.buySupplyPack;
    });

    document.getElementById('pitcherUpgradeBtn').onclick  = () => UI.buyUpgrade('pitcher');
    document.getElementById('signUpgradeBtn').onclick     = () => UI.buyUpgrade('sign');
    document.getElementById('tableUpgradeBtn').onclick    = () => UI.buyUpgrade('table');
    document.getElementById('umbrellaUpgradeBtn').onclick = () => UI.buyUpgrade('umbrella');

    // ---- Slider value mirrors ----
    const mirror = (sliderId, valueId, suffix = '') => {
        const slider = document.getElementById(sliderId);
        const value  = document.getElementById(valueId);
        slider.oninput = function () { value.textContent = this.value + suffix; };
    };
    mirror('lemonSlider', 'lemonValue');
    mirror('sugarSlider', 'sugarValue');
    mirror('iceSlider',   'iceValue');
    mirror('priceSlider', 'priceValue', ' $');

    // ---- Speed toggle (Phaser sim) ----
    document.getElementById('speedToggleBtn').onclick = function () {
        SoundManager.play('click');
        const scene = window.phaserGame?.scene.getScene('LemonadeStandScene');
        if (scene && scene.isSimulating) {
            scene.toggleSpeed();
            this.textContent = scene.simSpeed === 1 ? '⏩ x1' : '⏩ x10';
        }
    };

    // ---- Lazy bg music kick-off on first user interaction ----
    document.body.addEventListener('click', function () {
        if (SoundManager.enabled && SoundManager.audio.bgMusic?.paused) {
            SoundManager.play('bgMusic');
        }
    }, { once: true });
})();

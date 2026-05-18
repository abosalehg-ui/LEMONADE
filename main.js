// ========================================
// MAIN - entry point, wires GameState + UI + sounds + Phaser
// ========================================

(function init() {
    SoundManager.init();

    const hadSave = GameState.hasSave();
    const game = GameState.load();
    window.game = game; // exposed for game.js / Phaser scene compatibility

    UI.setGame(game);
    if (hadSave) UI.addLog('💾 Game loaded successfully!', 'success');
    UI.restoreRecipeToSliders();
    if (!hadSave) {
        // Brand-new game: roll the world.
        game.rollWeather();
        game.rollEvent();
        game.rollCustomerMix();
        game.rollChallenge();
        game.applyEventSupplyEffects();
    } else {
        // Returning player: backfill any fields missing from older saves.
        if (!game.todaysCustomerType) {
            game.rollCustomerMix();
            game.applyEventSupplyEffects();
        }
        if (!game.currentChallenge) {
            game.rollChallenge();
        }
    }

    // Seed the prev-snapshot so the first updateDisplay doesn't trigger particles.
    UI.syncPrevSnapshot();
    UI.updateDisplay();
    UI.updateEventBanner();
    UI.initColorblind();
    UI.updateDifficultyDisplay();

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
    document.getElementById('industrialPressBtn').onclick = () => UI.buyUpgrade('industrialPress');
    document.getElementById('neonSignBtn').onclick        = () => UI.buyUpgrade('neonSign');
    document.getElementById('loungeBtn').onclick          = () => UI.buyUpgrade('lounge');

    document.getElementById('resetGameBtn').onclick   = UI.resetGame;
    document.getElementById('closeReportBtn').onclick = UI.closeDailyReport;
    document.getElementById('replayTutorialBtn').onclick = () => { UI.toggleSettingsDrawer(); UI.startTutorial(); };
    document.getElementById('colorblindBtn').onclick     = UI.toggleColorblind;
    document.getElementById('storyBtn').onclick          = () => { UI.toggleSettingsDrawer(); UI.showStoryModal(); };
    document.getElementById('leaderboardBtn').onclick    = () => { UI.toggleSettingsDrawer(); UI.showLeaderboardModal(); };
    document.getElementById('closeStoryBtn').onclick     = UI.closeStoryModal;
    document.getElementById('closeLeaderboardBtn').onclick = UI.closeLeaderboardModal;

    // Difficulty modal buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.onclick = () => UI.pickDifficulty(btn.getAttribute('data-diff'));
    });

    // Tutorial buttons
    document.getElementById('tutSkipBtn').onclick = UI.endTutorial;
    document.getElementById('tutNextBtn').onclick = UI.nextTutorialStep;

    // ---- Slider value mirrors + persist recipe on change ----
    const mirror = (sliderId, valueId, suffix = '') => {
        const slider = document.getElementById(sliderId);
        const value  = document.getElementById(valueId);
        slider.oninput = function () {
            value.textContent = this.value + suffix;
        };
        slider.onchange = function () { UI.persistRecipe(); };
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

    // ---- PWA: register the service worker for offline play ----
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js')
                .catch(err => console.log('Service worker registration failed:', err));
        });
    }

    // ---- First-run onboarding: difficulty + tutorial ----
    if (!hadSave && !GameState.hasOnboarded()) {
        UI.showDifficultyModal();
    } else if (hadSave && !GameState.hasOnboarded()) {
        // Returning user from before onboarding existed: mark as onboarded
        // silently so we don't interrupt their game. They can replay from settings.
        GameState.markOnboarded();
    }
})();

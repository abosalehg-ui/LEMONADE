// ========================================
// GAME STATE - Pure logic, zero DOM access
// ========================================

const WEATHER_TYPES = [
    { type: 'sunny',  name: 'Sunny',    icon: '☀️',  demand: 1.5 },
    { type: 'hot',    name: 'Very Hot', icon: '🥵',  demand: 2.0 },
    { type: 'cloudy', name: 'Cloudy',   icon: '☁️',  demand: 1.0 },
    { type: 'rainy',  name: 'Rainy',    icon: '🌧️',  demand: 0.5 },
    { type: 'fog',    name: 'Foggy',    icon: '🌫️',  demand: 0.6 },
    { type: 'windy',  name: 'Windy',    icon: '🌬️',  demand: 0.8 }
];

const TIME_OF_DAY = ['morning', 'noon', 'evening', 'night'];

const EVENTS = [
    { type: 'festival',    name: 'Festival in the Park',  icon: '🎉', demandBonus:   2.0 },
    { type: 'competition', name: 'New Competitor Nearby', icon: '🏪', demandPenalty: 0.7 },
    { type: 'celebrity',   name: 'Celebrity Visit',       icon: '⭐', demandBonus:   1.5 },
    { type: 'roadwork',    name: 'Road Construction',     icon: '🚧', demandPenalty: 0.6 },
    { type: 'lemonShortage', name: 'Lemon Shortage',      icon: '🍋', supplyMultiplier: 1.5 },
    { type: 'viral',       name: 'Viral Video',           icon: '📺', demandBonus: 2.2, reputationBonus: 5 },
    { type: 'heatwave',    name: 'Heatwave',              icon: '🔥', demandBonus: 1.4, prefersIce: true },
    null, null, null, null
];

// Per-demographic preferences. Recipe targets are "ideal per cup" values.
// priceMax is the highest cup price this customer will tolerate.
const CUSTOMER_PROFILES = {
    child: { lemonPref: 2, sugarPref: 6, icePref: 4, priceMax: 5,  weight: 1.0 },
    teen:  { lemonPref: 3, sugarPref: 4, icePref: 6, priceMax: 8,  weight: 1.0 },
    adult: { lemonPref: 4, sugarPref: 3, icePref: 4, priceMax: 12, weight: 1.5 },
    elder: { lemonPref: 4, sugarPref: 2, icePref: 2, priceMax: 7,  weight: 0.9 },
    woman: { lemonPref: 4, sugarPref: 4, icePref: 4, priceMax: 10, weight: 1.1 },
    man:   { lemonPref: 4, sugarPref: 3, icePref: 4, priceMax: 10, weight: 1.1 }
};

const SPOILAGE_THRESHOLD = 50;    // No spoilage at or below this
const SPOILAGE_RATE      = 0.08;  // Lose 8% of the excess per day

const UPGRADE_COSTS = {
    pitcher:  [50, 100],
    sign:     [40, 80],
    table:    [60, 120],
    umbrella: 80
};

const ACHIEVEMENTS = [
    { id: 'first_sale', icon: '🎉', req: s => s.cupsSold >= 1 },
    { id: 'big_day',    icon: '📈', req: s => s.dailyCups >= 50 },
    { id: 'rich',       icon: '💰', req: s => s.money >= 500 },
    { id: 'tycoon',     icon: '👑', req: s => s.money >= 1000 && s.reputation >= 80 },
    { id: 'week',       icon: '📅', req: s => s.day >= 8 },
    { id: 'month',      icon: '🗓️', req: s => s.day >= 31 },
    { id: 'popular',    icon: '⭐', req: s => s.reputation >= 90 },
    { id: 'perfect',    icon: '😊', req: s => s.feedback.happy >= 50 },
    { id: 'monopoly',   icon: '🏆', req: s => s.competitors === 0 },
    { id: 'upgraded',   icon: '⬆️', req: s => s.upgrades.pitcher >= 2 && s.upgrades.sign >= 2 && s.upgrades.table >= 2 && s.upgrades.umbrella }
];

const SAVE_KEY = 'lemonadeTycoonSave';
const ONBOARD_KEY = 'lemonadeTycoonOnboarded';
const SAVE_VERSION = 2;
const HISTORY_LIMIT = 14;

const DIFFICULTY_PRESETS = {
    easy:   { startingMoney: 150, priceResistance: 0.7 },
    normal: { startingMoney: 100, priceResistance: 1.0 },
    hard:   { startingMoney: 70,  priceResistance: 1.3 }
};

class GameState {
    constructor(difficulty = 'normal') {
        const preset = DIFFICULTY_PRESETS[difficulty] || DIFFICULTY_PRESETS.normal;
        this.version = SAVE_VERSION;
        this.difficulty = difficulty;
        this.money = preset.startingMoney;
        this.lemons = 20;
        this.sugar = 20;
        this.ice = 20;
        this.day = 1;
        this.weather = 'sunny';
        this.reputation = 50;
        this.cupsSold = 0;
        this.dailyCups = 0;
        this.totalProfit = 0;
        this.feedback = { angry: 0, happy: 0, waiting: 0, expensive: 0 };
        this.upgrades = { pitcher: 0, sign: 0, table: 0, umbrella: false };
        this.supplyPrices = {
            lemons: { 20: 4, 50: 10, 100: 18 },
            sugar:  { 20: 3, 50: 7,  100: 13 },
            ice:    { 20: 2, 50: 4,  100: 7 }
        };
        this.competitors = 2;
        this.competitorPrice = 5;       // rival stand's current asking price
        this.competitorTrend = 0;       // -1 = lowering, 0 = stable, +1 = raising
        this.lastEvent = null;
        this.unlockedAchievements = [];
        this.recipe = { lemons: 3, sugar: 3, ice: 3, price: 5 };
        this.dailyHistory = [];
        this.lastReport = null;
        // Phase 3 fields
        this.todaysCustomerType = null; // dominant demographic for next/current day
        this.loyalCustomers = 0;         // recurring fan base
        this.lastSpoilage = null;        // { lemons, sugar, ice } loss from spoilage at end of last day
    }

    save() {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(this));
        } catch (e) {
            console.log('Error saving game:', e);
        }
    }

    static load() {
        const instance = new GameState();
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return instance;
        try {
            const data = JSON.parse(raw);
            if (data.version !== SAVE_VERSION) {
                console.log(`Save version mismatch (${data.version} vs ${SAVE_VERSION}), starting fresh.`);
                return instance;
            }
            Object.assign(instance, data);
        } catch (e) {
            console.log('Error loading game:', e);
        }
        return instance;
    }

    static hasSave() {
        return !!localStorage.getItem(SAVE_KEY);
    }

    static clearSave() {
        localStorage.removeItem(SAVE_KEY);
    }

    static hasOnboarded() {
        return localStorage.getItem(ONBOARD_KEY) === '1';
    }

    static markOnboarded() {
        localStorage.setItem(ONBOARD_KEY, '1');
    }

    static clearAll() {
        localStorage.removeItem(SAVE_KEY);
        localStorage.removeItem(ONBOARD_KEY);
    }

    buyUpgrade(type) {
        if (type === 'umbrella') {
            if (this.upgrades.umbrella) return { ok: false, reason: 'owned' };
            const cost = UPGRADE_COSTS.umbrella;
            if (this.money < cost) return { ok: false, reason: 'money', cost };
            this.money -= cost;
            this.upgrades.umbrella = true;
            return { ok: true, type, cost };
        }
        const level = this.upgrades[type];
        if (level >= 2) return { ok: false, reason: 'max' };
        const cost = UPGRADE_COSTS[type][level];
        if (this.money < cost) return { ok: false, reason: 'money', cost };
        this.money -= cost;
        this.upgrades[type]++;
        return { ok: true, type, cost, newLevel: this.upgrades[type] };
    }

    buySupplyPack(type, amount) {
        const cost = this.supplyPrices[type][amount];
        if (this.money < cost) return { ok: false, cost };
        this.money -= cost;
        this[type] += amount;
        return { ok: true, type, amount, cost };
    }

    quickBuySupplies() {
        const cost = 30;
        const items = 20;
        if (this.money < cost) return { ok: false, cost };
        this.money -= cost;
        this.lemons += items;
        this.sugar += items;
        this.ice += items;
        return { ok: true, cost, items };
    }

    rollWeather() {
        const pick = WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];
        this.weather = pick.type;
        return pick;
    }

    /**
     * Time-of-day for the current day. Cycles morning → noon → evening → night.
     * Drives the Phaser tint overlay.
     */
    getTimeOfDay() {
        return TIME_OF_DAY[(this.day - 1) % TIME_OF_DAY.length];
    }

    /**
     * Rival stand reacts to the player's last price.
     * Called from applyDayResult with the price the player charged this day.
     */
    updateRivalPrice(playerPrice) {
        const diff = playerPrice - this.competitorPrice;
        if (diff > 2) {
            // Player is much more expensive — rival sees room to raise.
            this.competitorPrice += 1;
            this.competitorTrend = 1;
        } else if (diff < -2) {
            // Player is undercutting — rival drops to compete.
            this.competitorPrice -= 1;
            this.competitorTrend = -1;
        } else {
            // Small drift to keep things alive even when matched.
            this.competitorPrice += Math.random() < 0.5 ? -1 : 1;
            this.competitorTrend = 0;
        }
        this.competitorPrice = Math.max(2, Math.min(15, this.competitorPrice));
    }

    rollEvent() {
        const pick = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        this.lastEvent = pick;
        return pick;
    }

    /**
     * Pick the dominant customer type for the day, weighted by weather + event.
     * Returns the chosen type string (e.g. 'child').
     */
    rollCustomerMix() {
        const weights = {};
        for (const type in CUSTOMER_PROFILES) {
            weights[type] = CUSTOMER_PROFILES[type].weight;
        }
        // Weather affects which demographics come out
        if (this.weather === 'hot' || this.weather === 'sunny') {
            weights.child += 1.5;
            weights.teen  += 0.8;
        }
        if (this.weather === 'rainy') {
            weights.elder -= 0.4;
            weights.child -= 0.5;
            weights.adult += 0.3;
        }
        if (this.weather === 'cloudy') {
            weights.adult += 0.5;
        }
        // Event biases
        if (this.lastEvent?.type === 'festival')  { weights.child += 1.0; weights.teen += 0.8; }
        if (this.lastEvent?.type === 'celebrity') { weights.teen  += 1.2; weights.woman += 0.5; }
        if (this.lastEvent?.type === 'viral')     { weights.teen  += 1.5; weights.child += 0.5; }

        // Weighted pick
        const types = Object.keys(weights);
        const total = types.reduce((s, t) => s + Math.max(0, weights[t]), 0);
        let r = Math.random() * total;
        for (const t of types) {
            r -= Math.max(0, weights[t]);
            if (r <= 0) {
                this.todaysCustomerType = t;
                return t;
            }
        }
        this.todaysCustomerType = 'adult';
        return 'adult';
    }

    canBrew(lemons, sugar, ice) {
        return this.lemons >= lemons && this.sugar >= sugar && this.ice >= ice;
    }

    /**
     * Compute everything about a day's sales given a recipe & price.
     * Pure: doesn't mutate. Returns numbers the UI/sim can use.
     */
    planDay({ lemons, sugar, ice, price }) {
        const weather = WEATHER_TYPES.find(w => w.type === this.weather);
        let baseDemand = Math.floor(10 + Math.random() * 20) + Math.floor(this.reputation / 10);

        // Loyal customers add a stable floor on demand.
        baseDemand += Math.floor(this.loyalCustomers * 0.7);

        let demandMultiplier = weather.demand;

        if (this.weather === 'hot' && this.upgrades.umbrella) demandMultiplier *= 1.3;
        if (this.upgrades.sign === 1) baseDemand += 5;
        else if (this.upgrades.sign === 2) baseDemand += 12;

        const comfortBonus = 1 + (this.upgrades.table * 0.15);

        if (this.lastEvent) {
            if (this.lastEvent.demandBonus)   demandMultiplier *= this.lastEvent.demandBonus;
            if (this.lastEvent.demandPenalty) demandMultiplier *= this.lastEvent.demandPenalty;
        }
        // Competitors drag demand down; the gap to the rival's price amplifies it.
        const priceGap = (price - this.competitorPrice) / Math.max(1, this.competitorPrice);
        const competitorEffect = Math.max(0.4, 1 - (this.competitors * 0.1) - Math.max(0, priceGap) * 0.3);
        demandMultiplier *= competitorEffect;

        const totalDemand    = Math.floor(baseDemand * demandMultiplier);
        const recipeQuality  = (lemons + sugar + ice) / 3;
        const pitcherBonus   = 1 + (this.upgrades.pitcher * 0.2);
        const finalQuality   = recipeQuality * pitcherBonus;
        const qualityFactor  = Math.min(finalQuality / 5, 2.0);
        const diffPreset     = DIFFICULTY_PRESETS[this.difficulty] || DIFFICULTY_PRESETS.normal;
        const priceResistance = Math.max(0.2, 1 - ((price - 5) / 10) * diffPreset.priceResistance);

        // How well the recipe matches today's dominant demographic.
        // matchFactor in [0.5, 1.4] — strong incentive to tune recipe to the crowd.
        const profile = CUSTOMER_PROFILES[this.todaysCustomerType] || CUSTOMER_PROFILES.adult;
        const recipeDist = Math.abs(lemons - profile.lemonPref) +
                           Math.abs(sugar  - profile.sugarPref) +
                           Math.abs(ice    - profile.icePref);
        const matchFactor = Math.max(0.5, 1.4 - recipeDist * 0.05);

        // Customers who can't afford it just don't buy.
        const priceTolerance = price <= profile.priceMax
            ? 1.0
            : Math.max(0.2, 1 - (price - profile.priceMax) * 0.15);

        const actualDemand = Math.floor(totalDemand * qualityFactor * priceResistance * matchFactor * priceTolerance);

        const maxCups = Math.min(
            Math.floor(this.lemons / lemons),
            Math.floor(this.sugar / sugar),
            Math.floor(this.ice / ice),
            actualDemand
        );

        const satisfactionRate = ((recipeQuality / 4) / (price / 7)) * comfortBonus * matchFactor;

        return { maxCups, actualDemand, recipeQuality, satisfactionRate, comfortBonus, matchFactor, primaryType: this.todaysCustomerType };
    }

    /**
     * Apply the result of a day's sales. Returns a summary for the UI to log.
     */
    applyDayResult({ maxCups, actualDemand, recipeQuality, satisfactionRate, comfortBonus, lemons, sugar, ice, price }) {
        const summary = {
            maxCups,
            actualDemand,
            revenue: 0,
            cost: 0,
            profit: 0,
            reputationDelta: 0,
            tier: null,
            competitorChange: null
        };

        if (maxCups <= 0) {
            summary.tier = actualDemand > 0 ? 'no_supplies' : 'no_customers';
        } else {
            this.lemons -= maxCups * lemons;
            this.sugar  -= maxCups * sugar;
            this.ice    -= maxCups * ice;

            const revenue = maxCups * price;
            const cost = maxCups * (lemons * 0.2 + sugar * 0.15 + ice * 0.1);
            const profit = revenue - cost;

            this.money += revenue;
            this.cupsSold += maxCups;
            this.dailyCups = maxCups;
            this.totalProfit += profit;

            summary.revenue = revenue;
            summary.cost = cost;
            summary.profit = profit;

            if (satisfactionRate > 2.0) {
                summary.reputationDelta = 10;
                summary.tier = 'love';
            } else if (satisfactionRate > 1.5) {
                summary.reputationDelta = 7;
                summary.tier = 'very_happy';
            } else if (satisfactionRate >= 1) {
                summary.reputationDelta = 3;
                summary.tier = 'satisfied';
            } else if (satisfactionRate < 0.7) {
                summary.reputationDelta = -5;
                summary.tier = 'unhappy';
            } else {
                summary.reputationDelta = 0;
                summary.tier = 'good';
            }

            this.reputation = Math.max(0, Math.min(100, this.reputation + summary.reputationDelta));
        }

        if (Math.random() < 0.15 && this.reputation > 70) {
            this.competitors = Math.max(0, this.competitors - 1);
            summary.competitorChange = this.competitors === 0 ? 'only_stand' : 'closed';
        } else if (Math.random() < 0.1) {
            this.competitors++;
            summary.competitorChange = 'new';
        }

        // --- Loyalty: very-happy days create regulars; bad days lose some ---
        const loyaltyBefore = this.loyalCustomers;
        if (summary.tier === 'love') {
            this.loyalCustomers = Math.min(60, this.loyalCustomers + Math.max(1, Math.floor(summary.maxCups * 0.08)));
        } else if (summary.tier === 'very_happy') {
            this.loyalCustomers = Math.min(60, this.loyalCustomers + Math.max(1, Math.floor(summary.maxCups * 0.05)));
        } else if (summary.tier === 'unhappy') {
            this.loyalCustomers = Math.max(0, this.loyalCustomers - Math.ceil(this.loyalCustomers * 0.15));
        }
        summary.loyaltyDelta = this.loyalCustomers - loyaltyBefore;

        // --- Spoilage: excess raw materials decay each day ---
        const spoiled = { lemons: 0, sugar: 0, ice: 0 };
        for (const k of ['lemons', 'sugar', 'ice']) {
            const excess = this[k] - SPOILAGE_THRESHOLD;
            if (excess > 0) {
                const lose = Math.ceil(excess * SPOILAGE_RATE);
                this[k] -= lose;
                spoiled[k] = lose;
            }
        }
        this.lastSpoilage = (spoiled.lemons || spoiled.sugar || spoiled.ice) ? spoiled : null;
        summary.spoilage = this.lastSpoilage;

        // Record this day's outcome for the daily report + chart.
        summary.day = this.day;
        summary.primaryType = this.todaysCustomerType;
        this.dailyHistory.push({
            day: this.day,
            cups: summary.maxCups,
            revenue: summary.revenue,
            cost: summary.cost,
            profit: summary.profit,
            tier: summary.tier,
            reputationDelta: summary.reputationDelta
        });
        if (this.dailyHistory.length > HISTORY_LIMIT) {
            this.dailyHistory.splice(0, this.dailyHistory.length - HISTORY_LIMIT);
        }
        this.lastReport = summary;

        // Rival reacts to player's price for the day just finished.
        this.updateRivalPrice(price);

        this.day++;
        this.rollWeather();
        this.rollEvent();
        this.rollCustomerMix();

        // --- Apply special event side-effects on supply prices for the new day ---
        this.applyEventSupplyEffects();

        return summary;
    }

    /**
     * Some events temporarily change supply prices (e.g. lemonShortage).
     * Resets to base prices first, then applies modifiers if applicable.
     */
    applyEventSupplyEffects() {
        const base = {
            lemons: { 20: 4, 50: 10, 100: 18 },
            sugar:  { 20: 3, 50: 7,  100: 13 },
            ice:    { 20: 2, 50: 4,  100: 7 }
        };
        // Deep clone defaults
        this.supplyPrices = {
            lemons: { ...base.lemons },
            sugar:  { ...base.sugar },
            ice:    { ...base.ice }
        };
        if (this.lastEvent?.type === 'lemonShortage') {
            const m = this.lastEvent.supplyMultiplier || 1.5;
            for (const k of [20, 50, 100]) {
                this.supplyPrices.lemons[k] = Math.ceil(base.lemons[k] * m);
            }
        }
    }

    /**
     * Returns the IDs of achievements newly unlocked by current state.
     */
    checkAchievements() {
        const newlyUnlocked = [];
        for (const ach of ACHIEVEMENTS) {
            if (this.unlockedAchievements.includes(ach.id)) continue;
            if (ach.req(this)) {
                this.unlockedAchievements.push(ach.id);
                newlyUnlocked.push(ach);
            }
        }
        return newlyUnlocked;
    }

    resetFeedback() {
        this.feedback = { angry: 0, happy: 0, waiting: 0, expensive: 0 };
        this.dailyCups = 0;
    }
}

window.GameState = GameState;
window.WEATHER_TYPES = WEATHER_TYPES;
window.EVENTS = EVENTS;
window.UPGRADE_COSTS = UPGRADE_COSTS;
window.ACHIEVEMENTS = ACHIEVEMENTS;

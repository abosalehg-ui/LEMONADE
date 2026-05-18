// ========================================
// GAME STATE - Pure logic, zero DOM access
// ========================================

const WEATHER_TYPES = [
    { type: 'sunny',  name: 'Sunny',    icon: '☀️', demand: 1.5 },
    { type: 'hot',    name: 'Very Hot', icon: '🥵', demand: 2.0 },
    { type: 'cloudy', name: 'Cloudy',   icon: '☁️', demand: 1.0 },
    { type: 'rainy',  name: 'Rainy',    icon: '🌧️', demand: 0.5 }
];

const EVENTS = [
    { type: 'festival',    name: 'Festival in the Park',  icon: '🎉', demandBonus:   2.0 },
    { type: 'competition', name: 'New Competitor Nearby', icon: '🏪', demandPenalty: 0.7 },
    { type: 'celebrity',   name: 'Celebrity Visit',       icon: '⭐', demandBonus:   1.5 },
    { type: 'roadwork',    name: 'Road Construction',     icon: '🚧', demandPenalty: 0.6 },
    null, null, null
];

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
        this.lastEvent = null;
        this.unlockedAchievements = [];
        this.recipe = { lemons: 3, sugar: 3, ice: 3, price: 5 };
        this.dailyHistory = [];
        this.lastReport = null;
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

    rollEvent() {
        const pick = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        this.lastEvent = pick;
        return pick;
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
        let demandMultiplier = weather.demand;

        if (this.weather === 'hot' && this.upgrades.umbrella) demandMultiplier *= 1.3;
        if (this.upgrades.sign === 1) baseDemand += 5;
        else if (this.upgrades.sign === 2) baseDemand += 12;

        const comfortBonus = 1 + (this.upgrades.table * 0.15);

        if (this.lastEvent) {
            if (this.lastEvent.demandBonus)   demandMultiplier *= this.lastEvent.demandBonus;
            if (this.lastEvent.demandPenalty) demandMultiplier *= this.lastEvent.demandPenalty;
        }
        const competitorEffect = Math.max(0.5, 1 - (this.competitors * 0.1));
        demandMultiplier *= competitorEffect;

        const totalDemand    = Math.floor(baseDemand * demandMultiplier);
        const recipeQuality  = (lemons + sugar + ice) / 3;
        const pitcherBonus   = 1 + (this.upgrades.pitcher * 0.2);
        const finalQuality   = recipeQuality * pitcherBonus;
        const qualityFactor  = Math.min(finalQuality / 5, 2.0);
        const diffPreset     = DIFFICULTY_PRESETS[this.difficulty] || DIFFICULTY_PRESETS.normal;
        const priceResistance = Math.max(0.2, 1 - ((price - 5) / 10) * diffPreset.priceResistance);
        const actualDemand   = Math.floor(totalDemand * qualityFactor * priceResistance);

        const maxCups = Math.min(
            Math.floor(this.lemons / lemons),
            Math.floor(this.sugar / sugar),
            Math.floor(this.ice / ice),
            actualDemand
        );

        const satisfactionRate = ((recipeQuality / 4) / (price / 7)) * comfortBonus;

        return { maxCups, actualDemand, recipeQuality, satisfactionRate, comfortBonus };
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

        // Record this day's outcome for the daily report + chart.
        summary.day = this.day;
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

        this.day++;
        this.rollWeather();
        this.rollEvent();

        return summary;
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

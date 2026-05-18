// ========================================
// I18N - English & Arabic translations
// ========================================

const translations = {
    en: {
        // Top Bar Resources
        lemonsTitle: "Lemons",
        sugarTitle: "Sugar",
        iceTitle: "Ice",
        moneyTitle: "Money",
        qualityTitle: "Quality",
        weatherTitle: "Weather",

        // Main Buttons
        startDay: "🚀 START DAY",
        buySupplies: "🛒 BUY SUPPLIES (Quick)",

        // Menu Buttons
        upgrades: "upgrades",
        supplies: "supplies",
        recipe: "recipe",
        achievements: "achievements",

        // Activity Log
        logTitle: "📋 Activity Log",
        welcomeMsg: "🎮 Welcome to Lemonade! Set your recipe and start selling.",

        // Settings Drawer
        settingsTitle: "TODAY'S SETTING",
        lemonsPerCup: "🍋 Lemons per cup:",
        sugarPerCup: "🍯 Sugar per cup:",
        icePerCup: "🧊 Ice per cup:",
        cupPrice: "💵 Cup Price:",

        // Game Description
        descTitle: "🍋 Game Description",
        descText: "Lemonade is a business management game where you run your own lemonade stand. Each day, you decide how much lemon, sugar, and ice to use in your recipe – and set the perfect price per cup. Make sure you buy enough ingredients for the next day. Adjust your recipe carefully: too much lemon makes it sour, too much sugar makes it too sweet, and ice is essential on hot days! Your success depends on weather conditions, customer satisfaction, and smart upgrades. A reasonable price attracts customers, but a high price will drive them away. Buy supplies, improve your equipment, and build your reputation to attract more customers and increase profits. Face random events, deal with competitors, and try to become the ultimate Lemonade! 🏆",
        createdBy: "Created by",

        // Icon Bar Tooltips
        angry: "Angry",
        happy: "Happy",
        waiting: "Waiting",
        expensive: "Too Expensive",
        cupsSold: "Cups Sold",
        profit: "Profit",
        day: "Day",
        reputation: "Reputation",

        // Live Simulation
        liveDay: "LIVE - DAY",
        time: "TIME:",
        skip: "⏭️ SKIP",

        // Upgrades Modal
        upgradesTitle: "🪙 UPGRADES",
        pitcherQuality: "🥤 Pitcher Quality",
        sign: "🪧 Sign",
        table: "🪑 Table",
        umbrella: "☂️ Umbrella",
        level: "Level:",
        status: "Status:",
        upgrade: "Upgrade",
        buy: "Buy",
        maxLevel: "✅ MAX LEVEL",
        purchased: "✅ PURCHASED",
        notOwned: "Not Owned",
        owned: "Owned ✅",
        close: "❌ CLOSE",

        // Pitcher Levels
        pitcherBasic: "Basic",
        pitcherGood: "Good",
        pitcherExcellent: "Excellent",

        // Sign Levels
        signNone: "None",
        signSmall: "Small",
        signLarge: "Large",

        // Table Levels
        tableBasic: "Basic",
        tableGood: "Good",
        tableLuxury: "Luxury",

        // Supplies Modal
        suppliesTitle: "📦 BUY SUPPLIES",
        lemons: "🍋 Lemons",
        sugar: "🍯 Sugar",
        ice: "🧊 Ice",
        buyBtn: "Buy",

        // Achievements Modal
        achievementsTitle: "🏆 ACHIEVEMENTS",
        unlocked: "✅ UNLOCKED",
        locked: "🔒 LOCKED",

        // Achievement Names
        achFirstSale: "First Sale",
        achFirstSaleDesc: "Sell your first cup",
        achBigDay: "Big Day",
        achBigDayDesc: "Sell 50 cups in one day",
        achRich: "Getting Rich",
        achRichDesc: "Earn 500$",
        achTycoon: "Lemonade Tycoon",
        achTycoonDesc: "Earn 1000$",
        achWeek: "One Week",
        achWeekDesc: "Survive 7 days",
        achMonth: "One Month",
        achMonthDesc: "Survive 30 days",
        achPopular: "Popular Stand",
        achPopularDesc: "Reach 90% reputation",
        achPerfect: "Perfect Recipe",
        achPerfectDesc: "Get 50 happy customers in one day",
        achMonopoly: "Monopoly",
        achMonopolyDesc: "Eliminate all competitors",
        achUpgraded: "Fully Upgraded",
        achUpgradedDesc: "Max all upgrades",

        // Weather Types
        sunny: "Sunny",
        hot: "Very Hot",
        cloudy: "Cloudy",
        rainy: "Rainy",
        fog: "Foggy",
        windy: "Windy",

        // Time of day
        timeMorning: "🌅 Morning",
        timeNoon: "☀️ Noon",
        timeEvening: "🌇 Evening",
        timeNight: "🌙 Night",

        // Rival stand
        rivalLabel: "🏪 Rival price",
        rivalTrendUp: "↑",
        rivalTrendDown: "↓",
        rivalTrendStable: "—",

        // Phase 5: Tech tree (advanced upgrades)
        advancedUpgradesTitle: "🔬 Advanced",
        upgradeIndustrialPress: "🏭 Industrial Press",
        upgradeNeonSign: "💡 Neon Sign",
        upgradeLounge: "🛋️ Lounge",
        upgradeLocked: "🔒 Requires:",
        reqPitcher2: "Pitcher Lv2",
        reqSign2: "Sign Lv2",
        reqTableUmbrella: "Table Lv2 + Umbrella",

        // Phase 5: Daily challenges
        challengeBannerLabel: "🎯 Today's challenge:",
        challengeRewardLabel: "Reward:",
        challengeDone: "✅ Challenge complete! +{m}$ +{r}🪙",
        challengeFailed: "❌ Challenge missed: {desc}",
        challengeMinCups: "Sell at least {n} cups",
        challengeMinProfit: "Earn at least ${n} profit",
        challengeMaxAngry: "Zero angry customers",
        challengeMinHappy: "Get at least {n} happy customers",
        challengeMaxPrice: "Charge ${n} or less per cup",
        challengeMinTier: "Reach {tier} tier",

        // Phase 5: Story mode
        storyBtn: "📜 Story",
        storyTitle: "📜 Story Mode",
        storyChapterLabel: "Chapter",
        storyChapterDone: "✅ DONE",
        storyChapterActive: "🎯 ACTIVE",
        storyChapterLocked: "🔒 LOCKED",
        storyAdvance: "📜 Chapter {n} complete! +{m}$ +{r}🪙",
        storyAllDone: "🌟 All chapters complete! You're a true Lemonade Tycoon.",
        storyChapter1: "First Sale — sell at least 5 cups",
        storyChapter2: "Saving Up — reach $250 in cash",
        storyChapter3: "Marketing — install your first sign",
        storyChapter4: "Loyal Crowd — gather 10 regulars",
        storyChapter5: "Reputable — reach 80% reputation",
        storyChapter6: "Sole Survivor — drive out all competitors",
        storyChapter7: "Premium Spot — build the Lounge",
        storyChapter8: "Tycoon — unlock 8 achievements",

        // Phase 5: Leaderboard
        leaderboardBtn: "🏅 Records",
        leaderboardTitle: "🏅 Personal Records",
        recBestDayProfit: "🪙 Best single-day profit",
        recBestTotalProfit: "💰 Best total profit",
        recBestStreak: "🔥 Longest happy streak",
        recBestLoyal: "🤝 Most regulars",
        recBestDay: "📅 Longest run (days)",
        newRecord: "🏅 NEW RECORD: {what}!",

        // Events
        eventFestival: "Festival in the Park",
        eventCompetition: "New Competitor Nearby",
        eventCelebrity: "Celebrity Visit",
        eventRoadwork: "Road Construction",
        eventLabel: "Event:",

        // Log Messages
        notEnoughSupplies: "❌ Not enough supplies!",
        notEnoughMoney: "❌ Not enough money!",
        bought: "🛒 Bought",
        for: "for",
        quickBuy: "🛒 QUICK BUY:",
        earned: "💰 Earned",
        selling: "selling",
        cups: "cups",
        demandExists: "⚠️ Demand exists, but no supplies!",
        noCustomers: "📉 No customers today.",
        customersLove: "⭐⭐⭐ Customers love it! Sold",
        repPlus: "Rep +",
        veryHappy: "⭐⭐ Very happy! Sold",
        satisfied: "⭐ Satisfied. Sold",
        customersUnhappy: "😞 Customers unhappy. Rep -5",
        goodDay: "✅ Good day! Sold",
        onlyStand: "🏆 You are the only stand!",
        competitorClosed: "👋 A competitor closed!",
        newCompetitor: "🪙 New competitor opened!",
        upgradedTo: "⬆️ Upgraded",
        to: "to level",
        purchasedUmbrella: "☂️ Purchased umbrella! Better sales in hot weather.",
        recipeLog: "📋 Recipe:",
        achievementUnlocked: "🏆",
        need: "Need",

        // Daily Report
        reportTitle: "📊 DAY REPORT",
        reportCups: "🥤 Cups Sold",
        reportRevenue: "💰 Revenue",
        reportCost: "💸 Cost",
        reportProfit: "📈 Profit",
        reportRep: "👍 Reputation",
        reportChartTitle: "📈 Profit history (last days)",
        reportContinue: "✅ CONTINUE",
        tierLove: "⭐⭐⭐ Customers love it!",
        tierVeryHappy: "⭐⭐ Very happy!",
        tierSatisfied: "⭐ Satisfied",
        tierUnhappy: "😞 Customers unhappy",
        tierGood: "✅ Good day",
        tierNoSupplies: "⚠️ Out of supplies",
        tierNoCustomers: "📉 No customers",

        // Reset
        resetButton: "🔄 Reset Game",
        resetConfirm: "Reset all progress? This cannot be undone.",
        resetDone: "🔄 Game reset.",

        // Sim
        timeLabel: "TIME",
        savedIndicator: "💾 Saved",

        // Toast
        unlockedToast: "Unlocked!",

        // Difficulty
        difficultyTitle: "🎮 Choose Difficulty",
        diffEasy: "😊 Easy",
        diffEasyDesc: "$150 start. Customers forgive higher prices.",
        diffNormal: "😐 Normal",
        diffNormalDesc: "$100 start. Balanced experience.",
        diffHard: "😤 Hard",
        diffHardDesc: "$70 start. Customers are picky about price.",
        currentDifficulty: "Difficulty:",

        // Tutorial
        tutorialBtn: "🎓 Tutorial",
        tutorialSkip: "Skip",
        tutorialNext: "Next →",
        tutorialDone: "✅ Done",
        tutorialStep: "Step",
        tutWelcomeTitle: "👋 Welcome!",
        tutWelcomeText: "Let's learn how to run your lemonade stand in 5 quick steps.",
        tutResourcesTitle: "📊 Your resources",
        tutResourcesText: "Up top: lemons 🍋, sugar 🍯, ice 🧊, money 💰, pitcher quality 🥤, and current weather.",
        tutRecipeTitle: "⚙️ Set the recipe",
        tutRecipeText: "Open the side panel to adjust ingredients per cup and the price you charge. Balance is everything.",
        tutSuppliesTitle: "🛒 Buy supplies",
        tutSuppliesText: "Quick-buy or open the supplies menu for bulk deals. You can't sell without ingredients!",
        tutStartTitle: "🚀 Start the day",
        tutStartText: "Press Start Day to begin. Watch the live simulation, then check the daily report.",

        // Accessibility
        colorblindBtn: "👁️ Colorblind mode",
        colorblindOn: "Colorblind: ON",
        colorblindOff: "Colorblind: OFF",

        // Customer types (today's crowd)
        crowdLabel: "Today's crowd:",
        crowdChild: "🧒 Kids — love sweet & cheap drinks",
        crowdTeen:  "🧑 Teens — want lots of ice, pay more",
        crowdAdult: "🧑‍💼 Adults — balanced taste, deeper pockets",
        crowdElder: "👴 Elders — less sweet, low budget",
        crowdWoman: "👩 Women — balanced, willing to pay",
        crowdMan:   "👨 Men — balanced, willing to pay",

        // Loyalty / regulars
        loyalLabel: "🤝 Regulars",
        loyaltyGained: "🤝 +{n} new regulars",
        loyaltyLost: "💔 Lost {n} regulars",

        // Spoilage
        spoilageLog: "🗑️ Spoiled: {l}🍋 {s}🍯 {i}🧊",

        // New events
        eventLemonShortage: "Lemon Shortage (prices up)",
        eventViral: "Viral Video on social media!",
        eventHeatwave: "Heatwave hits the city"
    },
    ar: {
        // شريط الموارد العلوي
        lemonsTitle: "ليمون",
        sugarTitle: "سكر",
        iceTitle: "ثلج",
        moneyTitle: "نقود",
        qualityTitle: "الجودة",
        weatherTitle: "الطقس",

        // الأزرار الرئيسية
        startDay: "🚀 ابدأ اليوم",
        buySupplies: "🛒 شراء الإمدادات (سريع)",

        // أزرار القائمة
        upgrades: "ترقيات",
        supplies: "إمدادات",
        recipe: "وصفة",
        achievements: "إنجازات",

        // سجل النشاط
        logTitle: "📋 سجل النشاط",
        welcomeMsg: "🎮 مرحبًا بك في Lemonade! اضبط وصفتك وابدأ البيع.",

        // قائمة الإعدادات
        settingsTitle: "إعدادات اليوم",
        lemonsPerCup: "🍋 ليمون لكل كوب:",
        sugarPerCup: "🍯 سكر لكل كوب:",
        icePerCup: "🧊 ثلج لكل كوب:",
        cupPrice: "💵 سعر الكوب:",

        // وصف اللعبة
        descTitle: "🍋 وصف اللعبة",
        descText: "Lemonade هي لعبة إدارة أعمال حيث تدير كشك الليموناضة الخاص بك. كل يوم، تقرر كم من الليمون والسكر والثلج تستخدم في وصفتك – وتحدد السعر المثالي لكل كوب. تأكد من شراء مكونات كافية لليوم التالي. اضبط وصفتك بعناية: الكثير من الليمون يجعلها حامضة، والكثير من السكر يجعلها حلوة جدًا، والثلج ضروري في الأيام الحارة! نجاحك يعتمد على الظروف الجوية ورضا العملاء والترقيات الذكية. السعر المعقول يجذب العملاء، لكن السعر المرتفع سيطردهم. اشترِ الإمدادات، وحسّن معداتك، وابنِ سمعتك لجذب المزيد من العملاء وزيادة الأرباح. واجه الأحداث العشوائية، وتعامل مع المنافسين، وحاول أن تصبح ملك الليموناضة! 🏆",
        createdBy: "تم الإنشاء بواسطة",

        // تلميحات شريط الأيقونات
        angry: "غاضب",
        happy: "سعيد",
        waiting: "منتظر",
        expensive: "غالي جدًا",
        cupsSold: "أكواب مباعة",
        profit: "الربح",
        day: "يوم",
        reputation: "السمعة",

        // المحاكاة المباشرة
        liveDay: "مباشر - اليوم",
        time: "الوقت:",
        skip: "⏭️ تخطي",

        // نافذة الترقيات
        upgradesTitle: "🪙 الترقيات",
        pitcherQuality: "🥤 جودة الإبريق",
        sign: "🪧 اللافتة",
        table: "🪑 الطاولة",
        umbrella: "☂️ المظلة",
        level: "المستوى:",
        status: "الحالة:",
        upgrade: "ترقية",
        buy: "شراء",
        maxLevel: "✅ أقصى مستوى",
        purchased: "✅ تم الشراء",
        notOwned: "غير مملوك",
        owned: "مملوك ✅",
        close: "❌ إغلاق",

        // مستويات الإبريق
        pitcherBasic: "عادي",
        pitcherGood: "جيد",
        pitcherExcellent: "ممتاز",

        // مستويات اللافتة
        signNone: "بدون",
        signSmall: "صغيرة",
        signLarge: "كبيرة",

        // مستويات الطاولة
        tableBasic: "عادية",
        tableGood: "جيدة",
        tableLuxury: "فاخرة",

        // نافذة الإمدادات
        suppliesTitle: "📦 شراء الإمدادات",
        lemons: "🍋 ليمون",
        sugar: "🍯 سكر",
        ice: "🧊 ثلج",
        buyBtn: "شراء",

        // نافذة الإنجازات
        achievementsTitle: "🏆 الإنجازات",
        unlocked: "✅ مفتوح",
        locked: "🔒 مقفل",

        // أسماء الإنجازات
        achFirstSale: "أول بيعة",
        achFirstSaleDesc: "بع كوبك الأول",
        achBigDay: "يوم كبير",
        achBigDayDesc: "بع 50 كوبًا في يوم واحد",
        achRich: "نحو الثراء",
        achRichDesc: "اكسب 500$",
        achTycoon: "قطب الليموناضة",
        achTycoonDesc: "اكسب 1000$",
        achWeek: "أسبوع واحد",
        achWeekDesc: "اصمد 7 أيام",
        achMonth: "شهر واحد",
        achMonthDesc: "اصمد 30 يومًا",
        achPopular: "كشك مشهور",
        achPopularDesc: "حقق سمعة 90%",
        achPerfect: "وصفة مثالية",
        achPerfectDesc: "احصل على 50 زبونًا سعيدًا في يوم واحد",
        achMonopoly: "احتكار",
        achMonopolyDesc: "تخلص من جميع المنافسين",
        achUpgraded: "ترقية كاملة",
        achUpgradedDesc: "ارفع جميع الترقيات للحد الأقصى",

        // أنواع الطقس
        sunny: "مشمس",
        hot: "حار جدًا",
        cloudy: "غائم",
        rainy: "ممطر",
        fog: "ضبابي",
        windy: "عاصف",

        // وقت اليوم
        timeMorning: "🌅 صباح",
        timeNoon: "☀️ ظهر",
        timeEvening: "🌇 مساء",
        timeNight: "🌙 ليل",

        // الكشك المنافس
        rivalLabel: "🏪 سعر المنافس",
        rivalTrendUp: "↑",
        rivalTrendDown: "↓",
        rivalTrendStable: "—",

        // المرحلة 5: شجرة الترقيات
        advancedUpgradesTitle: "🔬 ترقيات متقدمة",
        upgradeIndustrialPress: "🏭 معصرة صناعية",
        upgradeNeonSign: "💡 لافتة نيون",
        upgradeLounge: "🛋️ صالة استراحة",
        upgradeLocked: "🔒 يتطلب:",
        reqPitcher2: "إبريق مستوى 2",
        reqSign2: "لافتة مستوى 2",
        reqTableUmbrella: "طاولة مستوى 2 + مظلة",

        // المرحلة 5: التحديات اليومية
        challengeBannerLabel: "🎯 تحدي اليوم:",
        challengeRewardLabel: "المكافأة:",
        challengeDone: "✅ تم إنجاز التحدي! +{m}$ +{r}🪙",
        challengeFailed: "❌ لم يتحقق التحدي: {desc}",
        challengeMinCups: "بِع {n} كوباً على الأقل",
        challengeMinProfit: "اربح {n}$ على الأقل",
        challengeMaxAngry: "صفر زبائن غاضبين",
        challengeMinHappy: "احصل على {n} زبائن سعداء",
        challengeMaxPrice: "السعر ≤ {n}$ للكوب",
        challengeMinTier: "حقق مستوى {tier}",

        // المرحلة 5: وضع القصة
        storyBtn: "📜 القصة",
        storyTitle: "📜 وضع القصة",
        storyChapterLabel: "الفصل",
        storyChapterDone: "✅ منجز",
        storyChapterActive: "🎯 نشط",
        storyChapterLocked: "🔒 مقفل",
        storyAdvance: "📜 اكتمل الفصل {n}! +{m}$ +{r}🪙",
        storyAllDone: "🌟 اكتملت كل الفصول! أنت قطب ليموناضة حقيقي.",
        storyChapter1: "أول بيع — بع 5 أكواب على الأقل",
        storyChapter2: "ادّخار — اجمع 250$",
        storyChapter3: "تسويق — ثبّت أول لافتة",
        storyChapter4: "جمهور وفي — اجمع 10 زبائن دائمين",
        storyChapter5: "ذو سمعة — حقق سمعة 80%",
        storyChapter6: "الناجي الوحيد — أخرج كل المنافسين",
        storyChapter7: "مكان فاخر — ابنِ صالة الاستراحة",
        storyChapter8: "قطب — افتح 8 إنجازات",

        // المرحلة 5: لوحة الشرف
        leaderboardBtn: "🏅 السجلات",
        leaderboardTitle: "🏅 سجلاتك الشخصية",
        recBestDayProfit: "🪙 أفضل ربح في يوم",
        recBestTotalProfit: "💰 أفضل ربح إجمالي",
        recBestStreak: "🔥 أطول سلسلة أيام سعيدة",
        recBestLoyal: "🤝 أكثر عدد دائمين",
        recBestDay: "📅 أطول رحلة (أيام)",
        newRecord: "🏅 رقم قياسي جديد: {what}!",

        // الأحداث
        eventFestival: "مهرجان في الحديقة",
        eventCompetition: "منافس جديد قريب",
        eventCelebrity: "زيارة مشهور",
        eventRoadwork: "أعمال طرق",
        eventLabel: "حدث:",

        // رسائل السجل
        notEnoughSupplies: "❌ لا توجد إمدادات كافية!",
        notEnoughMoney: "❌ لا توجد أموال كافية!",
        bought: "🛒 تم شراء",
        for: "مقابل",
        quickBuy: "🛒 شراء سريع:",
        earned: "💰 ربحت",
        selling: "ببيع",
        cups: "كوب",
        demandExists: "⚠️ يوجد طلب، لكن لا توجد إمدادات!",
        noCustomers: "📉 لا زبائن اليوم.",
        customersLove: "⭐⭐⭐ الزبائن يحبونها! بيع",
        repPlus: "سمعة +",
        veryHappy: "⭐⭐ سعداء جدًا! بيع",
        satisfied: "⭐ راضون. بيع",
        customersUnhappy: "😞 الزبائن غير راضين. سمعة -5",
        goodDay: "✅ يوم جيد! بيع",
        onlyStand: "🏆 أنت الكشك الوحيد!",
        competitorClosed: "👋 منافس أغلق!",
        newCompetitor: "🪙 منافس جديد افتتح!",
        upgradedTo: "⬆️ تمت ترقية",
        to: "إلى مستوى",
        purchasedUmbrella: "☂️ تم شراء المظلة! مبيعات أفضل في الطقس الحار.",
        recipeLog: "📋 الوصفة:",
        achievementUnlocked: "🏆",
        need: "تحتاج",

        // التقرير اليومي
        reportTitle: "📊 تقرير اليوم",
        reportCups: "🥤 أكواب مباعة",
        reportRevenue: "💰 الإيرادات",
        reportCost: "💸 التكلفة",
        reportProfit: "📈 الربح",
        reportRep: "👍 السمعة",
        reportChartTitle: "📈 سجل الربح (آخر الأيام)",
        reportContinue: "✅ متابعة",
        tierLove: "⭐⭐⭐ الزبائن يحبونها!",
        tierVeryHappy: "⭐⭐ سعداء جداً!",
        tierSatisfied: "⭐ راضون",
        tierUnhappy: "😞 الزبائن غير راضين",
        tierGood: "✅ يوم جيد",
        tierNoSupplies: "⚠️ نفدت الإمدادات",
        tierNoCustomers: "📉 لا زبائن",

        // إعادة التعيين
        resetButton: "🔄 إعادة تعيين",
        resetConfirm: "هل تريد مسح كل التقدّم؟ لا يمكن التراجع.",
        resetDone: "🔄 تمت إعادة التعيين.",

        // المحاكاة
        timeLabel: "الوقت",
        savedIndicator: "💾 تم الحفظ",

        // إشعار
        unlockedToast: "إنجاز جديد!",

        // الصعوبة
        difficultyTitle: "🎮 اختر مستوى الصعوبة",
        diffEasy: "😊 سهل",
        diffEasyDesc: "تبدأ بـ 150$. الزبائن أكثر تسامحاً مع الأسعار.",
        diffNormal: "😐 عادي",
        diffNormalDesc: "تبدأ بـ 100$. تجربة متوازنة.",
        diffHard: "😤 صعب",
        diffHardDesc: "تبدأ بـ 70$. الزبائن متطلبون في السعر.",
        currentDifficulty: "الصعوبة:",

        // التعليم
        tutorialBtn: "🎓 الدرس التعليمي",
        tutorialSkip: "تخطي",
        tutorialNext: "التالي ←",
        tutorialDone: "✅ تم",
        tutorialStep: "خطوة",
        tutWelcomeTitle: "👋 أهلاً بك!",
        tutWelcomeText: "تعلّم إدارة كشك الليموناضة في 5 خطوات سريعة.",
        tutResourcesTitle: "📊 مواردك",
        tutResourcesText: "في الأعلى: ليمون 🍋، سكر 🍯، ثلج 🧊، نقود 💰، جودة الإبريق 🥤، والطقس الحالي.",
        tutRecipeTitle: "⚙️ اضبط الوصفة",
        tutRecipeText: "افتح القائمة الجانبية لتحديد كمية المكونات لكل كوب وسعر البيع. التوازن هو السر.",
        tutSuppliesTitle: "🛒 اشترِ الإمدادات",
        tutSuppliesText: "استخدم الشراء السريع أو افتح قائمة الإمدادات للحصول على عروض. لا يمكنك البيع بدون مكونات!",
        tutStartTitle: "🚀 ابدأ اليوم",
        tutStartText: "اضغط ابدأ اليوم. شاهد المحاكاة المباشرة ثم اطّلع على التقرير اليومي.",

        // إمكانية الوصول
        colorblindBtn: "👁️ وضع عمى الألوان",
        colorblindOn: "عمى الألوان: مُفعَّل",
        colorblindOff: "عمى الألوان: مُعطَّل",

        // أنواع العملاء (جمهور اليوم)
        crowdLabel: "جمهور اليوم:",
        crowdChild: "🧒 أطفال — يحبون الحلو والرخيص",
        crowdTeen:  "🧑 شباب — يريدون ثلجاً كثيراً، يدفعون أكثر",
        crowdAdult: "🧑‍💼 بالغون — ذوق متوازن وميزانية أوسع",
        crowdElder: "👴 كبار — أقل حلاوة وميزانية ضيقة",
        crowdWoman: "👩 نساء — متوازنات ويدفعن بسخاء",
        crowdMan:   "👨 رجال — متوازنون ويدفعون بسخاء",

        // الولاء
        loyalLabel: "🤝 الزبائن الدائمون",
        loyaltyGained: "🤝 +{n} زبون دائم جديد",
        loyaltyLost: "💔 فقدت {n} زبون دائم",

        // الفساد
        spoilageLog: "🗑️ تلف: {l}🍋 {s}🍯 {i}🧊",

        // الأحداث الجديدة
        eventLemonShortage: "نقص في الليمون (الأسعار ارتفعت)",
        eventViral: "فيديو فيرال على السوشيال ميديا!",
        eventHeatwave: "موجة حر تضرب المدينة"
    }
};

window.translations = translations;

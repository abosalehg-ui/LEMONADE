// ========================================
// PHASER 3 LEMONADE STAND SIMULATION
// Pixel Art Style - LEMONADE TYCOON Clone
// ========================================

class LemonadeStandScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LemonadeStandScene' });
        this.customers = [];
        this.vendor = null;
        this.stand = null;
        this.umbrella = null;
        this.isSimulating = false;
    }

    preload() {
        // إنشاء رسومات Pixel Art برمجياً
        this.createPixelAssets();
    }

    createPixelAssets() {
        // === خلفية العشب ===
        const grassTexture = this.textures.createCanvas('grass', 800, 400);
        const grassCtx = grassTexture.getContext();
        
        // تدرج أخضر للعشب
        const gradient = grassCtx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#b0e57c');
        gradient.addColorStop(1, '#8bc34a');
        grassCtx.fillStyle = gradient;
        grassCtx.fillRect(0, 0, 800, 400);
        
        // إضافة خطوط عشب بسيطة
        grassCtx.strokeStyle = '#7ab84a';
        grassCtx.lineWidth = 2;
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 800;
            const y = 200 + Math.random() * 200;
            grassCtx.beginPath();
            grassCtx.moveTo(x, y);
            grassCtx.lineTo(x + 5, y - 10);
            grassCtx.stroke();
        }
        grassTexture.refresh();

        // === الطاولة (Pixel Art) ===
        this.createTableTextures();

        // === البائع (Pixel Art) ===
        const vendorCanvas = this.textures.createCanvas('vendor', 32, 48);
        const vCtx = vendorCanvas.getContext();
        
        // رأس بيج
        vCtx.fillStyle = '#ffdbac';
        vCtx.fillRect(10, 4, 12, 12);
        
        // شعر بني
        vCtx.fillStyle = '#5c4033';
        vCtx.fillRect(10, 4, 12, 4);
        
        // عيون
        vCtx.fillStyle = '#000';
        vCtx.fillRect(13, 10, 2, 2);
        vCtx.fillRect(18, 10, 2, 2);
        
        // ابتسامة
        vCtx.fillRect(14, 14, 4, 1);
        
        // قميص أخضر
        vCtx.fillStyle = '#7ab84a';
        vCtx.fillRect(8, 16, 16, 14);
        
        // يدين
        vCtx.fillStyle = '#ffdbac';
        vCtx.fillRect(6, 20, 4, 8);
        vCtx.fillRect(22, 20, 4, 8);
        
        // بنطال أزرق
        vCtx.fillStyle = '#4a90e2';
        vCtx.fillRect(10, 30, 12, 14);
        
        // حذاء بني
        vCtx.fillStyle = '#5c4033';
        vCtx.fillRect(10, 44, 5, 4);
        vCtx.fillRect(17, 44, 5, 4);
        
        vendorCanvas.refresh();

        // === الزبائن (Pixel Art) ===
        this.createCustomerTextures();

        // === المظلة (Pixel Art) ===
        const umbrellaCanvas = this.textures.createCanvas('umbrella', 80, 60);
        const uCtx = umbrellaCanvas.getContext();
        
        // عمود المظلة
        uCtx.fillStyle = '#8B4513';
        uCtx.fillRect(38, 20, 4, 40);
        
        // قماش المظلة (نصف دائرة)
        uCtx.fillStyle = '#FF6347';
        uCtx.beginPath();
        uCtx.arc(40, 20, 35, Math.PI, 0, false);
        uCtx.fill();
        
        // خطوط المظلة
        uCtx.strokeStyle = '#DC143C';
        uCtx.lineWidth = 2;
        for (let i = -3; i <= 3; i++) {
            uCtx.beginPath();
            uCtx.moveTo(40, 20);
            uCtx.lineTo(40 + i * 10, 20 + 30);
            uCtx.stroke();
        }
        
        umbrellaCanvas.refresh();

        // === كوب الليموناضة (أيقونة) ===
        const cupCanvas = this.textures.createCanvas('lemonade_cup', 16, 20);
        const cCtx = cupCanvas.getContext();
        
        // كوب أصفر
        cCtx.fillStyle = '#FFD700';
        cCtx.fillRect(4, 6, 8, 12);
        cCtx.fillRect(3, 18, 10, 2);
        
        // شريحة ليمون
        cCtx.fillStyle = '#FFA500';
        cCtx.beginPath();
        cCtx.arc(8, 4, 3, 0, Math.PI * 2);
        cCtx.fill();
        
        // شفاطة
        cCtx.strokeStyle = '#FF0000';
        cCtx.lineWidth = 2;
        cCtx.beginPath();
        cCtx.moveTo(10, 6);
        cCtx.lineTo(12, 0);
        cCtx.stroke();
        
        cupCanvas.refresh();

        // === أيقونات ردود الفعل ===
        this.createFeedbackIcons();
    }

    createTableTextures() {
        // طاولة بسيطة (Basic)
        const tableBasic = this.textures.createCanvas('table_basic', 80, 40);
        let tCtx = tableBasic.getContext();
        tCtx.fillStyle = '#8B4513';
        tCtx.fillRect(10, 20, 60, 5); // سطح الطاولة
        tCtx.fillRect(15, 25, 5, 15); // رجل يسار
        tCtx.fillRect(60, 25, 5, 15); // رجل يمين
        tableBasic.refresh();

        // طاولة جيدة (Good)
        const tableGood = this.textures.createCanvas('table_good', 80, 40);
        tCtx = tableGood.getContext();
        tCtx.fillStyle = '#A0522D';
        tCtx.fillRect(5, 18, 70, 7);
        tCtx.fillRect(10, 25, 6, 15);
        tCtx.fillRect(64, 25, 6, 15);
        // مفرش أحمر
        tCtx.fillStyle = '#DC143C';
        tCtx.fillRect(8, 15, 64, 3);
        tableGood.refresh();

        // طاولة فاخرة (Luxury)
        const tableLuxury = this.textures.createCanvas('table_luxury', 80, 40);
        tCtx = tableLuxury.getContext();
        tCtx.fillStyle = '#654321';
        tCtx.fillRect(0, 16, 80, 9);
        tCtx.fillRect(8, 25, 8, 15);
        tCtx.fillRect(64, 25, 8, 15);
        // مفرش ذهبي
        tCtx.fillStyle = '#FFD700';
        tCtx.fillRect(5, 13, 70, 3);
        // زخارف
        tCtx.fillStyle = '#FFA500';
        for (let i = 10; i < 70; i += 10) {
            tCtx.fillRect(i, 18, 4, 4);
        }
        tableLuxury.refresh();
    }

    createCustomerTextures() {
        const customerTypes = [
            { key: 'customer1', shirt: '#FF6B6B', pants: '#4ECDC4' },
            { key: 'customer2', shirt: '#95E1D3', pants: '#F38181' },
            { key: 'customer3', shirt: '#FFA502', pants: '#2C3E50' },
            { key: 'customer4', shirt: '#6C5CE7', pants: '#FDCB6E' }
        ];

        customerTypes.forEach(type => {
            const canvas = this.textures.createCanvas(type.key, 28, 40);
            const ctx = canvas.getContext();
            
            // رأس
            ctx.fillStyle = '#ffdbac';
            ctx.fillRect(9, 3, 10, 10);
            
            // شعر
            ctx.fillStyle = '#000';
            ctx.fillRect(9, 3, 10, 3);
            
            // عيون
            ctx.fillRect(11, 8, 2, 2);
            ctx.fillRect(15, 8, 2, 2);
            
            // قميص
            ctx.fillStyle = type.shirt;
            ctx.fillRect(7, 13, 14, 12);
            
            // يدين
            ctx.fillStyle = '#ffdbac';
            ctx.fillRect(5, 16, 3, 7);
            ctx.fillRect(20, 16, 3, 7);
            
            // بنطال
            ctx.fillStyle = type.pants;
            ctx.fillRect(9, 25, 10, 12);
            
            // حذاء
            ctx.fillStyle = '#000';
            ctx.fillRect(9, 37, 4, 3);
            ctx.fillRect(15, 37, 4, 3);
            
            canvas.refresh();
        });
    }

    createFeedbackIcons() {
        // أيقونة سعيد (Happy)
        const happyCanvas = this.textures.createCanvas('icon_happy', 24, 24);
        let ctx = happyCanvas.getContext();
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(12, 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(7, 8, 3, 3); // عين يسار
        ctx.fillRect(14, 8, 3, 3); // عين يمين
        ctx.beginPath(); // ابتسامة
        ctx.arc(12, 13, 6, 0, Math.PI);
        ctx.stroke();
        happyCanvas.refresh();

        // أيقونة غاضب (Angry)
        const angryCanvas = this.textures.createCanvas('icon_angry', 24, 24);
        ctx = angryCanvas.getContext();
        ctx.fillStyle = '#FF4444';
        ctx.beginPath();
        ctx.arc(12, 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(7, 8, 3, 3);
        ctx.fillRect(14, 8, 3, 3);
        ctx.beginPath(); // عبوس
        ctx.arc(12, 17, 6, Math.PI, 0);
        ctx.stroke();
        angryCanvas.refresh();

        // أيقونة غالي (Expensive)
        const expensiveCanvas = this.textures.createCanvas('icon_expensive', 24, 24);
        ctx = expensiveCanvas.getContext();
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.arc(12, 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('$', 6, 18);
        expensiveCanvas.refresh();

        // أيقونة انتظار (Waiting)
        const waitingCanvas = this.textures.createCanvas('icon_waiting', 24, 24);
        ctx = waitingCanvas.getContext();
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.arc(12, 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFF';
        ctx.fillRect(11, 6, 2, 6);
        ctx.fillRect(11, 11, 5, 2);
        waitingCanvas.refresh();
    }

    create() {
        // إضافة الخلفية
        this.add.image(400, 200, 'grass');

        // إضافة الطاولة (ستتحدث حسب المستوى)
        this.stand = this.add.image(400, 280, 'table_basic').setOrigin(0.5, 1);

        // إضافة المظلة (مخفية افتراضياً)
        this.umbrella = this.add.image(400, 180, 'umbrella').setVisible(false);

        // إضافة البائع
        this.vendor = this.add.image(420, 270, 'vendor').setOrigin(0.5, 1);

        // إضافة أيقونة الكوب على الطاولة
        this.add.image(380, 250, 'lemonade_cup').setScale(1.5);

        // مجموعة الزبائن
        this.customerGroup = this.add.group();

        // النص التوضيحي
        this.statusText = this.add.text(400, 20, 'Ready to Start!', {
            fontSize: '18px',
            color: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
    }

    // === تحديث المحل حسب الترقيات ===
    updateStandVisuals(upgrades) {
        const tableLevels = ['table_basic', 'table_good', 'table_luxury'];
        this.stand.setTexture(tableLevels[upgrades.table]);
        this.umbrella.setVisible(upgrades.umbrella);
    }

    // === بدء المحاكاة ===
    startSimulation(maxCups, satisfactionRate) {
        if (this.isSimulating) return;
        this.isSimulating = true;
        
        this.customerGroup.clear(true, true);
        this.statusText.setText('Day in Progress...');

        let cupsSold = 0;
        const spawnInterval = 1500; // مللي ثانية بين كل زبون
        
        const spawnTimer = this.time.addEvent({
            delay: spawnInterval,
            callback: () => {
                if (cupsSold >= maxCups) {
                    spawnTimer.remove();
                    this.endSimulation();
                    return;
                }

                this.spawnCustomer(satisfactionRate);
                cupsSold++;
            },
            loop: true
        });
    }

    // === إنشاء زبون جديد ===
    spawnCustomer(satisfactionRate) {
        const customerKey = `customer${Phaser.Math.Between(1, 4)}`;
        const customer = this.add.image(-50, 320, customerKey).setOrigin(0.5, 1);
        
        this.customerGroup.add(customer);

        // الزبون يمشي للمحل
        this.tweens.add({
            targets: customer,
            x: 300,
            duration: 2000,
            ease: 'Linear',
            onComplete: () => {
                this.serveCustomer(customer, satisfactionRate);
            }
        });
    }

    // === خدمة الزبون ===
    serveCustomer(customer, satisfactionRate) {
        // تحديد رد الفعل
        let feedbackIcon = 'icon_happy';
        const rand = Math.random();
        
        if (satisfactionRate < 0.7) {
            feedbackIcon = 'icon_angry';
            if (window.game) window.game.feedback.angry++;
            if (window.playSound) window.playSound('angry');
        } else if (satisfactionRate > 1.5) {
            feedbackIcon = 'icon_happy';
            if (window.game) window.game.feedback.happy++;
            if (window.playSound) window.playSound('happy');
        } else if (rand < 0.2) {
            feedbackIcon = 'icon_expensive';
            if (window.game) window.game.feedback.expensive++;
        } else {
            if (window.game) window.game.feedback.waiting++;
        }

        // عرض الأيقونة فوق الزبون
        const icon = this.add.image(customer.x, customer.y - 50, feedbackIcon).setScale(1.5);
        
        // صوت البيع
        if (window.playSound) window.playSound('sell');

        // الزبون يغادر بعد ثانية
        this.time.delayedCall(1000, () => {
            icon.destroy();
            
            this.tweens.add({
                targets: customer,
                x: 900,
                duration: 2000,
                ease: 'Linear',
                onComplete: () => customer.destroy()
            });
        });
    }

    // === إنهاء المحاكاة ===
    endSimulation() {
        this.isSimulating = false;
        this.statusText.setText('Day Complete!');
        
        this.time.delayedCall(1500, () => {
            this.statusText.setText('Ready for Next Day');
        });
    }

    // === تخطي اليوم ===
    skipDay() {
        this.time.removeAllEvents();
        this.customerGroup.clear(true, true);
        this.endSimulation();
    }
}

// ========================================
// PHASER GAME CONFIG
// ========================================

const phaserConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 400,
    },
    parent: 'phaser-container',
    backgroundColor: '#8bc34a',
    scene: LemonadeStandScene,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true // CRITICAL: Enable pixel art rendering
};

// تهيئة اللعبة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    window.phaserGame = new Phaser.Game(phaserConfig);
});

// ========================================
// INTEGRATION FUNCTIONS (للاستدعاء من index.html)
// ========================================

window.updatePhaserStand = function(upgrades) {
    const scene = window.phaserGame?.scene.getScene('LemonadeStandScene');
    if (scene) {
        scene.updateStandVisuals(upgrades);
    }
};

window.startPhaserSimulation = function(maxCups, satisfactionRate) {
    const scene = window.phaserGame?.scene.getScene('LemonadeStandScene');
    if (scene) {
        scene.startSimulation(maxCups, satisfactionRate);
    }
};

window.skipPhaserDay = function() {
    const scene = window.phaserGame?.scene.getScene('LemonadeStandScene');
    if (scene) {
        scene.skipDay();
    }
};
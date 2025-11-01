// ========================================
// PHASER 3 LEMONADE STAND SIMULATION - BACKGROUND IMAGE
// Using LEMONADE.jpg as background
// ========================================

class LemonadeStandScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LemonadeStandScene' });
        this.customers = [];
        this.isSimulating = false;
        this.simSpeed = 1;
    }

    preload() {
        // تحميل صورة الخلفية
        this.load.image('background', 'assets/LEMONADE.jpg');
        
        // إنشاء رسومات العملاء فقط
        this.createCustomerAssets();
        this.createFeedbackIcons();
    }

    createCustomerAssets() {
        const customerColors = [
            { body: '#FF6B6B', details: '#4ECDC4' },
            { body: '#95E1D3', details: '#F38181' },
            { body: '#FFA502', details: '#2C3E50' },
            { body: '#6C5CE7', details: '#FDCB6E' }
        ];

        customerColors.forEach((colors, index) => {
            const texture = this.textures.createCanvas(`iso_customer${index + 1}`, 20, 28);
            const ctx = texture.getContext();
            
            // تنظيف الخلفية بشفافية
            ctx.clearRect(0, 0, 20, 28);
            
            // الجسم (isometric)
            ctx.fillStyle = colors.body;
            ctx.beginPath();
            ctx.moveTo(10, 5);
            ctx.lineTo(18, 15);
            ctx.lineTo(10, 25);
            ctx.lineTo(2, 15);
            ctx.closePath();
            ctx.fill();
            
            // الرأس
            ctx.fillStyle = '#FFDBAC';
            ctx.beginPath();
            ctx.ellipse(10, 3, 4, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // الشعر
            ctx.fillStyle = colors.details;
            ctx.fillRect(6, 2, 8, 2);
            
            // العيون
            ctx.fillStyle = '#000000';
            ctx.fillRect(7, 5, 2, 1);
            ctx.fillRect(11, 5, 2, 1);
            
            texture.refresh();
        });
    }

    createFeedbackIcons() {
        // Happy Icon
        const happyCanvas = this.textures.createCanvas('icon_happy', 24, 24);
        let ctx = happyCanvas.getContext();
        ctx.clearRect(0, 0, 24, 24);
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(12, 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(7, 8, 3, 3);
        ctx.fillRect(14, 8, 3, 3);
        ctx.beginPath();
        ctx.arc(12, 13, 6, 0, Math.PI);
        ctx.stroke();
        happyCanvas.refresh();

        // Angry Icon
        const angryCanvas = this.textures.createCanvas('icon_angry', 24, 24);
        ctx = angryCanvas.getContext();
        ctx.clearRect(0, 0, 24, 24);
        ctx.fillStyle = '#FF4444';
        ctx.beginPath();
        ctx.arc(12, 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(7, 8, 3, 3);
        ctx.fillRect(14, 8, 3, 3);
        ctx.beginPath();
        ctx.arc(12, 17, 6, Math.PI, 0);
        ctx.stroke();
        angryCanvas.refresh();

        // Expensive Icon
        const expensiveCanvas = this.textures.createCanvas('icon_expensive', 24, 24);
        ctx = expensiveCanvas.getContext();
        ctx.clearRect(0, 0, 24, 24);
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.arc(12, 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('$', 6, 18);
        expensiveCanvas.refresh();

        // Waiting Icon
        const waitingCanvas = this.textures.createCanvas('icon_waiting', 24, 24);
        ctx = waitingCanvas.getContext();
        ctx.clearRect(0, 0, 24, 24);
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
        // الخلفية - صورة LEMONADE.jpg
        this.background = this.add.image(200, 200, 'background').setDisplaySize(400, 400);

        // مجموعة العملاء فقط
        this.customerGroup = this.add.group();

        // النص التوضيحي
        this.statusText = this.add.text(200, 120, 'جاهز للبدء!', {
            fontSize: '14px',
            color: '#fff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5);

        // ✅ إطار النص لجعله أكثر وضوحاً
        this.statusText.setStroke('#000000', 3);
        this.statusText.setDepth(1000);
    }

    updateStandVisuals(upgrades) {
        // ✅ تأثير الترقية (يمكن إضافة تأثيرات بصرية أخرى إذا رغبت)
        console.log('Upgrades updated:', upgrades);
        
        // يمكنك إضافة تأثيرات على الخلفية حسب الترقيات إذا أردت
        if (upgrades.table > 0) {
            this.tweens.add({
                targets: this.background,
                scaleX: 1.02,
                scaleY: 1.02,
                duration: 200,
                yoyo: true
            });
        }
    }

    startSimulation(maxCups, satisfactionRate) {
        if (this.isSimulating) return;
        this.isSimulating = true;
        
        this.customerGroup.clear(true, true);
        this.statusText.setText('اليوم جاري...');

        let cupsSold = 0;
        const baseDelay = 1800;
        
        const spawnTimer = this.time.addEvent({
            delay: baseDelay / this.simSpeed,
            callback: () => {
                if (cupsSold >= maxCups) {
                    spawnTimer.remove();
                    this.endSimulation();
                    return;
                }

                this.spawnCustomer(satisfactionRate);
                cupsSold++;
                
                // تحديث المؤقت
                const progress = Math.floor((cupsSold / maxCups) * 100);
                if (document.getElementById('simTimer')) {
                    document.getElementById('simTimer').textContent = `الوقت: ${progress}%`;
                }
            },
            loop: true
        });

        this.currentTimer = spawnTimer;
    }

    spawnCustomer(satisfactionRate) {
        const customerType = Phaser.Math.Between(1, 4);
        
        // نقطة البداية (خارج الشاشة على اليسار)
        const startX = -30;
        const startY = 320; // من الأسفل
        
        const customer = this.add.image(startX, startY, `iso_customer${customerType}`);
        
        // ظل العميل
        const shadow = this.add.ellipse(startX, startY + 10, 12, 4, 0x000000, 0.4);
        customer.shadow = shadow;
        
        this.customerGroup.add(customer);

        // الحركة إلى نقطة البيع (وسط الشاشة)
        const targetX = 165;
        const targetY = 220;
        
        this.tweens.add({
            targets: customer,
            x: targetX,
            y: targetY,
            duration: 3000 / this.simSpeed,
            ease: 'Linear',
            onUpdate: () => {
                shadow.x = customer.x;
                shadow.y = customer.y + 10;
            },
            onComplete: () => {
                this.serveCustomer(customer, satisfactionRate);
            }
        });
    }

    serveCustomer(customer, satisfactionRate) {
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

        // عرض أيقونة التغذية الراجعة
        const icon = this.add.image(customer.x, customer.y - 30, feedbackIcon);
        
        // ✅ حركة ظهور الأيقونة
        icon.setScale(0);
        this.tweens.add({
            targets: icon,
            scale: 1,
            duration: 200,
            ease: 'Back.easeOut'
        });
        
        if (window.playSound) window.playSound('sell');

        // تأثير النقود الطائر
        this.createMoneyEffect(customer.x, customer.y);

        // مغادرة العميل
        this.time.delayedCall(1000 / this.simSpeed, () => {
            this.tweens.add({
                targets: icon,
                alpha: 0,
                duration: 300,
                onComplete: () => icon.destroy()
            });
            
            // الحركة للخروج من الشاشة (إلى اليمين)
            this.tweens.add({
                targets: customer,
                x: 430,
                y: 280,
                duration: 2500 / this.simSpeed,
                ease: 'Linear',
                onUpdate: () => {
                    if (customer.shadow) {
                        customer.shadow.x = customer.x;
                        customer.shadow.y = customer.y + 10;
                    }
                },
                onComplete: () => {
                    if (customer.shadow) customer.shadow.destroy();
                    customer.destroy();
                }
            });
        });
    }

    createMoneyEffect(x, y) {
        const money = this.add.text(x, y, '💰', {
            fontSize: '16px'
        });
        
        this.tweens.add({
            targets: money,
            y: y - 40,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => money.destroy()
        });
    }

    endSimulation() {
        this.isSimulating = false;
        this.statusText.setText('انتهى اليوم!');
        
        // ✅ احتفال بسيط
        this.tweens.add({
            targets: this.statusText,
            y: '-=10',
            duration: 200,
            yoyo: true,
            repeat: 2
        });
        
        this.time.delayedCall(1500, () => {
            this.statusText.setText('جاهز لليوم التالي');
        });
    }

    skipDay() {
        if (this.currentTimer) {
            this.currentTimer.remove();
        }
        this.time.removeAllEvents();
        this.customerGroup.clear(true, true);
        this.endSimulation();
    }

    toggleSpeed() {
        this.simSpeed = this.simSpeed === 1 ? 10 : 1;
        
        if (this.currentTimer && this.isSimulating) {
            const newDelay = 1800 / this.simSpeed;
            this.currentTimer.delay = newDelay;
        }
    }
}

// ========================================
// PHASER GAME CONFIG - 400x400
// ========================================

const phaserConfig = {
    type: Phaser.AUTO,
    width: 400,
    height: 400,
    parent: 'phaser-container',
    backgroundColor: '#87CEEB',
    scene: LemonadeStandScene,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: false,
    transparent: false
};

// تهيئة اللعبة
window.addEventListener('DOMContentLoaded', () => {
    window.phaserGame = new Phaser.Game(phaserConfig);
});

// ========================================
// INTEGRATION FUNCTIONS
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

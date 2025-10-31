// ========================================
// PHASER 3 LEMONADE STAND SIMULATION - ISOMETRIC
// Enhanced with Isometric View & Animations
// ========================================

class LemonadeStandScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LemonadeStandScene' });
        this.customers = [];
        this.vendor = null;
        this.stand = null;
        this.isSimulating = false;
        this.simSpeed = 1;
        this.isoGroup = null;
    }

    preload() {
        this.createIsometricAssets();
    }

    createIsometricAssets() {
        // === ISOMETRIC GRASS BACKGROUND ===
        const bgTexture = this.textures.createCanvas('iso_bg', 400, 400);
        const bgCtx = bgTexture.getContext();
        
        // السماء
        const skyGradient = bgCtx.createLinearGradient(0, 0, 0, 150);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(1, '#E0F7FF');
        bgCtx.fillStyle = skyGradient;
        bgCtx.fillRect(0, 0, 400, 150);
        
        // العشب (منظور isometric)
        const grassGradient = bgCtx.createLinearGradient(0, 150, 0, 400);
        grassGradient.addColorStop(0, '#7EC850');
        grassGradient.addColorStop(1, '#5A9E3A');
        bgCtx.fillStyle = grassGradient;
        
        // رسم العشب بشكل ماسي (isometric)
        bgCtx.beginPath();
        bgCtx.moveTo(0, 150);
        bgCtx.lineTo(400, 150);
        bgCtx.lineTo(400, 400);
        bgCtx.lineTo(0, 400);
        bgCtx.closePath();
        bgCtx.fill();
        
        // الرصيف
        bgCtx.fillStyle = '#888888';
        bgCtx.beginPath();
        bgCtx.moveTo(100, 250);
        bgCtx.lineTo(300, 250);
        bgCtx.lineTo(350, 400);
        bgCtx.lineTo(150, 400);
        bgCtx.closePath();
        bgCtx.fill();
        
        // الشارع
        bgCtx.fillStyle = '#555555';
        bgCtx.beginPath();
        bgCtx.moveTo(0, 280);
        bgCtx.lineTo(400, 280);
        bgCtx.lineTo(400, 400);
        bgCtx.lineTo(0, 400);
        bgCtx.closePath();
        bgCtx.fill();
        
        // خطوط الشارع
        bgCtx.strokeStyle = '#FFFF00';
        bgCtx.lineWidth = 2;
        bgCtx.setLineDash([10, 10]);
        bgCtx.beginPath();
        bgCtx.moveTo(0, 340);
        bgCtx.lineTo(400, 340);
        bgCtx.stroke();
        
        bgTexture.refresh();

        // === ISOMETRIC STAND ===
        this.createIsometricStand();

        // === ISOMETRIC VENDOR ===
        this.createIsometricVendor();

        // === ISOMETRIC CUSTOMERS ===
        this.createIsometricCustomers();

        // === DECORATIONS ===
        this.createIsometricDecorations();

        // === FEEDBACK ICONS ===
        this.createFeedbackIcons();
    }

    createIsometricStand() {
        const standTexture = this.textures.createCanvas('iso_stand', 80, 60);
        const ctx = standTexture.getContext();
        
        // تنظيف الخلفية بشفافية
        ctx.clearRect(0, 0, 80, 60);
        
        // قاعدة الكشك (isometric)
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(40, 10);
        ctx.lineTo(70, 30);
        ctx.lineTo(40, 50);
        ctx.lineTo(10, 30);
        ctx.closePath();
        ctx.fill();
        
        // سطح الكشك
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.moveTo(40, 5);
        ctx.lineTo(75, 28);
        ctx.lineTo(40, 55);
        ctx.lineTo(5, 28);
        ctx.closePath();
        ctx.fill();
        
        // لافتة
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(35, 15, 10, 8);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 8px Arial';
        ctx.fillText('LEMON', 28, 22);
        
        standTexture.refresh();
    }

    createIsometricVendor() {
        const vendorTexture = this.textures.createCanvas('iso_vendor', 24, 32);
        const ctx = vendorTexture.getContext();
        
        // تنظيف الخلفية بشفافية
        ctx.clearRect(0, 0, 24, 32);
        
        // الرأس (isometric)
        ctx.fillStyle = '#FFDBAC';
        ctx.beginPath();
        ctx.ellipse(12, 8, 6, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // الشعر
        ctx.fillStyle = '#5C4033';
        ctx.fillRect(6, 6, 12, 3);
        
        // الجسم
        ctx.fillStyle = '#7AB84A';
        ctx.beginPath();
        ctx.moveTo(12, 12);
        ctx.lineTo(18, 20);
        ctx.lineTo(12, 28);
        ctx.lineTo(6, 20);
        ctx.closePath();
        ctx.fill();
        
        // العيون
        ctx.fillStyle = '#000000';
        ctx.fillRect(9, 10, 2, 2);
        ctx.fillRect(13, 10, 2, 2);
        
        // الابتسامة
        ctx.beginPath();
        ctx.arc(12, 14, 3, 0, Math.PI);
        ctx.stroke();
        
        vendorTexture.refresh();
    }

    createIsometricCustomers() {
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

    createIsometricDecorations() {
        // الأشجار
        const treeTexture = this.textures.createCanvas('iso_tree', 30, 40);
        const ctx = treeTexture.getContext();
        
        // تنظيف الخلفية بشفافية
        ctx.clearRect(0, 0, 30, 40);
        
        // الجذع
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(13, 25, 4, 15);
        
        // الأوراق
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.ellipse(15, 20, 10, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        treeTexture.refresh();
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
        // الخلفية
        this.add.image(200, 200, 'iso_bg');

        // مجموعة العناصر Isometric
        this.isoGroup = this.add.group();

        // إضافة الأشجار
        this.addTree(50, 300);
        this.addTree(350, 320);

        // الظل
        this.standShadow = this.add.ellipse(200, 320, 60, 20, 0x000000, 0.3);

        // الكشك
        this.stand = this.add.image(200, 250, 'iso_stand');
        this.isoGroup.add(this.stand);

        // البائع
        this.vendor = this.add.image(200, 240, 'iso_vendor');
        this.isoGroup.add(this.vendor);

        // الظل المتحرك للبائع
        this.vendorShadow = this.add.ellipse(200, 255, 15, 5, 0x000000, 0.4);

        // كوب الليموناضة
        const cupTexture = this.textures.createCanvas('lemonade_cup', 12, 16);
        const cupCtx = cupTexture.getContext();
        cupCtx.clearRect(0, 0, 12, 16);
        cupCtx.fillStyle = '#FFD700';
        cupCtx.fillRect(3, 4, 6, 10);
        cupCtx.fillRect(2, 14, 8, 2);
        cupCtx.fillStyle = '#FFA500';
        cupCtx.beginPath();
        cupCtx.arc(6, 2, 2, 0, Math.PI * 2);
        cupCtx.fill();
        cupTexture.refresh();

        this.cup = this.add.image(190, 235, 'lemonade_cup');
        this.isoGroup.add(this.cup);

        // ✅ حركة الكوب
        this.tweens.add({
            targets: this.cup,
            y: 230,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // مجموعة العملاء
        this.customerGroup = this.add.group();

        // النص - فوق البائع مباشرة
        this.statusText = this.add.text(200, 210, 'جاهز للبدء!', {
            fontSize: '14px',
            color: '#fff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5);

        // ✅ إطار النص لجعله أكثر وضوحاً
        this.statusText.setStroke('#000000', 3);
        this.statusText.setDepth(1000); // التأكد من أنه فوق كل العناصر
    }

    addTree(x, y) {
        const tree = this.add.image(x, y, 'iso_tree');
        this.isoGroup.add(tree);
    }

    updateStandVisuals(upgrades) {
        // ✅ تأثير الترقية
        this.tweens.add({
            targets: this.stand,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 200,
            yoyo: true
        });

        // تحديث مظهر الكشك حسب الترقيات
        if (upgrades.table > 0) {
            this.stand.setTint(0xFFD700); // تلوين ذهبي للترقية
        } else {
            this.stand.clearTint();
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
        const customer = this.add.image(-30, 350, `iso_customer${customerType}`);
        
        // ظل العميل
        const shadow = this.add.ellipse(-30, 360, 12, 4, 0x000000, 0.4);
        customer.shadow = shadow;
        
        this.customerGroup.add(customer);

        // الحركة إلى الكشك (مسار isometric)
        this.tweens.add({
            targets: customer,
            x: 150,
            y: 280,
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
            
            this.tweens.add({
                targets: customer,
                x: 400,
                y: 350,
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
        
        // ✅ احتفال
        this.tweens.add({
            targets: [this.vendor, this.cup],
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
    pixelArt: false, // تغيير إلى false للسماح بالرسوم الناعمة
    transparent: true // لجعل الخلفية شفافة إذا لزم الأمر
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
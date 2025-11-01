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
        this.spawnPoints = [];
        this.exitPoints = [];
    }

    preload() {
        // تحميل صورة الخلفية
        this.load.image('background', 'assets/LEMONADE.jpg');
        
        // إنشاء رسومات العملاء المتحركة
        this.createAnimatedCustomerAssets();
        this.createFeedbackIcons();
    }

    createAnimatedCustomerAssets() {
        const customerTypes = [
            { name: 'child', height: 18, colors: ['#FF6B6B', '#4ECDC4'] },
            { name: 'teen', height: 22, colors: ['#95E1D3', '#F38181'] },
            { name: 'adult', height: 26, colors: ['#FFA502', '#2C3E50'] },
            { name: 'elder', height: 24, colors: ['#6C5CE7', '#FDCB6E'] },
            { name: 'woman', height: 24, colors: ['#FF9FF3', '#F368E0'] },
            { name: 'man', height: 26, colors: ['#54A0FF', '#5F27CD'] }
        ];

        // إنشاء 4 اتجاهات للحركة (يسار، يمين، أعلى، أسفل)
        const directions = ['left', 'right', 'up', 'down'];
        
        customerTypes.forEach((type, typeIndex) => {
            directions.forEach(direction => {
                // إنشاء 4 إطارات للحركة
                for (let frame = 0; frame < 4; frame++) {
                    const textureKey = `customer_${type.name}_${direction}_${frame}`;
                    const texture = this.textures.createCanvas(textureKey, 20, type.height);
                    const ctx = texture.getContext();
                    
                    this.drawCustomerFrame(ctx, type, direction, frame);
                    texture.refresh();
                }
            });
        });
    }

    drawCustomerFrame(ctx, type, direction, frame) {
        const width = 20;
        const height = type.height;
        
        // تنظيف الخلفية بشفافية
        ctx.clearRect(0, 0, width, height);
        
        // تحديد اتجاه الجسم والنظر
        let bodyOffset = 0;
        let lookDirection = 0;
        
        switch(direction) {
            case 'left':
                bodyOffset = -2;
                lookDirection = -1;
                break;
            case 'right':
                bodyOffset = 2;
                lookDirection = 1;
                break;
            case 'up':
                bodyOffset = 0;
                lookDirection = 0;
                break;
            case 'down':
                bodyOffset = 0;
                lookDirection = 0;
                break;
        }
        
        // تأثير الحركة (تمايل الجسم)
        const walkOffset = Math.sin(frame * 0.8) * 1.5;
        
        // الجسم (isometric مع تأثير الحركة)
        ctx.fillStyle = type.colors[0];
        ctx.beginPath();
        ctx.moveTo(10 + bodyOffset, 5 + walkOffset);
        ctx.lineTo(18 + bodyOffset, 15);
        ctx.lineTo(10 + bodyOffset, height - 3);
        ctx.lineTo(2 + bodyOffset, 15);
        ctx.closePath();
        ctx.fill();
        
        // الرأس
        ctx.fillStyle = '#FFDBAC';
        ctx.beginPath();
        ctx.ellipse(10 + bodyOffset, 3 + walkOffset, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // الشعر (يختلف حسب نوع العميل)
        ctx.fillStyle = type.colors[1];
        if (type.name === 'child') {
            ctx.fillRect(6 + bodyOffset, 2 + walkOffset, 8, 2);
        } else if (type.name === 'woman') {
            // شعر طويل
            ctx.fillRect(5 + bodyOffset, 2 + walkOffset, 10, 4);
            ctx.fillRect(8 + bodyOffset, 6 + walkOffset, 4, 6);
        } else {
            ctx.fillRect(6 + bodyOffset, 2 + walkOffset, 8, 2);
        }
        
        // العيون (تتبع اتجاه النظر)
        ctx.fillStyle = '#000000';
        const eyeSpacing = 3 + lookDirection;
        ctx.fillRect(7 + bodyOffset - lookDirection, 5 + walkOffset, 2, 1);
        ctx.fillRect(11 + bodyOffset - lookDirection, 5 + walkOffset, 2, 1);
        
        // الأرجل المتحركة
        ctx.fillStyle = type.colors[0];
        const legOffset = Math.sin(frame * 1.5) * 2;
        ctx.fillRect(6 + bodyOffset, height - 3, 3, 3 + legOffset);
        ctx.fillRect(11 + bodyOffset, height - 3, 3, 3 - legOffset);
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

        // تعريف نقاط الظهور والمغادرة من 4 جهات
        this.setupSpawnAndExitPoints();

        // مجموعة العملاء
        this.customerGroup = this.add.group();

        // النص التوضيحي
        this.statusText = this.add.text(200, 120, 'جاهز للبدء!', {
            fontSize: '14px',
            color: '#fff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
        this.statusText.setStroke('#000000', 3);
        this.statusText.setDepth(1000);

        // إنشاء أنيميشن للعملاء
        this.createCustomerAnimations();
    }

    setupSpawnAndExitPoints() {
        // 4 نقاط ظهور من الجهات المختلفة
        this.spawnPoints = [
            { x: -30, y: 200, direction: 'right' },   // يسار
            { x: 230, y: 300, direction: 'left' },    // يمين
            { x: 200, y: 310, direction: 'down' },    // أسفل+
            { x: 200, y: 430, direction: 'up' }       // أسفل
        ];

        // 4 نقاط مغادرة (يمكن أن تكون مختلفة عن نقاط الظهور)
        this.exitPoints = [
            { x: -30, y: 300, direction: 'left' },    // يسار
            { x: 330, y: 420, direction: 'right' },   // يمين
            { x: 310, y: 400, direction: 'up' },      // أسفل+
            { x: 300, y: 430, direction: 'down' }     // أسفل
        ];
    }

    createCustomerAnimations() {
        const customerTypes = ['child', 'teen', 'adult', 'elder', 'woman', 'man'];
        const directions = ['left', 'right', 'up', 'down'];
        
        customerTypes.forEach(type => {
            directions.forEach(direction => {
                const frames = [];
                for (let i = 0; i < 4; i++) {
                    frames.push({ key: `customer_${type}_${direction}_${i}` });
                }
                
                this.anims.create({
                    key: `walk_${type}_${direction}`,
                    frames: frames,
                    frameRate: 8,
                    repeat: -1
                });
            });
        });
    }

    updateStandVisuals(upgrades) {
        console.log('Upgrades updated:', upgrades);
        
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
        // اختيار عشوائي لنقطة الظهور والمغادرة
        const spawnIndex = Phaser.Math.Between(0, this.spawnPoints.length - 1);
        const exitIndex = Phaser.Math.Between(0, this.exitPoints.length - 1);
        
        const spawnPoint = this.spawnPoints[spawnIndex];
        const exitPoint = this.exitPoints[exitIndex];
        
        // اختيار عشوائي لنوع العميل
        const customerTypes = ['child', 'teen', 'adult', 'elder', 'woman', 'man'];
        const customerType = customerTypes[Phaser.Math.Between(0, customerTypes.length - 1)];
        
        const customer = this.add.sprite(spawnPoint.x, spawnPoint.y, `customer_${customerType}_${spawnPoint.direction}_0`);
        
        // بدء الأنيميشن
        customer.play(`walk_${customerType}_${spawnPoint.direction}`);
        
        // ظل العميل
        const shadow = this.add.ellipse(spawnPoint.x, spawnPoint.y + 10, 12, 4, 0x000000, 0.4);
        customer.shadow = shadow;
        
        this.customerGroup.add(customer);

        // الحركة إلى نقطة البيع (وسط الشاشة)
        const targetX = 200;
        const targetY = 200;
        
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
                this.serveCustomer(customer, satisfactionRate, exitPoint);
            }
        });
    }

    serveCustomer(customer, satisfactionRate, exitPoint) {
        // إيقاف أنيميشن المشي مؤقتاً
        customer.anims.pause();
        
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
            
            // استئناف الأنيميشن مع اتجاه المغادرة
            customer.setTexture(`customer_${customer.anims.currentAnim.key.split('_')[1]}_${exitPoint.direction}_0`);
            customer.play(`walk_${customer.anims.currentAnim.key.split('_')[1]}_${exitPoint.direction}`);
            
            // الحركة للخروج من الشاشة
            this.tweens.add({
                targets: customer,
                x: exitPoint.x,
                y: exitPoint.y,
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

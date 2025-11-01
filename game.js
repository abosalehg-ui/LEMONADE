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
            { name: 'child', height: 28, colors: ['#FF6B6B', '#4ECDC4'] },
            { name: 'teen', height: 34, colors: ['#95E1D3', '#F38181'] },
            { name: 'adult', height: 38, colors: ['#FFA502', '#2C3E50'] },
            { name: 'elder', height: 36, colors: ['#6C5CE7', '#FDCB6E'] },
            { name: 'woman', height: 36, colors: ['#FF9FF3', '#F368E0'] },
            { name: 'man', height: 38, colors: ['#54A0FF', '#5F27CD'] }
        ];

        // إنشاء 4 اتجاهات للحركة (يسار، يمين، أعلى، أسفل)
        const directions = ['left', 'right', 'up', 'down'];
        
        customerTypes.forEach((type, typeIndex) => {
            directions.forEach(direction => {
                // إنشاء 4 إطارات للحركة
                for (let frame = 0; frame < 4; frame++) {
                    const textureKey = `customer_${type.name}_${direction}_${frame}`;
                    const texture = this.textures.createCanvas(textureKey, 30, type.height);
                    const ctx = texture.getContext();
                    
                    this.drawCustomerFrame(ctx, type, direction, frame);
                    texture.refresh();
                }
            });
        });
    }

    drawCustomerFrame(ctx, type, direction, frame) {
    const width = 30;
    const height = type.height;
    ctx.clearRect(0, 0, width, height);

    const step = frame % 4;
    const walkCycle = Math.sin((step / 4) * Math.PI * 2);
    const bodySway = walkCycle * 2.8; // زيادة حركة الجسم يميناً ويساراً
    const armSwing = walkCycle * 4; // زيادة حركة الذراعين
    const legSwing = walkCycle * 3.5; // زيادة حركة الساقين
    const headBob = Math.abs(walkCycle) * 1.2; // حركة الرأس للأعلى والأسفل

    // الاتجاه
    let dirX = 0, dirY = 0, flipX = 1;
    switch (direction) {
        case 'left': flipX = -1; dirX = -1; break;
        case 'right': flipX = 1; dirX = 1; break;
        case 'up': dirY = -1; break;
        case 'down': dirY = 1; break;
    }

    const centerX = 15 + bodySway; // إضافة الحركة الأفقية للجسم
    const baseY = height * 0.55; // تعديل موضع الجسم

    // ظل أسفل القدمين
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(15, height - 3, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // ملابس وتفاصيل حسب النوع
    let topColor = type.colors[0];
    let bottomColor = type.colors[1];
    let accessory = null;

    if (type.name === 'man') {
        topColor = '#3C6382';
        bottomColor = '#0A3D62';
        accessory = 'hat';
    } else if (type.name === 'woman') {
        topColor = '#F8A5C2';
        bottomColor = '#FDA7DF';
        accessory = 'dress';
    } else if (type.name === 'child') {
        topColor = '#55E6C1';
        bottomColor = '#10AC84';
        accessory = 'shorts';
    } else if (type.name === 'elder') {
        topColor = '#BDC581';
        bottomColor = '#84817A';
        accessory = 'glasses';
    } else if (type.name === 'teen') {
        topColor = '#9AECDB';
        bottomColor = '#1B9CFC';
        accessory = 'hoodie';
    } else if (type.name === 'adult') {
        topColor = '#F6B93B';
        bottomColor = '#E58E26';
    }

    // الساقين مع حركة أفضل
    const legLength = height * 0.35;
    const legY = height - legLength - 4;
    ctx.fillStyle = '#2C2C2C';
    
    // الساق اليسرى
    ctx.save();
    ctx.translate(centerX - 2.5, legY);
    ctx.rotate(-legSwing * 0.15);
    ctx.fillRect(-1.5, 0, 3, legLength);
    ctx.restore();
    
    // الساق اليمنى
    ctx.save();
    ctx.translate(centerX + 2.5, legY);
    ctx.rotate(legSwing * 0.15);
    ctx.fillRect(-1.5, 0, 3, legLength);
    ctx.restore();

    // الجسم مع تدرج لوني
    const bodyHeight = height * 0.4;
    const grad = ctx.createLinearGradient(centerX - 6, baseY, centerX + 6, baseY + bodyHeight);
    grad.addColorStop(0, topColor);
    grad.addColorStop(1, bottomColor);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(centerX - 6 * flipX, baseY);
    ctx.lineTo(centerX + 6 * flipX, baseY);
    ctx.lineTo(centerX + 5 * flipX, baseY + bodyHeight);
    ctx.lineTo(centerX - 5 * flipX, baseY + bodyHeight);
    ctx.closePath();
    ctx.fill();

    // الذراعين مع حركة محسنة
    const armLength = 9;
    ctx.fillStyle = topColor;
    ctx.strokeStyle = bottomColor;
    ctx.lineWidth = 3;
    
    // الذراع اليسرى
    ctx.save();
    ctx.translate(centerX - 7 * flipX, baseY + 4);
    ctx.rotate(-armSwing * 0.12);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, armLength);
    ctx.stroke();
    ctx.restore();
    
    // الذراع اليمنى
    ctx.save();
    ctx.translate(centerX + 7 * flipX, baseY + 4);
    ctx.rotate(armSwing * 0.12);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, armLength);
    ctx.stroke();
    ctx.restore();

    // الرأس مع حركة محسنة
    const headY = baseY - 9 - headBob;
    ctx.fillStyle = '#FFD9B3';
    ctx.beginPath();
    ctx.arc(centerX, headY, 6, 0, Math.PI * 2);
    ctx.fill();

    // الشعر
    if (type.name === 'woman') {
        ctx.fillStyle = '#6D214F';
        ctx.beginPath();
        ctx.arc(centerX, headY - 3, 7, 0, Math.PI, true);
        ctx.fill();
        ctx.fillRect(centerX - 4, headY - 2, 8, 7);
    } else if (type.name === 'child') {
        ctx.fillStyle = '#82589F';
        ctx.fillRect(centerX - 5, headY - 6, 10, 3);
    } else if (type.name === 'elder') {
        ctx.fillStyle = '#CED6E0';
        ctx.fillRect(centerX - 5, headY - 6, 10, 4);
    } else {
        ctx.fillStyle = '#303952';
        ctx.fillRect(centerX - 5, headY - 6, 10, 4);
    }

    // العيون + الفم مع اتجاهات محسنة
    const eyeOffsetX = dirX * 1.8;
    const eyeOffsetY = dirY * 1.2;
    
    ctx.fillStyle = '#000';
    // رسم العيون بناءً على الاتجاه
    if (direction === 'left' || direction === 'right') {
        // عيون جانبية
        ctx.fillRect(centerX - 3 + eyeOffsetX, headY - 1, 1.8, 2);
        ctx.fillRect(centerX + 2 + eyeOffsetX, headY - 1, 1.8, 2);
    } else {
        // عيون أمامية
        ctx.beginPath();
        ctx.arc(centerX - 2 + eyeOffsetX, headY - 0.5 + eyeOffsetY, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 2 + eyeOffsetX, headY - 0.5 + eyeOffsetY, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // الفم
    ctx.fillStyle = '#A44';
    ctx.fillRect(centerX - 1.5, headY + 3 + eyeOffsetY * 0.5, 3, 1);

    // الإكسسوارات (حسب النوع)
    if (accessory === 'hat') {
        ctx.fillStyle = '#2C3A47';
        ctx.fillRect(centerX - 6, headY - 8, 12, 3);
        ctx.fillRect(centerX - 4, headY - 11, 8, 3);
    } else if (accessory === 'dress') {
        ctx.fillStyle = '#F8A5C2';
        ctx.beginPath();
        ctx.moveTo(centerX - 6, baseY + 3);
        ctx.lineTo(centerX + 6, baseY + 3);
        ctx.lineTo(centerX + 8, baseY + bodyHeight);
        ctx.lineTo(centerX - 8, baseY + bodyHeight);
        ctx.closePath();
        ctx.fill();
    } else if (accessory === 'shorts') {
        ctx.fillStyle = '#0A3D62';
        ctx.fillRect(centerX - 5, baseY + bodyHeight - 6, 10, 6);
    } else if (accessory === 'glasses') {
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.rect(centerX - 5, headY - 1.5, 4, 3);
        ctx.rect(centerX + 1, headY - 1.5, 4, 3);
        ctx.moveTo(centerX - 1, headY);
        ctx.lineTo(centerX + 1, headY);
        ctx.stroke();
    } else if (accessory === 'hoodie') {
        ctx.fillStyle = '#1B9CFC';
        ctx.beginPath();
        ctx.arc(centerX, headY - 4, 7, Math.PI, 0);
        ctx.fill();
    }
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
            { x: -30, y: 202, direction: 'right' },   // يسار
            { x: 403, y: 296, direction: 'left' },    // يمين
            { x: 401, y: 306, direction: 'down' },    // أسفل+
            { x: 200, y: 430, direction: 'up' }       // أسفل
        ];

        // 4 نقاط مغادرة (يمكن أن تكون مختلفة عن نقاط الظهور)
        this.exitPoints = [
            { x: -30, y: 300, direction: 'left' },    // يسار
            { x: 401, y: 303, direction: 'right' },   // يمين
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

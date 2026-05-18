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
        this.isRaining = false;
        this.rainParticles = null;
    }

    preload() {
        // تحميل صورة الخلفية
        this.load.image('background', 'assets/LEMONADE.jpg');
        
        // إنشاء رسومات العملاء المتحركة
        this.createAnimatedCustomerAssets();
        this.createFeedbackIcons();
        this.createRainAssets();
    }

    createAnimatedCustomerAssets() {
        // Cached spritesheet approach: one canvas per customer TYPE (6 total),
        // each holds a 6x6 grid (6 directions × 6 frames). Reduces 216 textures → 6.
        const customerTypes = [
            { name: 'child', height: 24, colors: ['#FF6B6B', '#4ECDC4'] },
            { name: 'teen',  height: 30, colors: ['#95E1D3', '#F38181'] },
            { name: 'adult', height: 36, colors: ['#FFA502', '#2C3E50'] },
            { name: 'elder', height: 34, colors: ['#6C5CE7', '#FDCB6E'] },
            { name: 'woman', height: 34, colors: ['#FF9FF3', '#F368E0'] },
            { name: 'man',   height: 36, colors: ['#54A0FF', '#5F27CD'] }
        ];

        this.customerDirections = ['left', 'right', 'up', 'down', 'up-left', 'up-right'];
        this.customerFrameWidth = 24;
        this.customerFrameCount = 6;

        customerTypes.forEach(type => {
            const sheetW = this.customerFrameWidth * this.customerFrameCount; // 6 cols
            const sheetH = type.height * this.customerDirections.length;       // 6 rows
            const textureKey = `customer_${type.name}`;
            const texture = this.textures.createCanvas(textureKey, sheetW, sheetH);
            const ctx = texture.getContext();

            this.customerDirections.forEach((direction, rowIdx) => {
                for (let frame = 0; frame < this.customerFrameCount; frame++) {
                    ctx.save();
                    ctx.translate(frame * this.customerFrameWidth, rowIdx * type.height);
                    this.drawCustomerFrame(ctx, type, direction, frame);
                    ctx.restore();
                }
            });

            // Register each cell as an addressable frame: `${direction}_${frame}`
            this.customerDirections.forEach((direction, rowIdx) => {
                for (let frame = 0; frame < this.customerFrameCount; frame++) {
                    texture.add(
                        `${direction}_${frame}`,
                        0,
                        frame * this.customerFrameWidth,
                        rowIdx * type.height,
                        this.customerFrameWidth,
                        type.height
                    );
                }
            });

            texture.refresh();
        });
    }

    drawCustomerFrame(ctx, type, direction, frame) {
        const width = 24;
        const height = type.height;
        ctx.clearRect(0, 0, width, height);

        const step = frame % 6;
        const walkCycle = Math.sin((step / 6) * Math.PI * 2);
        const bodySway = walkCycle * 1.5;
        const armSwing = walkCycle * 3;
        const legSwing = walkCycle * 3.5;
        const headBob = Math.sin((step / 6) * Math.PI * 4) * 0.8;

        // الاتجاه
        let dirX = 0, dirY = 0, flipX = 1, lookDirection = direction;
        
        // تحديد اتجاه النظر والحركة
        switch (direction) {
            case 'left': 
                flipX = -1; 
                dirX = -1; 
                break;
            case 'right': 
                flipX = 1; 
                dirX = 1; 
                break;
            case 'up': 
                dirY = -1; 
                break;
            case 'down': 
                dirY = 1; 
                break;
            case 'up-left': 
                flipX = -1; 
                dirX = -0.7; 
                dirY = -0.7; 
                break;
            case 'up-right': 
                flipX = 1; 
                dirX = 0.7; 
                dirY = -0.7; 
                break;
        }

        const centerX = 12;
        const baseY = height / 2 + bodySway;

        // ظل أسفل القدمين (أكثر واقعية)
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(centerX, height - 1, 7, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // ملابس وتفاصيل حسب النوع (ألوان محسنة)
        let topColor = type.colors[0];
        let bottomColor = type.colors[1];
        let accessory = null;
        let skinColor = '#FFDBAC';
        let hairColor = '#3C2415';

        if (type.name === 'man') {
            topColor = '#2C3A47';
            bottomColor = '#1B9CFC';
            accessory = 'hat';
            skinColor = '#D4A574';
            hairColor = '#654321';
        } else if (type.name === 'woman') {
            topColor = '#FD79A8';
            bottomColor = '#E84393';
            accessory = 'dress';
            hairColor = '#8B4513';
        } else if (type.name === 'child') {
            topColor = '#00B894';
            bottomColor = '#00A085';
            accessory = 'shorts';
            skinColor = '#FFDBAC';
            hairColor = '#654321';
        } else if (type.name === 'elder') {
            topColor = '#BDC581';
            bottomColor = '#6C7CE0';
            accessory = 'glasses';
            skinColor = '#D2B48C';
            hairColor = '#C0C0C0';
        } else if (type.name === 'teen') {
            topColor = '#74B9FF';
            bottomColor = '#0984E3';
            accessory = 'hoodie';
            skinColor = '#FFDBAC';
            hairColor = '#8B4513';
        } else if (type.name === 'adult') {
            topColor = '#FDCB6E';
            bottomColor = '#E17055';
            skinColor = '#D4A574';
            hairColor = '#654321';
        }

        // الجسم المحسن مع تدرج لوني أفضل
        const grad = ctx.createLinearGradient(centerX - 6, baseY, centerX + 6, baseY + 12);
        grad.addColorStop(0, this.lightenColor(topColor, 20));
        grad.addColorStop(0.5, topColor);
        grad.addColorStop(1, bottomColor);
        ctx.fillStyle = grad;
        
        ctx.beginPath();
        ctx.moveTo(centerX - 6 * flipX, baseY);
        ctx.lineTo(centerX + 6 * flipX, baseY);
        ctx.lineTo(centerX + 4 * flipX, height - 6);
        ctx.lineTo(centerX - 4 * flipX, height - 6);
        ctx.closePath();
        ctx.fill();

        // إضافة ظل للجسم
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // الذراعين المحسنة
        ctx.fillStyle = this.lightenColor(skinColor, -10);
        ctx.fillRect(centerX - 8 * flipX, baseY + 3 - armSwing * 0.5, 2.5, 7);
        ctx.fillRect(centerX + 6 * flipX, baseY + 3 + armSwing * 0.5, 2.5, 7);

        // الساقين المحسنة
        ctx.fillStyle = '#2D3436';
        ctx.fillRect(centerX - 3.5, height - 6 - legSwing * 0.3, 2.5, 6 + legSwing * 0.3);
        ctx.fillRect(centerX + 1, height - 6 + legSwing * 0.3, 2.5, 6 - legSwing * 0.3);

        // الرأس مع حركته الطبيعية
        const headY = baseY - 8 + headBob;
        const headSize = 5;
        
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(centerX, headY, headSize, 0, Math.PI * 2);
        ctx.fill();

        // إضافة ظل للرأس
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // الشعر المحسن حسب النوع
        if (type.name === 'woman') {
            // شعر طويل للمرأة
            ctx.fillStyle = hairColor;
            ctx.beginPath();
            ctx.arc(centerX, headY - 3, headSize + 1, 0, Math.PI * 2);
            ctx.fill();
            // طبقات الشعر
            ctx.fillRect(centerX - (headSize + 1), headY - 2, (headSize + 1) * 2, 8);
        } else if (type.name === 'child') {
            // شعر مجعد للأطفال
            ctx.fillStyle = hairColor;
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(centerX - 4 + i * 2, headY - 5, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (type.name === 'elder') {
            // شعر رمادي للقضاء
            ctx.fillStyle = hairColor;
            ctx.fillRect(centerX - headSize, headY - headSize - 1, headSize * 2, 3);
            // شارب
            ctx.fillRect(centerX - 2, headY + 2, 4, 1);
        } else {
            // شعر عادي للرجال والبالغين
            ctx.fillStyle = hairColor;
            ctx.beginPath();
            ctx.arc(centerX, headY - 1, headSize + 1, Math.PI, 0);
            ctx.fill();
            ctx.fillRect(centerX - headSize, headY - headSize, headSize * 2, 3);
        }

        // العيون المحسنة مع اتجاه النظر
        const eyeOffsetX = dirX * 1.5;
        const eyeOffsetY = dirY * 1;
        const eyeSize = 1.5;
        
        ctx.fillStyle = '#000';
        ctx.fillRect(centerX - 3 + eyeOffsetX, headY - 1 + eyeOffsetY, eyeSize, eyeSize);
        ctx.fillRect(centerX + 1.5 + eyeOffsetX, headY - 1 + eyeOffsetY, eyeSize, eyeSize);

        // بريق في العيون
        ctx.fillStyle = '#FFF';
        ctx.fillRect(centerX - 2.5 + eyeOffsetX, headY - 0.5 + eyeOffsetY, 0.5, 0.5);
        ctx.fillRect(centerX + 2 + eyeOffsetX, headY - 0.5 + eyeOffsetY, 0.5, 0.5);

        // الفم
        ctx.fillStyle = '#8B4513';
        const mouthY = headY + 3 + eyeOffsetY * 0.3;
        ctx.fillRect(centerX - 1.5 + eyeOffsetX * 0.2, mouthY, 3, 1);

        // الإكسسورات المحسنة
        if (accessory === 'hat') {
            // قبعة للرجال
            ctx.fillStyle = '#2C3A47';
            ctx.fillRect(centerX - 6, headY - 7, 12, 2);
            ctx.fillRect(centerX - 4, headY - 9, 8, 2);
            ctx.strokeStyle = '#34495E';
            ctx.lineWidth = 1;
            ctx.strokeRect(centerX - 6, headY - 7, 12, 2);
        } else if (accessory === 'dress') {
            // فستان للمرأة
            ctx.fillStyle = this.lightenColor('#FD79A8', -20);
            ctx.beginPath();
            ctx.moveTo(centerX - 6, baseY + 3);
            ctx.lineTo(centerX + 6, baseY + 3);
            ctx.lineTo(centerX + 4, height - 4);
            ctx.lineTo(centerX - 4, height - 4);
            ctx.closePath();
            ctx.fill();
        } else if (accessory === 'shorts') {
            // شورت للأطفال
            ctx.fillStyle = '#00A085';
            ctx.fillRect(centerX - 5, baseY + 5, 10, 4);
        } else if (accessory === 'glasses') {
            // نظارة للقضاء
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.rect(centerX - 5, headY - 2, 4, 3);
            ctx.rect(centerX + 1, headY - 2, 4, 3);
            ctx.moveTo(centerX - 1, headY - 1);
            ctx.lineTo(centerX + 1, headY - 1);
            ctx.stroke();
        } else if (accessory === 'hoodie') {
            // برقع للمquila
            ctx.fillStyle = '#74B9FF';
            ctx.beginPath();
            ctx.arc(centerX, headY - 4, 6, Math.PI, 0);
            ctx.fill();
            // حبل البرقع
            ctx.fillStyle = '#0984E3';
            ctx.fillRect(centerX - 1, headY + 2, 2, 3);
        }
    }

    // دالة لتفتيح أو تغميق الألوان
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    createRainAssets() {
        // إنشاء جزيئات المطر
        const rainTexture = this.textures.createCanvas('raindrop', 2, 8);
        const ctx = rainTexture.getContext();
        ctx.clearRect(0, 0, 2, 8);
        ctx.fillStyle = '#4FC3F7';
        ctx.fillRect(0, 0, 2, 8);
        rainTexture.refresh();

        // إنشاء تشويش الخلفية للمطر
        const rainOverlay = this.add.graphics();
        rainOverlay.setAlpha(0.1);
        rainOverlay.fillStyle(0x4FC3F7);
        
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, 400);
            const y = Phaser.Math.Between(0, 400);
            rainOverlay.fillRect(x, y, 1, 1);
        }
        rainOverlay.setVisible(false);
        this.rainOverlay = rainOverlay;
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

        // إعداد المطر
        this.setupRain();
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

    setupRain() {
        // إنشاء جزيئات المطر
        this.rainParticles = this.add.particles('raindrop');
        this.rainEmitter = this.rainParticles.createEmitter({
            x: { min: 0, max: 400 },
            y: -10,
            lifespan: 2000,
            speedY: { min: 100, max: 200 },
            speedX: { min: -20, max: 20 },
            quantity: 2,
            frequency: 50,
            alpha: { start: 0.8, end: 0 },
            scale: { start: 1, end: 0.5 },
            tint: 0x4FC3F7
        });
        this.rainParticles.setVisible(false);
    }

    createCustomerAnimations() {
        const customerTypes = ['child', 'teen', 'adult', 'elder', 'woman', 'man'];

        customerTypes.forEach(type => {
            this.customerDirections.forEach(direction => {
                const frames = [];
                for (let i = 0; i < this.customerFrameCount; i++) {
                    frames.push({ key: `customer_${type}`, frame: `${direction}_${i}` });
                }

                this.anims.create({
                    key: `walk_${type}_${direction}`,
                    frames: frames,
                    frameRate: 10,
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

        // تشغيل المطر إذا كان هناك ترقية related to weather
        if (upgrades.weather === 'rain') {
            this.startRain();
        } else {
            this.stopRain();
        }
    }

    startRain() {
        if (!this.isRaining) {
            this.isRaining = true;
            this.rainParticles.setVisible(true);
            this.rainEmitter.start();
            this.rainOverlay.setVisible(true);
            
            // تأثير على الزبائن عند المطر
            this.time.delayedCall(500, () => {
                this.customerGroup.getChildren().forEach(customer => {
                    customer.setTint(0xCCCCCC);
                });
            });
        }
    }

    stopRain() {
        if (this.isRaining) {
            this.isRaining = false;
            this.rainParticles.setVisible(false);
            this.rainEmitter.stop();
            this.rainOverlay.setVisible(false);
            
            // إزالة التأثير عن الزبائن
            this.customerGroup.getChildren().forEach(customer => {
                customer.clearTint();
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

                const progress = Math.min(100, Math.floor((cupsSold / maxCups) * 100));
                const timerEl = document.getElementById('simTimer');
                const fillEl = document.getElementById('simProgressFill');
                if (timerEl) timerEl.textContent = `${progress}%`;
                if (fillEl) fillEl.style.width = `${progress}%`;
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
        
        // إضافة تنوع في اتجاه النظر
        const lookDirections = ['left', 'right', 'up', 'down', 'up-left', 'up-right'];
        const lookDirection = lookDirections[Phaser.Math.Between(0, lookDirections.length - 1)];
        
        const customer = this.add.sprite(spawnPoint.x, spawnPoint.y, `customer_${customerType}`, `${lookDirection}_0`);
        customer.customerType = customerType;

        // بدء الأنيميشن مع اتجاه النظر المختلف
        customer.play(`walk_${customerType}_${lookDirection}`);
        
        // ظل العميل المحسن
        const shadow = this.add.ellipse(spawnPoint.x, spawnPoint.y + 12, 14, 5, 0x000000, 0.3);
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
                shadow.y = customer.y + 12;
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
        const icon = this.add.image(customer.x, customer.y - 40, feedbackIcon);
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
            const typeName = customer.customerType;
            customer.setTexture(`customer_${typeName}`, `${exitPoint.direction}_0`);
            customer.play(`walk_${typeName}_${exitPoint.direction}`);
            
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
                        customer.shadow.y = customer.y + 12;
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
            fontSize: '18px'
        });
        
        this.tweens.add({
            targets: money,
            y: y - 50,
            alpha: 0,
            duration: 1200,
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

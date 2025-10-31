// ========================================
// PHASER 3 LEMONADE STAND - ISOMETRIC
// 400x400 | Isometric View | Enhanced Graphics
// ========================================

class LemonadeStandScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LemonadeStandScene' });
        this.customers = [];
        this.vendor = null;
        this.cart = null;
        this.isSimulating = false;
        this.simSpeed = 1;
        this.weather = 'sunny';
        this.dayCount = 1;
        this.currentTimer = null;
        this.activeTimers = [];
        this.activeTweens = [];
    }

    preload() {
        this.createIsometricAssets();
    }

    createIsometricAssets() {
        this.createIsometricBackground();
        this.createCartTextures();
        this.createVendorTextures();
        this.createCustomerTextures();
        this.createDecorations();
        this.createFeedbackIcons();
        this.createWeatherElements();
        this.createCoinTexture();
    }

    createIsometricBackground() {
        const canvas = this.textures.createCanvas('bg_iso', 400, 400);
        const ctx = canvas.getContext();
        
        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 150);
        skyGrad.addColorStop(0, '#87CEEB');
        skyGrad.addColorStop(1, '#B0E0E6');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 400, 150);
        
        // Grass area (top part)
        const grassGrad = ctx.createLinearGradient(0, 150, 0, 250);
        grassGrad.addColorStop(0, '#7ab84a');
        grassGrad.addColorStop(1, '#6aa33a');
        ctx.fillStyle = grassGrad;
        ctx.fillRect(0, 150, 400, 100);
        
        // Road - Isometric diamond
        ctx.fillStyle = '#555555';
        ctx.beginPath();
        ctx.moveTo(200, 180);
        ctx.lineTo(350, 250);
        ctx.lineTo(200, 320);
        ctx.lineTo(50, 250);
        ctx.closePath();
        ctx.fill();
        
        // Road lines
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.lineTo(200, 300);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Sidewalk left
        ctx.fillStyle = '#CCCCCC';
        ctx.beginPath();
        ctx.moveTo(50, 250);
        ctx.lineTo(100, 220);
        ctx.lineTo(100, 290);
        ctx.lineTo(50, 320);
        ctx.closePath();
        ctx.fill();
        
        // Sidewalk right
        ctx.beginPath();
        ctx.moveTo(350, 250);
        ctx.lineTo(300, 220);
        ctx.lineTo(300, 290);
        ctx.lineTo(350, 320);
        ctx.closePath();
        ctx.fill();
        
        // Grass bottom
        ctx.fillStyle = '#6aa33a';
        ctx.fillRect(0, 320, 400, 80);
        
        // Grass details
        ctx.strokeStyle = '#5a9330';
        ctx.lineWidth = 1;
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * 400;
            const y = 160 + Math.random() * 40;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 3, y - 6);
            ctx.stroke();
        }
        
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * 400;
            const y = 330 + Math.random() * 60;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 3, y - 6);
            ctx.stroke();
        }
        
        canvas.refresh();
    }

    createCartTextures() {
        // BASIC CART
        const basicCart = this.textures.createCanvas('cart_basic', 80, 70);
        let ctx = basicCart.getContext();
        
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(25, 60, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(55, 60, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(40, 25);
        ctx.lineTo(65, 40);
        ctx.lineTo(65, 55);
        ctx.lineTo(40, 40);
        ctx.lineTo(15, 55);
        ctx.lineTo(15, 40);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.moveTo(40, 25);
        ctx.lineTo(65, 40);
        ctx.lineTo(40, 55);
        ctx.lineTo(15, 40);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(35, 10, 10, 15);
        ctx.fillStyle = '#FF6347';
        ctx.font = 'bold 8px Arial';
        ctx.fillText('$', 37, 18);
        
        basicCart.refresh();

        // GOOD CART
        const goodCart = this.textures.createCanvas('cart_good', 90, 80);
        ctx = goodCart.getContext();
        
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(28, 68, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(62, 68, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.moveTo(45, 28);
        ctx.lineTo(75, 45);
        ctx.lineTo(75, 62);
        ctx.lineTo(45, 45);
        ctx.lineTo(15, 62);
        ctx.lineTo(15, 45);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#CD853F';
        ctx.beginPath();
        ctx.moveTo(45, 28);
        ctx.lineTo(75, 45);
        ctx.lineTo(45, 62);
        ctx.lineTo(15, 45);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#FF6347';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(45, 35);
        ctx.lineTo(68, 48);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(45, 40);
        ctx.lineTo(68, 53);
        ctx.stroke();
        
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(38, 8, 14, 20);
        ctx.fillStyle = '#FF6347';
        ctx.font = 'bold 10px Arial';
        ctx.fillText('🍋', 40, 18);
        
        goodCart.refresh();

        // LUXURY CART
        const luxuryCart = this.textures.createCanvas('cart_luxury', 100, 90);
        ctx = luxuryCart.getContext();
        
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(30, 78, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(70, 78, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.moveTo(50, 30);
        ctx.lineTo(85, 50);
        ctx.lineTo(85, 70);
        ctx.lineTo(50, 50);
        ctx.lineTo(15, 70);
        ctx.lineTo(15, 50);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, 30);
        ctx.lineTo(85, 50);
        ctx.lineTo(85, 70);
        ctx.stroke();
        
        ctx.fillStyle = '#8B6914';
        ctx.beginPath();
        ctx.moveTo(50, 30);
        ctx.lineTo(85, 50);
        ctx.lineTo(50, 70);
        ctx.lineTo(15, 50);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                ctx.fillRect(25 + i * 15, 48 + j * 10, 4, 4);
            }
        }
        
        // Umbrella
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.arc(50, 25, 30, Math.PI, 0, false);
        ctx.fill();
        ctx.strokeStyle = '#DC143C';
        ctx.lineWidth = 2;
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(50, 25);
            ctx.lineTo(50 + i * 10, 45);
            ctx.stroke();
        }
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(48, 25, 4, 25);
        
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(40, 5, 20, 15);
        ctx.fillStyle = '#8B0000';
        ctx.font = 'bold 10px Arial';
        ctx.fillText('VIP', 43, 15);
        
        luxuryCart.refresh();
    }

    createVendorTextures() {
        const directions = ['down', 'left', 'right', 'up'];
        
        directions.forEach(dir => {
            const canvas = this.textures.createCanvas(`vendor_${dir}`, 32, 48);
            const ctx = canvas.getContext();
            
            ctx.fillStyle = '#ffdbac';
            ctx.fillRect(10, 4, 12, 12);
            
            ctx.fillStyle = '#5c4033';
            ctx.fillRect(10, 4, 12, 4);
            
            ctx.fillStyle = '#000';
            if (dir === 'left') {
                ctx.fillRect(11, 9, 2, 2);
                ctx.fillRect(15, 9, 2, 2);
            } else if (dir === 'right') {
                ctx.fillRect(13, 9, 2, 2);
                ctx.fillRect(17, 9, 2, 2);
            } else if (dir === 'up') {
                ctx.fillRect(12, 8, 2, 2);
                ctx.fillRect(17, 8, 2, 2);
            } else {
                ctx.fillRect(12, 10, 2, 2);
                ctx.fillRect(17, 10, 2, 2);
            }
            
            ctx.fillRect(14, 14, 4, 1);
            
            ctx.fillStyle = '#7ab84a';
            ctx.fillRect(8, 16, 16, 14);
            
            ctx.fillStyle = '#ffdbac';
            if (dir === 'left') {
                ctx.fillRect(5, 20, 4, 8);
                ctx.fillRect(23, 20, 4, 8);
            } else if (dir === 'right') {
                ctx.fillRect(5, 20, 4, 8);
                ctx.fillRect(23, 20, 4, 8);
            } else {
                ctx.fillRect(6, 20, 4, 8);
                ctx.fillRect(22, 20, 4, 8);
            }
            
            ctx.fillStyle = '#4a90e2';
            ctx.fillRect(10, 30, 12, 14);
            
            ctx.fillStyle = '#5c4033';
            ctx.fillRect(10, 44, 5, 4);
            ctx.fillRect(17, 44, 5, 4);
            
            canvas.refresh();
        });
    }

    createCustomerTextures() {
        const customerTypes = [
            { id: 1, shirt: '#FF6B6B', pants: '#4ECDC4', hair: '#2C3E50' },
            { id: 2, shirt: '#95E1D3', pants: '#F38181', hair: '#8B4513' },
            { id: 3, shirt: '#FFA502', pants: '#2C3E50', hair: '#FFD700' },
            { id: 4, shirt: '#6C5CE7', pants: '#FDCB6E', hair: '#5c4033' }
        ];

        const directions = ['down', 'left', 'right', 'up'];

        customerTypes.forEach(type => {
            directions.forEach(dir => {
                const canvas = this.textures.createCanvas(`customer${type.id}_${dir}`, 28, 40);
                const ctx = canvas.getContext();
                
                ctx.fillStyle = '#ffdbac';
                ctx.fillRect(9, 3, 10, 10);
                
                ctx.fillStyle = type.hair;
                ctx.fillRect(9, 3, 10, 3);
                
                ctx.fillStyle = '#000';
                if (dir === 'left') {
                    ctx.fillRect(10, 8, 2, 2);
                    ctx.fillRect(14, 8, 2, 2);
                } else if (dir === 'right') {
                    ctx.fillRect(12, 8, 2, 2);
                    ctx.fillRect(16, 8, 2, 2);
                } else if (dir === 'up') {
                    ctx.fillRect(11, 7, 2, 2);
                    ctx.fillRect(15, 7, 2, 2);
                } else {
                    ctx.fillRect(11, 9, 2, 2);
                    ctx.fillRect(15, 9, 2, 2);
                }
                
                ctx.fillStyle = type.shirt;
                ctx.fillRect(7, 13, 14, 12);
                
                ctx.fillStyle = '#ffdbac';
                ctx.fillRect(5, 16, 3, 7);
                ctx.fillRect(20, 16, 3, 7);
                
                ctx.fillStyle = type.pants;
                ctx.fillRect(9, 25, 10, 12);
                
                ctx.fillStyle = '#000';
                ctx.fillRect(9, 37, 4, 3);
                ctx.fillRect(15, 37, 4, 3);
                
                canvas.refresh();
            });
        });
    }

    createDecorations() {
        const treeCanvas = this.textures.createCanvas('tree', 40, 60);
        const tCtx = treeCanvas.getContext();
        
        tCtx.fillStyle = '#8B4513';
        tCtx.fillRect(16, 35, 8, 25);
        
        tCtx.fillStyle = '#228B22';
        tCtx.beginPath();
        tCtx.arc(20, 20, 15, 0, Math.PI * 2);
        tCtx.fill();
        tCtx.beginPath();
        tCtx.arc(10, 30, 12, 0, Math.PI * 2);
        tCtx.fill();
        tCtx.beginPath();
        tCtx.arc(30, 30, 12, 0, Math.PI * 2);
        tCtx.fill();
        
        treeCanvas.refresh();

        const lampCanvas = this.textures.createCanvas('lamp', 20, 50);
        const lCtx = lampCanvas.getContext();
        
        lCtx.fillStyle = '#555';
        lCtx.fillRect(8, 10, 4, 40);
        
        lCtx.fillStyle = '#FFD700';
        lCtx.beginPath();
        lCtx.arc(10, 8, 6, 0, Math.PI * 2);
        lCtx.fill();
        
        lampCanvas.refresh();

        const signCanvas = this.textures.createCanvas('sign', 30, 40);
        const sCtx = signCanvas.getContext();
        
        sCtx.fillStyle = '#8B4513';
        sCtx.fillRect(13, 15, 4, 25);
        
        sCtx.fillStyle = '#FFD700';
        sCtx.fillRect(5, 10, 20, 12);
        
        sCtx.fillStyle = '#FF6347';
        sCtx.font = 'bold 8px Arial';
        sCtx.fillText('SALE', 7, 18);
        
        signCanvas.refresh();
    }

    createFeedbackIcons() {
        const happyCanvas = this.textures.createCanvas('icon_happy', 24, 24);
        let ctx = happyCanvas.getContext();
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(12, 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(7, 8, 3, 3);
        ctx.fillRect(14, 8, 3, 3);
        ctx.beginPath();
        ctx.arc(12, 13, 6, 0, Math.PI);
        ctx.lineWidth = 2;
        ctx.stroke();
        happyCanvas.refresh();

        const angryCanvas = this.textures.createCanvas('icon_angry', 24, 24);
        ctx = angryCanvas.getContext();
        ctx.fillStyle = '#FF4444';
        ctx.beginPath();
        ctx.arc(12, 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(7, 8, 3, 3);
        ctx.fillRect(14, 8, 3, 3);
        ctx.beginPath();
        ctx.arc(12, 17, 6, Math.PI, 0);
        ctx.lineWidth = 2;
        ctx.stroke();
        angryCanvas.refresh();

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

    createWeatherElements() {
        const sunCanvas = this.textures.createCanvas('sun', 40, 40);
        const sCtx = sunCanvas.getContext();
        sCtx.fillStyle = '#FFD700';
        sCtx.beginPath();
        sCtx.arc(20, 20, 15, 0, Math.PI * 2);
        sCtx.fill();
        sCtx.strokeStyle = '#FFA500';
        sCtx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            sCtx.beginPath();
            sCtx.moveTo(20 + Math.cos(angle) * 18, 20 + Math.sin(angle) * 18);
            sCtx.lineTo(20 + Math.cos(angle) * 25, 20 + Math.sin(angle) * 25);
            sCtx.stroke();
        }
        sunCanvas.refresh();

        const cloudCanvas = this.textures.createCanvas('cloud', 60, 30);
        const cCtx = cloudCanvas.getContext();
        cCtx.fillStyle = '#FFFFFF';
        cCtx.beginPath();
        cCtx.arc(15, 15, 10, 0, Math.PI * 2);
        cCtx.arc(30, 12, 12, 0, Math.PI * 2);
        cCtx.arc(45, 15, 10, 0, Math.PI * 2);
        cCtx.fill();
        cloudCanvas.refresh();
    }

    createCoinTexture() {
        const coinCanvas = this.textures.createCanvas('coin', 20, 20);
        const ctx = coinCanvas.getContext();
        
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(10, 10, 9, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#FFA500';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('$', 5, 15);
        
        coinCanvas.refresh();
    }

    create() {
        this.add.image(200, 200, 'bg_iso');
        this.createWeatherDisplay();

        this.add.image(40, 140, 'tree').setScale(0.8);
        this.add.image(360, 140, 'tree').setScale(0.8);

        // Vendor behind cart
        this.vendorShadow = this.add.ellipse(200, 245, 25, 8, 0x000000, 0.4);
        this.vendor = this.add.image(200, 235, 'vendor_down').setOrigin(0.5, 1);

        // Cart in front of vendor
        this.cartShadow = this.add.ellipse(200, 280, 80, 20, 0x000000, 0.3);
        this.cart = this.add.image(200, 260, 'cart_basic').setOrigin(0.5, 1);

        this.decorationsGroup = this.add.group();

        this.customerGroup = this.add.group();

        // Status text above vendor
        this.statusText = this.add.text(200, 190, 'Ready to Start!', {
            fontSize: '14px',
            color: '#fff',
            backgroundColor: '#000',
            padding: { x: 6, y: 3 }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.vendor,
            y: 233,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createWeatherDisplay() {
        if (this.weatherElements) {
            this.weatherElements.clear(true, true);
        }
        this.weatherElements = this.add.group();
        
        if (this.weather === 'sunny') {
            const sun = this.add.image(350, 50, 'sun');
            this.weatherElements.add(sun);
            
            this.tweens.add({
                targets: sun,
                angle: 360,
                duration: 20000,
                repeat: -1,
                ease: 'Linear'
            });
        } else {
            const cloud1 = this.add.image(100, 40, 'cloud').setAlpha(0.8);
            const cloud2 = this.add.image(250, 60, 'cloud').setAlpha(0.7);
            const cloud3 = this.add.image(350, 45, 'cloud').setAlpha(0.9);
            
            this.weatherElements.add([cloud1, cloud2, cloud3]);
            
            this.tweens.add({
                targets: [cloud1, cloud2, cloud3],
                x: '+=50',
                duration: 30000,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
    }

    updateStandVisuals(upgrades) {
        const cartLevels = ['cart_basic', 'cart_good', 'cart_luxury'];
        this.cart.setTexture(cartLevels[upgrades.table]);
        
        this.decorationsGroup.clear(true, true);
        
        if (upgrades.table >= 1) {
            const sign = this.add.image(160, 220, 'sign');
            this.decorationsGroup.add(sign);
            
            this.tweens.add({
                targets: sign,
                angle: -5,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        
        if (upgrades.table >= 2) {
            const lamp1 = this.add.image(150, 240, 'lamp');
            const lamp2 = this.add.image(250, 240, 'lamp');
            this.decorationsGroup.add([lamp1, lamp2]);
            
            this.tweens.add({
                targets: [lamp1, lamp2],
                alpha: 0.7,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        
        this.tweens.add({
            targets: this.cart,
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 200,
            yoyo: true
        });
    }

    startSimulation(maxCups, satisfactionRate) {
        if (this.isSimulating) {
            console.log('Already simulating, skipping...');
            return;
        }
        
        console.log('Starting simulation with', maxCups, 'cups');
        this.isSimulating = true;
        
        // Clean up any existing timers/tweens
        this.cleanupSimulation();
        
        this.weather = Math.random() > 0.5 ? 'sunny' : 'cloudy';
        this.createWeatherDisplay();
        
        this.customerGroup.clear(true, true);
        this.statusText.setText('Day in Progress...');

        let cupsSold = 0;
        const baseDelay = 2000;
        
        this.currentTimer = this.time.addEvent({
            delay: baseDelay / this.simSpeed,
            callback: () => {
                if (cupsSold >= maxCups) {
                    if (this.currentTimer) {
                        this.currentTimer.remove();
                        this.currentTimer = null;
                    }
                    this.endSimulation();
                    return;
                }

                this.spawnCustomer(satisfactionRate);
                cupsSold++;
                
                const progress = Math.floor((cupsSold / maxCups) * 100);
                if (document.getElementById('simTimer')) {
                    document.getElementById('simTimer').textContent = `TIME: ${progress}%`;
                }
            },
            loop: true
        });
    }

    cleanupSimulation() {
        // Remove all active timers
        if (this.currentTimer) {
            this.currentTimer.remove();
            this.currentTimer = null;
        }
        
        this.activeTimers.forEach(timer => {
            if (timer && timer.remove) {
                timer.remove();
            }
        });
        this.activeTimers = [];
        
        // Clean up customer group
        if (this.customerGroup) {
            this.customerGroup.getChildren().forEach(customer => {
                if (customer.shadow) {
                    customer.shadow.destroy();
                }
            });
            this.customerGroup.clear(true, true);
        }
    }

    spawnCustomer(satisfactionRate) {
        const customerNum = Phaser.Math.Between(1, 4);
        
        const spawnSide = Math.random() > 0.5 ? 'left' : 'right';
        let startX, startY, targetX, targetY, walkDir;
        
        if (spawnSide === 'left') {
            startX = 20;
            startY = 340;
            targetX = 170;
            targetY = 275;
            walkDir = 'right';
        } else {
            startX = 380;
            startY = 340;
            targetX = 230;
            targetY = 275;
            walkDir = 'left';
        }
        
        const textureKey = `customer${customerNum}_${walkDir}`;
        
        // Check if texture exists
        if (!this.textures.exists(textureKey)) {
            console.error('Texture does not exist:', textureKey);
            return;
        }
        
        const customer = this.add.image(startX, startY, textureKey).setOrigin(0.5, 1);
        customer.customerNum = customerNum;
        customer.isActive = true;
        
        const shadow = this.add.ellipse(startX, startY + 10, 20, 6, 0x000000, 0.4);
        customer.shadow = shadow;
        
        this.customerGroup.add(customer);

        let frame = 0;
        const walkTimer = this.time.addEvent({
            delay: 200 / this.simSpeed,
            callback: () => {
                if (!customer.isActive) {
                    walkTimer.remove();
                    return;
                }
                frame = (frame + 1) % 2;
                customer.y += (frame * 2 - 1);
            },
            loop: true
        });
        
        this.activeTimers.push(walkTimer);

        const walkTween = this.tweens.add({
            targets: customer,
            x: targetX,
            y: targetY,
            duration: 2500 / this.simSpeed,
            ease: 'Linear',
            onUpdate: () => {
                if (shadow && shadow.active) {
                    shadow.x = customer.x;
                    shadow.y = customer.y + 10;
                }
            },
            onComplete: () => {
                if (!customer.isActive) return;
                
                if (walkTimer && walkTimer.remove) {
                    walkTimer.remove();
                }
                
                const upTextureKey = `customer${customer.customerNum}_up`;
                if (this.textures.exists(upTextureKey)) {
                    customer.setTexture(upTextureKey);
                }
                
                this.serveCustomer(customer, satisfactionRate);
            }
        });
    }

    serveCustomer(customer, satisfactionRate) {
        if (!customer || !customer.active || !customer.isActive) return;
        
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

        const icon = this.add.image(customer.x, customer.y - 50, feedbackIcon).setScale(1.5);
        
        icon.setScale(0);
        this.tweens.add({
            targets: icon,
            scale: 1.5,
            duration: 200,
            ease: 'Back.easeOut'
        });
        
        const coin = this.add.image(customer.x, customer.y - 30, 'coin');
        this.tweens.add({
            targets: coin,
            x: this.vendor.x,
            y: this.vendor.y - 20,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 600 / this.simSpeed,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                if (coin && coin.active) coin.destroy();
                const sparkle = this.add.circle(this.vendor.x, this.vendor.y - 20, 8, 0xFFD700);
                this.tweens.add({
                    targets: sparkle,
                    alpha: 0,
                    scale: 2,
                    duration: 300,
                    onComplete: () => {
                        if (sparkle && sparkle.active) sparkle.destroy();
                    }
                });
            }
        });
        
        this.tweens.add({
            targets: coin,
            angle: 360,
            duration: 600 / this.simSpeed,
            ease: 'Linear'
        });
        
        if (window.playSound) window.playSound('sell');

        this.tweens.add({
            targets: this.vendor,
            y: this.vendor.y + 5,
            duration: 200,
            yoyo: true
        });

        const leaveTimer = this.time.delayedCall(1200 / this.simSpeed, () => {
            if (!customer || !customer.active || !customer.isActive) return;
            
            this.tweens.add({
                targets: icon,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    if (icon && icon.active) icon.destroy();
                }
            });
            
            const exitSide = customer.x < 200 ? 'left' : 'right';
            const exitX = exitSide === 'left' ? -50 : 450;
            
            const exitTextureKey = `customer${customer.customerNum}_${exitSide}`;
            if (this.textures.exists(exitTextureKey)) {
                customer.setTexture(exitTextureKey);
            }
            
            let frame = 0;
            const walkTimer = this.time.addEvent({
                delay: 200 / this.simSpeed,
                callback: () => {
                    if (!customer.isActive) {
                        walkTimer.remove();
                        return;
                    }
                    frame = (frame + 1) % 2;
                    customer.y += (frame * 2 - 1);
                },
                loop: true
            });
            
            this.activeTimers.push(walkTimer);
            
            this.tweens.add({
                targets: customer,
                x: exitX,
                y: 340,
                duration: 2500 / this.simSpeed,
                ease: 'Linear',
                onUpdate: () => {
                    if (customer.shadow && customer.shadow.active) {
                        customer.shadow.x = customer.x;
                        customer.shadow.y = customer.y + 10;
                    }
                },
                onComplete: () => {
                    if (walkTimer && walkTimer.remove) {
                        walkTimer.remove();
                    }
                    customer.isActive = false;
                    if (customer.shadow && customer.shadow.active) {
                        customer.shadow.destroy();
                    }
                    if (customer && customer.active) {
                        customer.destroy();
                    }
                }
            });
        });
        
        this.activeTimers.push(leaveTimer);
    }

    endSimulation() {
        this.isSimulating = false;
        this.statusText.setText('Day Complete!');
        this.dayCount++;
        
        this.tweens.add({
            targets: [this.vendor, this.cart],
            y: '-=25',
            duration: 250,
            yoyo: true,
            repeat: 2,
            ease: 'Bounce.easeOut'
        });
        
        for (let i = 0; i < 10; i++) {
            const confetti = this.add.circle(
                200 + (Math.random() - 0.5) * 100,
                250,
                3,
                Phaser.Display.Color.GetColor(
                    Math.random() * 255,
                    Math.random() * 255,
                    Math.random() * 255
                )
            );
            
            this.tweens.add({
                targets: confetti,
                y: 400,
                x: confetti.x + (Math.random() - 0.5) * 50,
                alpha: 0,
                duration: 1500,
                delay: i * 100,
                ease: 'Cubic.easeIn',
                onComplete: () => confetti.destroy()
            });
        }
        
        this.time.delayedCall(1500, () => {
            this.statusText.setText('Ready for Next Day');
        });
    }

    skipDay() {
        console.log('Skipping day...');
        
        // Mark all customers as inactive
        if (this.customerGroup) {
            this.customerGroup.getChildren().forEach(customer => {
                if (customer) customer.isActive = false;
            });
        }
        
        // Clean up everything
        this.cleanupSimulation();
        
        // End simulation
        this.endSimulation();
    }

    toggleSpeed() {
        this.simSpeed = this.simSpeed === 1 ? 10 : 1;
        
        if (this.currentTimer && this.isSimulating) {
            const newDelay = 2000 / this.simSpeed;
            this.currentTimer.delay = newDelay;
        }
    }
}

// ========================================
// PHASER GAME CONFIG
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
    pixelArt: true
};

// Initialize game on page load
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

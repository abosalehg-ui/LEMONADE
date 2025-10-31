// ========================================
// PHASER 3 LEMONADE STAND - ISOMETRIC EDITION
// Enhanced with Isometric View & Animations
// ========================================

class LemonadeStandScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LemonadeStandScene' });
        this.customers = [];
        this.vendor = null;
        this.stand = null;
        this.umbrella = null;
        this.isSimulating = false;
        this.simSpeed = 1;
    }

    preload() {
        this.createPixelAssets();
    }

    createPixelAssets() {
        // === ISOMETRIC BACKGROUND ===
        this.createIsometricBackground();
        
        // === DECORATIONS ===
        this.createDecorations();
        
        // === STAND ===
        this.createStandTextures();
        
        // === VENDOR ===
        this.createVendorTexture();
        
        // === CUSTOMERS WITH ANIMATIONS ===
        this.createCustomerAnimations();
        
        // === UMBRELLA ===
        this.createUmbrellaTexture();
        
        // === FEEDBACK ICONS ===
        this.createFeedbackIcons();
        
        // === EFFECTS ===
        this.createEffectTextures();
    }

    createIsometricBackground() {
        const canvas = this.textures.createCanvas('background', 800, 400);
        const ctx = canvas.getContext();
        
        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 200);
        skyGrad.addColorStop(0, '#87CEEB');
        skyGrad.addColorStop(1, '#B0E0E6');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 800, 400);
        
        // Grass area (top portion)
        ctx.fillStyle = '#7CB342';
        ctx.beginPath();
        ctx.moveTo(150, 80);
        ctx.lineTo(650, 80);
        ctx.lineTo(750, 120);
        ctx.lineTo(50, 120);
        ctx.closePath();
        ctx.fill();
        
        // Grass texture
        ctx.fillStyle = '#689F38';
        for (let i = 0; i < 80; i++) {
            const gx = 50 + Math.random() * 700;
            const gy = 80 + Math.random() * 40;
            ctx.fillRect(gx, gy, 2, 3);
        }
        
        // Sidewalk (lighter gray)
        ctx.fillStyle = '#BDBDBD';
        ctx.beginPath();
        ctx.moveTo(50, 120);
        ctx.lineTo(750, 120);
        ctx.lineTo(800, 180);
        ctx.lineTo(0, 180);
        ctx.closePath();
        ctx.fill();
        
        // Sidewalk tiles
        ctx.strokeStyle = '#9E9E9E';
        ctx.lineWidth = 1;
        for (let i = 0; i < 12; i++) {
            const sx = 50 + i * 60;
            ctx.beginPath();
            ctx.moveTo(sx, 120);
            ctx.lineTo(sx + 50, 180);
            ctx.stroke();
        }
        
        // Street (dark gray)
        ctx.fillStyle = '#424242';
        ctx.beginPath();
        ctx.moveTo(0, 180);
        ctx.lineTo(800, 180);
        ctx.lineTo(800, 400);
        ctx.lineTo(0, 400);
        ctx.closePath();
        ctx.fill();
        
        // Street lines (yellow dashed)
        ctx.strokeStyle = '#FDD835';
        ctx.lineWidth = 3;
        ctx.setLineDash([15, 10]);
        ctx.beginPath();
        ctx.moveTo(100, 290);
        ctx.lineTo(700, 290);
        ctx.stroke();
        ctx.setLineDash([]);
        
        canvas.refresh();
    }

    createDecorations() {
        // Tree
        const tree = this.textures.createCanvas('tree', 60, 80);
        const tCtx = tree.getContext();
        
        // Trunk
        tCtx.fillStyle = '#6D4C41';
        tCtx.fillRect(24, 50, 12, 30);
        
        // Leaves (isometric style)
        tCtx.fillStyle = '#388E3C';
        tCtx.beginPath();
        tCtx.ellipse(30, 35, 25, 18, 0, 0, Math.PI * 2);
        tCtx.fill();
        
        // Highlights
        tCtx.fillStyle = '#4CAF50';
        tCtx.beginPath();
        tCtx.ellipse(25, 30, 12, 8, 0, 0, Math.PI * 2);
        tCtx.fill();
        
        tree.refresh();
        
        // Sun
        const sun = this.textures.createCanvas('sun', 80, 80);
        const sCtx = sun.getContext();
        
        sCtx.fillStyle = '#FFF176';
        sCtx.beginPath();
        sCtx.arc(40, 40, 30, 0, Math.PI * 2);
        sCtx.fill();
        
        // Rays
        sCtx.strokeStyle = '#FFEB3B';
        sCtx.lineWidth = 4;
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            sCtx.beginPath();
            sCtx.moveTo(40 + Math.cos(angle) * 35, 40 + Math.sin(angle) * 35);
            sCtx.lineTo(40 + Math.cos(angle) * 50, 40 + Math.sin(angle) * 50);
            sCtx.stroke();
        }
        
        sun.refresh();
        
        // Cloud
        const cloud = this.textures.createCanvas('cloud', 100, 40);
        const cCtx = cloud.getContext();
        
        cCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        cCtx.beginPath();
        cCtx.arc(25, 20, 15, 0, Math.PI * 2);
        cCtx.arc(45, 18, 18, 0, Math.PI * 2);
        cCtx.arc(65, 20, 15, 0, Math.PI * 2);
        cCtx.arc(45, 25, 20, 0, Math.PI * 2);
        cCtx.fill();
        
        cloud.refresh();
    }

    createStandTextures() {
        const levels = ['basic', 'good', 'luxury'];
        const colors = [
            { base: '#8D6E63', top: '#A1887F', accent: '#FFEB3B' },
            { base: '#6D4C41', top: '#8D6E63', accent: '#FF9800' },
            { base: '#4E342E', top: '#6D4C41', accent: '#FFD700' }
        ];
        
        levels.forEach((level, idx) => {
            const canvas = this.textures.createCanvas(`stand_${level}`, 120, 100);
            const ctx = canvas.getContext();
            
            const col = colors[idx];
            
            // Counter front face
            ctx.fillStyle = col.base;
            ctx.fillRect(20, 60, 80, 20);
            
            // Counter top (isometric diamond)
            ctx.fillStyle = col.top;
            ctx.beginPath();
            ctx.moveTo(60, 45);
            ctx.lineTo(105, 58);
            ctx.lineTo(60, 71);
            ctx.lineTo(15, 58);
            ctx.closePath();
            ctx.fill();
            
            // Counter right side
            ctx.fillStyle = col.base;
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            ctx.moveTo(100, 60);
            ctx.lineTo(105, 58);
            ctx.lineTo(105, 78);
            ctx.lineTo(100, 80);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
            
            // Decorations
            if (idx >= 1) {
                ctx.strokeStyle = col.accent;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(15, 58);
                ctx.lineTo(60, 71);
                ctx.lineTo(105, 58);
                ctx.stroke();
            }
            
            if (idx === 2) {
                ctx.fillStyle = '#FFD700';
                [30, 60, 90].forEach(x => {
                    ctx.fillRect(x, 62, 6, 6);
                });
            }
            
            // Sign pole
            ctx.fillStyle = '#795548';
            ctx.fillRect(56, 20, 4, 25);
            
            // Sign board
            ctx.fillStyle = '#FFF';
            ctx.fillRect(35, 15, 50, 20);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(35, 15, 50, 20);
            
            // Text
            ctx.fillStyle = '#000';
            ctx.font = 'bold 8px Arial';
            ctx.fillText('LEMONADE', 40, 25);
            
            // Lemon icon
            ctx.fillStyle = '#FDD835';
            ctx.beginPath();
            ctx.arc(60, 30, 4, 0, Math.PI * 2);
            ctx.fill();
            
            canvas.refresh();
        });
    }

    createVendorTexture() {
        const vendor = this.textures.createCanvas('vendor_idle', 40, 60);
        const ctx = vendor.getContext();
        
        // Head
        ctx.fillStyle = '#FFDBAC';
        ctx.beginPath();
        ctx.arc(20, 15, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Hair
        ctx.fillStyle = '#5C4033';
        ctx.fillRect(12, 8, 16, 6);
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(15, 14, 3, 3);
        ctx.fillRect(22, 14, 3, 3);
        
        // Smile
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(20, 18, 5, 0, Math.PI);
        ctx.stroke();
        
        // Body (green apron)
        ctx.fillStyle = '#66BB6A';
        ctx.fillRect(10, 27, 20, 25);
        
        // Arms
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(6, 32, 4, 12);
        ctx.fillRect(30, 32, 4, 12);
        
        // Hands holding cup
        ctx.fillStyle = '#FFD54F';
        ctx.fillRect(16, 45, 8, 10);
        
        vendor.refresh();
    }

    createCustomerAnimations() {
        const customerStyles = [
            { shirt: '#EF5350', pants: '#42A5F5', hair: '#3E2723' },
            { shirt: '#AB47BC', pants: '#26A69A', hair: '#6D4C41' },
            { shirt: '#FFA726', pants: '#5C6BC0', hair: '#000' },
            { shirt: '#66BB6A', pants: '#EC407A', hair: '#8D6E63' },
            { shirt: '#42A5F5', pants: '#FFA726', hair: '#4E342E' },
            { shirt: '#26A69A', pants: '#EF5350', hair: '#3E2723' },
            { shirt: '#EC407A', pants: '#66BB6A', hair: '#5C4033' },
            { shirt: '#5C6BC0', pants: '#FDD835', hair: '#6D4C41' }
        ];
        
        const directions = ['down', 'up', 'left', 'right'];
        
        customerStyles.forEach((style, styleIdx) => {
            directions.forEach(dir => {
                for (let frame = 0; frame < 4; frame++) {
                    const canvas = this.textures.createCanvas(
                        `customer${styleIdx + 1}_${dir}_${frame}`,
                        32, 48
                    );
                    const ctx = canvas.getContext();
                    
                    const legOffset = frame % 2 === 0 ? 2 : -2;
                    
                    // Head
                    ctx.fillStyle = '#FFDBAC';
                    ctx.fillRect(10, 6, 12, 12);
                    
                    // Hair
                    ctx.fillStyle = style.hair;
                    ctx.fillRect(10, 6, 12, 4);
                    
                    // Eyes
                    ctx.fillStyle = '#000';
                    if (dir === 'left') {
                        ctx.fillRect(11, 12, 2, 2);
                        ctx.fillRect(15, 12, 2, 2);
                    } else if (dir === 'right') {
                        ctx.fillRect(15, 12, 2, 2);
                        ctx.fillRect(19, 12, 2, 2);
                    } else {
                        ctx.fillRect(12, 12, 2, 2);
                        ctx.fillRect(17, 12, 2, 2);
                    }
                    
                    // Body
                    ctx.fillStyle = style.shirt;
                    ctx.fillRect(8, 18, 16, 12);
                    
                    // Arms
                    ctx.fillStyle = '#FFDBAC';
                    ctx.fillRect(5, 22 - legOffset, 4, 8);
                    ctx.fillRect(23, 22 + legOffset, 4, 8);
                    
                    // Legs
                    ctx.fillStyle = style.pants;
                    ctx.fillRect(10 + legOffset, 30, 5, 12);
                    ctx.fillRect(17 - legOffset, 30, 5, 12);
                    
                    // Shoes
                    ctx.fillStyle = '#000';
                    ctx.fillRect(10 + legOffset, 42, 5, 3);
                    ctx.fillRect(17 - legOffset, 42, 5, 3);
                    
                    canvas.refresh();
                }
            });
        });
    }

    createUmbrellaTexture() {
        const levels = ['basic', 'good', 'luxury'];
        const colors = ['#EF5350', '#FF9800', '#9C27B0'];
        
        levels.forEach((level, idx) => {
            const canvas = this.textures.createCanvas(`umbrella_${level}`, 100, 80);
            const ctx = canvas.getContext();
            
            // Pole
            ctx.fillStyle = '#795548';
            ctx.fillRect(48, 40, 4, 40);
            
            // Canopy
            ctx.fillStyle = colors[idx];
            ctx.beginPath();
            ctx.ellipse(50, 30, 45, 25, 0, Math.PI, 0, true);
            ctx.fill();
            
            // Stripes
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 2;
            for (let i = -2; i <= 2; i++) {
                ctx.beginPath();
                ctx.moveTo(50, 30);
                ctx.lineTo(50 + i * 18, 55);
                ctx.stroke();
            }
            
            canvas.refresh();
        });
    }

    createFeedbackIcons() {
        // Happy
        const happy = this.textures.createCanvas('icon_happy', 32, 32);
        let ctx = happy.getContext();
        ctx.fillStyle = '#FDD835';
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(9, 10, 4, 4);
        ctx.fillRect(19, 10, 4, 4);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(16, 16, 8, 0, Math.PI);
        ctx.stroke();
        happy.refresh();
        
        // Angry
        const angry = this.textures.createCanvas('icon_angry', 32, 32);
        ctx = angry.getContext();
        ctx.fillStyle = '#EF5350';
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(9, 10, 4, 4);
        ctx.fillRect(19, 10, 4, 4);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(16, 20, 8, Math.PI, 0);
        ctx.stroke();
        angry.refresh();
        
        // Expensive
        const expensive = this.textures.createCanvas('icon_expensive', 32, 32);
        ctx = expensive.getContext();
        ctx.fillStyle = '#FF9800';
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('$', 8, 24);
        expensive.refresh();
        
        // Waiting
        const waiting = this.textures.createCanvas('icon_waiting', 32, 32);
        ctx = waiting.getContext();
        ctx.fillStyle = '#78909C';
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFF';
        ctx.fillRect(15, 8, 2, 8);
        ctx.fillRect(15, 15, 6, 2);
        waiting.refresh();
    }

    createEffectTextures() {
        // Money coin
        const coin = this.textures.createCanvas('coin', 20, 20);
        const cCtx = coin.getContext();
        cCtx.fillStyle = '#FFD700';
        cCtx.beginPath();
        cCtx.arc(10, 10, 9, 0, Math.PI * 2);
        cCtx.fill();
        cCtx.strokeStyle = '#FFA000';
        cCtx.lineWidth = 2;
        cCtx.stroke();
        cCtx.fillStyle = '#FFA000';
        cCtx.font = 'bold 12px Arial';
        cCtx.fillText('$', 5, 15);
        coin.refresh();
        
        // Sparkle
        const sparkle = this.textures.createCanvas('sparkle', 16, 16);
        const sCtx = sparkle.getContext();
        sCtx.fillStyle = '#FFF';
        sCtx.fillRect(7, 0, 2, 16);
        sCtx.fillRect(0, 7, 16, 2);
        sparkle.refresh();
    }

    create() {
        // Background
        this.add.image(400, 200, 'background');
        
        // Sun (animated rotation)
        this.sun = this.add.image(700, 50, 'sun').setScale(0.7);
        this.tweens.add({
            targets: this.sun,
            angle: 360,
            duration: 60000,
            repeat: -1,
            ease: 'Linear'
        });
        
        // Clouds (moving)
        this.clouds = [];
        for (let i = 0; i < 3; i++) {
            const cloud = this.add.image(
                100 + i * 250,
                40 + i * 10,
                'cloud'
            ).setAlpha(0.7);
            this.clouds.push(cloud);
            
            this.tweens.add({
                targets: cloud,
                x: '+=100',
                duration: 20000 + i * 5000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        
        // Trees on grass
        this.add.image(100, 100, 'tree').setScale(0.7);
        this.add.image(700, 105, 'tree').setScale(0.8);
        this.add.image(180, 110, 'tree').setScale(0.6);
        
        // Stand shadow
        this.standShadow = this.add.ellipse(400, 260, 120, 30, 0x000000, 0.3);
        
        // Stand
        this.stand = this.add.image(400, 220, 'stand_basic');
        
        // Umbrella (hidden by default)
        this.umbrella = this.add.image(400, 140, 'umbrella_basic').setVisible(false);
        
        // Vendor
        this.vendor = this.add.image(400, 195, 'vendor_idle');
        
        // Vendor idle animation
        this.tweens.add({
            targets: this.vendor,
            y: 192,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Customer group
        this.customerGroup = this.add.group();
        
        // Status text
        this.statusText = this.add.text(400, 20, 'Ready to Start!', {
            fontSize: '18px',
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: { x: 12, y: 6 },
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    updateStandVisuals(upgrades) {
        const levels = ['basic', 'good', 'luxury'];
        this.stand.setTexture(`stand_${levels[upgrades.table]}`);
        
        if (upgrades.umbrella) {
            this.umbrella.setTexture(`umbrella_${levels[upgrades.table]}`);
            this.umbrella.setVisible(true);
        } else {
            this.umbrella.setVisible(false);
        }
        
        // Upgrade animation
        this.tweens.add({
            targets: [this.stand, this.umbrella],
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 200,
            yoyo: true,
            ease: 'Back.easeOut'
        });
        
        // Sparkle effect
        for (let i = 0; i < 5; i++) {
            const sparkle = this.add.image(
                380 + Math.random() * 40,
                200 + Math.random() * 40,
                'sparkle'
            ).setScale(0.5);
            
            this.tweens.add({
                targets: sparkle,
                alpha: 0,
                scale: 1.5,
                duration: 800,
                onComplete: () => sparkle.destroy()
            });
        }
    }

    startSimulation(maxCups, satisfactionRate) {
        if (this.isSimulating) return;
        this.isSimulating = true;
        
        this.customerGroup.clear(true, true);
        this.statusText.setText('Day in Progress...');

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
                    document.getElementById('simTimer').textContent = `TIME: ${progress}%`;
                }
            },
            loop: true
        });

        this.currentTimer = spawnTimer;
    }

    spawnCustomer(satisfactionRate) {
        const customerType = Phaser.Math.Between(1, 8);
        const startX = -50;
        const startY = 340;
        
        // Create customer
        const customer = this.add.image(startX, startY, `customer${customerType}_right_0`);
        customer.customerType = customerType;
        customer.direction = 'right';
        customer.frame = 0;
        
        // Shadow
        const shadow = this.add.ellipse(startX, startY + 15, 25, 10, 0x000000, 0.4);
        customer.shadow = shadow;
        
        this.customerGroup.add(customer);
        
        // Walking animation
        const walkAnim = this.time.addEvent({
            delay: 150 / this.simSpeed,
            callback: () => {
                customer.frame = (customer.frame + 1) % 4;
                customer.setTexture(`customer${customer.customerType}_${customer.direction}_${customer.frame}`);
            },
            loop: true
        });
        customer.walkAnim = walkAnim;
        
        // Path: Street -> Sidewalk -> Stand
        const path = [
            { x: 200, y: 320 },  // Move on street
            { x: 300, y: 240 },  // Enter sidewalk
            { x: 350, y: 220 },  // Approach stand
        ];
        
        let pathIndex = 0;
        
        const moveToNext = () => {
            if (pathIndex >= path.length) {
                walkAnim.remove();
                this.serveCustomer(customer, satisfactionRate);
                return;
            }
            
            const target = path[pathIndex];
            pathIndex++;
            
            // Update direction
            if (target.x > customer.x) {
                customer.direction = 'right';
            } else if (target.x < customer.x) {
                customer.direction = 'left';
            }
            if (target.y < customer.y) {
                customer.direction = 'up';
            }
            
            this.tweens.add({
                targets: customer,
                x: target.x,
                y: target.y,
                duration: 1500 / this.simSpeed,
                ease: 'Linear',
                onUpdate: () => {
                    shadow.x = customer.x;
                    shadow.y = customer.y + 15;
                },
                onComplete: moveToNext
            });
        };
        
        moveToNext();
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

        // Show feedback icon
        const icon = this.add.image(customer.x, customer.y - 60, feedbackIcon).setScale(0);
        
        this.tweens.add({
            targets: icon,
            scale: 1.2,
            duration: 300,
            ease: 'Back.easeOut'
        });
        
        // Money flying animation
        for (let i = 0; i < 3; i++) {
            this.time.delayedCall(i * 100, () => {
                const coin = this.add.image(customer.x, customer.y - 30, 'coin');
                
                this.tweens.add({
                    targets: coin,
                    x: 400,
                    y: 200,
                    scale: 0.5,
                    alpha: 0,
                    duration: 800,
                    ease: 'Cubic.easeOut',
                    onComplete: () => coin.destroy()
                });
            });
        }
        
        if (window.playSound) window.playSound('sell');

        // Customer leaves
        this.time.delayedCall(1200 / this.simSpeed, () => {
            this.tweens.add({
                targets: icon,
                alpha: 0,
                y: icon.y - 20,
                duration: 400,
                onComplete: () => icon.destroy()
            });
            
            customer.direction = 'right';
            
            // Restart walk animation
            const walkAnim = this.time.addEvent({
                delay: 150 / this.simSpeed,
                callback: () => {
                    customer.frame = (customer.frame + 1) % 4;
                    customer.setTexture(`customer${customer.customerType}_${customer.direction}_${customer.frame}`);
                },
                loop: true
            });
            
            this.tweens.add({
                targets: customer,
                x: 850,
                y: 350,
                duration: 2000 / this.simSpeed,
                ease: 'Linear',
                onUpdate: () => {
                    if (customer.shadow) {
                        customer.shadow.x = customer.x;
                        customer.shadow.y = customer.y + 15;
                    }
                },
                onComplete: () => {
                    walkAnim.remove();
                    if (customer.shadow) customer.shadow.destroy();
                    customer.destroy();
                }
            });
        });
    }

    endSimulation() {
        this.isSimulating = false;
        this.statusText.setText('Day Complete!');
        
        // Celebration animation
        this.tweens.add({
            targets: [this.vendor, this.stand],
            y: '-=15',
            duration: 150,
            yoyo: true,
            repeat: 3,
            ease: 'Quad.easeInOut'
        });
        
        // Confetti effect
        for (let i = 0; i < 15; i++) {
            this.time.delayedCall(i * 80, () => {
                const confetti = this.add.rectangle(
                    380 + Math.random() * 40,
                    180,
                    8,
                    8,
                    Phaser.Display.Color.RandomRGB().color
                );
                
                this.tweens.add({
                    targets: confetti,
                    y: 350,
                    x: confetti.x + (Math.random() - 0.5) * 100,
                    angle: 360,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Cubic.easeIn',
                    onComplete: () => confetti.destroy()
                });
            });
        }
        
        this.time.delayedCall(2000, () => {
            this.statusText.setText('Ready for Next Day');
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
// PHASER GAME CONFIG
// ========================================

const phaserConfig = {
    type: Phaser.AUTO,
    width: 800,
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
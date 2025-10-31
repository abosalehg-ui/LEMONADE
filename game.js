// ========================================
// PHASER 3 LEMONADE STAND SIMULATION
// Enhanced with Sounds, Shadows & Animations
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
        // === GRASS BACKGROUND ===
        const grassTexture = this.textures.createCanvas('grass', 800, 400);
        const grassCtx = grassTexture.getContext();
        
        const gradient = grassCtx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#b0e57c');
        gradient.addColorStop(1, '#8bc34a');
        grassCtx.fillStyle = gradient;
        grassCtx.fillRect(0, 0, 800, 400);
        
        // Grass details
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

        // === TABLES ===
        this.createTableTextures();

        // === VENDOR ===
        const vendorCanvas = this.textures.createCanvas('vendor', 32, 48);
        const vCtx = vendorCanvas.getContext();
        
        // Head
        vCtx.fillStyle = '#ffdbac';
        vCtx.fillRect(10, 4, 12, 12);
        
        // Hair
        vCtx.fillStyle = '#5c4033';
        vCtx.fillRect(10, 4, 12, 4);
        
        // Eyes
        vCtx.fillStyle = '#000';
        vCtx.fillRect(13, 10, 2, 2);
        vCtx.fillRect(18, 10, 2, 2);
        
        // Smile
        vCtx.fillRect(14, 14, 4, 1);
        
        // Green shirt
        vCtx.fillStyle = '#7ab84a';
        vCtx.fillRect(8, 16, 16, 14);
        
        // Arms
        vCtx.fillStyle = '#ffdbac';
        vCtx.fillRect(6, 20, 4, 8);
        vCtx.fillRect(22, 20, 4, 8);
        
        // Blue pants
        vCtx.fillStyle = '#4a90e2';
        vCtx.fillRect(10, 30, 12, 14);
        
        // Shoes
        vCtx.fillStyle = '#5c4033';
        vCtx.fillRect(10, 44, 5, 4);
        vCtx.fillRect(17, 44, 5, 4);
        
        vendorCanvas.refresh();

        // === CUSTOMERS ===
        this.createCustomerTextures();

        // === UMBRELLA ===
        const umbrellaCanvas = this.textures.createCanvas('umbrella', 80, 60);
        const uCtx = umbrellaCanvas.getContext();
        
        // Pole
        uCtx.fillStyle = '#8B4513';
        uCtx.fillRect(38, 20, 4, 40);
        
        // Canopy
        uCtx.fillStyle = '#FF6347';
        uCtx.beginPath();
        uCtx.arc(40, 20, 35, Math.PI, 0, false);
        uCtx.fill();
        
        // Stripes
        uCtx.strokeStyle = '#DC143C';
        uCtx.lineWidth = 2;
        for (let i = -3; i <= 3; i++) {
            uCtx.beginPath();
            uCtx.moveTo(40, 20);
            uCtx.lineTo(40 + i * 10, 20 + 30);
            uCtx.stroke();
        }
        
        umbrellaCanvas.refresh();

        // === LEMONADE CUP ===
        const cupCanvas = this.textures.createCanvas('lemonade_cup', 16, 20);
        const cCtx = cupCanvas.getContext();
        
        cCtx.fillStyle = '#FFD700';
        cCtx.fillRect(4, 6, 8, 12);
        cCtx.fillRect(3, 18, 10, 2);
        
        // Lemon slice
        cCtx.fillStyle = '#FFA500';
        cCtx.beginPath();
        cCtx.arc(8, 4, 3, 0, Math.PI * 2);
        cCtx.fill();
        
        // Straw
        cCtx.strokeStyle = '#FF0000';
        cCtx.lineWidth = 2;
        cCtx.beginPath();
        cCtx.moveTo(10, 6);
        cCtx.lineTo(12, 0);
        cCtx.stroke();
        
        cupCanvas.refresh();

        // === FEEDBACK ICONS ===
        this.createFeedbackIcons();
    }

    createTableTextures() {
        // Basic Table
        const tableBasic = this.textures.createCanvas('table_basic', 80, 40);
        let tCtx = tableBasic.getContext();
        tCtx.fillStyle = '#8B4513';
        tCtx.fillRect(10, 20, 60, 5);
        tCtx.fillRect(15, 25, 5, 15);
        tCtx.fillRect(60, 25, 5, 15);
        tableBasic.refresh();

        // Good Table
        const tableGood = this.textures.createCanvas('table_good', 80, 40);
        tCtx = tableGood.getContext();
        tCtx.fillStyle = '#A0522D';
        tCtx.fillRect(5, 18, 70, 7);
        tCtx.fillRect(10, 25, 6, 15);
        tCtx.fillRect(64, 25, 6, 15);
        tCtx.fillStyle = '#DC143C';
        tCtx.fillRect(8, 15, 64, 3);
        tableGood.refresh();

        // Luxury Table
        const tableLuxury = this.textures.createCanvas('table_luxury', 80, 40);
        tCtx = tableLuxury.getContext();
        tCtx.fillStyle = '#654321';
        tCtx.fillRect(0, 16, 80, 9);
        tCtx.fillRect(8, 25, 8, 15);
        tCtx.fillRect(64, 25, 8, 15);
        tCtx.fillStyle = '#FFD700';
        tCtx.fillRect(5, 13, 70, 3);
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
            
            ctx.fillStyle = '#ffdbac';
            ctx.fillRect(9, 3, 10, 10);
            
            ctx.fillStyle = '#000';
            ctx.fillRect(9, 3, 10, 3);
            ctx.fillRect(11, 8, 2, 2);
            ctx.fillRect(15, 8, 2, 2);
            
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
    }

    createFeedbackIcons() {
        // Happy Icon
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
        ctx.stroke();
        happyCanvas.refresh();

        // Angry Icon
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
        ctx.stroke();
        angryCanvas.refresh();

        // Expensive Icon
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

        // Waiting Icon
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
        // Background
        this.add.image(400, 200, 'grass');

        // Stand shadow
        this.standShadow = this.add.ellipse(400, 310, 100, 20, 0x000000, 0.3);

        // Table
        this.stand = this.add.image(400, 280, 'table_basic').setOrigin(0.5, 1);

        // Umbrella (hidden by default)
        this.umbrella = this.add.image(400, 180, 'umbrella').setVisible(false);

        // Vendor shadow
        this.vendorShadow = this.add.ellipse(420, 280, 30, 10, 0x000000, 0.4);

        // Vendor
        this.vendor = this.add.image(420, 270, 'vendor').setOrigin(0.5, 1);

        // Lemonade cup on table
        this.cup = this.add.image(380, 250, 'lemonade_cup').setScale(1.5);

        // ✅ Add bouncing animation to cup
        this.tweens.add({
            targets: this.cup,
            y: 245,
            duration: 1000,
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
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
    }

    updateStandVisuals(upgrades) {
        const tableLevels = ['table_basic', 'table_good', 'table_luxury'];
        this.stand.setTexture(tableLevels[upgrades.table]);
        this.umbrella.setVisible(upgrades.umbrella);
        
        // ✅ Visual feedback animation
        this.tweens.add({
            targets: this.stand,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 200,
            yoyo: true
        });
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
                
                // Update timer display
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
        const customerKey = `customer${Phaser.Math.Between(1, 4)}`;
        const customer = this.add.image(-50, 320, customerKey).setOrigin(0.5, 1);
        
        // ✅ Add shadow to customer
        const shadow = this.add.ellipse(-50, 330, 25, 8, 0x000000, 0.4);
        customer.shadow = shadow;
        
        this.customerGroup.add(customer);

        // Walk to stand
        this.tweens.add({
            targets: customer,
            x: 300,
            duration: 2000 / this.simSpeed,
            ease: 'Linear',
            onUpdate: () => {
                shadow.x = customer.x;
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

        // Show feedback icon
        const icon = this.add.image(customer.x, customer.y - 50, feedbackIcon).setScale(1.5);
        
        // ✅ Icon pop animation
        icon.setScale(0);
        this.tweens.add({
            targets: icon,
            scale: 1.5,
            duration: 200,
            ease: 'Back.easeOut'
        });
        
        if (window.playSound) window.playSound('sell');

        // Customer leaves
        this.time.delayedCall(1000 / this.simSpeed, () => {
            this.tweens.add({
                targets: icon,
                alpha: 0,
                duration: 300,
                onComplete: () => icon.destroy()
            });
            
            this.tweens.add({
                targets: customer,
                x: 900,
                duration: 2000 / this.simSpeed,
                ease: 'Linear',
                onUpdate: () => {
                    if (customer.shadow) customer.shadow.x = customer.x;
                },
                onComplete: () => {
                    if (customer.shadow) customer.shadow.destroy();
                    customer.destroy();
                }
            });
        });
    }

    endSimulation() {
        this.isSimulating = false;
        this.statusText.setText('Day Complete!');
        
        // ✅ Celebration animation
        this.tweens.add({
            targets: [this.vendor, this.cup],
            y: '-=20',
            duration: 200,
            yoyo: true,
            repeat: 2
        });
        
        this.time.delayedCall(1500, () => {
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
        
        // Adjust current timer if simulation is running
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
    width: 600,
    height: 400,
    parent: 'phaser-container',
    backgroundColor: '#8bc34a',
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

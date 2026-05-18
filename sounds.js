// ========================================
// SOUND SYSTEM
// ========================================

const SOUND_FILES = {
    bgMusic:    'background-music.mp3',
    click:      'button-click.mp3',
    sell:       'cash-register.mp3',
    upgrade:    'upgrade-sound.mp3',
    achievement:'achievement.mp3',
    happy:      'happy-customer.mp3',
    angry:      'angry-customer.mp3'
};

const SoundManager = {
    enabled: true,
    audio: {},

    init() {
        for (const key in SOUND_FILES) {
            const audio = new Audio(SOUND_FILES[key]);
            audio.onerror = () => console.log(`Sound file not found: ${SOUND_FILES[key]}`);
            this.audio[key] = audio;
        }
        if (this.audio.bgMusic) {
            this.audio.bgMusic.loop = true;
            this.audio.bgMusic.volume = 0.3;
        }
    },

    play(name) {
        if (!this.enabled || !this.audio[name]) return;
        try {
            this.audio[name].currentTime = 0;
            this.audio[name].play().catch(e => console.log('Audio play failed:', e));
        } catch (e) {
            console.log('Error playing sound:', e);
        }
    },

    toggle() {
        this.enabled = !this.enabled;
        if (this.enabled) {
            this.play('bgMusic');
        } else if (this.audio.bgMusic) {
            this.audio.bgMusic.pause();
        }
        return this.enabled;
    }
};

window.SoundManager = SoundManager;
// Back-compat: game.js still calls window.playSound directly.
window.playSound = (name) => SoundManager.play(name);

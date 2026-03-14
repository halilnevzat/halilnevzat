// ==UserScript==
// @name         WhatsApp Web Kesin Ses Susturucu
// @namespace    http://halilnevzat.com/
// @version      1.1
// @description  Bildirim sesini 5 dakika boyunca bloke eder. Sekmeye girince sıfırlanır.
// @author       Gemini
// @match        https://web.whatsapp.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    let lastPlayedTime = 0;
    const COOLDOWN_MS = 5 * 60 * 1000; // 5 Dakika
    let isTabActive = true;

    // Sekme durumunu takip et
    window.addEventListener('focus', () => {
        isTabActive = true;
        lastPlayedTime = 0; // Sekmeye girince süreyi sıfırla
        console.log("WA Susturucu: Sekme aktif, süre sıfırlandı.");
    });

    window.addEventListener('blur', () => {
        isTabActive = false;
    });

    // Ses çalma girişimlerini yakala
    const originalPlay = HTMLAudioElement.prototype.play;

    HTMLAudioElement.prototype.play = function() {
        const now = Date.now();

        // Eğer sekme aktif değilse ve son çalma üzerinden 5 dk geçmediyse sustur
        if (!isTabActive) {
            if (now - lastPlayedTime < COOLDOWN_MS && lastPlayedTime !== 0) {
                // Sesi tamamen durdur ve çalma talebini reddet
                this.pause();
                this.currentTime = 0;
                return Promise.resolve();
            }

            // Eğer ilk kez çalıyorsa zamanı kaydet
            if (lastPlayedTime === 0 || now - lastPlayedTime >= COOLDOWN_MS) {
                lastPlayedTime = now;
            }
        }

        return originalPlay.apply(this, arguments);
    };

    // Ekstra önlem: Yeni Audio nesnesi oluşturulmasını da izle
    const OriginalAudio = window.Audio;
    window.Audio = function() {
        const audio = new OriginalAudio(...arguments);
        return audio;
    };

})();

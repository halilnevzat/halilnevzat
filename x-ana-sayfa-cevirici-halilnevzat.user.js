// ==UserScript==
// @name         X Ana Sayfa Gerçek Çeviri - Halil Nevzat Demirel Edition
// @namespace    https://halilnevzat.com/
// @version      12.0
// @description  X'in güvenlik katmanlarına takılmadan ana sayfada yerinde çeviri yapar. Geliştirici: Halil Nevzat Demirel (https://halilnevzat.com)
// @author       Halil Nevzat Demirel
// @homepage     https://halilnevzat.com/
// @supportURL   https://halilnevzat.com/iletisim
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_xmlhttpRequest
// @connect      translate.googleapis.com
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Bu script Halil Nevzat Demirel tarafından özelleştirilmiştir.
    // Web: halilnevzat.com

    function addTranslateButton() {
        const tweets = document.querySelectorAll('article[data-testid="tweet"]');

        tweets.forEach(tweet => {
            // Eğer zaten buton veya çeviri sonucu varsa ekleme yapma
            if (tweet.querySelector('.custom-tr-wrapper')) return;

            const tweetTextNode = tweet.querySelector('div[data-testid="tweetText"]');
            if (!tweetTextNode) return;

            // Buton ve sonuç için bir kapsayıcı oluştur
            const wrapper = document.createElement('div');
            wrapper.className = 'custom-tr-wrapper';
            
            const btn = document.createElement('div');
            btn.innerHTML = 'Gönderiyi çevir';
            btn.style.cssText = 'color: rgb(29, 155, 240); cursor: pointer; font-size: 15px; margin-top: 8px; width: fit-content; font-family: inherit;';
            
            wrapper.appendChild(btn);
            tweetTextNode.after(wrapper);

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const originalText = tweetTextNode.innerText;
                btn.innerText = 'Çevriliyor...';

                // Google Translate'in API'sini kullanarak yerinde çeviri
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURIComponent(originalText)}`,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const translatedText = data[0].map(x => x[0]).join('');

                            // Çeviri sonucunu görseldeki gibi ekle
                            const resultDiv = document.createElement('div');
                            resultDiv.style.cssText = 'margin-top: 10px; padding-top: 8px; border-top: 1px solid #333;';
                            resultDiv.innerHTML = `
                                <div style="color: #71767b; font-size: 13px; margin-bottom: 2px;">Google tarafından çevrildi</div>
                                <div style="font-size: 15px; line-height: 20px; color: white;">${translatedText}</div>
                            `;
                            
                            btn.style.display = 'none'; // "Gönderiyi çevir" yazısını gizle
                            wrapper.appendChild(resultDiv);
                        } catch (err) {
                            btn.innerText = 'Çeviri hatası.';
                            console.error(err);
                        }
                    },
                    onerror: () => { btn.innerText = 'Bağlantı hatası.'; }
                });
            };
        });
    }

    // Dinamik yüklemeler için MutationObserver
    const observer = new MutationObserver(() => {
        addTranslateButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // İlk yüklemede çalıştır
    addTranslateButton();
})();

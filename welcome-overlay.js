// Overlay: single line of real code, seamless morph to welcome
window.addEventListener('DOMContentLoaded', function () {
    // Inject overlay-specific CSS for perfect mobile fit
    const style = document.createElement('style');
    style.textContent = `
#welcome-overlay {
  position: fixed; z-index: 9999; inset: 0;
  background: rgba(10,10,10,0.88);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  transition: opacity 0.7s;
}
#welcome-overlay.hide { opacity: 0; pointer-events: none; }
.welcome-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0;
  overflow: visible;
  box-sizing: border-box;
}
.code-welcome {
  display: inline-block;
  font-family: 'Fira Mono', 'Consolas', monospace;
  font-size: clamp(1.1rem, 5vw, 3.8rem);
  font-weight: bold;
  color: #fff !important;
  text-shadow: none !important;
  box-shadow: none !important;
  border: none !important;
  outline: none !important;
  width: auto;
  margin: 0;
  padding: 0 2vw;
  letter-spacing: 0;
  line-height: 1.1;
  text-align: center;
  opacity: 1;
  max-width: 100vw;
  white-space: nowrap;
  overflow: visible;
  box-sizing: content-box;
  transition: color 0.7s cubic-bezier(.4,0,.2,1), text-shadow 0.7s, box-shadow 0.7s;
  position: relative;
}

.code-welcome {
  font-size: 3.5rem !important;
  font-weight: 900 !important;
  letter-spacing: 0.05em !important;
  padding-left: 2vw !important;
  padding-right: 2vw !important;
  max-width: 95vw !important;
  white-space: normal !important;
}

.code-welcome.gold, .code-welcome.gold * {
  color: var(--primary) !important;
}

.code-welcome.shine, .code-welcome.shine * {
  /* SOLO el brillo, NO color */
  text-shadow:
    0 0 4px rgba(212,175,55,0.3),
    0 0 8px rgba(255,215,0,0.3),
    0 0 16px rgba(255,224,102,0.3),
    0 0 32px rgba(255,224,102,0.3),
    0 0 48px rgba(255,224,102,0.3) !important;
  border: none !important;
  background: none !important;
  box-shadow: none !important;
  filter: none !important;
  -webkit-text-stroke: 0 !important;
  transition: none !important;
}





@media (max-width: 600px) {
  .code-welcome {
    font-family: 'Consolas', monospace !important;
    font-size: clamp(1.1rem, 7vw, 2.1rem) !important;
    padding-left: 2vw !important;
    padding-right: 2vw !important;
    letter-spacing: 0.01em !important;
    white-space: normal !important;
    max-width: 95vw !important;
    width: 100vw;
  }
}


@media (max-width: 600px) {
  .code-welcome {
    font-family: 'Consolas', monospace !important;
    font-size: clamp(0.85rem, 6vw, 1.6rem) !important;
    width: 100vw;
    padding-left: 1vw;
    padding-right: 1vw;
    overflow: hidden;
    max-width: 100vw;
  }
}

`;
    document.head.appendChild(style);
    const overlay = document.createElement('div');
    overlay.id = 'welcome-overlay';
    overlay.innerHTML = `
        <div class="welcome-content">
            <div class="code-welcome"></div>
        </div>
    `;
    overlay.setAttribute('aria-hidden', 'true');
    // Fallback para navegadores sin blur
    function blurSupported() {
        const el = document.createElement('div');
        el.style.backdropFilter = 'blur(2px)';
        return el.style.backdropFilter !== '';
    }
    if (!blurSupported()) {
        overlay.classList.add('no-blur');
    }
    // Permitir saltar animación con click/tap
    overlay.addEventListener('click', skipOverlay);
    overlay.addEventListener('touchstart', skipOverlay);
    let overlayRemoved = false;
    function skipOverlay() {
        if (overlayRemoved) return;
        overlayRemoved = true;
        overlay.classList.add('hide');
        setTimeout(() => overlay.remove(), 700);
    }

    document.body.appendChild(overlay);

    const codeWelcome = overlay.querySelector('.code-welcome');
    const finalText = 'Bienvenido a Netifycr';
    const codeLine = '<meta charset="utf-8"> ';

    // Step 1: Show code line for 1.5s
    codeWelcome.textContent = codeLine;
    codeWelcome.style.opacity = 1;
    setTimeout(() => {
        let morphTime = 1500; // ms
        let morphStart = null;
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/=" ';
        // Get the starting string (codeLine)
        let startArr = codeLine.split('');
        let targetArr = finalText.split('');
        let charIndices = [];
        // For each char, find its index in chars
        for (let i = 0; i < finalText.length; i++) {
            let startChar = startArr[i] || ' ';
            let idx = chars.indexOf(startChar);
            if (idx === -1) idx = 0;
            charIndices.push(idx);
        }
        function morphEffect(ts) {
            if (!morphStart) morphStart = ts;
            let progress = (ts - morphStart) / morphTime;
            if (progress > 1) progress = 1;
            let display = '';
            for (let i = 0; i < finalText.length; i++) {
                let targetChar = targetArr[i];
                let startIdx = charIndices[i];
                let targetIdx = chars.indexOf(targetChar);
                if (targetIdx === -1) targetIdx = 0;
                // Calculate how far this char should be
                let steps = targetIdx - startIdx;
                if (steps < 0) steps += chars.length;
                let curStep = Math.floor(steps * progress);
                let curIdx = (startIdx + curStep) % chars.length;
                display += chars[curIdx];
            }
            codeWelcome.textContent = display;
            codeWelcome.classList.add('gold');
            if (progress < 1) {
                requestAnimationFrame(morphEffect);
            } else {
                // El texto final aparece dorado, y luego el brillo
                setTimeout(() => {
                    codeWelcome.classList.add('shine');
                    setTimeout(() => {
                        overlay.classList.add('hide');
                        setTimeout(() => overlay.remove(), 700);
                    }, 2000);
                }, 30); // Pequeño delay para mostrar el texto dorado antes del brillo
            }
        }
        requestAnimationFrame(morphEffect);
    }, 1500);
});

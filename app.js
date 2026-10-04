/**
 * Interactive Mechanics & Instant Preloading Engine for Illegal-Soccer.com
 */

document.addEventListener('DOMContentLoaded', () => {
  // Curve Shot Simulator Engine
  const curveDirSelect = document.getElementById('curveDirSelect');
  const curvePowerInput = document.getElementById('curvePowerInput');
  const shotTypeSelect = document.getElementById('shotTypeSelect');
  const simBtn = document.getElementById('simBtn');
  const simResult = document.getElementById('simResult');

  function simulateCurveShot() {
    if (!curveDirSelect || !curvePowerInput || !shotTypeSelect || !simResult) return;

    const dir = curveDirSelect.value;
    const power = parseInt(curvePowerInput.value) || 50;
    const shotType = shotTypeSelect.value;

    let advice = "";
    let bendDescription = "";

    if (dir === "left") {
      bendDescription = "Bends aggressively around the right-side defender toward the top-left corner.";
      advice = "PC Input: Hold Middle Mouse Button + Drag cursor smoothly LEFT during kick.";
    } else if (dir === "right") {
      bendDescription = "Bends sharply inward toward the far-right post, fooling the goalkeeper.";
      advice = "PC Input: Hold Middle Mouse Button + Drag cursor smoothly RIGHT during kick.";
    } else {
      bendDescription = "Dead-straight bullet trajectory with zero deviation.";
      advice = "PC Input: Standard Left Click without dragging Middle Mouse.";
    }

    if (shotType === "flick") {
      advice = `🔥 Pro Combo: Press [Q] to pop ball into the air -> Hold [L-Click + M-Button] -> ${advice}`;
    }

    simResult.innerHTML = `
      <div style="font-size: 1.05rem; margin-bottom: 0.5rem; color: #22c55e;">
        ⚡ <strong>Shot Simulation (${power}% Power):</strong> ${bendDescription}
      </div>
      <div style="font-size: 0.88rem; color: #f3f4f6; background: rgba(0,0,0,0.4); padding: 0.6rem 0.8rem; border-radius: 6px;">
        ${advice}
      </div>
    `;
  }

  if (simBtn) {
    simBtn.addEventListener('click', simulateCurveShot);
  }

  if (curveDirSelect && curvePowerInput && shotTypeSelect) {
    curveDirSelect.addEventListener('change', simulateCurveShot);
    curvePowerInput.addEventListener('input', simulateCurveShot);
    shotTypeSelect.addEventListener('change', simulateCurveShot);
  }

  // Instant Hover Preloading for Internal Navigation
  const preloadedUrls = new Set();
  function preloadUrl(url) {
    if (!url || preloadedUrls.has(url)) return;
    try {
      const parsed = new URL(url, window.location.href);
      if (parsed.origin !== window.location.origin) return;
      if (parsed.pathname === window.location.pathname) return;

      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = parsed.href;
      document.head.appendChild(link);
      preloadedUrls.add(url);
    } catch (e) {
      // Ignore invalid URL
    }
  }

  document.querySelectorAll('a[href]').forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('javascript:')) {
      anchor.addEventListener('mouseenter', () => preloadUrl(href), { passive: true });
      anchor.addEventListener('touchstart', () => preloadUrl(href), { passive: true });
    }
  });
});

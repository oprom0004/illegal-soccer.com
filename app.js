/**
 * Interactive Mechanics, Shootout Mini-Game & Instant Preloading Engine for Illegal-Soccer.com
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Curve Shot Simulator Form Engine
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

  // 2. Interactive HTML5 Canvas Shootout Minigame
  const canvas = document.getElementById('shootoutCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let score = 0;
    let shots = 0;
    const scoreDisplay = document.getElementById('gameScore');
    const resetBtn = document.getElementById('resetGameBtn');

    let ball = { x: 300, y: 300, vx: 0, vy: 0, curve: 0, radius: 10, inFlight: false, scored: null };
    let goalie = { x: 300, y: 100, width: 60, height: 25, speed: 2.2, dir: 1 };
    const goal = { x: 120, y: 50, width: 360, height: 70 };

    function resetBall() {
      ball.x = 300;
      ball.y = 300;
      ball.vx = 0;
      ball.vy = 0;
      ball.curve = 0;
      ball.inFlight = false;
      ball.scored = null;
    }

    function drawField() {
      // Grass pitch
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Goal box lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.strokeRect(goal.x, goal.y, goal.width, goal.height);

      // Net pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let x = goal.x; x <= goal.x + goal.width; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, goal.y);
        ctx.lineTo(x, goal.y + goal.height);
        ctx.stroke();
      }
      for (let y = goal.y; y <= goal.y + goal.height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(goal.x, y);
        ctx.lineTo(goal.x + goal.width, y);
        ctx.stroke();
      }

      // Penalty Spot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(300, 290, 4, 0, Math.PI * 2);
      ctx.fill();

      // Goalkeeper
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 8;
      ctx.fillRect(goalie.x - goalie.width / 2, goalie.y - goalie.height / 2, goalie.width, goalie.height);
      ctx.shadowBlur = 0;

      // Goalie label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GOALIE', goalie.x, goalie.y + 4);

      // Ball
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Score status message on canvas
      if (ball.scored === true) {
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('⚽ GOAAAL! PERFECT CURVE!', 300, 180);
      } else if (ball.scored === false) {
        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('❌ SAVED / MISSED!', 300, 180);
      }
    }

    function update() {
      // Goalie patrol
      goalie.x += goalie.speed * goalie.dir;
      if (goalie.x > goal.x + goal.width - goalie.width / 2 || goalie.x < goal.x + goalie.width / 2) {
        goalie.dir *= -1;
      }

      // Ball physics
      if (ball.inFlight) {
        ball.x += ball.vx + ball.curve;
        ball.y += ball.vy;

        // Check goal collision
        if (ball.y <= goal.y + goal.height) {
          ball.inFlight = false;
          shots++;

          // Check if goalie saved
          const goalieLeft = goalie.x - goalie.width / 2;
          const goalieRight = goalie.x + goalie.width / 2;
          const goalieTop = goalie.y - goalie.height / 2;
          const goalieBottom = goalie.y + goalie.height / 2;

          if (ball.x >= goalieLeft && ball.x <= goalieRight && ball.y >= goalieTop && ball.y <= goalieBottom) {
            ball.scored = false;
          } else if (ball.x >= goal.x && ball.x <= goal.x + goal.width && ball.y >= goal.y) {
            ball.scored = true;
            score++;
          } else {
            ball.scored = false;
          }

          if (scoreDisplay) {
            scoreDisplay.textContent = `Goals: ${score} | Shots: ${shots}`;
          }

          setTimeout(resetBall, 1500);
        }
      }

      drawField();
      requestAnimationFrame(update);
    }

    canvas.addEventListener('click', (e) => {
      if (ball.inFlight) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

      const dx = clickX - ball.x;
      const dy = clickY - ball.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      ball.vx = (dx / dist) * 7;
      ball.vy = (dy / dist) * 7;
      
      // Calculate curve towards click horizontal offset
      ball.curve = (clickX - 300) * 0.015;
      ball.inFlight = true;
      ball.scored = null;
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        score = 0;
        shots = 0;
        if (scoreDisplay) scoreDisplay.textContent = 'Goals: 0 | Shots: 0';
        resetBall();
      });
    }

    update();
  }

  // 3. Instant Hover Preloading for Internal Navigation
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

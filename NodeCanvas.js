import { useEffect } from 'react';

const NodeCanvas = ({ isLoading }) => {
  // Normal state control panel
  const normal = {
    colorChangeSpeed: .01,
    saturation: 100,
    lightness: 100,
    speedMultiplier: 1,
    nodeCount: 80,
    nodeBaseRadius: 1,
    lineWidth: 1,
    gravityRadius: 150,
    maxLineDistance: 200,
    nodeColor: 'rgba(0, 150, 255, 0.1)', // Example color for normal state nodes
    lineColor: 'rgba(0, 150, 255, 0.1)' // Example color for normal state lines
  };

  // Loading state control panel
  const loading = {
    colorChangeSpeed: .01,
    saturation: 100,
    lightness: 100,
    speedMultiplier: 20,
    nodeCount: 80,
    nodeBaseRadius: 1,
    lineWidth: 1,
    gravityRadius: 150,
    maxLineDistance: 200,
    nodeColor: 'rgba(255, 0, 0, 0.1)', // Example color for loading state nodes
    lineColor: 'rgba(255, 0, 0, .3)' // Example color for loading state lines
  };

  useEffect(() => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const config = isLoading ? loading : normal;

    const mouse = {
      x: null,
      y: null,
      gravityRadius: config.gravityRadius
    };

    const updateMousePosition = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    window.addEventListener('mousemove', updateMousePosition);

    const nodes = [];
    for (let i = 0; i < config.nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * config.speedMultiplier,
        vy: (Math.random() - 0.5) * config.speedMultiplier,
      });
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    let animationFrameId;

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.fillStyle = config.nodeColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, config.nodeBaseRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = config.lineColor;
      ctx.lineWidth = config.lineWidth;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < config.maxLineDistance) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }

        const dx = mouse.x - nodes[i].x;
        const dy = mouse.y - nodes[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.gravityRadius) {
          nodes[i].vx += (dx / distance) * 0.005;
          nodes[i].vy += (dy / distance) * 0.005;
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoading]); // Only re-run the effect if isLoading changes

  return <canvas id="canvas" />;
};

export default NodeCanvas;
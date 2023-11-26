import { useEffect } from 'react';

const NetworkGraphCanvas = ({ isLoading }) => {
  // Normal state control panel
  const normal = {
    nodeCount: 50,
    nodeColor: 'rgba(0, 255, 0, 0.7)', // Green color for nodes
    lineColor: 'rgba(0, 255, 0, 0.3)', // Lighter green for lines
    maxLineDistance: 150
  };

  // Loading state control panel
  const loading = {
    nodeCount: 100,
    nodeColor: 'rgba(255, 255, 0, 0.7)', // Yellow color for nodes during loading
    lineColor: 'rgba(255, 255, 0, 0.3)', // Lighter yellow for lines
    maxLineDistance: 200
  };

  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const config = isLoading ? loading : normal;

    let nodes = Array.from({ length: config.nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      nodes = Array.from({ length: config.nodeCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      }));
    };
    window.addEventListener('resize', resize);

    let animationFrameId;

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw nodes
      nodes.forEach(node => {
        ctx.fillStyle = config.nodeColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw lines
      ctx.strokeStyle = config.lineColor;
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
      }

      // Update node positions
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoading]); // Only re-run the effect if isLoading changes

  return <canvas id="canvas" />;
};

export default NetworkGraphCanvas;

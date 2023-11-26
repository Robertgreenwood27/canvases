import { useEffect, useState } from 'react';

const PulsatingGridCanvas = ({ isLoading }) => {
  // Normal state control panel
  const normal = {
    gridSpacing: 50,
    pulseSpeed: 0.02,
    maxPulseSize: 5,
    color: 'rgba(0, 150, 255, 0.7)', // Blue color for normal state
  };

  // Loading state control panel
  const loading = {
    gridSpacing: 30,
    pulseSpeed: 0.04,
    maxPulseSize: 8,
    color: 'rgba(50, 205, 50, 0.7)', // Green color for loading state
  };

  const [config, setConfig] = useState(normal);

  useEffect(() => {
    setConfig(isLoading ? loading : normal);
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let x = 0; x < canvas.width; x += config.gridSpacing) {
          for (let y = 0; y < canvas.height; y += config.gridSpacing) {
            const rawSize = Math.sin((x + y + performance.now() * config.pulseSpeed) * 0.05) * config.maxPulseSize;
            const size = Math.abs(rawSize); // Ensure size is always positive
            ctx.fillStyle = config.color;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      
        requestAnimationFrame(draw);
      };
      

    draw();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [isLoading, config.gridSpacing, config.pulseSpeed, config.maxPulseSize, config.color]); // Re-run the effect if isLoading or config values change

  return <canvas id="canvas" />;
};

export default PulsatingGridCanvas;

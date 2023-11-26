import { useEffect, useState } from 'react';

const DigitalRainCanvas = ({ isLoading }) => {
  // Characters used for the digital rain
  const characters = '01';

  // Normal state control panel
  const normal = {
    fontSize: 16,
    columnSpeed: 5,
    color: 'rgba(0, 255, 0, 0.8)', // Green color for normal state
  };

  // Loading state control panel
  const loading = {
    fontSize: 18,
    columnSpeed: 10,
    color: 'rgba(255, 255, 255, 0.8)', // White color for loading state
  };

  const [config, setConfig] = useState(normal);

  useEffect(() => {
    setConfig(isLoading ? loading : normal);
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / config.fontSize);
    const drops = Array(columns).fill(0);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = config.color;
      ctx.font = `${config.fontSize}px monospace`;

      drops.forEach((drop, i) => {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * config.fontSize, drop * config.fontSize);

        // Randomly reset drop back to top
        if (drop * config.fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    const interval = setInterval(draw, config.columnSpeed);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops.length = Math.floor(canvas.width / config.fontSize);
      drops.fill(0);
    };
    window.addEventListener('resize', resize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [isLoading, config.fontSize, config.columnSpeed, config.color]); // Re-run the effect if isLoading or config values change

  return <canvas id="canvas" />;
};

export default DigitalRainCanvas;

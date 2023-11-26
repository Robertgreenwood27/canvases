import { useEffect } from 'react';

const StarfieldCanvas = ({ isLoading }) => {
  // Normal state control panel
  const normal = {
    starCount: 100,
    starColor: 'rgba(255, 255, 255, 0.8)', // White stars
    starSize: 1,
    moveSpeed: 0.5
  };

  // Loading state control panel
  const loading = {
    starCount: 200,
    starColor: 'rgba(255, 215, 0, 0.8)', // Golden stars for loading state
    starSize: 2,
    moveSpeed: 2
  };

  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const config = isLoading ? loading : normal;
    let stars = [];

    for (let i = 0; i < config.starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * config.starSize
      });
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];
      for (let i = 0; i < config.starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * config.starSize
        });
      }
    };
    window.addEventListener('resize', resize);

    let animationFrameId;

    const update = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.y += config.moveSpeed;

        if (star.y > canvas.height) {
          star.x = Math.random() * canvas.width;
          star.y = 0;
        }

        ctx.fillStyle = config.starColor;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
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

export default StarfieldCanvas;

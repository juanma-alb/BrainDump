import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const ParticleBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine); 
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(() => ({
    fullScreen: { enable: false },
    background: {
      color: { value: "transparent" },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab", 
        },
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.8 } },
      },
    },
    particles: {
      color: { value: "#60a5fa" }, 
      links: {
        color: "#818cf8", 
        distance: 150,
        enable: true,
        opacity: 0.4,
        width: 1.5,
      },
      move: {
        enable: true,
        speed: 1.2, 
        direction: "none" as const, 
        random: false,
        straight: false,
        outModes: { default: "bounce" as const }, 
      },
      number: {
        density: { enable: true, area: 800 },
        value: 80, 
      },
      opacity: { value: 0.6 },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }), []);

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={options}
        className="absolute inset-0 z-0 h-full w-full"
      />
    );
  }

  return null;
};

export default ParticleBackground;
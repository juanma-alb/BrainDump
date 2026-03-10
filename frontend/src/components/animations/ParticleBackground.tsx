import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const ParticleBackground = () => {
  const [init, setInit] = useState(false);

  // Inicializamos el motor de partículas una sola vez
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine); // Usamos slim para que cargue súper rápido
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Configuramos el diseño y comportamiento de las partículas
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
        // Agregamos 'as const' para decirle a TS que esto es un valor exacto, no un string cualquiera
        direction: "none" as const, 
        random: false,
        straight: false,
        // Hacemos lo mismo aquí
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
        // EL FIX ESTÁ AQUÍ: Cambiamos -z-10 por z-0
        // Como el contenido de tu login tiene z-10, las partículas (z-0) se quedarán al fondo 
        // pero POR DELANTE del color oscuro/claro de la pantalla.
        className="absolute inset-0 z-0 h-full w-full"
      />
    );
  }

  return null;
};

export default ParticleBackground;
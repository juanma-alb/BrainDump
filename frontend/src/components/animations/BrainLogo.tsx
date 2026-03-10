import Lottie from "lottie-react";
import aiBrainAnimation from "../../assets/ai-brain-animation.json.json";

const MiComponenteConIcono = () => {
  return (
    <div style={{ width: "200px", height: "200px", margin: " auto" }}> 
      <Lottie 
        animationData={aiBrainAnimation} 
        loop={true} 
        autoplay={true} 
      />
    </div>
  );
};

export default MiComponenteConIcono;
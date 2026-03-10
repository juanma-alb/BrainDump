import Lottie from "lottie-react";
import aiStarAnimation from "../../assets/AI Star UI animation.json"; 

const AiStar = () => {
  return (
    <div style={{ width: "20px", height: "20px", margin: " auto" }}> 
      <Lottie 
        animationData={aiStarAnimation} 
        loop={true} 
        autoplay={true} 
      />
    </div>
  );
};

export default AiStar;
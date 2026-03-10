import Lottie from "lottie-react";
import noteAnimation from "../../assets/Note animation.json";

const NoteAnimation = () => {
  return (
    <div style={{ width: "250px", height: "250px", margin: " auto" }}> 
      <Lottie 
        animationData={noteAnimation} 
        loop={true} 
        autoplay={true} 
      />
    </div>
  );
};

export default NoteAnimation;
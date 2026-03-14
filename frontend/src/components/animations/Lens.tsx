import Lottie from "lottie-react";
import lens from "../../assets/Search.json"; 

export default function Lens() {
  return (
    <div className="w-60 h-60 md:w-60 md:h-60 mx-auto flex items-center justify-center -mb-4"> 
      <Lottie 
        animationData={lens}  
        loop={true} 
        autoplay={true} 
      />
    </div>
  );
}
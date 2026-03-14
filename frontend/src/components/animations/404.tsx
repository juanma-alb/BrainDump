import Lottie from "lottie-react";
import notFound from "../../assets/404 error GLiTch 2.json"; 

const AiStar = () => {
  return (
    <div style={{ width: "300px", height: "150px", margin: " auto" }}> 
      <Lottie 
         animationData={notFound}  
        loop={true} 
        autoplay={true} 
      />
    </div>
  );
};

export default AiStar;
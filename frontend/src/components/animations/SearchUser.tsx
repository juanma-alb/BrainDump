import Lottie from "lottie-react";
import search from "../../assets/SearchUser.json"; 

export default function SearchUser() {
  return (
    <div className="w-48 h-48 md:w-64 md:h-64 mx-auto flex items-center justify-center -mb-4"> 
      <Lottie 
        animationData={search}  
        loop={true} 
        autoplay={true} 
      />
    </div>
  );
}
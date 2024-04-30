import React from 'react'

const Rating = ({rating}) => {
    let filledStars = Math.floor(rating/2);
    const hasHalfStar = rating % 1 !== 0;
    if(rating % 1 < 0){
        filledStars = filledStars-1
    }

    const filledStarsArray = Array.from({ length: filledStars }, (_, index) => (
        <span key={index}><i class="fa-solid fa-star fa-layers-counter" style={{color:'white'}} ></i></span>
      ));
     
   return <div> {filledStarsArray}
   {hasHalfStar && <span  style={{position:'relative'}}>
    <i class="fa-regular fa-star" style={{color:'white'}}></i> 
    <i class="fa-solid fa-star fa-layers-counter"  style={{position:'absolute',color:'white',left:0,top:'2px',clipPath:`polygon(0 0, ${(rating%2) * 100}% 0, ${(rating%2) * 100}% 100%, 0% 100%)`}}></i>
    </span> }
    <span>{(rating/2).toFixed(1)}</span>
    
    </div>;
};
export default Rating

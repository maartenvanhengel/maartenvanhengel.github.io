window.onload = function(){
    setInterval(carousel, 3500);
};


var timer =1;
function carousel(){
    if(screen.width > 500)
    {
   if(timer == 0){
    document.getElementById("img1").style.display = "block"
    document.getElementById("img2").style.display = "none"
    document.getElementById("img3").style.display = "none"
    timer++;
   }
   else if(timer == 1){
    document.getElementById("img1").style.display = "none"
    document.getElementById("img2").style.display = "block"
    document.getElementById("img3").style.display = "none"
    timer++;
   }
   else{
    document.getElementById("img1").style.display = "none"
    document.getElementById("img2").style.display = "none"
    document.getElementById("img3").style.display = "block"
    timer=0;
   }
}
else{
    document.getElementById("img1").style.display = "none"
    document.getElementById("img2").style.display = "none"
    document.getElementById("img3").style.display = "none"
}
}
window.onload = function(){
    const toTop = document.getElementById("move-up");
    window.addEventListener("scroll",()=>{
        if (window.pageYOffset > 100) {
            toTop.classList.add("active");
        } else {
            toTop.classList.remove("active");
        }
    })
}
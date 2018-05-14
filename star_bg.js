
(function(){

let w=window,
d=document,
e=d.documentElement,
g=d.getElementsByTagName('body')[0];
let width = w.innerWidth||e.clientWidth||g.clientWidth;
let height = w.innerHeight||e.clientHeight||g.clientHeight;


let sky_ele = document.getElementById("stars")

let stars = new Array(20).fill({})

function create_star(obj){
    let star = document.createElement("div")
    star.classList.add("star")
    let x = Math.floor(Math.random()*width);
    let y = 0 - Math.floor(Math.random()*height);
    star.style.left = x+"px";
    star.style.top = y+"px";
    let speed = Math.floor(Math.random()*10)+10;
    sky_ele.appendChild(star)
    return {
        star : star,
        x : x, 
        y : y,
        speed : speed,
    }
}
stars = stars.map(create_star)


console.log(stars)
function move_stars(){
    stars = stars.map(function(star){
        star.y += star.speed;
        if(star.y > height){ 
            star.y = 0 - Math.floor(Math.random()*height)
            star.speed = Math.floor(Math.random()*40);
            star.x = Math.floor(Math.random()*width);
            star.star.style.left = star.x+"px";
        }
        star.star.style.top = star.y+"px";
        return star
    })
}


var start = null;
function step(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  move_stars()

    window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);



}())

document.addEventListener("turbolinks:load", function() {
  const img = document.getElementsByClassName("main-img-container")[0];
  img.addEventListener("mousemove", function(e) {
    let div = document.createElement("div");
    div.style.position = "absolute";
    div.style.top = e.pageY - 195 + "px"
    div.style.left = e.pageX - (document.body.clientWidth * 0.1) - 40 + "px";
    div.style.height = "80px";
    div.style.width = "80px";
    div.style.border = "solid black 5px";
    img.appendChild(div);
    div.addEventListener("mouseleave", function() {
      div.parentNode.removeChild(div);
    })
  })
  setInterval(function() {
    while (img.childNodes.length > 4) {
      img.removeChild(img.lastChild);
    }
  },1000);
})

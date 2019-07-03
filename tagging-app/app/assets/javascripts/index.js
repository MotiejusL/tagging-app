document.addEventListener("turbolinks:load", function() {
  const characters = ["Waldo", "Odlaw"];
  const img = document.getElementsByClassName("img-wrapper")[0];
  let pointerWrapper = document.createElement("div");
  pointerWrapper.classList.add("pointer-wrapper");
  let div = document.createElement("div");
  pointerWrapper.hidden = true;
  div.classList.add("on-hover-pointer");
  pointerWrapper.appendChild(div);
  img.appendChild(pointerWrapper);
  img.addEventListener("mousemove", moveMousePointer);

  function moveMousePointer(e) {
    if (e.pageX >= 157 + 187 && e.pageX <= 978 + 187 && e.pageY >= 60 + 195 && e.pageY <= 581 + 195) {
      pointerWrapper.hidden = false;
      pointerWrapper.style.top = e.pageY - 195 + "px";
      pointerWrapper.style.left = e.pageX - (document.body.clientWidth * 0.1) - 40 + "px";
      if (pointerWrapper.childNodes.length > 1) {
        pointerWrapper.removeChild(pointerWrapper.lastChild);
      }
    } else {
      pointerWrapper.hidden = true;
    }
  }

  img.addEventListener("click", function() {
    characters.forEach(function (element, index) {
      let selectDiv = document.createElement("div");
      selectDiv.classList.add("pop-up");
      if (index == 0) {
        selectDiv.classList.add("first-popup");
      }
      selectDiv.innerHTML = element;
      pointerWrapper.appendChild(selectDiv);
    })
    img.removeEventListener("mousemove", moveMousePointer);
  })

  img.addEventListener("mouseleave", function() {
    pointerWrapper.hidden = true;
  })

  pointerWrapper.addEventListener("mouseleave", function() {
    img.addEventListener("mousemove", moveMousePointer);
  })
})

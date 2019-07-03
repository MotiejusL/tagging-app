document.addEventListener("turbolinks:load", function() {
  const characters = ["Waldo", "Odlaw"];
  const img = document.getElementsByClassName("img-wrapper")[0];
  const foundIt = document.getElementsByClassName('foundIt')[0];
  const timerDiv = document.querySelector("h2");
  let pointerWrapper = document.createElement("div");
  pointerWrapper.classList.add("pointer-wrapper");
  let div = document.createElement("div");
  pointerWrapper.hidden = true;
  div.classList.add("on-hover-pointer");
  pointerWrapper.appendChild(div);
  img.appendChild(pointerWrapper);
  img.addEventListener("mousemove", moveMousePointer);

  let timerInterval = timeCount(timerDiv);
  function moveMousePointer(e) {
    if (e.pageX >= 157 + 187 && e.pageX <= 978 + 187 && e.pageY >= 108 + 195 && e.pageY <= 629 + 195) {
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

  function timeCount(div) {
    div.classList.add("main-font");
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
      let timerInterval = setInterval(function() {
        seconds++;
        if (seconds == 60) {
          seconds = 0;
          minutes++;
        } else if(minutes == 60) {
          minutes == 0;
          hours++;
        }
        div.innerHTML = String(hours).padStart(2,0) + ":" + String(minutes).padStart(2,0) + ":" + String(seconds).padStart(2,0);
      },1000)
      return timerInterval;
  }

  img.addEventListener("click", function(event) {
    characters.forEach(function (element, index) {
      let selectDiv = document.createElement("div");
      selectDiv.classList.add("pop-up");
      if (index == 0) {
        selectDiv.classList.add("first-popup");
      }
      selectDiv.innerHTML = element;
      selectDiv.addEventListener('click', function(e) {
        e.cancelBubble = true;
        Rails.ajax({
          url: "/cordinates",
          type: "GET",
          data: '[cordinateY]=' + event.pageY + '&[cordinateX]=' + event.pageX + '&[name]=' +  selectDiv.innerHTML +
          '',
          beforeSend: function() {
            return true
          },
          success: function(response) {
            if (response.foundIt == true) {
              foundIt.style.backgroundColor = "rgba(46,204,113,0.8)";
              foundIt.style.opacity = "1";
              foundIt.innerHTML = "You found " + response.foundName + " in " + timerDiv.innerHTML;
              clearInterval(timerInterval);
              timerInterval = timeCount(timerDiv);
            } else {
              foundIt.style.backgroundColor = "rgba(240,52,52,0.8)";
              foundIt.style.opacity = "1";
              foundIt.innerHTML = "Failed";
            }
            setTimeout(function() {
              foundIt.style.opacity = "0";
            }, 2000)
          },
          error: function(data) {
            alert('error');
          }
        })
      })
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

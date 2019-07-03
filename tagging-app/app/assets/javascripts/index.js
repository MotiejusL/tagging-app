document.addEventListener("turbolinks:load", function() {
  const characters = ["Waldo", "Odlaw"];
  const img = document.getElementsByClassName("img-wrapper")[0];
  const foundIt = document.getElementsByClassName('foundIt')[0];
  const timerDiv = document.querySelector("h2");
  const h1 = document.querySelector("h1");
  const submit = document.getElementById("submit");
  const login = document.getElementsByClassName("login")[0];
  const header = document.getElementsByClassName("header")[0];
  const footer = document.getElementsByClassName("footer")[0];
  const container = document.getElementsByClassName("container")[0];
  let alreadyFound = [];
  let timerInterval;
  let lastID;
  let globalSeconds = 0;
  let pointerWrapper = document.createElement("div");
  pointerWrapper.classList.add("pointer-wrapper");
  let div = document.createElement("div");
  pointerWrapper.hidden = true;
  div.classList.add("on-hover-pointer");
  pointerWrapper.appendChild(div);
  img.appendChild(pointerWrapper);
  getUsersLastId();
  checkIfLoginHidden();

  function checkIfLoginHidden() {
    if (sessionStorage.getItem("alreadySet") == "true") {
      makeVisibleAndRunning();
    }
  }

  function getUsersLastId() {
    Rails.ajax({
      url: "/lastuser",
      type: "GET",
      beforeSend: function() {
        return true;
      },
      success: function(response) {
        lastID = response.lastId + 1;
      },
      error: function(response) {
        alert('error');
      }
    })
  }

  function makeVisibleAndRunning() {
    login.hidden = true;
    header.style.opacity = "1";
    footer.style.opacity = "1";
    container.style.opacity = "1";
    img.addEventListener("mousemove", moveMousePointer);
    timerInterval = timeCount(timerDiv);
  }

  function moveMousePointer(e) {
    console.log(e.pageX + "  " + e.pageY);
    const margins = 110;
    if (e.pageX >= (window.innerWidth - 900) / 2 + 25 && e.pageX <= window.innerWidth - ((window.innerWidth - 900) / 2) - 50 && e.pageY >= header.clientHeight + timerDiv.clientHeight + h1.clientHeight + margins && e.pageY <= header.clientHeight + timerDiv.clientHeight + h1.clientHeight + 625) {
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
        globalSeconds++;
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
          '&[screenX]=' + window.innerWidth + '&[screenY]=' + window.innerHeight + '',
          beforeSend: function() {
            return true
          },
          success: function(response) {
            if (response.foundIt == true) {
              foundIt.style.backgroundColor = "rgba(46,204,113,0.8)";
              foundIt.style.opacity = "1";
              foundIt.innerHTML = "You found " + response.foundName + " in " + timerDiv.innerHTML;
            } else {
              foundIt.style.backgroundColor = "rgba(240,52,52,0.8)";
              foundIt.style.opacity = "1";
              foundIt.innerHTML = "Failed";
            }
            setTimeout(function() {
              foundIt.style.opacity = "0";
            }, 2000)
            if (alreadyFound.includes(response.foundName) == false) {
              alreadyFound.push(response.foundName);
            }
            if (alreadyFound.length == characters.length) {
              Rails.ajax({
                url: "/users/" + lastID,
                type: "PUT",
                data: '[time]=' + globalSeconds + '&[id]=' + lastID,
                beforeSend: function() {
                  return true;
                },
                success: function(response) {
                  alert("good");
                  clearInterval(timerInterval);
                  timerInterval = timeCount(timerDiv);
                  globalSeconds = 0;
                },
                error: function(response) {
                  alert("error");
                }
              })
            }
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

  submit.addEventListener("click", function() {
    sessionStorage.setItem("alreadySet", "true");
    makeVisibleAndRunning();
  })
})

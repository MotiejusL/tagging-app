document.addEventListener('turbolinks:load', () => {
  gameStart();

  function gameStart() {
    let characters;
    let imgId;
    const img = document.getElementsByClassName('img-wrapper')[0];
    const imgToSet = img.querySelectorAll('img')[0];
    const imgToFade = img.querySelectorAll('img')[1];
    const bestList = document.getElementsByClassName('best-list')[0];
    const imageHeader = document.getElementById('img-header');
    let timerInterval;
    let lastID = 1;
    let globalSeconds = 0;
    let bestTimes = [];
    let alreadyFound = [];
    let currentImage = 0;
    const pointerWrapper = createPointer(img);
    checkIfLoginHidden();
    setImageHeaderIdAndChars(currentImage, true);
    addListenersForArrows();

    function setImageHeaderIdAndChars(imageIndex, firstTimeSet) {
      promiseOfImagesWithChars().then((charsAndImages) => {
        const imageIndexModulus = mod(imageIndex, charsAndImages.length);
        characters = charsAndImages[imageIndexModulus].charNames;
        imgId = charsAndImages[imageIndexModulus].imageId;
        imageHeader.textContent = 'Find ';
        characters.forEach((name, index) => {
          if (index + 1 === characters.length) {
            imageHeader.textContent += `${name}`;
          } else if (index + 1 === characters.length - 1) {
            imageHeader.textContent += `${name} and `;
          } else {
            imageHeader.textContent += `${name}, `;
          }
        });
        imgToSet.classList.toggle('transition-none');
        imgToFade.classList.toggle('transition-none');
        if (firstTimeSet !== true) {
          clearInterval(timerInterval);
          globalSeconds = 0;
          timerInterval = timeCount(img.timerDiv);
          imgToFade.src = `/assets/${charsAndImages[imageIndexModulus].imageName}`;
          imgToSet.classList.toggle('opacity-zero');
          imgToFade.classList.toggle('opacity-one');
          setTimeout(() => {
            imgToFade.src = '//:0';
            imgToSet.src = `/assets/${charsAndImages[imageIndexModulus].imageName}`;
            imgToSet.classList.toggle('transition-none');
            imgToFade.classList.toggle('transition-none');
            imgToSet.classList.toggle('opacity-zero');
            imgToFade.classList.toggle('opacity-one');
          }, 800);
        } else {
          imgToSet.src = `/assets/${charsAndImages[imageIndexModulus].imageName}`;
        }
        getBestTimes(imgId);
      });
    }

    function addListenersForArrows() {
      const rightArrow = document.getElementById('right-arrow');
      const leftArrow = document.getElementById('left-arrow');

      rightArrow.addEventListener('click', getNextImage);
      leftArrow.addEventListener('click', getPrevImage);
    }

    function getNextImage(event) {
      event.stopPropagation();
      currentImage += 1;
      setImageHeaderIdAndChars(currentImage, false);
    }

    function getPrevImage(event) {
      event.stopPropagation();
      currentImage -= 1;
      setImageHeaderIdAndChars(currentImage, false);
    }

    function mod(n, p) {
      const result = (Math.abs(n) % p);
      return result;
    }

    const submit = document.getElementById('submit');
    submit.addEventListener('click', () => {
      sessionStorage.setItem('alreadySet', 'true');
      makeVisibleAndRunning();
      getUsersLastId();
    });

    async function promiseOfImagesWithChars() {
      const imagesWithCharactersAwait = await getImagesWithChars();
      return imagesWithCharactersAwait;
    }

    function getImagesWithChars() {
      return new Promise((resolve) => {
        Rails.ajax({
          url: '/get_images_and_chars',
          type: 'GET',
          beforeSend: function returnTrue() {
            return true;
          },
          success: function getResponse(response) {
            resolve(response.imagesWithCharacters);
          },
          error: function getError(response) {
            console.error(response);
          },
        });
      });
    }

    function createPointer(image) {
      const pointerWrap = document.createElement('div');
      pointerWrap.classList.add('pointer-wrapper');
      pointerWrap.hidden = true;
      const div = document.createElement('div');
      div.classList.add('on-hover-pointer');
      pointerWrap.appendChild(div);
      image.appendChild(pointerWrap);
      return pointerWrap;
    }

    function fillBestUserList() {
      removeTableRows(bestList);
      bestTimes.forEach((element, index) => {
        if (index < 5) {
          const newTr = document.createElement('tr');
          const newThName = document.createElement('th');
          newThName.innerHTML = element.name;
          const newThScore = document.createElement('th');
          newThScore.innerHTML = `${element.score} s`;
          newTr.appendChild(newThName);
          newTr.appendChild(newThScore);
          bestList.appendChild(newTr);
        }
      });
    }

    function removeTableRows(table) {
      while (table.rows.length > 1) {
        table.deleteRow(table.rows.length - 1);
      }
    }

    function getBestTimes(imageId) {
      Rails.ajax({
        url: `/users_for_img/${imageId}`,
        type: 'GET',
        beforeSend: function returnTrue() {
          return true;
        },
        success: function getRespone(response) {
          if (response.users !== []) {
            bestTimes = response.users;
            sortByTime(bestTimes);
            fillBestUserList();
          }
        },
        error: function getError(response) {
          console.error(response);
        },
      });
    }

    function sortByTime(array) {
      const arrayForSort = array;
      for (let i = 0; i < array.length; i += 1) {
        for (let j = 0; j < array.length; j += 1) {
          if (array[i].score < array[j].score) {
            const temp = array[i];
            arrayForSort[i] = array[j];
            arrayForSort[j] = temp;
          }
        }
      }
      return array;
    }

    function checkIfLoginHidden() {
      if (sessionStorage.getItem('alreadySet') === 'true') {
        makeVisibleAndRunning();
        lastID = sessionStorage.getItem('ID');
      }
    }

    function getUsersLastId() {
      Rails.ajax({
        url: '/lastuser',
        type: 'GET',
        beforeSend: function returnTrue() {
          return true;
        },
        success: function getResponse(response) {
          if (response.lastId !== undefined) {
            lastID = response.lastId + 1;
            sessionStorage.setItem('ID', lastID);
          } else {
            sessionStorage.setItem('ID', lastID);
          }
        },
        error: function getError(response) {
          console.error(response);
        },
      });
    }

    function makeVisibleAndRunning() {
      const login = document.getElementsByClassName('login')[0];
      const header = document.getElementsByClassName('header')[0];
      const footer = document.getElementsByClassName('footer')[0];
      const container = document.getElementsByClassName('container')[0];
      const timerDiv = document.querySelector('h2');
      login.hidden = true;
      header.style.opacity = '1';
      footer.style.opacity = '1';
      container.style.opacity = '1';
      img.header = header;
      img.timerDiv = timerDiv;
      img.addEventListener('mousemove', moveMousePointer);
      timerInterval = timeCount(timerDiv);
    }

    function moveMousePointer(e) {
      //console.log(`${e.pageX  }  ${ e.pageY}`);
      const textHeader = document.querySelector('h1');
      const header = e.currentTarget.header;
      const timerDiv = e.currentTarget.timerDiv;
      const margin = 110;
      img.addEventListener('click', showPopUpMenu);
      if (e.pageX >= window.innerWidth - (window.innerWidth * 0.9) + 40
      && e.pageX <= window.innerWidth - (window.innerWidth * 0.1) - 52
      && e.pageY >= header.clientHeight + timerDiv.clientHeight + textHeader.clientHeight + margin
      && e.pageY <= header.clientHeight + timerDiv.clientHeight
       + textHeader.clientHeight + margin + imgToSet.clientHeight - 80) {
        pointerWrapper.hidden = false;
        pointerWrapper.style.top = `${e.pageY - 315}px`;
        pointerWrapper.style.left = `${e.pageX - (document.body.clientWidth * 0.1) - 40}px`;
        if (pointerWrapper.childNodes.length > 1) {
          pointerWrapper.removeChild(pointerWrapper.lastChild);
        }
      } else {
        pointerWrapper.hidden = true;
      }
    }

    function timeCount(timersDiv) {
      const timersDivParam = timersDiv;
      timersDiv.classList.add('main-font');
      timersDivParam.textContent = '00:00:00';
      const timer = { seconds: 0, minutes: 0, hours: 0 };
      timerInterval = setInterval(secondTick, 1000, timer, timersDiv);
      return timerInterval;
    }

    function secondTick(timer, timersDiv) {
      const timerParam = timer;
      const timersDivParam = timersDiv;
      timerParam.seconds += 1;
      globalSeconds += 1;
      if (timer.seconds === 60) {
        timerParam.seconds = 0;
        timerParam.minutes += 1;
      } else if (timer.minutes === 60) {
        timerParam.minutes = 0;
        timerParam.hours += 1;
      }
      timersDivParam.innerHTML = `${String(timer.hours).padStart(2, 0)}:${String(timer.minutes).padStart(2, 0)}:${String(timer.seconds).padStart(2, 0)}`;
    }

    img.addEventListener('click', showPopUpMenu);

    function showPopUpMenu(imgElement) {
      img.removeEventListener('click', showPopUpMenu);
      const timerDiv = imgElement.currentTarget.timerDiv;
      characters.forEach((element, index) => {
        const selectDiv = document.createElement('div');
        selectDiv.classList.add('pop-up');
        if (index === 0) {
          selectDiv.classList.add('first-popup');
        }
        selectDiv.innerHTML = element;
        selectDiv.imgElement = imgElement;
        selectDiv.timerDiv = timerDiv;
        selectDiv.addEventListener('click', sendCordinates);
        pointerWrapper.appendChild(selectDiv);
      });
      img.removeEventListener('mousemove', moveMousePointer);
    }

    function sendCordinates(e) {
      const timerDiv = e.currentTarget.timerDiv;
      e.stopPropagation();
      const selectDiv = e.currentTarget;
      const imgElement = selectDiv.imgElement;
      const imageY = imgToSet.clientHeight;
      Rails.ajax({
        url: '/cordinates',
        type: 'GET',
        data: `[cordinateY]=${imgElement.pageY}&[cordinateX]=${imgElement.pageX}&[name]=${selectDiv.innerHTML
        }&[screenX]=${window.innerWidth}&[screenY]=${window.innerHeight}&[imgId]=${imgId}&[imageY]=${imageY}`,
        beforeSend: function returnTrue() {
          return true;
        },
        success: function getResponse(response) {
          checkIfCharacterIsFound(response, timerDiv);
        },
        error: function getError(response) {
          console.log(response);
        },
      });
    }

    function checkIfCharacterIsFound(response, timerDiv) {
      const foundIt = document.getElementsByClassName('foundIt')[0];
      if (response.foundIt === true) {
        foundIt.style.backgroundColor = 'rgba(46,204,113,0.8)';
        foundIt.style.opacity = '1';
        foundIt.innerHTML = `You found ${response.foundName} in ${timerDiv.innerHTML}`;
      } else {
        foundIt.style.backgroundColor = 'rgba(240,52,52,0.8)';
        foundIt.style.opacity = '1';
        foundIt.innerHTML = 'He is not here!';
      }
      setTimeout(() => {
        foundIt.style.opacity = '0';
      }, 2000);
      if (alreadyFound.includes(response.foundName) === false && response.foundIt === true) {
        alreadyFound.push(response.foundName);
      }
      if (alreadyFound.length === characters.length) {
        updateUsersBestTime(timerDiv, alreadyFound);
      }
    }

    function updateUsersBestTime(timerDiv) {
      Rails.ajax({
        url: `/users/${lastID}`,
        type: 'PUT',
        data: `[time]=${globalSeconds}&[id]=${lastID}&[imageId]=${imgId}`,
        beforeSend: function returnTrue() {
          return true;
        },
        success: function getResponse() {
          clearInterval(timerInterval);
          timerInterval = timeCount(timerDiv);
          globalSeconds = 0;
          alreadyFound = [];
          getBestTimes(imgId);
          fillBestUserList();
        },
        error: function getError(res) {
          console.error(res);
        },
      });
    }


    img.addEventListener('mouseleave', () => {
      pointerWrapper.hidden = true;
    });

    pointerWrapper.addEventListener('mouseleave', () => {
      img.addEventListener('mousemove', moveMousePointer);
    });
  }
});

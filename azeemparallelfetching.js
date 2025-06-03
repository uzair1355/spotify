 const promisesArray = [];
  Array.from(anchors).forEach((e) => {
    promisesArray.push(
      (async () => {
      if (e.href.includes("/songs/")) {
        let folder = e.href.split("/").slice(-2)[0];
        // get the metadata of each folder

        let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);

        let response = await a.json();
        console.log(response);
        let cardcontainer = document.querySelector(".cardcontainer");

        cardcontainer.innerHTML =
          cardcontainer.innerHTML +
          ` <div class="card" data-folder="ncs">
              <div class="play">
                <img src="play.svg" alt="" />
              </div>
              <img
                aria-hidden="false"
                draggable="false"
                loading="lazy"
                src="/songs/${folder}/cover.jpg"
                data-testid="card-image"
                alt=""
                class="mMx2LUixlnN_Fu45JpFB yMQTWVwLJ5bV8VGiaqU3 Yn2Ei5QZn19gria6LjZj"
              />
              <h4 style="padding: 0px 0px 5px 0px" class="f-3">${response.title}</h4>
              <p class="f-1" style="width: 153px">
                <span data-encore-id="text"
                  ><a
                    style="color: #b3b3b3; text-decoration: none"
                    draggable="true"
                    dir="auto"
                    href="/artist/6DARBhWbfcS9E4yJzcliqQ"
                    >${response.discription}</a
                  >,
                  <a
                    style="color: #b3b3b3; text-decoration: none"
                    draggable="true"
                    dir="auto"
                    href="/artist/5uhcvmuj3X2tr8ooCLrUAx"
                    >${response.artist}</a
                  ></span
                >
              </p>
            </div>`;
      }
    })()
  );
  });
  await Promise.all(promisesArray)

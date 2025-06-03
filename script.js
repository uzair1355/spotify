//GLOBAL VAR//

let currentsong = new Audio();
let maxll = 2;
let songs = [];
let currFolder;
let Namesorted = [];
let namesong = [];
let indexsong;
let autoplay = 0;

// CLEAN function

function cleanSongName(filename) {
  // Remove extension (.mp3)
  let nameWithoutExt = filename.replace(".mp3", "");

  // Remove trailing numeric ID (e.g., -330416 or -315229)
  nameWithoutExt = nameWithoutExt.replace(/-\d+$/, "");

  // replaces with 20%
  nameWithoutExt = nameWithoutExt.replace(/%20/g, " ");

  // Replace dashes with spaces
  return nameWithoutExt.replace(/-/g, " ");
}

// trim function
function lengthchk(sentence) {
  let trimmed = [];
  let maxl = 20;

  for (let name of sentence) {
    trimmed.push(
      name.length > maxl ? `${name.substring(0, maxl)}` + "..." : `${name}`
    );
  }
  return trimmed;
}

//check song?
function checkstring(string, songs) {
  for (let i = 0; i < songs.length; i++) {
    if (string === songs[i].substring(0, maxll)) {
      return i;
    }
  }
}

// play song ?
function playsong(track, pause = false) {
  currentsong.src = `/${currFolder}/` + track;

  if (!pause) {
    currentsong.play();
    play.src = "pause.svg";
   
    
  }

  let max = 10;

  document.querySelector(".songinfo").innerHTML =
    track.substring(0, max) + "...";
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

// formatting time to 00:00/00:00
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// MAIN fetching songs from folder to add to playlidt to play them ?

async function getsong(folder) {
  // updating current folder to the user selected one ?
  currFolder = folder;
  // console.log(currFolder);

  // ✅ Clear previous data
  songs = [];
  namesong = [];
  Namesorted = [];

  //now fetching songs from folder ?
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);

  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");

  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  // cleaning names
  for (const Snamee of songs) {
    namesong.push(cleanSongName(Snamee));
  }
  console.log(namesong[0]);

  // length correction
  Namesorted = lengthchk(namesong);
  console.log(Namesorted[0]);

  // listing songs of this folder to playlist
  let songul = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];

  // clearing the previous folder songs ?

  songul.innerHTML = "";

  // inserting  new songs now ?
  for (const Sname of Namesorted) {


    songul.innerHTML =
      songul.innerHTML +
      `
     <li>
                <img  style="background-color: #1ED760;" src="music.svg" alt="" />
                <div style="width: 150px;" class="info">
                  <div  class="songname" style="font-size: 13px; height:30px; padding-top:5px" >${Sname}</div>
                  <div style="font-size: 8px; "  >Artist</div>
                </div>
                <div class="playnow"> <span style="width: 23px;">PLAY NOW</span><img class="invert" width="30px" src="playsong.svg" alt=""></div>
              </li>`;
  }




  //attach an event listnner to each song//
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    let maxll = 2;

    e.addEventListener("click", (element) => {
      // playing song afterwards
      indexsong = checkstring(
        e.querySelector(".songname").innerHTML.substring(0, maxll),
        songs
      );

      let song = songs[indexsong];
      console.log(song);
      playsong(song);
    });
  });

  // returning songs for putting a default song in playbar initially for better UI

  return songs;
}

async function displayalbums(params) {
  //
  //now fetching songs from folder ?
  let a = await fetch(`http://127.0.0.1:3000/songs/`);

  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let anchors = div.getElementsByTagName("a");
  console.log(anchors);
  let array = Array.from(anchors);

  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-2)[0];
      // get the metadata of each folder

      let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);

      let response = await a.json();
      console.log(response);
      let cardcontainer = document.querySelector(".cardcontainer");

      cardcontainer.innerHTML =
        cardcontainer.innerHTML +
        ` <div class="card" data-folder=${folder}>
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
              <h4 style="padding: 5px 0px 5px 0px" class="f-3">${response.title}</h4>
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
  }

  // load the playlist whenever card is clicked

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    let playbutton = e.querySelector(".play");

    let newF = e.dataset.folder;

    playbutton.addEventListener("click", async () => {
      songs = await getsong(`songs/${newF}`);
        playsong(songs[0]);
    });
  });



}

async function main(params) {
  // loading albums to the spotify

  displayalbums();

  // attach event listner to play , previous  & next

  play.addEventListener("click", (params) => {
    if (currentsong.paused) {
      currentsong.play();
     
      
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "playsong.svg";
    }
  });

  // listen for timeupdate event

  currentsong.addEventListener("timeupdate", (params) => {
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentsong.currentTime
    )}/${formatTime(currentsong.duration)}`;

    // seekbar movement

    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  // add an even listner to seekbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

    document.querySelector(".circle").style.left = percent + "%";

    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  // add event listner to hamburger

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%";
  });

  // add event listner to close
  document.querySelector(".close").addEventListener("click", (params) => {
    document.querySelector(".left").style.left = "-120%";
  });

  // add event listner to next

  next.addEventListener("click", (params) => {
    let x;
    console.log(songs.length);

    console.log(currentsong.src);
    let flagg = 0;
    let lastindex = songs.length - 1;
    for (let i = 0; i < songs.length; i++) {
      // console.log ("/songs/"+songs[i]);
      if (currentsong.src.split(`/${currFolder}/`)[1] === songs[i]) {
        if (i === lastindex) {
          flagg = flagg;
          break;
        } else {
          x = i;
          flagg = 1;
          break;
        }
      }
    }

    if (flagg === 0) {
      playsong(songs[0]);
    } else {
      playsong(songs[x + 1]);
    }
  });

  // add event listner to previous

  previous.addEventListener("click", (params) => {
    let index = songs.indexOf(currentsong.src.split(`/${currFolder}/`)[1]);
    console.log(index);

    if (index > 0) {
      playsong(songs[index - 1]);
    }
  });

  // add event listner to volume rangr

  document.querySelector(".inputrange").addEventListener("change", (e) => {
    console.log("setting volume to ", e.target.value, "/100");
    currentsong.volume = parseInt(e.target.value) / 100;
  });

  //get list of songs fromdefault set foldre initially first  and playing default?
  songs = await getsong("songs/karan_aujla");
  playsong(songs[0], true);

  // add event listner to mute the track
  document.querySelector(".vol").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");

      currentsong.volume = 0;

      document.querySelector(".inputrange").value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");

      currentsong.volume = 0.5;

      document.querySelector(".inputrange").value = 50;
    }
  });


  

  // if (autoplay) {
  //   console.log("sxjkdskjvkfjv");

  //   // want to autoplay song after it finshes
  //   if (
  //     (document.querySelector(".circle").style.left =
  //       (currentsong.currentTime / currentsong.duration) * 100 + "%" ===
  //         "100%" && songs[indexsong] < songs.length)
  //   ) {
  //     playsong(songs[indexsong + 1]);
  //   }
  // }
}

main();

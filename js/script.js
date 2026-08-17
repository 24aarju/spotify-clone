console.log("Let's write JavaScript");
let currentSong = new Audio();
let songs;
let currfolder;
function secondsToMinutesSeconds(seconds) {

    if (isNaN(seconds) || seconds < 0) {

        return "00:00";

    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');

    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;

}
async function getSongs(folder) {
    currfolder = folder;

    let response = await fetch(
        `https://api.github.com/repos/24aarju/spotify-clone/contents/${folder}`
    );

    let files = await response.json();

    songs = files
        .filter(file => file.name.endsWith(".mp3"))
        .map(file => file.name);

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `<li>
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
                <div>${song}</div>
                <div>Song Artist</div>
            </div>
            <div class="playbutton">
                <span>Play Now</span>
                <i class="fa-regular fa-circle-play"></i>
            </div>
        </li>`;
    }

    Array.from(
        document.querySelector(".songlist").getElementsByTagName("li")
    ).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(
                e.querySelector(".info").firstElementChild.innerHTML.trim()
            );
        });
    });
}
const playMusic = (track, pause = false) => {
    //let audio = new Audio("/songs/" +track)
    currentSong.src = `https://raw.githubusercontent.com/24aarju/spotify-clone/main/${currfolder}/${encodeURIComponent(track)}`;
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function displayAlbums() {
    console.log("displaying albums");

    let response = await fetch(
        "https://api.github.com/repos/24aarju/spotify-clone/contents/songs"
    );

    let folders = await response.json();

    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    for (const folder of folders) {

        if (folder.type !== "dir") continue;

        let folderName = folder.name;

        let infoResponse = await fetch(
            `https://raw.githubusercontent.com/24aarju/spotify-clone/main/songs/${folderName}/info.json`
        );

        let info = await infoResponse.json();

        cardContainer.innerHTML += `
            <div data-folder="songs/${folderName}" class="card">
                <div class="play">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                        width="30"
                        height="30">
                        <path fill="#1DB954"
                            d="M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM276.5 211.5C269.1 207 259.8 206.8 252.2 211C244.6 215.2 240 223.3 240 232L240 408C240 416.7 244.7 424.7 252.3 428.9C259.9 433.1 269.1 433 276.6 428.4L420.6 340.4C427.7 336 432.1 328.3 432.1 319.9C432.1 311.5 427.7 303.8 420.6 299.4L276.6 211.4zM362 320L288 365.2L288 274.8L362 320z" />
                    </svg>
                </div>

                <img src="https://raw.githubusercontent.com/24aarju/spotify-clone/main/songs/${folderName}/cover.jpg" alt="">

                <h2>${info.title}</h2>
                <p>${info.description}</p>
            </div>`;
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async event => {

            let folder = event.currentTarget.dataset.folder;

            await getSongs(folder);

            if (songs.length > 0) {
                playMusic(songs[0]);
            }
        });
    });
}

async function main() {


    //get the list of all the songs
     await getSongs("songs/ncs");
    playMusic(songs[0], true)

    // songs.forEach(song => {
    console.log(songs)

    //Display the list of all the songs
    displayAlbums()

    //Attach an event listener to previous, play and next
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"

        }

    })
    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);

        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
            document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) * 100 + "%"
    });
   // add an event listener to seekbar
   document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent)/100
   })
   //add an event listener for hamburger
   document.querySelector(".hamburger").addEventListener("click", () =>{
    document.querySelector(".left").style.left = "0"
   })
   //add an event listener for close button
document.querySelector(".close").addEventListener("click", () =>{
    document.querySelector(".left").style.left = "-120%"
   })
   //add an event listener for previous button
   previous.addEventListener("click", () =>{
    currentSong.pause()
    console.log("previous clicked")
    console.log(currentSong)
    let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1) >= 0){
      playMusic(songs[index-1])
    }
   })
   //add an event listener for next button
   next.addEventListener("click", () =>{
    currentSong.pause()
    console.log("next clicked")
    let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1) < songs.length ){
      playMusic(songs[index+1])
    }
   })

   
}

main();




console.log("Let's write JavaScript");

async function getSongs() {

    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");

    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }

    return songs;
}

async function main() {
    //get the list of all the songs
    let songs = await getSongs();
   // songs.forEach(song => {
    console.log(songs);
let songUL =document.querySelector(".songlist").getElementsByTagName("ul")[0]
for (const song of songs) {
    songUL.innerHTML+= `<li> ${song.replaceAll("%20"," ")}</li>`;
}

//play the first song
let audio = new Audio("/songs/" +songs[0]);

document.body.addEventListener("click", () => {
    audio.play();
});



}

main();

let currentsong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {

    if(isNaN(seconds) || seconds<0 ){
        return "00:00";
    }
    // Calculate whole minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Ensure both minutes and seconds are two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder){
    currFolder = folder;

    let a = await fetch(`http://127.0.0.1:3002/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = [];
        for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){

            songs.push(element.href.split(`/${folder}/`)[1])
        }
    
}

//showing all the songs in the playlist
let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
songul.innerHTML="";
for (const song of songs) {
    songul.innerHTML = songul.innerHTML + `<li><img src="music.svg" class="filter" alt="">
    <div class="info">
        <div> ${song.replaceAll("%20"," ")}</div>
        <div>Sanjeev </div>
    
    </div>
   
    <img src="play.svg" class="filter" alt="">
</li>`;
}


Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    

    e.addEventListener("click", element => {
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playsong(e.querySelector(".info").firstElementChild.innerHTML.trim())

    })

})

    return songs

}

const playsong = (track, pause = false) => {
    currentsong.src = `/${currFolder}/`+ track
  if(!pause){
    currentsong.play()
    play.src = "pause.svg"

  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00"



}


async function displayAlbums(){

    let a = await fetch(`http://127.0.0.1:3002/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
        if(e.href.includes("/songs")){
           let folder = e.href.split("/").slice(-2)[0]

           //Getting metadata of a folder
           let a = await fetch(`http://127.0.0.1:3002/songs/${folder}/info.json`)
           let response = await a.json();
           cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folfer="${folder}" class="card" >
               <img src="cards pics/cardlogo.svg" class="card-icon" alt="No Logo">
              
               
                <img src ="/songs/${folder}/cover.jpg"  alt="">
               <h3> ${response.title} </h3>
               <p class=" grey "> ${response.description} </p>
           </div>`

        }
    }

    //Loading songs whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playsong(songs[0])
        })
        
    });
    
}
 
async function main(){

await getsongs("songs/ncs");
playsong(songs[0], true)
console.log(songs)

//Displaying all the albums on the page
await displayAlbums()



//Attaching event listener to play and paused
play.addEventListener("click", () => {
    if(currentsong.paused){
        currentsong.play()
        play.src = "pause.svg";
    }

    else{
    currentsong.pause()
    play.src = "play.svg";

    }

})


//Time updation

currentsong.addEventListener("timeupdate", () => {

    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`

    document.querySelector(".seekscroll").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";

})


//Event listner for Seekbar

document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".seekscroll").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100
})

//Event listner for Hamburger
document.querySelector(".hamburger").addEventListener("click",() => {
document.querySelector(".left").style.left = "0";

})

document.querySelector(".close").addEventListener("click",()=>{
document.querySelector(".left").style.left = "-100%";

})

//Event Listener for Previous
previous.addEventListener("click",() => {
currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if ((index-1) >= 0){
    playsong(songs[index-1])
    }
})

//Event Listener for Next
next.addEventListener("click",() => {
currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if ((index+1) < songs.length){
    playsong(songs[index+1])
    }
})

//Event Listener for Volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("setting volume to ",e.target,e.target.volume)
    currentsong.volume = parseInt(e.target.value)/100
    if(currentsong.volume > 0){
        document.querySelector(".volume>img").src= document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")


    }

})

//Event Listener for muted Volume
document.querySelector(".volume>img").addEventListener("click", (e) => {
 if(e.target.src.includes("volume.svg")){
    e.target.src = e.target.src.replace("volume.svg","mute.svg")
    currentsong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
 }

 else{
    e.target.src = e.target.src.replace("mute.svg","volume.svg")
    currentsong.volume = 0.10;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
 }
    

})


}

main()
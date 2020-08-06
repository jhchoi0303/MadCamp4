import WaveSurfer from "wavesurfer.js";
import playImage from "../../images/play-button.png";

const waveformList: (WaveSurfer | null)[] = [null, null];
const gainNodeList: (GainNode | null)[] = [null, null];
const ratioList = [1, 1];

let playingBPM = 0;
const bpmList = [0, 0];
const syncList:number[][][] | null[] = [null, null];
const intervalList: number[] = [0, 0];

function initAudio() {
  initAudioPlayer();
  initBeatChecker();
  initUrlInputBox();
  attachRatioSlider();
}

function initAudioPlayer() {
  const playButtonList = document.querySelectorAll(".play-btn") as NodeListOf<
    HTMLAudioElement
  >;

  for (let i = 0; i < 2; i++) {
    const playButtonElem = playButtonList[i];
    const waveformID = "waveform-" + i.toString();
    let color = "rgb(0,171,251)";
    if (i == 1) color = "rgb(0,171,251)";

    /* Make waveform */
    waveformList[i] = WaveSurfer.create({
      container: "#" + waveformID,
      barWidth: 3,
      cursorWidth: 1,
      backend: "MediaElement",
      height: 120,
      progressColor: color,
      responsive: true,
      waveColor: "#EFEFEF",
      cursorColor: "transparent",
    });

    /* Init play button */
    playButtonElem.addEventListener("click", (ev) => {
      waveformList[i]?.playPause();
      setBPM(i);
      setSync(i);
    });
  }
}

function initBeatChecker() {}

function initUrlInputBox() {
  const inputList = document.querySelectorAll(".url-box > input") as NodeListOf<
    HTMLInputElement
  >;
  const buttonList = document.querySelectorAll(
    ".url-box > button"
  ) as NodeListOf<HTMLButtonElement>;
  const titleList = document.querySelectorAll(".title") as NodeListOf<
    HTMLDivElement
  >;
  const playBtnImageList = document.querySelectorAll(
    ".play-btn img"
  ) as NodeListOf<HTMLImageElement>;

  for (let i = 0; i < 2; i++) {
    const inputElem = inputList[i];
    const buttonElem = buttonList[i];
    const titleElem = titleList[i];
    const playBtnImageElem = playBtnImageList[i];

    buttonElem.addEventListener("click", (ev) => {
      /* Load audio from a server */
      const requestAudio = new XMLHttpRequest();
      requestAudio.open(
        "GET",
        `/api/youtube/download?url=${inputElem.value}`,
        true
      );
      requestAudio.responseType = "blob";
      requestAudio.onload = () => {
        if (requestAudio.status === 200) {
          /* Load audio meta data from a server */
          const requestMeta = new XMLHttpRequest();
          requestMeta.open(
            "GET",
            `/api/youtube/download/meta?url=${inputElem.value}`,
            true
          );
          requestMeta.onload = () => {
            if (requestMeta.status === 200) {
              const json = JSON.parse(requestMeta.response);

              titleElem.innerHTML = decodeURIComponent(
                Array.prototype.map
                  .call(atob(json.title), function (c) {
                    return (
                      "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                  })
                  .join("")
              );

              bpmList[i] = json.bpm;
              syncList[i] = json.sync_info;
              console.log(json.sync_info);
            }
          };
          requestMeta.send();

          /* Load audio file from the server */
          waveformList[i]?.load(URL.createObjectURL(requestAudio.response));

          /* Attach audio filter */
          attachFilter(i);

          /* Initialize a play button image */
          playBtnImageElem.setAttribute('src', `${playImage}`);
          let audioElem = document.querySelectorAll('.waveform audio')[i] as HTMLAudioElement;
          if (audioElem == null)
            audioElem = document.querySelector('.waveform audio') as HTMLAudioElement;
          audioElem.addEventListener("ended", (ev) => {
            playBtnImageElem.setAttribute("src", `${playImage}`);
          });
        } else {
          alert("Check url");
        }
      };
      requestAudio.send();
    });
  }
}

function attachFilter(index: number) {
  let audioElem = document.querySelectorAll(".waveform audio")[
    index
  ] as HTMLAudioElement;
  const filterSliderElemList = document.querySelectorAll(
    ".slider.filter"
  ) as NodeListOf<HTMLInputElement>;
  const masterSliderElemList = document.querySelectorAll(
    ".slider.master"
  ) as NodeListOf<HTMLInputElement>;

  if (audioElem == null) {
    index = 0;
    audioElem = document.querySelectorAll(".waveform audio")[
      index
    ] as HTMLAudioElement;
  }

  let sliderIndex = index * 3;

  const audioContext = new AudioContext();
  const audioDestination = audioContext.destination;
  const audioSourceNode = audioContext.createMediaElementSource(audioElem);
  const analyser = audioContext.createAnalyser();
  const biquadFilterHigh = audioContext.createBiquadFilter();
  const biquadFilterMiddle = audioContext.createBiquadFilter();
  const biquadFilterLow = audioContext.createBiquadFilter();
  const gainNode = audioContext.createGain();

  gainNodeList[index] = gainNode;
  gainNode.gain.value =
    (ratioList[index] * parseInt(masterSliderElemList[index].value)) / 100;

  /* Biquad filter */
  /* freq: 0 ~ 24000 */
  /* gain: -3.4e+38 ~ 1541.27 */
  biquadFilterHigh.type = "highshelf";
  biquadFilterMiddle.type = "peaking";
  biquadFilterLow.type = "lowshelf";
  biquadFilterHigh.frequency.value = 3200.0;
  biquadFilterMiddle.frequency.value = 1000.0;
  biquadFilterLow.frequency.value = 320.0;
  biquadFilterHigh.gain.value = parseInt(
    filterSliderElemList[sliderIndex].value
  );
  biquadFilterMiddle.gain.value = parseInt(
    filterSliderElemList[sliderIndex + 1].value
  );
  biquadFilterLow.gain.value = parseInt(
    filterSliderElemList[sliderIndex + 2].value
  );

  audioSourceNode
    .connect(analyser)
    .connect(biquadFilterHigh)
    .connect(biquadFilterMiddle)
    .connect(biquadFilterLow)
    .connect(gainNode)
    .connect(audioDestination);

  filterSliderElemList[sliderIndex].addEventListener("mousemove", (ev) => {
    const element = ev.target as HTMLInputElement;

    if (element != null) {
      biquadFilterHigh.gain.value = parseInt(element.value);
    }
  });
  filterSliderElemList[sliderIndex + 1].addEventListener("mousemove", (ev) => {
    const element = ev.target as HTMLInputElement;

    if (element != null) {
      biquadFilterMiddle.gain.value = parseInt(element.value);
    }
  });
  filterSliderElemList[sliderIndex + 2].addEventListener("mousemove", (ev) => {
    const element = ev.target as HTMLInputElement;

    if (element != null) {
      biquadFilterLow.gain.value = parseInt(element.value);
    }
  });

  masterSliderElemList[index].addEventListener("mousemove", (ev) => {
    const element = ev.target as HTMLInputElement;

    if (element != null) {
      gainNode.gain.value = parseInt(element.value) / 100;
    }
  });
}

function attachRatioSlider() {
  const ratioSliderElem = document.querySelector(
    ".slider.ratio"
  ) as HTMLInputElement;
  const masterSliderElemList = document.querySelectorAll(
    ".slider.master"
  ) as NodeListOf<HTMLInputElement>;

  ratioSliderElem.addEventListener("mousemove", (ev) => {
    const value = parseInt(ratioSliderElem.value) / 100;

    if (value < 0) {
      ratioList[1] = 1 + value;
      ratioList[0] = 1;
    } else {
      ratioList[0] = 1 - value;
      ratioList[1] = 1;
    }

    for (let i = 0; i < 2; i++) {
      const gainNode = gainNodeList[i] as GainNode;

      if (gainNode != null)
        gainNode.gain.value =
          (ratioList[i] * parseInt(masterSliderElemList[i].value)) / 100;
    }
  });
}

function setBPM(index: number) {
  const audioElemList = document.querySelectorAll(
    ".waveform audio"
  ) as NodeListOf<HTMLAudioElement>;
  const audioElem = audioElemList[index];

  if (audioElem == null) return;

  if (audioElem.paused) {
    const otherAudioElem = audioElemList[(index + 1) % 2];

    audioElem.playbackRate = 1;

    if (otherAudioElem == null) playingBPM = 0;
    else if (otherAudioElem.paused) {
      playingBPM = 0;
      otherAudioElem.playbackRate = 1;
    }
  } else {
    if (playingBPM == 0) {
      playingBPM = bpmList[index];
    } else {
      audioElemList[index].playbackRate = playingBPM / bpmList[index];
    }
  }

  const bpmElem = document.querySelector("#bpm-box") as HTMLDivElement;
  bpmElem.innerHTML = playingBPM.toString() + " BPM";
}

function setSync(index: number) {
  const otherIndex = (index + 1) % 2;

  const audioElemList = document.querySelectorAll('.waveform audio') as NodeListOf<HTMLAudioElement>;
  const audioElem = audioElemList[index];
  const otherAudioElem = audioElemList[otherIndex];

  const interval = 60 / playingBPM;
  
  if (audioElem.paused)
    return;
  
  if (otherAudioElem == null || otherAudioElem.paused) {
  }
  else {
    const currentTime = otherAudioElem.currentTime;
    const beatStart = syncList[otherIndex]?.[0][0] as number;

    const currentBeat = Math.round((currentTime - beatStart) / interval);
    const offset = currentTime - currentBeat * interval;

    const enterTime = audioElem.currentTime;
    const enterBeatStart = syncList[index]?.[0][0] as number;
    const enterBeat = Math.round((enterTime - enterBeatStart) / interval);

    audioElem.currentTime = enterBeat * interval + offset;
  }
}

export default initAudio;

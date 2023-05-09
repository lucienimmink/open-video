import './index.css';

const getPreferredHeight = (video) => {
  const chromeHeight = window.outerHeight - window.innerHeight;
  return window.height < video.videoHeight
    ? window.height
    : video.videoHeight + chromeHeight;
};
const getPreferredWidth = (video) => {
  return window.width < video.videoWidth ? window.width : video.videoWidth;
};

async function playVideo(fileHandle, file = null) {
  const errorBanner = document.querySelector(".error-banner");
  errorBanner.classList.add("hidden");
  const video = document.querySelector("video");
  const fileData = file || await fileHandle.getFile();
  video.src = URL.createObjectURL(fileData);
  video.controls = true;
  video.play();

  video.onloadedmetadata = () => {
    document.title = `${fileData.name}`;
    window.resizeTo(getPreferredWidth(video), getPreferredHeight(video));
  };

  video.onerror = () => {
    const errorBanner = document.querySelector(".error-banner");
    errorBanner.querySelector(".error-message").textContent =
      "Error occurred while trying to play " + fileData.name;
    errorBanner.classList.remove("hidden");
  };
}

if ("launchQueue" in window) {
  window.launchQueue.setConsumer((launchParams) => {
    if (launchParams.files && launchParams.files.length) {
      playVideo(launchParams.files[0]);
    }
    if (launchParams.targetURL) {
      const query = new URL(launchParams.targetURL).searchParams;
      const open = query.get('open');
      if (open) {
        const fileSelectElement = document.querySelector("input[type=file]");
        fileSelectElement.click();
      } 
    }
  });
}

const dropElement = document.querySelector("video");
dropElement.addEventListener("dragover", (event) => { event.preventDefault(); dropElement.classList.add('dropping') } );
dropElement.addEventListener("dragleave", (event) => { event.preventDefault(); dropElement.classList.remove('dropping') } );
dropElement.addEventListener("drop", async (event) => { 
  event.preventDefault();
  dropElement.classList.remove('dropping')
  const fileHandle = await event.dataTransfer.items[0].getAsFileSystemHandle();
  playVideo(fileHandle);
} );

const fileSelectElement = document.querySelector("input[type=file]");
fileSelectElement.addEventListener("change", async (event) => { 
  console.log(fileSelectElement.files[0]);
  playVideo(null, fileSelectElement.files[0]);
 });
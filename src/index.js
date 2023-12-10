import './index.css';

const getPreferredHeight = video => {
  const chromeHeight = window.outerHeight - window.innerHeight;
  return window.height < video.videoHeight
    ? window.height
    : video.videoHeight + chromeHeight;
};
const getPreferredWidth = video => {
  return window.width < video.videoWidth ? window.width : video.videoWidth;
};

async function playVideo(fileHandle, file = null) {
  const errorBanner = document.querySelector('.error-banner');
  errorBanner.classList.add('hidden');
  const video = document.querySelector('video');
  const fileData = file || (await fileHandle.getFile());
  video.src = URL.createObjectURL(fileData);
  video.controls = true;
  video.play();

  video.onloadedmetadata = () => {
    document.title = `${fileData.name}`;
    window.resizeTo(getPreferredWidth(video), getPreferredHeight(video));
  };

  video.onerror = () => {
    const errorBanner = document.querySelector('.error-banner');
    errorBanner.querySelector('.error-message').textContent =
      'Error occurred while trying to play ' + fileData.name;
    errorBanner.classList.remove('hidden');
  };

  video.onpause = () => {
    document.title = `Paused: ${fileData.name}`;
  };
  video.onplay = () => {
    document.title = `${fileData.name}`;
  };
  video.oncontrols = () => {
    console.log('controls?');
  };
}

if ('launchQueue' in window) {
  window.launchQueue.setConsumer(launchParams => {
    if (launchParams.files && launchParams.files.length) {
      playVideo(launchParams.files[0]);
    }
  });
}

const dropElement = document.querySelector('video');
dropElement.addEventListener('dragover', event => {
  event.preventDefault();
  dropElement.classList.add('dropping');
});
dropElement.addEventListener('dragleave', event => {
  event.preventDefault();
  dropElement.classList.remove('dropping');
});
dropElement.addEventListener('drop', async event => {
  event.preventDefault();
  dropElement.classList.remove('dropping');
  const fileHandle = await event.dataTransfer.items[0].getAsFileSystemHandle();
  playVideo(fileHandle);
});

const fileSelectElement = document.querySelector('input[type=file]');
fileSelectElement.addEventListener('change', () => {
  playVideo(null, fileSelectElement.files[0]);
});

window.addEventListener('keydown', event => {
  const video = document.querySelector('video');
  const feedback = document.querySelector('.key-feedback');
  event.preventDefault();

  document.getAnimations().forEach(animation => {
    animation.cancel();
  });
  video.controls = false;

  let showOverlay = true;

  switch (event.key) {
    case 'ArrowLeft':
      if (video.currentTime > 5) video.currentTime -= 5;
      feedback.textContent = '⏪';
      break;
    case 'ArrowRight':
      if (video.currentTime < video.duration - 5) video.currentTime += 5;
      feedback.textContent = '⏩';
      break;
    case 'ArrowUp':
      if (video.volume < 0.95) video.volume += 0.05;
      feedback.textContent = '🔊';
      break;
    case 'ArrowDown':
      if (video.volume > 0.05) video.volume -= 0.05;
      feedback.textContent = '🔉';
      break;
    case ' ':
      if (video.paused) {
        video.play();
        feedback.textContent = '▶️';
      } else {
        video.pause();
        feedback.textContent = '⏸';
      }
      break;
    default:
      showOverlay = false;
  }
  if (showOverlay) {
    const animation = feedback.animate(
      { opacity: [1, 0] },
      { duration: 1000, fill: 'forwards', easing: 'ease-in' },
    );
    animation.onfinish = () => {
      video.controls = true;
    };
  }
});

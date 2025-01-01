import { useState, useEffect } from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import Library from './components/Library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faInstagram, faFacebookF, faSoundcloud, faYoutube } from '@fortawesome/free-brands-svg-icons';

const App = () => {
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [profile, setProfile] = useState(null)

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  const previousSong = () => {
    setIsPlaying(false);
    let songInt = currentSong - 1;
    setCurrentSong(songInt);
    if (songInt < 0) {
      setCurrentSong(songs.length - 1);
    }
  };

  const nextSong = () => {
    setIsPlaying(false);
    let songInt = currentSong + 1;
    setCurrentSong(songInt);
    if (songInt >= songs.length) {
      setCurrentSong(0);
    }
  };

  const handleDataFromChild = (data) => {
    setCurrentSong(data);
  };

  const convertTime = (seconds) => {
    seconds = Math.floor(seconds);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    let time = '';
    if (hours > 0) {
      time += `${hours}:`;
    }
    if (minutes > 0 || hours > 0) {
      time += `${minutes}:`;
    }
    time += `${remainingSeconds.toString().padStart(2, '0')}`;
    return time.trim();
  };

  useEffect(() => {
    setSongs(window.wpData.songs);
    setProfile(window.wpData.profile);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (songs.length > 0) {
      songs.forEach((e) => {
        const audio = new Audio(e.url);
        audio.onloadedmetadata = () => {
          e.duration = convertTime(audio.duration);
        };
      });
    }
  }, [songs]);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="app-container roboto-regular">
      <div className="app-library border-effect">
        <Library songs={songs} currentSong={currentSong} isPlaying={isPlaying} sendDataToParent={handleDataFromChild} />

        <div className="controls-container">
          <div className="wavesurfer-container">
            {songs.length > 0 && (
              <WavesurferPlayer
                height={50}
                width={590}
                waveColor={'#494d5f'}
                progressColor={'#8458B3'}
                barWidth="3"
                barGap="2"
                url={songs[currentSong].url}
                onReady={(ws) => setWavesurfer(ws)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            )}
          </div>
          <div className="controls-buttons-container">
            <div className="controls-play-buttons">
              <button onClick={previousSong}>
                <span className="material-symbols-outlined">skip_previous</span>
              </button>
              <button onClick={onPlayPause}>
                <span className="material-symbols-outlined large-button">
                  {isPlaying ? 'pause_circle' : 'play_circle'}
                </span>
              </button>
              <button onClick={nextSong}>
                <span className="material-symbols-outlined">skip_next</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside className="border-effect">
        <div className="profile-image">
          <img src={profile.image} alt="Br&en" />
        </div>

        <div className="profile-share-links">
          <ul>
            <li>
              <a target='_blank' href="">
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
            </li>
            <li>
              <a target='_blank' href="">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </li>
            <li>
              <a target='_blank' href="">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
            </li>
            <li>
              <a target='_blank' href="">
                <FontAwesomeIcon icon={faSoundcloud} />
              </a>
            </li>
            <li>
              <a target='_blank' href="">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </li>
          </ul>
        </div>

        <div className="profile-description" dangerouslySetInnerHTML={{__html: profile.content}}>

        </div>
      </aside>
    </div>
  );
};

export default App;

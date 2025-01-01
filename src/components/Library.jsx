const Library = ({songs, currentSong, isPlaying, sendDataToParent}) => {
    const updateCurrentSong = (data) => {
        sendDataToParent(data)
    }

    const changeSong = (e) => {
        if (!e.target.classList.contains('song-container')) 
        e.target = e.target.closest('.song-container')
        updateCurrentSong(e.target.value)
    }

    const CurrentSongPlaying = (index) => {
        console.log(index.song)
        if (currentSong == index.song) {
            if (isPlaying) {
                return <span>Playing - </span>
            }
        }
    }

    const isSelected = (index) => {
        if (currentSong == index) {
            return ' is-selected'
        }
        return ''
    }

    return <div className="library-container">
        <ul>
        {songs.map((e, index) => (
            <li className={"song-container" + isSelected(index)} key={index} value={index} onClick={changeSong}>
                <div className="song-image">
                    <img style={{width:'100px'}} src={e.image} alt={e.title} />
                </div>

                <div className="song-content">
                    <h2 className="plus-jakarta-sans">{e.title}</h2>
                    <span>{e.duration}</span>
                    <CurrentSongPlaying song={index}/>
                </div>
                
            </li>
        ))}
        </ul>
    </div>
}

export default Library;
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
        if (isPlaying) {
            return <span>Playing - </span>
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
                    <img style={{width:'100px'}} src={e.artUrl} alt={e.title} />
                </div>

                <div className="song-content">
                    {currentSong === index && (
                        <span>
                            <span>Selected - </span>
                            <CurrentSongPlaying/>
                        </span>
                    )}
                    {e.title} - {e.duration} 
                </div>
                
            </li>
        ))}
        </ul>
    </div>
}

export default Library;
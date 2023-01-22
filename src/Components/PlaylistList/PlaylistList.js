import React from 'react';
import './PlaylistList.css';

class PlaylistList extends React.Component {
	componentDidMount() {
		this.props.getUserPlaylist();
	}
	componentDidUpdate() {
		this.props.getUserPlaylist();
	}
	render() {
		return (
			<div className='PlaylistList'>
				<h2>Existing Playlists</h2>
				<div className='PlaylistListList'>
					{this.props.playlistList.map((playlist) => {
						return (
							<div
								className='PlaylistListItem'
								key={playlist.playlistId}>
								<div className='PlaylistListItem-information'>
									<h3>{playlist.name}</h3>
									<p>{playlist.playlistId}</p>
									<p>{playlist.userId}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

export default PlaylistList;

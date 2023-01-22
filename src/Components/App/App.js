import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import PlaylistList from '../PlaylistList/PlaylistList';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchResults: [],
			playlistTracks: [],
			playlistName: 'Hype List',
			playlistList: [],
		};
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
		this.search = this.search.bind(this);
		this.getUserPlaylist = this.getUserPlaylist.bind(this);
	}
	addTrack(track) {
		let currentTracks = this.state.playlistTracks;
		if (currentTracks.find((savedTrack) => savedTrack.id === track.id)) {
			return;
		}
		currentTracks.push(track);
		this.setState({
			playlistTracks: currentTracks,
		});
	}
	removeTrack(track) {
		let currentTracks = this.state.playlistTracks;
		currentTracks = currentTracks.filter((currentTrack) => currentTrack.id !== track.id);
		this.setState({
			playlistTracks: currentTracks,
		});
	}
	updatePlaylistName(name) {
		this.setState({
			playlistName: name,
		});
	}
	savePlaylist() {
		const trackUris = this.state.playlistTracks.map((track) => track.uri);
		Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
			this.setState({
				playlistName: 'New Playlist',
				playlistTracks: [],
			});
		});
	}
	search(term) {
		Spotify.search(term).then((searchResults) => {
			this.setState({
				searchResults: searchResults,
			});
		});
	}
	getUserPlaylist() {
		Spotify.getUserPlaylist().then((playlistList) => {
			this.setState({
				playlistList: playlistList,
			});
		});
	}
	render() {
		return (
			<div>
				<h1>
					Ja<span className='highlight'>mmm</span>ing
				</h1>
				<div className='App'>
					<SearchBar onSearch={this.search} />

					<div className='App-playlist'>
						<PlaylistList
							getUserPlaylist={this.getUserPlaylist}
							playlistList={this.state.playlistList}
						/>
						<SearchResults
							searchResults={this.state.searchResults}
							onAdd={this.addTrack}
						/>
						<Playlist
							onNameChange={this.updatePlaylistName}
							playlistTracks={this.state.playlistTracks}
							playlistName={this.state.playlistName}
							onRemove={this.removeTrack}
							onSave={this.savePlaylist}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default App;

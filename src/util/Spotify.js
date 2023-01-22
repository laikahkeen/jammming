let accessToken;
let userId;
let headers;
let redirectUrl;
const clientId = 'b8acf62c4bce43279a942a24b0ad8851';

if (window.location == 'http://localhost:3000/') {
	redirectUrl = 'http://localhost:3000/';
} else {
	redirectUrl = 'https://laikahkeen.github.io/jammming/';
}

const Spotify = {
	getAccessToken() {
		if (accessToken) {
			headers = { Authorization: `Bearer ${accessToken}` };
			return;
		}
		const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
		const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
		if (accessTokenMatch && expiresInMatch) {
			accessToken = accessTokenMatch[1];
			const expiresIn = Number(expiresInMatch[1]);
			window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			headers = { Authorization: `Bearer ${accessToken}` };
			return;
		}

		window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
	},
	search(term) {
		Spotify.getAccessToken();

		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
			headers: headers,
		})
			.then((response) => response.json())
			.then((jsonResponse) => {
				if (!jsonResponse.tracks) {
					return [];
				}
				return jsonResponse.tracks.items.map((track) => ({
					id: track.id,
					name: track.name,
					artist: track.artists[0].name,
					album: track.album.name,
					uri: track.uri,
				}));
			});
	},
	getUserCurrentUserId() {
		if (userId) {
			return;
		}

		Spotify.getAccessToken();

		return fetch('https://api.spotify.com/v1/me', { headers: headers })
			.then((response) => response.json())
			.then((jsonResponse) => {
				userId = jsonResponse.id;
				return;
			});
	},
	savePlaylist(name, trackUris) {
		if (!name || !trackUris.length) {
			return;
		}

		Spotify.getAccessToken();
		Spotify.getUserCurrentUserId();

		return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
			headers: headers,
			method: 'POST',
			body: JSON.stringify({ name: name }),
		})
			.then((response) => response.json())
			.then((jsonResponse) => {
				const playlistId = jsonResponse.id;
				return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
					headers: headers,
					method: 'POST',
					body: JSON.stringify({
						uris: trackUris,
					}),
				});
			});
	},
	getUserPlaylist() {
		Spotify.getUserCurrentUserId();
		return fetch(`https://api.spotify.com/v1/users/${userId}/playlists `, {
			headers: headers,
		})
			.then((response) => response.json())
			.then((jsonResponse) => {
				return jsonResponse.items.map((item) => ({
					playlistId: item.id,
					name: item.name,
					userId: item.public,
				}));
			});
	},
};

export default Spotify;

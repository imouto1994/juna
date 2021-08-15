const got = require("got");

const TOKEN =
  "BQCnRq3t1Nm94I_OXNWgDa2n9Wd68X-zK5w9VjItN4Fh5mOU3SbRe0cpkfpl32-AD7G4RICI-oH3aXwMqIWc1iwDcFLJjdRSAbnLzDlpqeDLvWMkMaTF3uRDClUEHXrJeh6yxjqRfp9J20-6b9GLxm9Ge73jzOoetznQjV-r7WZfebW0dug1EkPFdQRG12tk2OMtM2DsoOMF1Q49vDYLkeKmjgbaGvo3XdMnL6u2x608fSqG_2IKJbQ9lkmcejQGkqLjGwk1tR0IakGCDZJFY1-VZsP92YgPLLGDvKimZIXwWnLt0WEIV7A_";

(async () => {
  const tracks = [];
  let url =
    "https://api.spotify.com/v1/playlists/2DPebk3hCS3jo4uAY4xgZ9/tracks?offset=0&limit=100&additional_types=track%2Cepisode&market=from_token";
  while (url != null) {
    const result = await got(url, {
      headers: {
        authorization: `Bearer ${TOKEN}`,
      },
    }).json();
    tracks.push(...result.items);
    url = result.next;
  }

  const map = {};
  for (const trackInfo of tracks) {
    const { track } = trackInfo;
    if (map[track.name] == null) {
      map[track.name] = [];
      map[track.name].push(track);
    } else {
      let hasDuplicate = false;
      for (const existingTrack of map[track.name]) {
        if (existingTrack.artists[0].name === track.artists[0].name) {
          hasDuplicate = true;
        }
      }
      if (hasDuplicate) {
        console.log("Found duplicate", track.name, track.artists[0].name);
      } else {
        map[track.name].push(track);
      }
    }
  }
})();

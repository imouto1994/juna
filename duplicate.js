const got = require("got");

const TOKEN =
  "BQCam3mrQjJBCfhyWDD26iH-6wc7vEH8tixfruvztJgBnd7ifgf_2oscjGuovZo1A-jV7FKKzM_PicWgoPwRhJdPFjdcItiON_MteHL6Rmu4zECpbVVNw4NKM_J_gpC9K_V3wuahRC7Pc90FVdD7trlI9-sU2w-qsL6j2rkuuXztGIuYppicr-NU9Nz0OqcCmHfcsOcnFUtpZ0RY7VSuEALdHdHrldlJOS4DHMcgeRUE2I1R_Rcgh-OgayakW6MD33JFrndzqJdgsTXub_2bgQj-qcgOx7zTPAUipH7my5mucEvVInnAfdaI";

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
      console.log("Same name...", track.name, map[track.name].length);
      let hasDuplicate = false;
      for (const existingTrack of map[track.name]) {
        if (existingTrack.artists[0].name === track.artists[0].name) {
          hasDuplicate = true;
        }
      }
      if (hasDuplicate) {
        console.log("Found duplicate!", track.name, track.artists[0].name);
      } else {
        map[track.name].push(track);
      }
    }
  }
})();

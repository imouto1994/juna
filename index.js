const got = require("got");

const TOKEN =
  "BQCam3mrQjJBCfhyWDD26iH-6wc7vEH8tixfruvztJgBnd7ifgf_2oscjGuovZo1A-jV7FKKzM_PicWgoPwRhJdPFjdcItiON_MteHL6Rmu4zECpbVVNw4NKM_J_gpC9K_V3wuahRC7Pc90FVdD7trlI9-sU2w-qsL6j2rkuuXztGIuYppicr-NU9Nz0OqcCmHfcsOcnFUtpZ0RY7VSuEALdHdHrldlJOS4DHMcgeRUE2I1R_Rcgh-OgayakW6MD33JFrndzqJdgsTXub_2bgQj-qcgOx7zTPAUipH7my5mucEvVInnAfdaI";

function delay(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function compare(trackInfoA, trackInfoB) {
  const { track: trackA } = trackInfoA;
  const { track: trackB } = trackInfoB;

  const artistA = trackA.artists[0].name;
  const artistB = trackB.artists[0].name;
  if (artistA !== artistB) {
    return (artistA > artistB) - (artistA < artistB);
  }

  const albumA = trackA.album.name;
  const albumB = trackB.album.name;
  if (albumA !== albumB) {
    return (albumA > albumB) - (albumA < albumB);
  }

  return (trackA.name > trackB.name) - (trackA.name < trackB.name);
}

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

  for (let i = 1; i < tracks.length; i++) {
    const track = tracks[i];
    let j = i - 1;
    while (j >= 0 && compare(tracks[j], track) > 0) {
      tracks[j + 1] = tracks[j];
      j = j - 1;
    }
    if (j + 1 !== i) {
      tracks[j + 1] = track;
      await got.put(
        "https://api.spotify.com/v1/playlists/2DPebk3hCS3jo4uAY4xgZ9/tracks",
        {
          json: {
            range_start: i,
            range_length: 1,
            insert_before: j + 1,
          },
          headers: {
            authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      console.log(`Insert track ${i} to index ${j + 1}`);
      await delay(1000);
    }
  }
})();

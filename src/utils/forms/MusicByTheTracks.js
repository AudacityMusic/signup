import { useState } from "react";
import LibraryMusicHour from "./LibraryMusicHour";

export default class MusicByTheTracks extends LibraryMusicHour {
  constructor(date, location, navigation, scrollObject) {
    super(date, location, navigation, scrollObject);

    this.title = "Music by the Tracks";
    this.timeLimit = useState(10);
  }
}

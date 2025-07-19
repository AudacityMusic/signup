import { useState } from "react";
import LibraryMusicHour from "./LibraryMusicHour";

export default class MusicByTheTracks extends LibraryMusicHour {
  constructor(date, location, navigation, scrollRef) {
    // Call LibraryMusicHour constructor to set up base questions/state
    super(date, location, navigation, scrollRef);
    // Override form title for configuration and submission
    this.title = "Music by the Tracks";
    // Override default time limit specific to this form
    this.timeLimit = useState(10);
  }

  /**
   * Override to remove ensemble profile question not needed for this form
   */
  questions() {
    // Get base questions from LibraryMusicHour
    const base = super.questions();
    // Filter out ensembleProfile
    return base.filter((q) => q.name !== "ensembleProfile");
  }
}

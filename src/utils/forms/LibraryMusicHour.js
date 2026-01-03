/**
 * LibraryMusicHour.js
 * Form class for the 'Library Music Hour' signup form.
 * Extends base Form to define specific questions and validation logic.
 * Fields include performer info, music selection, performance type, and permissions.
 */

import { useEffect, useState } from "react";

import {
  Question,
  emptyQuestionState,
  getUser,
  isAtLeast,
  isNotEmpty,
} from "..";
import Form from "./Form";

import CheckBoxQuery from "../../components/CheckBoxQuery";
import MultipleChoice from "../../components/MultipleChoice";
import TextField from "../../components/TextField";
import UploadButton from "../../components/UploadButton";

export default class LibraryMusicHour extends Form {
  /**
   * @param {string} date - event date string
   * @param {string} location - event location
   * @param {object} navigation - React Navigation prop
   * @param {object} scrollRef - ref for auto-scrolling on validation errors
   */
  constructor(date, location, navigation, scrollRef) {
    // Initialize base Form with title, date, location, navigation, and scroll behavior
    super("Library Music Hour", date, location, navigation, scrollRef);

    // Question states: [stateValue, setState] hooks for each input
    this.fullName = emptyQuestionState(); // Performer's name

    // Prefill fullName from stored user on mount
    useEffect(() => {
      (async () => {
        const user = await getUser();
        this.fullName[1]((prev) => ({ ...prev, value: user?.name }));
      })();
    }, []);

    // Other fields
    this.city = emptyQuestionState(); // City of residence
    this.phoneNumber = emptyQuestionState(); // Contact number
    this.age = emptyQuestionState(); // Performer age
    this.musicPiece = emptyQuestionState(); // Music piece name
    this.composer = emptyQuestionState(); // Composer name
    this.instrument = emptyQuestionState(); // Instrument type
    this.performanceType = emptyQuestionState(); // Radio choice for performance type
    this.length = emptyQuestionState(); // Performance length input
    this.recordingLink = emptyQuestionState(); // Link to recording
    this.backgroundLink = emptyQuestionState(); // Link to background music
    this.publicPermission = emptyQuestionState(); // Public sharing consent
    this.parentalConsent = emptyQuestionState(); // Parental consent
    this.pianoAccompaniment = emptyQuestionState(); // Accompaniment option
    this.ensembleProfile = emptyQuestionState(); // Ensemble profile if ensemble
    this.otherInfo = emptyQuestionState(); // Additional notes

    // State for time limit selection based on performance type
    this.timeLimit = useState(0);

    // Mapping of performance options to time limits (minutes)
    this.performanceOptions = {
      "Individual performance only": 8,
      "Individual performance and music instrument presentation": 12,
      "Group performance only": 15,
      "Group performance and music instrument presentation": 20,
      "Library Band Ensemble (Band, Orchestra, or Choir)": 60,
    };
  }

  /**
   * Define form questions array with labels, components, and validation.
   * Uses Question helper to bind component, state, and validation.
   * @returns {Question[]} array of question definitions
   */
  questions() {
    const questions = [
      new Question({
        name: "fullName",
        component: (
          <TextField
            title="Performer's Full Name"
            key="fullName"
            state={this.fullName[0]}
            setState={this.fullName[1]}
          />
        ),
        validate: (value) => value.trim().split(" ").length >= 2,
      }),

      new Question({
        name: "city",
        component: (
          <TextField
            title="City of Residence"
            key="city"
            state={this.city[0]}
            setState={this.city[1]}
          />
        ),
        validate: isNotEmpty,
      }),

      new Question({
        name: "phoneNumber",
        component: (
          <TextField
            title="Phone Number"
            keyboardType="phone-pad"
            maxLength={20}
            key="phoneNumber"
            state={this.phoneNumber[0]}
            setState={this.phoneNumber[1]}
          />
        ),
        validate: (value) => isAtLeast(value, 10),
      }),

      new Question({
        name: "age",
        component: (
          <TextField
            title="Performer's Age"
            keyboardType="numeric"
            key="age"
            state={this.age[0]}
            setState={this.age[1]}
          />
        ),
        validate(value) {
          const age = Number(value);
          if (isNaN(age)) {
            return false;
          }
          return age >= 5 && age <= 125;
        },
      }),

      new Question({
        name: "musicPiece",
        component: (
          <TextField
            title="Name of Music Piece"
            key="musicPiece"
            state={this.musicPiece[0]}
            setState={this.musicPiece[1]}
          />
        ),
        validate: isNotEmpty,
      }),

      new Question({
        name: "composer",
        component: (
          <TextField
            title="Name of Composer"
            key="composer"
            state={this.composer[0]}
            setState={this.composer[1]}
          />
        ),
        validate: isNotEmpty,
      }),

      new Question({
        name: "instrument",
        component: (
          <TextField
            title="Instrument Type"
            key="instrument"
            state={this.instrument[0]}
            setState={this.instrument[1]}
          />
        ),
        validate: isNotEmpty,
      }),

      this.title == "Library Music Hour"
        ? new Question({
            name: "performanceType",
            component: (
              <MultipleChoice
                title="Performance Type"
                options={Object.keys(this.performanceOptions)}
                onSelect={(option) => {
                  this.performanceType[1]((prevState) => ({
                    ...prevState,
                    value: option,
                  }));
                  this.timeLimit[1](this.performanceOptions[option]);
                }}
                key="performanceType"
                state={this.performanceType[0]}
                setState={this.performanceType[1]}
              />
            ),
            validate: isNotEmpty,
          })
        : null,

      new Question({
        name: "length",
        component: (
          <TextField
            title="Length of Performance (mins)"
            subtitle={`Time Limit: ${this.timeLimit[0]} minutes`}
            keyboardType="numeric"
            key="length"
            state={this.length[0]}
            setState={this.length[1]}
          />
        ),
        validate: function (value) {
          const time = Number(value);
          if (isNaN(time)) {
            return false;
          }
          return time > 0 && time <= this.timeLimit[0];
        }.bind(this),
      }),

      new Question({
        name: "recordingLink",
        component: (
          <TextField
            title="Recording Link"
            keyboardType="url"
            key="recordingLink"
            state={this.recordingLink[0]}
            setState={this.recordingLink[1]}
          />
        ),
        validate(value) {
          try {
            new URL(value);
          } catch {
            return false;
          }
          return true;
        },
      }),

      new Question({
        name: "backgroundLink",
        component: (
          <TextField
            title="Background Music Link (optional)"
            keyboardType="url"
            key="backgroundLink"
            state={this.backgroundLink[0]}
            setState={this.backgroundLink[1]}
          />
        ),
        validate(value) {
          if (value == null || value.trim() === "") {
            return true;
          }
          try {
            new URL(value);
          } catch {
            return false;
          }
          return true;
        }
      }),

      new Question({
        name: "publicPermission",
        component: (
          <CheckBoxQuery
            question="Do you give permission for Audacity Sign Up to post recordings of your performance on public websites?"
            key="publicPermission"
            state={this.publicPermission[0]}
            setState={this.publicPermission[1]}
          />
        ),
        validate: (value) => value != null,
      }),

      new Question({
        name: "parentalConsent",
        component: (
          <CheckBoxQuery
            question="My parent has given their consent for my participation."
            key="parentalConsent"
            state={this.parentalConsent[0]}
            setState={this.parentalConsent[1]}
            showNo={false}
          />
        ),
        validate: (value) => value == "Yes",
        isVisible: () => this.age[0].value < 18,
      }),

      new Question({
        name: "pianoAccompaniment",
        component: (
          <UploadButton
            title="Our volunteer piano accompanist can provide sight reading accompaniment for entry level players. To request this service, upload the main score AND accompaniment score in one PDF file."
            key="pianoAccompaniment"
            state={this.pianoAccompaniment[0]}
            setState={this.pianoAccompaniment[1]}
            navigation={this.navigation}
          />
        ),
        validate: () => this.pianoAccompaniment[0].value != "Uploading",
      }),

      this.title == "Library Music Hour"
        ? new Question({
            name: "ensembleProfile",
            component: (
              <UploadButton
                title="Upload your Library Band Ensemble profile as one PDF file."
                key="ensembleProfile"
                state={this.ensembleProfile[0]}
                setState={this.ensembleProfile[1]}
                navigation={this.navigation}
                required={true}
              />
            ),

            isVisible: () =>
              this.performanceType[0].value?.includes("Ensemble"),

            validate: () =>
              this.ensembleProfile[0].value != null &&
              this.ensembleProfile[0].value != "Uploading",
          })
        : null,

      new Question({
        name: "otherInfo",
        component: (
          <TextField
            title="Other Information (optional)"
            key="otherInfo"
            state={this.otherInfo[0]}
            setState={this.otherInfo[1]}
          />
        ),
      }),
    ];

    return questions.filter((question) => question != null);
  }
}

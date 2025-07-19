/**
 * DanceClub.js
 * Form class for the 'Audacity Dance Club' sign-up.
 * - Extends base Form to define dance club specific questions and state
 * - Fields include full name, contact, favorite pieces, age group, styles, and consents
 */

import { useEffect } from "react";

import {
  Question,
  emptyQuestionState,
  getUser,
  isAtLeast,
  isExactly,
  isNotEmpty,
} from "..";
import Form from "./Form";

import CheckBoxQuery from "../../components/CheckBoxQuery";
import MultipleChoice from "../../components/MultipleChoice";
import MultiSelect from "../../components/MultiSelect";
import TextField from "../../components/TextField";
import TextFieldGroup from "../../components/TextFieldGroup";

export default class DanceClub extends Form {
  /**
   * @param {string} date - event date
   * @param {string} location - event location
   * @param {object} navigation - React Navigation instance
   * @param {object} scrollRef - ref for scroll-to-error behavior
   */
  constructor(date, location, navigation, scrollRef) {
    // Initialize base form with title and context
    super("Audacity Dance Club", date, location, navigation, scrollRef);

    // State hooks for each question
    this.fullName = emptyQuestionState(); // Performer name
    useEffect(() => {
      // Prefill name if available
      (async () => {
        const user = await getUser();
        this.fullName[1]((prev) => ({ ...prev, value: user?.name }));
      })();
    }, []);
    this.phoneNumber = emptyQuestionState(); // Contact number
    this.favoritePieces = emptyQuestionState(["", "", "", ""]); // Top 4 music pieces
    this.age = emptyQuestionState(); // Age selection
    this.favoriteDanceStyles = emptyQuestionState([]); // Styles selection
    this.consent = emptyQuestionState(); // Liability consent
    this.recording = emptyQuestionState(); // Recording consent
  }

  /**
   * Build array of Question objects with UI components and validation logic
   * @returns {Question[]}
   */
  questions() {
    return [
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
        name: "favoritePieces",
        component: (
          <TextFieldGroup
            title="Your 4 Favorite Pieces of Music"
            key="favoritePieces"
            n={4}
            state={this.favoritePieces[0]}
            setState={this.favoritePieces[1]}
          />
        ),
        validate(pieces) {
          for (const piece of pieces) {
            if (!isNotEmpty(piece)) {
              return false;
            }
          }
          return true;
        },
      }),

      new Question({
        name: "age",
        component: (
          <MultipleChoice
            title="Your Age"
            options={[
              "Under 10",
              "10-15",
              "16-20",
              "21-40",
              "41-60",
              "61-80",
              "81-100",
            ]}
            onSelect={(value) => {
              this.age[1]((prevState) => ({ ...prevState, value: value }));
            }}
            key="age"
            state={this.age[0]}
            setState={this.age[1]}
          />
        ),
        validate: isNotEmpty,
      }),

      new Question({
        name: "favoriteDanceStyles",
        component: (
          <MultiSelect
            title="Your 4 Favorite Dance Styles"
            options={[
              "Ballet",
              "Bollywood",
              "Contemporary",
              "Fitness",
              "Kpop",
              "Latin",
              "Lyrical",
            ]}
            key="favoriteDanceStyles"
            state={this.favoriteDanceStyles[0]}
            setState={this.favoriteDanceStyles[1]}
            required={true}
          />
        ),
        validate: (value) => isExactly(value, 4),
      }),

      new Question({
        name: "consent",
        component: (
          <CheckBoxQuery
            question="I am committed to holding the volunteer instructor and organizer harmless"
            key="consent"
            state={this.consent[0]}
            setState={this.consent[1]}
            showNo={false}
          />
        ),
        validate: (value) => value == "Yes",
      }),

      new Question({
        name: "recording",
        component: (
          <CheckBoxQuery
            question={
              "We will record our event and place them on our website. " +
              "Maximum efforts will be made to avoid showing faces of the participants, " +
              "but we can't guarantee it can be avoided completely. " +
              "I consent to my and/or my child's image being recorded/filmed and " +
              "allow the product to be used for promotional purposes in any way ADC sees fit, " +
              "including on social media. I also understand that ADC retains full ownership " +
              "of these images and/or videos."
            }
            key="recording"
            state={this.recording[0]}
            setState={this.recording[1]}
            showNo={false}
          />
        ),
        validate: (value) => value == "Yes",
      }),
    ];
  }
}

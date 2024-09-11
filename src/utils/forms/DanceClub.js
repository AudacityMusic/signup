import { useEffect } from "react";
import { View } from "react-native";

import {
  Question,
  alertError,
  emptyQuestionState,
  getUser,
  isAtLeast,
  isExactly,
  isNotEmpty,
} from "..";
import Form from "./Form";

import TextField from "../../components/TextField";
import CheckBoxQuery from "../../components/CheckBoxQuery";
import MultipleChoice from "../../components/MultipleChoice";
import MultiSelect from "../../components/MultiSelect";

export default class DanceClub extends Form {
  constructor(date, location, navigation, scrollObject) {
    super("Audacity Dance Club", date, location, navigation, scrollObject);

    this.fullName = emptyQuestionState();

    useEffect(() => {
      (async () => {
        try {
          const user = await getUser();
          this.fullName[1]((prevState) => ({
            ...prevState,
            value: user?.name,
          }));
        } catch (error) {
          alertError("Unable to get user information in DanceClub: " + error);
        }
      })();
    }, []);

    this.phoneNumber = emptyQuestionState();
    this.favoritePieces = [
      emptyQuestionState(),
      emptyQuestionState(),
      emptyQuestionState(),
      emptyQuestionState(),
    ];
    this.age = emptyQuestionState();
    this.favoriteDanceStyles = emptyQuestionState([]);
    this.consent = emptyQuestionState();
    this.recording = emptyQuestionState();
  }

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
          <View key="favoritePiecesView">
            {this.favoritePieces.map((piece, index) => (
              <TextField
                title={index == 0 ? "Your 4 Favorite Pieces of Music" : ""}
                key={`favoritePieces${index}`}
                state={piece[0]}
                setState={piece[1]}
                extraMargin={index == 3}
                valid={this.favoritePieces.every((piece) => piece[0].valid)}
              />
            ))}
          </View>
        ),
        state: { value: this.favoritePieces, y: -1, valid: true },
        setState: (value) => {
          this.favoritePieces = value;
        },
        y: -1,
        validate: (value) => {
          let good = true;

          for (const [index, piece] of value.entries()) {
            const result = isNotEmpty(piece[0].value);
            const original = this.favoritePieces[index][0];
            this.favoritePieces[index][1]({ ...original, valid: result });
            good = good && result;
          }

          return good;
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
          />
        ),
        validate: (value) => value == "Yes",
      }),

      new Question({
        name: "consent",
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
          />
        ),
        validate: (value) => value == "Yes",
      }),
    ];
  }
}

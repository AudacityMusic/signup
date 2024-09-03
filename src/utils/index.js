import { useState, useEffect } from "react";
import { Alert, View, Platform } from "react-native";
import TextField from "../components/TextField";
import CheckBoxQuery from "../components/CheckBoxQuery";
import UploadButton from "../components/UploadButton";
import MultipleChoice from "../components/MultipleChoice";
import MultiSelect from "../components/MultiSelect";
import SlotList from "../components/Slot";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Constants from "expo-constants";

export function alertError(error) {
  console.error(error);
  Alert.alert(
    "Error",
    `Your request was not processed successfully due to an unexpected error. We apologize for the inconvenience. To help us identify and fix this error, please take a screenshot of this alert and send a bug report to ${Constants.expoConfig.extra.email}. Thank you!\n\nPlatform: ${Platform.OS} with v${Platform.Version}\n\n${error}`,
  );
}

export async function getUser() {
  try {
    const userString = await AsyncStorage.getItem("user");
    if (userString === null) {
      throw "EMPTY User";
    }
    return JSON.parse(userString);
  } catch (error) {
    console.error(error);
  }
}

export class Question {
  constructor({ name, component, validate = (_) => true, isVisible = () => true, state=null, setState=null, y=null}) {
    this.name = name;
    this.component = component;
    this.state = (state ? state : component.props.state);
    this.setState = (setState ? setState : component.props.setState);
    this.y = (y ? y : component.props.state.y);
    this.isVisible = isVisible;
    this.validate = () => !isVisible() || validate((state ? state : component.props.state).value);
  }
}

export function emptyQuestionState(initial = null) {
  return useState({ value: initial, y: null, valid: true });
}

export function hashForm(title, location, date) {
  return title + "&&&" + location + "&&&" + date;
}

export class FormString {
  constructor() {
    this.string = "";
    this.repr = "";
  }

  append(key, value) {
    if (this.string.length > 0) {
      this.string += "&";
      this.repr += "\n";
    }

    this.string += `entry.${key}=${encodeURIComponent(value)}`;
    this.repr += `entry.${key}=${value}`;
  }

  toString() {
    return this.string;
  }

  log() {
    return this.repr;
  }
}

export async function submitForm(formId, formData) {
  const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  console.log("Form Data: " + formData.log());

  try {
    console.log(formData.log());
    const response = await fetch(formUrl, {
      method: "POST",
      body: formData.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.ok) {
      return true;
    };
    console.log(response);
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

const isAtLeast = (value, len) => value ? (value.hasOwnProperty("trim") ? value.trim() : value).length >= len : false;
const isNotEmpty = (value) => isAtLeast(value, 1);
const isExactly = (value, len) => !isAtLeast(value, len + 1) && isAtLeast(value, len);

class Form {
  constructor(scrollObject) {
    this.scrollObject = scrollObject;
    this.form = null;
  }

  questions() {
    return [];
  }

  validate() {
    let allValid = true;
    let minInvalidY = Infinity;
  
    for (const question of this.questions()) {
      const isValid = question.validate();
      question.setState((prevState) => ({
        ...prevState,
        valid: isValid,
      }));
  
      if (!isValid) {
        allValid = false;
        if (question.y < minInvalidY) {
          minInvalidY = question.y;
        }
      }
    }
  
    if (!allValid) {
      this.scrollObject.scrollTo({
        x: 0,
        y: minInvalidY,
        animated: true,
      });
      return false;
    }
  
    return true;
  }
}

class MusicHour extends Form {
  constructor(title, date, location, navigation, scrollObject) {
    super(scrollObject);

    this.title = title;
    this.form = formEntryIDs[title];
    this.navigation = navigation;
    this.date = date;
    this.location = location;

    this.fullName = emptyQuestionState();

    useEffect(() => {
      (async () => {
        try {
          const user = await getUser();
          this.fullName[1]((prevState) => ({ ...prevState, value: user?.name }));
        } catch (error) {
          console.error(error);
        }
      })();
    }, []);

    this.city = emptyQuestionState();
    this.phoneNumber = emptyQuestionState();
    this.age = emptyQuestionState();
    this.musicPiece = emptyQuestionState();
    this.composer = emptyQuestionState();
    this.instrument = emptyQuestionState();
    this.performanceType = emptyQuestionState(); 
    this.length = emptyQuestionState();
    this.recordingLink = emptyQuestionState();
    this.publicPermission = emptyQuestionState();
    this.parentalConsent = emptyQuestionState();
    this.pianoAccompaniment = emptyQuestionState(); 
    this.ensembleProfile = emptyQuestionState();
    this.otherInfo = emptyQuestionState();
    this.timeLimit = useState(
      title == "Library Music Hour" ? 0 : 10,
    );
  
    this.performanceOptions = {
      "Individual performance only": 8,
      "Individual performance and music instrument presentation": 12,
      "Group performance only": 15,
      "Group performance and music instrument presentation": 20,
      "Library Band Ensemble (Band, Orchestra, or Choir)": 60,
    };
  }

  questions() {
    let questions = [
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
                options={this.performanceOptions}
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
        name: 'length',
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
        validate(value) {
          const time = Number(value);
          if (isNaN(time)) {
            return false;
          }
          // return time > 0 && time <= this.timeLimit[0];
          return time > 0;
        },
      }),
  
      new Question({
        name: 'recordingLink',
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
        name: "publicPermission",
        component: (
          <CheckBoxQuery
            question="Do you give permission for Audacity Music Club to post recordings of your performance on public websites?"
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
        // Only PDF files can be uploaded
        // Optional
        validate: () =>
          this.pianoAccompaniment[0].value == null ||
          this.pianoAccompaniment[0].value[1] <= 104857600, // There are 104,857,600 bytes in 100 MB
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
  
            isVisible: () => this.performanceType[0].value?.includes("Ensemble"),
  
            // Only PDF files can be uploaded
            // Required only if visible (selected ensemble option)
            validate: () =>
              this.ensembleProfile[0].value != null &&
              this.ensembleProfile[0].value <= 104857600, // There are 104,857,600 bytes in 100 MB
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
  
    questions = questions.filter((question) => question != null);
    return questions;  
  }

  async submit() {
    if (!super.validate()) {
      return;
    }

    const formData = new FormString();

    formData.append(this.form.location, this.location);
    formData.append(this.form.date, this.date);
    
    for (const question of this.questions()) {
      const value = this[question.name][0].value;
      formData.append(this.form[question.name], (value == null) ? "" : ((value.constructor === Array) ? value[0] : value));
    }

    console.log(formData.log());

    if (!submitForm(this.form.id, formData)) {
      this.navigation.navigate("End", { isSuccess: false });
      return;
    }

    try {
      const submittedForms = await AsyncStorage.getItem("submittedForms");
      const hash = hashForm(this.title, this.location, this.date);
      if (submittedForms == null) {
        await AsyncStorage.setItem("submittedForms", JSON.stringify([hash]));
      } else {
        const newForms = JSON.parse(submittedForms);
        newForms.push(hash);
        await AsyncStorage.setItem("submittedForms", JSON.stringify(newForms));
      }
    } catch (error) {
      console.error(`Unable to get/save submittedForms: ${error}`);
    }

    this.navigation.navigate("End", { isSuccess: true });
  }
}

class RequestConcert extends Form {
  constructor(scrollObject, navigation) {
    super(scrollObject);
    this.navigation = navigation;

    this.phoneNumber = emptyQuestionState();
    this.organization = emptyQuestionState();
    this.eventInfo = emptyQuestionState();
    this.venue = emptyQuestionState();
    this.publicity = emptyQuestionState();
    this.stipend = emptyQuestionState();
    this.donatable = emptyQuestionState();
    this.slots = emptyQuestionState([]);
    this.audience = emptyQuestionState();
    this.distance = emptyQuestionState();
    this.provided = emptyQuestionState([]);
    this.donationBox = emptyQuestionState();
    this.extraAudience = emptyQuestionState();
    this.otherInfo = emptyQuestionState();
  }

  questions() {
    return [
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
        name: "organization",
        component: (
          <TextField
            title="Organization Name & Description"
            key="organizationName"
            state={this.organization[0]}
            setState={this.organization[1]}
          />
        ),
        validate: isNotEmpty,
      }),
  
      new Question({
        name: "eventInfo",
        component: (
          <TextField
            title="Event Information"
            key="eventInfo"
            state={this.eventInfo[0]}
            setState={this.eventInfo[1]}
          />
        ),
        validate: isNotEmpty,
      }),
  
      new Question({
        name: "venue",
        component: (
          <TextField
            title="Venue Address & Information"
            key="venue"
            state={this.venue[0]}
            setState={this.venue[1]}
          />
        ),
        validate: isNotEmpty,
      }),
  
      new Question({
        name: 'publicity',
        component: (
          <MultipleChoice
            title="Is the event public or private?"
            options={["Public", "Private"]}
            onSelect={(option) => {
              this.publicity[1]((prevState) => ({ ...prevState, value: option }));
            }}
            key="publicity"
            state={this.publicity[0]}
            setState={this.publicity[1]}
          />
        ),
        validate: isNotEmpty,
      }),
  
      new Question({
        name: 'stipend',
        component: (
          <CheckBoxQuery
            question="Does your event come with a stipend?"
            key="stipend"
            state={this.stipend[0]}
            setState={this.stipend[1]}
          />
        ),
  
        validate: (value) => value != null,
      }),
  
      new Question({
        name: 'donatable',
        component: (
          <CheckBoxQuery
            question="Are you able to donate to our charitable cause?"
            key="donatable"
            state={this.donatable[0]}
            setState={this.donatable[1]}
          />
        ),
        validate: (value) => value != null,
      }),

      new Question({
        name: "slots",
        component: (
          <SlotList
            title="Possible Concert Times"
            key="slots"
            state={this.slots[0]}
            setState={this.slots[1]}
          />
        ),
  
        validate: (value) => {
          if (value.length == 0) {
            return false;
          }
  
          for (const slot of value) {
            if (!slot.validate()) {
              return false;
            }
          }
  
          return true;
        }
      }),
  
      new Question({
        name: 'audience',
        component: (
          <TextField
            title="Describe the audience"
            key="audience"
            state={this.audience[0]}
            setState={this.audience[1]}
          />
        ),
        validate: isNotEmpty,
      }),
  
      new Question({
        name: 'distance',
        component: (
          <TextField
            title="Distance from the parking lot to the stage (ft)"
            key="distance"
            keyboardType="numeric"
            state={this.distance[0]}
            setState={this.distance[1]}
          />
        ),
        validate: isNotEmpty,
      }),
  
      new Question({
        name: 'provided',
        component: (
          <MultiSelect
            title="You will provide a:"
            options={["Cart for Moving Equipment", "PA System", "Large Screen", "Chairs", "Labor", "Canopy", "Covered Stage"]}
            key="provided"
            state={this.provided[0]}
            setState={this.provided[1]}
          />
        ),
        validate: () => true,
      }),
  
      new Question({
        name: 'donationBox',
        component: (
          <CheckBoxQuery
            question="Permission for Donation Box for Charitable Causes (See Ongoing Charitable Donation Drives at www.goaudacity.com/projects)"
            key="donationBox"
            state={this.donationBox[0]}
            setState={this.donationBox[1]}
          />
        ),
        validate: (value) => value != null,
      }),
  
      new Question({
        name: 'extraAudience',
        component: (
          <CheckBoxQuery
            question="Permission to Draw in Our Own Audience"
            key="extraAudience"
            state={this.extraAudience[0]}
            setState={this.extraAudience[1]}
          />
        ),
        validate: (value) => value != null,
      }),
  
      new Question({
        name: 'otherInfo',
        component: (
          <TextField
            title="Other Information (optional)"
            key="otherInfo"
            state={this.otherInfo[0]}
            setState={this.otherInfo[1]}
          />
        )
      })
    ];
  }

  async submit() {
    if (!super.validate()) {
      return;
    }

    Alert.alert("Not Implemented", "The Request Concert form's submission has not been implemented yet. Please contact the IT Team.");
  }
}

class DanceClub extends Form{
  constructor(scrollObject, navigation) {
    super(scrollObject);
    this.navigation = navigation;

    this.fullName = emptyQuestionState();

    useEffect(() => {
      (async () => {
        try {
          const user = await getUser();
          this.fullName[1]((prevState) => ({ ...prevState, value: user?.name }));
        } catch (error) {
          console.error(error);
        }
      })();
    }, []);

    this.phoneNumber = emptyQuestionState();
    this.favoritePieces = [emptyQuestionState(), emptyQuestionState(), emptyQuestionState(), emptyQuestionState()];
    this.age = emptyQuestionState();
    this.favoriteDanceStyles = emptyQuestionState([]);
    this.consent = emptyQuestionState();
    this.recording = emptyQuestionState();
  }

  questions() {
    return [
      new Question({
        name: 'fullName',
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
        name: 'phoneNumber',
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
        name: 'favoritePieces',
        component: (
          <View>
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
        state: {value: this.favoritePieces, y: -1, valid: true},
        setState: (value) => {this.favoritePieces = value},
        y: -1,
        validate: (value) => {
          let good = true;

          for (const [index, piece] of value.entries()) {
            const result = isNotEmpty(piece[0].value); 
            const original = this.favoritePieces[index][0]; 
            this.favoritePieces[index][1]({...original, valid: result});
            good = good && result;
          };

          return good;
        }
      }),
  
      new Question({
        name: 'age',
        component: (
          <MultipleChoice
            title="Your Age"
            options={["Under 10", "10-15", "16-20", "21-40", "41-60", "61-80", "81-100"]}
            onSelect={(value) => {this.age[1]((prevState) => ({ ...prevState, value: value }))}}
            key="age"
            state={this.age[0]}
            setState={this.age[1]}
          />
        ),
        validate: isNotEmpty,
      }),
  
      new Question({
        name: 'favoriteDanceStyles',
        component: (
          <MultiSelect
            title="Your 4 Favorite Dance Styles"
            options={["Ballet", "Bollywood", "Contemporary", "Fitness", "Kpop", "Latin", "Lyrical"]}
            key="favoriteDanceStyles"
            state={this.favoriteDanceStyles[0]}
            setState={this.favoriteDanceStyles[1]}
          />
        ),
        validate: (value) => isExactly(value, 4),
      }),
  
      new Question({
        name: 'consent',
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
        name: 'consent',
        component: (
          <CheckBoxQuery
            question={"We will record our event and place them on our website. " + 
                      "Maximum efforts will be made to avoid showing faces of the participants, " +
                      "but we can't guarantee it can be avoided completely. " +
                      "I consent to my and/or my child's image being recorded/filmed and " +
                      "allow the product to be used for promotional purposes in any way ADC sees fit, " + 
                      "including on social media. I also understand that ADC retains full ownership " +
                      "of these images and/or videos."}
  
            key="recording"
            state={this.recording[0]}
            setState={this.recording[1]}
          />
        ),
        validate: (value) => value == "Yes",
      }),
    ];
  }

  async submit() {
    if (!super.validate()) {
      return;
    }

    Alert.alert("Not Implemented", "The Dance Club Signup form's submission has not been implemented yet. Please contact the IT Team.");
  }
}

export function questions(date, location, navigation, scrollObject) {
  return {
    "Library Music Hour": new MusicHour("Library Music Hour", date, location, navigation, scrollObject),
    "Music by the Tracks": new MusicHour("Music by the Tracks", date, location, navigation, scrollObject),
    "Request Concert": new RequestConcert(scrollObject, navigation),
    "Audacity Dance Club": new DanceClub(scrollObject, navigation),
  };
}

export const formEntryIDs = {
  "Library Music Hour": {
    id: "1FAIpQLSf7SfdPH1WRNscth7BTy9hZpFwhm-CLRlToryqsQjSFU1EPlg",
    location: "476670975",
    date: "785137847",
    fullName: "194705108",
    city: "171289053",
    phoneNumber: "1427621981",
    age: "2098203720",
    musicPiece: "762590043",
    composer: "979503979",
    instrument: "1774708872",
    length: "44358071",
    recordingLink: "687629199",
    performanceType: "1453633813",
    publicPermission: "1607100323",
    parentalConsent: "1363593782",
    pianoAccompaniment: "1307690728",
    ensembleProfile: "1413514639",
    otherInfo: "995802706",
  },
  "Music by the Tracks": {
    id: "1FAIpQLSfjPUdis44wJBjAXgegrKVaUzzvG-kRgErcV5td76BDU-dSSg",
    location: "476670975",
    date: "785137847",
    fullName: "194705108",
    city: "171289053",
    phoneNumber: "1427621981",
    age: "2098203720",
    musicPiece: "762590043",
    composer: "979503979",
    instrument: "1774708872",
    length: "44358071",
    recordingLink: "687629199",
    publicPermission: "1607100323",
    parentalConsent: "1363593782",
    pianoAccompaniment: "1307690728",
    otherInfo: "995802706",
  },
};

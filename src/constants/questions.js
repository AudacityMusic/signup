import { useState, useEffect } from "react";
import { getUser, Question, emptyQuestionState } from "../utils";
import TextField from "../components/TextField";
import CheckBoxQuery from "../components/CheckBoxQuery";
import UploadButton from "../components/UploadButton";
import NextButton from "../components/NextButton";
import MultipleChoice from "../components/MultipleChoice";
import MultiSelect from "../components/MultiSelect";
import SlotList from "../components/Slot";

const isAtLeast = (value, len) => value?.trim().length >= len;
const isNotEmpty = (value) => isAtLeast(value, 1);

function MusicHour(title, navigation) {
  const [fullName, setFullName] = emptyQuestionState();

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser();
        setFullName((prevState) => ({ ...prevState, value: user?.name }));
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const [city, setCity] = emptyQuestionState();
  const [phoneNumber, setPhoneNumber] = emptyQuestionState();
  const [age, setAge] = emptyQuestionState();
  const [musicPiece, setMusicPiece] = emptyQuestionState();
  const [composer, setComposer] = emptyQuestionState();
  const [instrument, setInstrument] = emptyQuestionState();
  const [performanceType, setPerformanceType] = emptyQuestionState();
  const [length, setLength] = emptyQuestionState();
  const [recordingLink, setRecordingLink] = emptyQuestionState();
  const [publicPermission, setPublicPermission] = emptyQuestionState();
  const [parentalConsent, setParentalConsent] = emptyQuestionState();
  const [pianoAccompaniment, setPianoAccompaniment] = emptyQuestionState();
  const [ensembleProfile, setEnsembleProfile] = emptyQuestionState();
  const [otherInfo, setOtherInfo] = emptyQuestionState();
  const [timeLimit, setTimeLimit] = useState(
    title == "Library Music Hour" ? 0 : 10,
  );

  const performanceOptions = {
    "Individual performance only": 8,
    "Individual performance and music instrument presentation": 12,
    "Group performance only": 15,
    "Group performance and music instrument presentation": 20,
    "Library Band Ensemble (Band, Orchestra, or Choir)": 60,
  };

  let questions = [
    new Question({
      component: (
        <TextField
          title="Performer's Full Name"
          key="fullName"
          state={fullName}
          setState={setFullName}
        />
      ),
      validate: (value) => value.trim().split(" ").length >= 2,
    }),

    new Question({
      component: (
        <TextField
          title="City of Residence"
          key="city"
          state={city}
          setState={setCity}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <TextField
          title="Phone Number"
          keyboardType="phone-pad"
          maxLength={10}
          key="phoneNumber"
          state={phoneNumber}
          setState={setPhoneNumber}
        />
      ),
      validate: (value) => isAtLeast(value, 10),
    }),

    new Question({
      component: (
        <TextField
          title="Performer's Age"
          keyboardType="numeric"
          key="age"
          state={age}
          setState={setAge}
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
      component: (
        <TextField
          title="Name of Music Piece"
          key="musicPiece"
          state={musicPiece}
          setState={setMusicPiece}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <TextField
          title="Name of Composer"
          key="composer"
          state={composer}
          setState={setComposer}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <TextField
          title="Instrument Type"
          key="instrument"
          state={instrument}
          setState={setInstrument}
        />
      ),
      validate: isNotEmpty,
    }),

    title == "Library Music Hour"
      ? new Question({
          component: (
            <MultipleChoice
              title="Performance Type"
              options={performanceOptions}
              onSelect={(option) => {
                setPerformanceType((prevState) => ({
                  ...prevState,
                  value: option,
                }));
                setTimeLimit(performanceOptions[option]);
              }}
              key="performanceType"
              state={performanceType}
              setState={setPerformanceType}
            />
          ),
          validate: isNotEmpty,
        })
      : null,

    new Question({
      component: (
        <TextField
          title="Length of Performance (mins)"
          subtitle={`Time Limit: ${timeLimit} minutes`}
          keyboardType="numeric"
          key="length"
          state={length}
          setState={setLength}
        />
      ),
      validate(value) {
        const time = Number(value);
        if (isNaN(time)) {
          return false;
        }
        return time > 0 && time <= timeLimit;
      },
    }),

    new Question({
      component: (
        <TextField
          title="Recording Link"
          keyboardType="url"
          key="recordingLink"
          state={recordingLink}
          setState={setRecordingLink}
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
      component: (
        <CheckBoxQuery
          question="Do you give permission for Audacity Music Club to post recordings of your performance on public websites?"
          key="publicPermission"
          state={publicPermission}
          setState={setPublicPermission}
        />
      ),
      validate: (value) => value != null,
    }),

    new Question({
      component: (
        <CheckBoxQuery
          question="My parent has given their consent for my participation."
          key="parentalConsent"
          state={parentalConsent}
          setState={setParentalConsent}
        />
      ),
      validate: (value) => value,
      isVisible: () => age.value < 18,
    }),

    new Question({
      component: (
        <UploadButton
          title="Our volunteer piano accompanist can provide sight reading accompaniment for entry level players. To request this service, upload the main score AND accompaniment score in one PDF file."
          key="pianoAccompaniment"
          state={pianoAccompaniment}
          setState={setPianoAccompaniment}
          navigation={navigation}
        />
      ),
      // Only PDF files can be uploaded
      // Optional
      validate: () =>
        pianoAccompaniment.value == null ||
        pianoAccompaniment.value[1] <= 104857600, // There are 104,857,600 bytes in 100 MB
    }),

    title == "Library Music Hour"
      ? new Question({
          component: (
            <UploadButton
              title="Upload your Library Band Ensemble profile as one PDF file."
              key="ensembleProfile"
              state={ensembleProfile}
              setState={setEnsembleProfile}
              navigation={navigation}
              required={true}
            />
          ),

          isVisible: () => performanceType.value?.includes("Ensemble"),

          // Only PDF files can be uploaded
          // Required only if visible (selected ensemble option)
          validate: () =>
            ensembleProfile.value != null &&
            ensembleProfile.value[1] <= 104857600, // There are 104,857,600 bytes in 100 MB
        })
      : null,

    new Question({
      component: (
        <TextField
          title="Other Information (optional)"
          key="otherInfo"
          state={otherInfo}
          setState={setOtherInfo}
        />
      ),
    }),
  ];

  questions = questions.filter((question) => question != null);
  return questions;
}

function RequestConcert() {
  const [phoneNumber, setPhoneNumber] = emptyQuestionState();
  const [organization, setOrganization] = emptyQuestionState();
  const [eventInfo, setEventInfo] = emptyQuestionState();
  const [venue, setVenue] = emptyQuestionState();
  const [publicity, setPublicity] = emptyQuestionState();
  const [stipend, setStipend] = emptyQuestionState();
  const [donatable, setDonatable] = emptyQuestionState();
  const [slots, setSlots] = emptyQuestionState([]); 
  const [audience, setAudience] = emptyQuestionState();
  const [distance, setDistance] = emptyQuestionState();
  const [provided, setProvided] = emptyQuestionState([]);
  const [donationBox, setDonationBox] = emptyQuestionState();
  const [extraAudience, setExtraAudience] = emptyQuestionState();
  const [otherInfo, setOtherInfo] = emptyQuestionState();

  return [
    new Question({
      component: (
        <TextField
          title="Phone Number"
          keyboardType="phone-pad"
          maxLength={10}
          key="phoneNumber"
          state={phoneNumber}
          setState={setPhoneNumber}
        />
      ),
      validate: (value) => isAtLeast(value, 10),
    }),

    new Question({
      component: (
        <TextField
          title="Organization Name & Description"
          key="organizationName"
          state={organization}
          setState={setOrganization}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <TextField
          title="Event Information"
          key="eventInfo"
          state={eventInfo}
          setState={setEventInfo}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <TextField
          title="Venue Address & Information"
          key="venue"
          state={venue}
          setState={setVenue}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <MultipleChoice
          title="Is the event public or private?"
          options={["Public", "Private"]}
          onSelect={(option) => {
            setPublicity((prevState) => ({ ...prevState, value: option }));
          }}
          key="publicity"
          state={publicity}
          setState={setPublicity}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <CheckBoxQuery
          question="Does your event come with a stipend?"
          key="stipend"
          state={stipend}
          setState={setStipend}
        />
      ),

      validate: (value) => value != null,
    }),

    new Question({
      component: (
        <CheckBoxQuery
          question="Are you able to donate to our charitable cause?"
          key="donatable"
          state={donatable}
          setState={setDonatable}
        />
      ),
      validate: (value) => value != null,
    }),

    new Question({
      component: (
        <SlotList
          title="Possible Concert Times"
          state={slots}
          setState={setSlots}
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
      component: (
        <TextField
          title="Describe the audience"
          key="audience"
          state={audience}
          setState={setAudience}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <TextField
          title="Distance from the parking lot to the stage (ft)"
          key="distance"
          keyboardType="numeric"
          state={distance}
          setState={setDistance}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <MultiSelect
          title="You will provide a:"
          options={["Cart for Moving Equipment", "PA System", "Large Screen", "Chairs", "Labor", "Canopy", "Covered Stage"]}
          key="provided"
          state={provided}
          setState={setProvided}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <CheckBoxQuery
          question="Permission for Donation Box for Charitable Causes (See Ongoing Charitable Donation Drives at www.goaudacity.com/projects)"
          key="donationBox"
          state={donationBox}
          setState={setDonationBox}
        />
      ),
      validate: (value) => value != null,
    }),

    new Question({
      component: (
        <CheckBoxQuery
          question="Permission to Draw in Our Own Audience"
          key="extraAudience"
          state={extraAudience}
          setState={setExtraAudience}
        />
      ),
      validate: (value) => value != null,
    }),

    new Question({
      component: (
        <TextField
          title="Other Information (optional)"
          key="otherInfo"
          state={otherInfo}
          setState={setOtherInfo}
        />
      )
    })
  ]  
}

function DanceClub() {
  const [fullName, setFullName] = emptyQuestionState();

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser();
        setFullName((prevState) => ({ ...prevState, value: user?.name }));
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const [phoneNumber, setPhoneNumber] = emptyQuestionState();
  const [favoritePieces, setFavoritePieces] = emptyQuestionState();
  const [age, setAge] = emptyQuestionState();
  const [favoriteDanceStyles, setFavoriteDanceStyles] = emptyQuestionState();
  const [consent, setConsent] = emptyQuestionState();
  const [recording, setRecording] = emptyQuestionState();

  return [
    new Question({
      component: (
        <TextField
          title="Performer's Full Name"
          key="fullName"
          state={fullName}
          setState={setFullName}
        />
      ),
      validate: (value) => value.trim().split(" ").length >= 2,
    }),

    new Question({
      component: (
        <TextField
          title="Phone Number"
          keyboardType="phone-pad"
          maxLength={10}
          key="phoneNumber"
          state={phoneNumber}
          setState={setPhoneNumber}
        />
      ),
      validate: (value) => isAtLeast(value, 10),
    }),

    new Question({
      component: (
        <TextField
          title="Your 4 Favorite Pieces of Music"
          key="favoritePieces"
          state={favoritePieces}
          setState={setFavoritePieces}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <MultipleChoice
          title="Your Age"
          options={["Under 10", "10-15", "16-20", "21-40", "41-60", "61-80", "81-100"]}
          onSelect={(value) => {setAge((prevState) => ({ ...prevState, value: value }))}}
          key="age"
          state={age}
          setState={setAge}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <MultipleChoice
          title="Your 4 Favorite Dance Styles"
          options={["Ballet", "Bollywood", "Contemporary", "Fitness", "Kpop", "Latin", "Lyrical"]}
          onSelect={(value) => {setFavoriteDanceStyles((prevState) => ({ ...prevState, value: value }))}}
          key="favoriteDanceStyles"
          state={favoriteDanceStyles}
          setState={setFavoriteDanceStyles}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <CheckBoxQuery
          question="I am committed to holding the volunteer instructor and organizer harmless"
          key="consent"
          state={consent}
          setState={setConsent}
        />
      ),
      validate: (value) => value,
    }),

    new Question({
      component: (
        <CheckBoxQuery
          question={"We will record our event and place them on our website." + 
                    "Maximum efforts will be made to avoid showing faces of the participants," +
                    "but we can't guarantee it can be avoided completely." +
                    "I consent to my and/or my child's image being recorded/filmed and " +
                    "allow the product to be used for promotional purposes in any way ADC sees fit, " + 
                    "including on social media. I also understand that ADC retains full ownership" +
                    "of these images and/or videos."}

          key="recording"
          state={recording}
          setState={setRecording}
        />
      ),
      validate: (value) => value,
    }),
  ]
}

export default function questions(navigation) {
  return {
    "Library Music Hour": MusicHour("Library Music Hour", navigation),
    "Music by the Tracks": MusicHour("Music by the Tracks", navigation),
    "Request Concert": RequestConcert(),
    "Audacity Dance Club": DanceClub(),
  };
}
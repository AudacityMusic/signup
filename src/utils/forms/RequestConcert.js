import { Question, emptyQuestionState, isAtLeast, isNotEmpty } from "..";
import Form from "./Form";

import CheckBoxQuery from "../../components/CheckBoxQuery";
import MultipleChoice from "../../components/MultipleChoice";
import MultiSelect from "../../components/MultiSelect";
import TextField from "../../components/TextField";
import TimeSlotList from "../../components/TimeSlotList";

export default class RequestConcert extends Form {
  constructor(date, location, navigation, scrollObject) {
    super("Request a Concert", date, location, navigation, scrollObject);

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
            maxLength={15}
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
        name: "publicity",
        component: (
          <MultipleChoice
            title="Is the event public or private?"
            options={["Public", "Private"]}
            onSelect={(option) => {
              this.publicity[1]((prevState) => ({
                ...prevState,
                value: option,
              }));
            }}
            key="publicity"
            state={this.publicity[0]}
            setState={this.publicity[1]}
          />
        ),
        validate: isNotEmpty,
      }),

      new Question({
        name: "stipend",
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
        name: "donatable",
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
          <TimeSlotList
            title="Possible Concert Times"
            key="slots"
            state={this.slots[0]}
            setState={this.slots[1]}
          />
        ),

        validate(value) {
          if (value.length == 0) {
            return false;
          }

          for (const slot of value) {
            if (!slot.validate()) {
              return false;
            }
          }

          return true;
        },
      }),

      new Question({
        name: "audience",
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
        name: "distance",
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
        name: "provided",
        component: (
          <MultiSelect
            title="You will provide a:"
            options={[
              "Cart for Moving Equipment",
              "PA System",
              "Large Screen",
              "Chairs",
              "Labor",
              "Canopy",
              "Covered Stage",
            ]}
            key="provided"
            state={this.provided[0]}
            setState={this.provided[1]}
          />
        ),
        validate: () => true,
      }),

      new Question({
        name: "donationBox",
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
        name: "extraAudience",
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
  }
}

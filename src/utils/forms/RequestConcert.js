/**
 * RequestConcert.js
 * Form class for the 'Request a Concert' signup.
 * - Extends base Form to capture event requests and logistical details.
 * - Fields include contact info, organization details, event logistics, resources, and time slots.
 */

import { Question, emptyQuestionState, isAtLeast, isNotEmpty } from "..";
import Form from "./Form";

import CheckBoxQuery from "../../components/CheckBoxQuery";
import MultipleChoice from "../../components/MultipleChoice";
import MultiSelect from "../../components/MultiSelect";
import TextField from "../../components/TextField";
import TimeSlotList from "../../components/TimeSlotList";

export default class RequestConcert extends Form {
  /**
   * @param {string} date - proposed event date
   * @param {string} location - event location
   * @param {object} navigation - React Navigation prop
   * @param {object} scrollRef - ref for scroll-to-error scrolling
   */
  constructor(date, location, navigation, scrollRef) {
    // Initialize base Form with title and context
    super("Request a Concert", date, location, navigation, scrollRef);

    // State hooks for each question field
    this.phoneNumber = emptyQuestionState(); // Contact phone
    this.organization = emptyQuestionState(); // Org name/description
    this.eventInfo = emptyQuestionState(); // Event details
    this.venue = emptyQuestionState(); // Venue info
    this.publicity = emptyQuestionState(); // Public/private
    this.stipend = emptyQuestionState(); // Stipend availability
    this.donatable = emptyQuestionState(); // Donation option
    this.timeSlots = emptyQuestionState([]); // Available time slots array
    this.audience = emptyQuestionState(); // Audience description
    this.distance = emptyQuestionState(); // Distance details
    this.provided = emptyQuestionState([]); // Provided resources
    this.donationBox = emptyQuestionState(); // Donation box option
    this.extraAudience = emptyQuestionState(); // Additional audience notes
    this.otherInfo = emptyQuestionState(); // Other comments
  }

  /**
   * Build list of Question definitions for Request a Concert form.
   * @returns {Question[]}
   */
  questions() {
    return [
      // Phone number field
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
      // Organization name and description
      new Question({
        name: "organization",
        component: (
          <TextField
            title="Organization Name & Description"
            key="organization"
            state={this.organization[0]}
            setState={this.organization[1]}
          />
        ),
        validate: isNotEmpty,
      }),
      // Event info field
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
      // Venue details
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
      // Public or private event
      new Question({
        name: "publicity",
        component: (
          <MultipleChoice
            title="Is the event public or private?"
            options={["Public", "Private"]}
            onSelect={(opt) =>
              this.publicity[1]((prev) => ({ ...prev, value: opt }))
            }
            key="publicity"
            state={this.publicity[0]}
            setState={this.publicity[1]}
          />
        ),
        validate: isNotEmpty,
      }),
      // Stipend checkbox
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
        validate: (val) => val != null,
      }),
      // Donatable option checkbox
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
        validate: (val) => val != null,
      }),
      // Time slots list
      new Question({
        name: "timeSlots",
        component: (
          <TimeSlotList
            title="Possible Concert Times"
            key="timeSlots"
            state={this.timeSlots[0]}
            setState={this.timeSlots[1]}
          />
        ),
        validate: (slots) =>
          slots.length > 0 && slots.every((s) => s.validate()),
      }),
      // Audience description
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
      // Distance input
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
      // Provided resources multi-select
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
        validate: (val) => val.length > 0,
      }),
      // Donation box option
      new Question({
        name: "donationBox",
        component: (
          <CheckBoxQuery
            question="Will you provide a donation box at the event?"
            key="donationBox"
            state={this.donationBox[0]}
            setState={this.donationBox[1]}
          />
        ),
        validate: (val) => val != null,
      }),
      // Additional audience info
      new Question({
        name: "extraAudience",
        component: (
          <TextField
            title="Additional Audience Details"
            key="extraAudience"
            state={this.extraAudience[0]}
            setState={this.extraAudience[1]}
          />
        ),
        validate: () => true,
      }),
      // Other comments
      new Question({
        name: "otherInfo",
        component: (
          <TextField
            title="Additional Comments"
            key="otherInfo"
            state={this.otherInfo[0]}
            setState={this.otherInfo[1]}
          />
        ),
        validate: () => true,
      }),
    ];
  }
}

import * as React from 'react';
import StepZilla, { Step, StepInjectedProps, ValidatedStep } from 'react-stepzilla';

class Step1 extends React.Component<StepInjectedProps> {
    render() {
        return (
            <div>
              <p>Thank you for looking at this form. Press a numbered button
                  below to jump directly to another step.</p>
              <button onClick={() => this.props.jumpToStep(1)}>2</button>
              <button onClick={() => this.props.jumpToStep(2)}>3</button>
            </div>
        );
    }
}

interface Step2State {
    firstname: string;
    lastname: string;
}
class Step2 extends React.Component<StepInjectedProps, Step2State> implements ValidatedStep {
    readonly state: Step2State = { firstname: '', lastname: '' };

    isValidated() {
        return this.state.firstname !== '' && this.state.lastname !== '';
    }

    onChange = (event: React.FormEvent<HTMLInputElement>) => {
        const { id, value } = event.currentTarget;
        if (id !== undefined) {
            const fieldName = id as keyof Step2State;
            this.setState({...this.state, [fieldName]: value});
        }
    }

    render() {
        return (
          <form>
              <label htmlFor="firstname">First Name:</label>
              <input id="firstname" type="text" value={this.state.firstname} />
              <br />
              <label htmlFor="lastname">Last Name:</label>
              <input id="lastname" type="text" value={this.state.lastname} />
          </form>
        );
    }
}

interface Step3Props extends StepInjectedProps {
    title: string;
    blurb: string;
}

class Step3 extends React.Component<Step3Props> implements ValidatedStep {
    isValidated() {
        return new Promise(resolve => setTimeout(resolve, 500));
    }
    render() {
        return (
            <div>
                <h1>{this.props.title}</h1>
                <div>{this.props.blurb}</div>
            </div>
        );
    }
}

// Class 'Step3Broken' incorrectly implements interface 'ValidatedStep'. Property 'isValidated' is missing in type 'Step4Broken'.
// $ExpectError
class Step4Broken extends React.Component<StepInjectedProps> implements ValidatedStep {
    render() {
        return (
            <p>Thank you for your input</p>
        );
    }
}

class Step4 extends React.Component<StepInjectedProps> implements ValidatedStep {
    isValidated() {
        return true;
    }

    render() {
        return (
            <p>Thank you for your input</p>
        );
    }
}

const steps: Step[] = [
    { name: 'Introduction', component: <Step1 /> },
    { name: 'Enter your details', component: <Step2 /> },
    { name: 'Submit', component: <Step3 title="Submit" blurb="Do you want to submit your name details?" />},
    { name: 'Done', component: <Step4 /> }
];

<StepZilla steps={steps} />;

<StepZilla steps={steps} stepsNavigation={true} startAtStep={0} />;

<StepZilla steps={steps} nextButtonText="Continue" backButtonText="Go Back" />;

<StepZilla steps={steps} showSteps={false} dontValidate={true} preventEnterSubmission={true} />;

// Types of property 'steps' are incompatible. Type 'number' is not assignable to type 'Step[]'.
// $ExpectError
<StepZilla steps={1} />;

// Types of property 'stepsNavigation' are incompatible. Type 'string' is not assignable to type 'boolean | undefined'.
// $ExpectError
<StepZilla stepsNavigation="true" />;

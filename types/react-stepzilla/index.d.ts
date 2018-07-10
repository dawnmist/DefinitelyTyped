// Type definitions for react-stepzilla 4.7
// Project: https://github.com/newbreedofgeek/react-stepzilla#readme
// Definitions by: Janeene Beeforth <https://github.com/dawnmist>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.6

import * as React from 'react';

/**
 * React-Stepzilla will inject these properties into each step component.
 */
export interface StepInjectedProps {
    /**
     * Allows you to jump to any other step.
     * Use this with caution - it does not do any validation before leaving the current step.
     */
    jumpToStep(index: number): void;
}

/**
 * Interface that must be implemented in each step if validation is being used in the Wizard.
 */
export interface ValidatedStep {
    /**
     * This function is required if validation is being used in the Wizard.
     * If true, validation has succeeded and the form can progress to the next step.
     * If false, validation failed and the form cannot proceed.
     * It can also return a Promise that either resolves or rejects (resolve = validation succeeded,
     * reject = validation failed).
     */
    isValidated(): boolean | Promise<any>;
}

/**
 * Interface for defining the Step name and Component to use.
 */
export interface Step {
    /** Display name for this step */
    name: string;
    /** Component to display for this step */
    component: JSX.Element;
}

export interface StepZillaProps {
    /**
     * The steps to be displayed
     */
    steps: Step[];
    /**
     * Enable or disable the steps UI navigation at the top of the page
     */
    showSteps?: boolean;
    /**
     * Show next/previous buttons at the bottom of the page
     */
    showNavigation?: boolean;
    /**
     * Enable or disable the ability to jump to another step by clicking on the steps UI navigation bar
     */
    stepsNavigation?: boolean;
    /**
     * Show or hide the previous button in the last step.
     * For example, if the last step is simply a "thankyou for your submission" message, you may not want
     * to permit returning to the actual submission step.
     */
    prevBtnOnLastStep?: boolean;
    /**
     * Enable or disable validation rules in step components (used in dev/test, when rules have been defined).
     */
    dontValidate?: boolean;
    /**
     * By default if you hit the Enter key on any element it validates the form and moves to the next step
     * if valid. This allows you to disable that auto-validate and continue behaviour.
     */
    preventEnterSubmission?: boolean;
    /**
     * Specify a step index number (0-based) to start the wizard from. (e.g. to skip the first few steps).
     * A startAtStep value of 2 will start from the third step in the steps array.
     */
    startAtStep?: number;
    /**
     * Text string to display on the "next" button. Defaults to "Next" if not provided.
     */
    nextButtonText?: string;
    /**
     * Text string to display on the "previous" button. Defaults to "Previous" if not provided.
     */
    backButtonText?: string;
    /**
     * Specify the "next" button className (if not provided it defaults to "btn btn-prev btn-primary btn-lg"
     * which depends on bootstrap). If using bootstrap and setting a custom className, you need to provide
     * the bootstrap classNames that it should be merged with yourself,
     * e.g. "btn btn-prev btn-primary btn-lg pull-right my-custom-btn"
     */
    nextButtonCls?: string;
    /**
     * Specify the "previous" button className (if not provided it defaults to "btn btn-next btn-primary btn-lg"
     * which depends on bootstrap). If using bootstrap and setting a custom className, you need to provide
     * the bootstrap classNames that it should be merged with yourself,
     * e.g. "btn btn-next btn-primary btn-lg pull-left my-custom-btn"
     */
    backButtonCls?: string;
    /**
     * Alternative to display for the "next" button on the final "action" step (second-last step).
     * You can use this to change the text to "Save".
     */
    nextTextOnFinalActionStep?: string;
    /**
     * Array of step indexes that are using the 'react-validation-mixin' HOC validation.
     */
    hocValidationAppliedTo?: number[];
    /**
     * Function that is called every time the current step index changes.
     */
    onStepChange?(step: number): void;
}

export default class StepZilla extends React.Component<StepZillaProps> {}

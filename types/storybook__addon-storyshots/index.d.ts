// Type definitions for @storybook/addon-storyshots 3.3
// Project: https://github.com/storybooks/storybook
// Definitions by: Janeene Beeforth <https://github.com/dawnmist>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

/// <reference types="jest" />
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { Page, NavigationOptions, ScreenshotOptions } from 'puppeteer';
import * as React from 'react';

export type Framework = 'react' | 'react-native' | 'vue' | 'angular';
/**
 * Note: 'rn' should not have been being leaked out through the context, so at some stage expect the 'rn' value to revert to 'react-native'.
 * See https://github.com/storybooks/storybook/issues/3375
 */
export type ContextFramework = 'react' | 'rn' | 'vue' | 'angular';

/**
 * Storybook context
 */
export interface Context {
    /**
     * The story 'kind' string as set in storiesOf(kind)
     */
    kind: string;
    /**
     * The story name string as set in storiesOf().add(name, ...)
     */
    story: string;
    /**
     * The filename that the story is defined in.
     */
    fileName: string;
    /**
     * The javascript framework used in your project.
     */
    framework: ContextFramework;
}

/**
 * The main story object used in @storybook. This is further specified inside each of the framework-specific storybook packages
 * such as @storybook/react, @storybook/vue, etc.
 */
export interface StoryObject {
    /**
     * The name of the story (as given in ofStories().add(name, ...)).
     */
    name: string;
    /**
     * The render function used to render a component for a framework.
     * Output varies according to the framework in use, e.g.
     *   for react: React.Component | JSX.Element
     *   for vue: ComponentOptions<Vue> | null
     */
    render(context: Context): any;
}

/**
 * Storyshot Test function props.
 * These are provided as input to the StoryshotsOptions.test function.
 */
export interface StoryshotsTestProps {
    /**
     * The story object itself.
     */
    story: StoryObject;
    /**
     * The Context information for the story.
     */
    context: Context;
    /**
     * The normal renderTree function (or StoryshotsOptions.renderer if specified).
     */
    renderTree(story: StoryObject, context: Context, options: StoryshotsOptions): any;
    /**
     * A shallow-render alternative function to renderTree.
     * Note: this is not supported for all frameworks. Currently works with 'react' and 'react-native'
     */
    renderShallowTree(story: StoryObject, context: Context, options: StoryshotsOptions): any;
}

/**
 * Options for Storyshots when initializing the storyshots test.
 */
export interface StoryshotsConfigOptions {
    /**
     * Path to storybook config.
     * For React, this defaults to '.storybook'.
     * For React-Native, this defaults to 'storybook'.
     */
    configPath?: string;
    /**
     * Jest suite (describe) name. Default is 'Storyshots'.
     */
    suite?: string;
    /**
     * Used to filter which Stories should be included in the jest snapshot tests. This matches against the 'storiesOf' name.
     */
    storyKindRegex?: RegExp;
    /**
     * Used to filter which Stories should be included in the jest snapshot tests. This matches against the individual 'add' story name.
     */
    storyNameRegex?: RegExp;
    /**
     * If you are running tests from outside of your app's directory, storyshots' detection of which framework you are using may fail.
     */
    framework?: Framework;
    /**
     * Run a custom test function for each story, rather than the storyshots' default test.
     * Note that setting this 'test' option will override the 'renderer' option.
     */
    test?: (props: StoryshotsTestProps) => any;
}

export interface StoryshotsRendererOptions<CustomRendererProps extends object = any> {
    /**
     * Pass a custom renderer to storyshots for recording snapshots in the default storyshots snapshot tests.
     * Note that setting the 'test' option will override this 'renderer' option.
     * Element is the output from the framework-dependent StoryObject render function.
     */
    renderer?(element: any, rendererOptions: StoryshotsRendererOptions<CustomRendererProps> & CustomRendererProps): any;
    /**
     * Pass a custom serializer (such as enzyme-to-json) to serialize components into snapshot-comparable data.
     * This option only needs to be set if the default 'snapshotSerializers' is not set in your jest config.
     * The tree input is the result of running the renderer function.
     */
    serializer?(tree: any): any;
}

export type StoryshotsOptions<CustomRendererProps extends object = any> =
  & StoryshotsConfigOptions
  & StoryshotsRendererOptions<CustomRendererProps>
  & CustomRendererProps;

/**
 * Options that can be passed to the snapshotWithOptions or multisnapshotWithOptions functions.
 * Currently used to specify mocks for components that rely on functionality not available in node.js.
 */
export interface SnapshotTestOptions extends StoryshotsRendererOptions {
    /**
     * React refs are not available in jest. This is used to mock components that rely on ref functionality.
     */
    createNodeMock?(element: any): any;
}

/**
 * The default test, render the story as normal and take a Jest snapshot.
 * Can be used in the StoryshotsOptions 'test' option.
 */
export function snapshot(): (props: StoryshotsTestProps) => any;

/**
 * Like the default 'snapshot' test, but allows you to specify a set of optuons for the test renderer.
 * Can be used in the StoryshotsOptions 'test' option.
 */
export function snapshotWithOptions(options: SnapshotTestOptions): (props: StoryshotsTestProps) => any;

/**
 * Like snapshotWithOptions, but generates a separate snapshot file for each stories file rather than a single monolithic file.
 * This makes it dramatically easier to review changes.
 * Can be used in the StoryshotsOptions 'test' option.
 */
export function multiSnapshotWithOptions(options: SnapshotTestOptions): (props: StoryshotsTestProps) => any;

/**
 * Test function that takes a shallow-rendered version of the component.
 * Note that the shallow renderer will be overridden if you specify the 'renderer' option in the initStoryshots options.
 */
export function shallowSnapshot(props: StoryshotsTestProps): any;

/**
 * Utility function used in multiSnapshotWithOptions to retrieve the filename for a snapshot.
 */
export function getSnapshotFileName(context: Context): string | null;

/**
 * Options to use for image snapshot tests.
 */
export interface ImageSnapshotTestOptions {
    context: Context;
    url: string;
}

/**
 * Configuration options that can be provided to the imageSnapshot test function.
 */
export interface ImageSnapshotOptions {
    /**
     * URL to visit in Puppeteer to browse stories and take image snapshots.
     * Default is http://localhost:6006.
     */
    storybookUrl?: string;
    /**
     * Specify match options to pass to jest-image-snapshot.
     */
    getMatchOptions?(options?: ImageSnapshotTestOptions): MatchImageSnapshotOptions;
    /**
     * Specify beforeScreenshot test options for jest-image-snapshot.
     * beforeScreenshot receives the Puppeteer page instance and the ImageSnapshotJestOptions. It is part of the promise chain and
     * is called after the browser navigation is completed but before the screenshot is taken. It allows for triggering events on
     * the page elements and delaying the screenshot and can be used to avoid regressions due to mounting animations.
     */
    beforeScreenshot?(page: Page, options: ImageSnapshotTestOptions): Promise<any>;
    /**
     * Used to specify options to pass to the Puppeteer.goTo() function.
     */
    getGotoOptions?(options: ImageSnapshotTestOptions): Partial<NavigationOptions>;
    /**
     * Used to specify options to pass to the Puppeteer.screenshot() function.
     */
    getScreenshotOptions?(options: ImageSnapshotTestOptions): ScreenshotOptions;
}

/**
 * Render the story and taks Jest snapshots as images instead of json. This requires you to either:
 *   - Have a storybook running (i.e. accessible via http(s), for instance using 'yarn run storybook')
 *   - Have a static build of the storybook (for instance, using 'yarn run build-storybook' to generate story page files).
 * Then you will need to reference the storybook URL (file://... if using a static build, http(s)://... if served).
 */
export function imageSnapshot(options?: ImageSnapshotOptions): (props: StoryshotsTestProps) => any;

/**
 * Initialize the Storyshots jest tests.
 * If using a custom renderer (e.g. enzyme's mount), merge the renderer's options with the options passed to initStoryshots.
 */
export default function initStoryshots(options?: StoryshotsOptions): void;

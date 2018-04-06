import initStoryshots, {
    Framework,
    getSnapshotFileName,
    imageSnapshot,
    ImageSnapshotOptions,
    ImageSnapshotTestOptions,
    multiSnapshotWithOptions,
    snapshot,
    snapshotWithOptions,
    StoryshotsTestProps,
    StoryshotsOptions
} from '@storybook/addon-storyshots';
import { shallow, mount, MountRendererProps } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as PropTypes from 'prop-types';
import { NavigationOptions, Page, ScreenshotOptions } from 'puppeteer';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import 'jest-specific-snapshot';

// Basic initialization
initStoryshots();

// With an element mock
initStoryshots({
    test: snapshotWithOptions({
        createNodeMock: (element: JSX.Element) => {
            return '';
        }
    })
});

initStoryshots({
    test: snapshotWithOptions({
        createNodeMock: (element: JSX.Element) => {
            return '';
        },
        renderer: mount,
        serializer: toJson
    })
});

initStoryshots({
    test: snapshotWithOptions({
        createNodeMock: (element: JSX.Element) => {
            return '';
        },
        renderer: mount,
        serializer: toJson,
        // $ExpectError
        anUnknownItem: {}
    })
});

// Creating image snapshots with jest-image-snapshot.
const getMatchOptions = (options: ImageSnapshotTestOptions): MatchImageSnapshotOptions => {
    return {
      failureThreshold: 0.2,
      failureThresholdType: 'percent',
    };
};
const beforeScreenshot = (page: Page, options: ImageSnapshotTestOptions) => {
    return new Promise(resolve =>
        setTimeout(() => {
            resolve();
        }, 600)
    );
};
initStoryshots({
    suite: 'Image storyshots',
    test: imageSnapshot({
        storybookUrl: 'http://localhost:6006',
        getMatchOptions,
        beforeScreenshot
    })
});

// Image snapshots specifying puppeteer goto options.
const getGotoOptions = (options: ImageSnapshotTestOptions): Partial<NavigationOptions> => {
    return {
      waitUntil: 'networkidle0',
    };
};

// Image snapshots specifying puppeteer screenshot options.
const getScreenshotOptions = ({context, url}: ImageSnapshotTestOptions): ScreenshotOptions => {
    return {
      fullPage: false
    };
};
initStoryshots({
    suite: 'Image storyshots',
    test: imageSnapshot({
        storybookUrl: 'http://localhost:6006',
        getScreenshotOptions,
        getGotoOptions
    })
});

// configPath
initStoryshots({
    configPath: '.my-storybook-config-dir'
});

// suite
initStoryshots({
    suite: 'MyStoryshots'
});

// storyKindRegex
initStoryshots({
    storyKindRegex: /^MyComponent$/
});

// storyNameRegex
initStoryshots({
    storyNameRegex: /buttons/
});

// framework - note: for TypeScript Version 2.7+, the cast is no longer necessary.
initStoryshots({
    framework: 'react-native' as Framework
});

// renderer
initStoryshots({
    renderer: mount
});

/**
 * renderer with custom renderer options
 */
initStoryshots({
    renderer: mount,
    context: { translate: <T>(a: T): T => a },
    childContextTypes: {
        translate: PropTypes.func
    }
});

const options_ok: StoryshotsOptions<MountRendererProps> = {
    renderer: mount,
    context: { translate: <T>(a: T): T => a },
    childContextTypes: {
        translate: PropTypes.func
    }
};
const options_notOk: StoryshotsOptions<MountRendererProps> = {
    renderer: mount,
    context: { translate: <T>(a: T): T => a },
    childContextTypes: {
        translate: PropTypes.func
    },
    // $ExpectError
    anUnknownItem: {}
};

// This uses the default = any, so it passes.
initStoryshots({
    renderer: mount,
    context: { translate: <T>(a: T): T => a },
    childContextTypes: {
        translate: PropTypes.func
    },
    anUnknownItem: {}
});

// serializer
initStoryshots({
    serializer: toJson
});

// Test function - default snapshot test
initStoryshots({
    test: snapshot
});

// Test function - snapshot with options.
initStoryshots({
    test: snapshotWithOptions({})
});

initStoryshots({
    test: snapshotWithOptions({
        // $ExpectError
        anUnknownItem: {}
    })
});

// With a custom test function.
initStoryshots({
  test: ({ story, context }: StoryshotsTestProps) => {
    const snapshotFileName = getSnapshotFileName(context);
    const storyElement = story.render(context);
    const shallowTree = shallow(storyElement);

    if (snapshotFileName) {
      expect(toJson(shallowTree)).toMatchSpecificSnapshot(snapshotFileName);
    }
  }
});

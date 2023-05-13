import {
    createIntegration,
    createComponent,
    RuntimeEnvironment,
    RuntimeContext,
} from '@gitbook/runtime';

import {
    extractStorylaneLinkPropsFromURL,
    fetchStorylaneOEmbedData
} from './storylane';

interface StorylaneInstallationConfiguration {
}

type StorylaneRuntimeEnvironment = RuntimeEnvironment<StorylaneInstallationConfiguration>;
type StorylaneRuntimeContext = RuntimeContext<StorylaneRuntimeEnvironment>;

/**
 * Component to render the block when embedding the Storylane URL.
 */
const embedBlock = createComponent<{
    subdomain?: string;
    linkValue?: string;
    url?: string;
}>({
    componentId: 'embed',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const {url} = action;
                const nodeProps = extractStorylaneLinkPropsFromURL(url);

                return {
                    props: {
                        ...nodeProps,
                        url,
                    },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        const {environment} = context;
        const {subdomain, linkValue, url} = element.props;

        if (!linkValue) {
            return (
                <block>
                    <card
                        title={'Storylane'}
                        onPress={{
                            action: '@ui.url.open',
                            url,
                        }}
                        icon={
                            <image
                                source={{
                                    url: environment.integration.urls.icon,
                                }}
                                aspectRatio={1}
                            />
                        }
                    />
                </block>
            );
        }

        const embedData = await fetchStorylaneOEmbedData(linkValue);
        const aspectRatio = embedData.width / embedData.height;
        return (
            <block>
                <webframe
                    source={{
                        url: `https://${subdomain}.storylane.io/demo/${linkValue}`,
                    }}
                    aspectRatio={aspectRatio}
                />
            </block>
        );
    },
});

export default createIntegration<StorylaneRuntimeContext>({
    components: [embedBlock],
});

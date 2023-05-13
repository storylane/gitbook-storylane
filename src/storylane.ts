export interface StorylaneOEmbed {
    type: 'rich';
    title: string;
    width: number;
    height: number;
}

/**
 * Fetch the Storylane demo oembed data.
 */
export async function fetchStorylaneOEmbedData(linkValue: string): Promise<StorylaneOEmbed> {
    const url = new URL(`https://api.storylane.io/oembed/meta`);
    url.searchParams.append('url', `https://app.storylane.io/share/${linkValue}`);

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const result = await response.json<StorylaneOEmbed>();

    return result;
}

/**
 * Extract the Storylane link props (subdomain and value) from the embed URL.
 */
export function extractStorylaneLinkPropsFromURL(input: string): {
    subdomain?: string;
    linkValue?: string;
} {
    const url = new URL(input);
    const match = url.hostname.match(/^(?<subdomain>[^.]+)\.storylane\.io$/i)
    if (!match) {
        return;
    }

    const parts = url.pathname.split('/');
    if (!['demo', 'share'].includes(parts[1])) {
        return;
    }

    return {
        subdomain: match.groups.subdomain,
        linkValue: parts[2]
    };
}

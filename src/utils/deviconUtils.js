const DEVICON_CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const DEVICON_JSON_URL = 'https://raw.githubusercontent.com/devicons/devicon/master/devicon.json';

/**
 * Parses a devicon class string (e.g. "devicon-react-original") into its
 * component parts and returns the CDN SVG URL.
 *
 * Supported input formats:
 *  - "devicon-react-original"          → name=react, version=original
 *  - "devicon-amazonwebservices-plain" → name=amazonwebservices, version=plain
 *
 * @param {string} icon - The devicon class string stored against a skill.
 * @returns {string|null} The full CDN SVG URL, or null if the input is falsy/unparseable.
 */
export const getDeviconUrl = (icon) => {
    if (!icon) return null;

    // If it's a URL or base64 data URL, return it directly
    if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('data:image/')) {
        return icon;
    }

    // Match "devicon-<name>-<version>" where name may contain hyphens (e.g. "plain-wordmark")
    // Strategy: strip the leading "devicon-" prefix, then the last "-<word>" segment is the version.
    const withoutPrefix = icon.replace(/^devicon-/, '');
    if (!withoutPrefix) return null;

    // Split on the LAST hyphen-separated token that looks like a known version keyword
    const versionKeywords = ['original-wordmark', 'plain-wordmark', 'line-wordmark', 'original', 'plain', 'line'];
    let name = null;
    let version = null;

    for (const v of versionKeywords) {
        if (withoutPrefix.endsWith(`-${v}`)) {
            name = withoutPrefix.slice(0, -(v.length + 1)); // strip "-version"
            version = v;
            break;
        }
    }

    if (!name || !version) return null;

    return `${DEVICON_CDN}/${name}/${name}-${version}.svg`;
};

/**
 * Parses a devicon class string and returns { name, version } or null.
 *
 * @param {string} icon
 * @returns {{ name: string, version: string } | null}
 */
export const parseDeviconClass = (icon) => {
    if (!icon) return null;

    const withoutPrefix = icon.replace(/^devicon-/, '');
    if (!withoutPrefix) return null;

    const versionKeywords = ['original-wordmark', 'plain-wordmark', 'line-wordmark', 'original', 'plain', 'line'];

    for (const v of versionKeywords) {
        if (withoutPrefix.endsWith(`-${v}`)) {
            const name = withoutPrefix.slice(0, -(v.length + 1));
            return { name, version: v };
        }
    }

    return null;
};

export { DEVICON_CDN, DEVICON_JSON_URL };

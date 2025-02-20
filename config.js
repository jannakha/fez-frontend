// webpack configuration for prod/staging/dev builds
const deployment = {
    development: {
        url: (branch) => (`https://development.library.uq.edu.au/espace/${branch}/#/`),
        fullPath: (branch) => (`https://development.library.uq.edu.au/espace/${branch}/#`),
        api: 'https://api.library.uq.edu.au/staging/',
        auth_login: 'https://fez-staging.library.uq.edu.au/login.php',
        auth_logout: 'https://auth.library.uq.edu.au/logout',
        gtm: 'GTM-K597ZS',
        title: 'UQ eSpace (DEVELOPMENT)',
        short_name: 'eSpace',
        titleSuffix: 'Development',
        environment: 'development',
        basePath: 'espace/', // updated in webpack
        publicPath: '',
        orcidUrl: 'https://sandbox.orcid.org',
        orcidClientId: 'APP-OXX6M6MBQ77GUVWX',
    },
    staging: {
        url: () => ('https://fez-staging.library.uq.edu.au/'),
        fullPath: () => ('https://fez-staging.library.uq.edu.au'),
        api: 'https://api.library.uq.edu.au/staging/',
        auth_login: 'https://fez-staging.library.uq.edu.au/login.php',
        auth_logout: 'https://auth.library.uq.edu.au/logout',
        gtm: 'GTM-K597ZS',
        title: 'UQ eSpace (STAGING)',
        short_name: 'eSpace',
        titleSuffix: 'Staging',
        environment: 'staging',
        basePath: '',
        publicPath: '/',
        orcidUrl: 'https://sandbox.orcid.org',
        orcidClientId: 'APP-OXX6M6MBQ77GUVWX',
    },
    production: {
        url: () => ('https://espace.library.uq.edu.au/'),
        fullPath: () => ('https://espace.library.uq.edu.au'),
        api: 'https://api.library.uq.edu.au/v1/',
        auth_login: 'https://espace.library.uq.edu.au/login.php',
        auth_logout: 'https://auth.library.uq.edu.au/logout',
        gtm: 'GTM-T4NPC25',
        title: 'UQ eSpace',
        short_name: 'eSpace',
        titleSuffix: '',
        environment: 'production',
        basePath: '',
        publicPath: '/',
        orcidUrl: 'https://orcid.org',
        orcidClientId: 'APP-UIQ1ZTKAU17ZGZSC',
    }
};

exports.default = deployment;



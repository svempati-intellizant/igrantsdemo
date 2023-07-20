export const dataSpecialistRouteLinks = {
    landing: '/landing',
    dashboard: '/dashboard',
    addNewGrantee: '/add-new-grantee',
    grantList: { baseUrl: '/grant-list', param: '/:granteeId' },
    allGrantList: '/all-grant-list',
    grantDetail: {
        baseUrl: '/grant-detail',
        param: '/:granteeId/questions/:granteeGrantId',
    },
    renewGrant: {
        baseUrl: '/grant-detail',
        param: '/:granteeId/renew/:granteeGrantId',
    },
};

export const MasterRouteLinks = {
    dashboard: '/dashboard',
    landing: '/landing',
    granteeList: '/grantee-list',
    grantList: { baseUrl: '/grant-list', param: '/:granteeId' },
    grantRiskAnalysis: { baseUrl: '/grant-risk-analysis', param: '/:grantId' },
    riskAnalysis: { baseUrl: '/risk-analysis', param: '/:granteeId' },
    portfolioView: { baseUrl: '/portfolio', param: '/:type' },
};

import React, { Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import NoPageFound from '../pages/notFoundPage/notFound';
import { dataSpecialistRouteLinks } from './linkMaster';
import Backdrop from '@material-ui/core/Backdrop';
import BounceLoader from '../components/loading/bounceLoader';
import Landing from '../pages/common/landing';

const DataSpecialistDashboard = lazy(() =>
    import('../pages/dataSpecialistPages/dataSpecialistDashboard')
);
const DataSpecialistAddNewGrantee = lazy(() =>
    import('../pages/dataSpecialistPages/dataSpecialistAddNewGrantee')
);
const dataSpecialistGrantList = lazy(() =>
    import('../pages/dataSpecialistPages/dataSpecialistGrantList')
);

const dataSpecialistGrantAssesment = lazy(() =>
    import('../pages/dataSpecialistPages/dataSpecialistGrantAssesment')
);

const dataSpecialistRenewGrant = lazy(() =>
    import('../pages/dataSpecialistPages/dataSpecialistRenewGrant')
);

const dataSpecialistListAllGrants = lazy(() =>
    import('../pages/dataSpecialistPages/dataSpecialistListAllGrants')
);

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const DataSpecialistRouter = () => {
    const authstate = useSelector((state) => {
        return state.auth.loginState;
    });
    const classes = useStyles();
    return (
        <Suspense
            fallback={
                <Backdrop className={classes.backdrop} open={true}>
                    <BounceLoader />
                </Backdrop>
            }>
            <Switch>
                {/* If authenticated redirect to Dashboard */}
                <Route exact path='/'>
                    {authstate && <Redirect to={dataSpecialistRouteLinks.landing} />}
                </Route>
                {/* Dashboard Route */}
                <Route exact path={dataSpecialistRouteLinks.landing} component={Landing} />
                <Route
                    exact
                    path={dataSpecialistRouteLinks.dashboard}
                    component={DataSpecialistDashboard}
                />
                {/* Add new Grantee Route */}
                <Route
                    exact
                    path={dataSpecialistRouteLinks.addNewGrantee}
                    component={DataSpecialistAddNewGrantee}
                />
                {/* Add grant for a grantee Route */}
                <Route
                    exact
                    path={`${dataSpecialistRouteLinks.grantList.baseUrl}${dataSpecialistRouteLinks.grantList.param}`}
                    component={dataSpecialistGrantList}
                />
                {/* List all Grant Route */}
                <Route
                    exact
                    path={dataSpecialistRouteLinks.allGrantList}
                    component={dataSpecialistListAllGrants}
                />
                {/* Grant Detail of grant Route */}
                <Route
                    exact
                    path={`${dataSpecialistRouteLinks.grantDetail.baseUrl}${dataSpecialistRouteLinks.grantDetail.param}`}
                    component={dataSpecialistGrantAssesment}
                />
                {/* Renew Grant of a grantee */}
                <Route
                    exact
                    path={`${dataSpecialistRouteLinks.renewGrant.baseUrl}${dataSpecialistRouteLinks.renewGrant.param}`}
                    component={dataSpecialistRenewGrant}
                />
                {/* 404 Route */}
                <Route>
                    <Redirect to={dataSpecialistRouteLinks.dashboard} />
                </Route>
            </Switch>
        </Suspense>
    );
};

export default DataSpecialistRouter;

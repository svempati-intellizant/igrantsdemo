import React, { Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { MasterRouteLinks } from './linkMaster';
// import ManagerDashboard from "../pages/managerPages/managerDashboard";
import ManagerDashboard from '../pages/managerPages/new/index';
import managerGrantList from '../pages/managerPages/managerGrantList';
import ManagerGranteeList from '../pages/managerPages/managerGranteeList';
import RiskAnalysis from '../pages/managerPages/riskAnalysis';
import ManagerGrantRiskAnalysis from '../pages/managerPages/managerGrantRiskAnalysis';
import ManagerPortFolioView from '../pages/managerPages/managerPortFolioView';
import Landing from '../pages/common/landing';
const ManagerRouter = () => {
    const authstate = useSelector((state) => {
        return state.auth.loginState;
    });
    return (
        <Suspense fallback={<div className='loaderContainer initialLoader'>Loading....</div>}>
            <Switch>
                <Route exact path='/'>
                    {authstate && <Redirect to={MasterRouteLinks.landing} />}
                </Route>
                <Route exact path='/igrant'>
                    {authstate && <Redirect to={MasterRouteLinks.landing} />}
                </Route>
                <Route path={MasterRouteLinks.landing} component={Landing} />
                <Route path={MasterRouteLinks.dashboard} component={ManagerDashboard} />
                <Route
                    exact
                    path={`${MasterRouteLinks.grantList.baseUrl}${MasterRouteLinks.grantList.param}`}
                    component={managerGrantList}
                />
                <Route exact path={MasterRouteLinks.granteeList} component={ManagerGranteeList} />
                <Route
                    exact
                    path={`${MasterRouteLinks.grantRiskAnalysis.baseUrl}${MasterRouteLinks.grantRiskAnalysis.param}`}
                    component={ManagerGrantRiskAnalysis}
                />
                <Route
                    exact
                    path={`${MasterRouteLinks.riskAnalysis.baseUrl}${MasterRouteLinks.riskAnalysis.param}`}
                    component={RiskAnalysis}
                />
                <Route
                    exact
                    path={`${MasterRouteLinks.portfolioView.baseUrl}${MasterRouteLinks.portfolioView.param}`}
                    component={ManagerPortFolioView}
                />
                {/* <Route>
          <Redirect to={MasterRouteLinks.dashboard} />
        </Route> */}
            </Switch>
        </Suspense>
    );
};

export default ManagerRouter;

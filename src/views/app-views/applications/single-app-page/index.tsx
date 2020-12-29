import { Card, Menu, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { ExperimentOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import Flex from "../../../../components/shared-components/Flex";
import Avatar from "antd/lib/avatar/avatar";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import Description from "./Description";
import Licenses from "./Licenses";
import Packages from "./Packages";
import Devices from "./Devices";
import InnerAppLayout from "../../../../layouts/inner-app-layout";
import IntegrationsHeader from "./IntegrationsHeader";
import { AppService } from "../../../../api";
import News from "./news";
import Loading from "../../../../components/shared-components/Loading";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { IState } from "../../../../redux/reducers";
import { APP_NAME } from "../../../../configs/AppConfig";
import QiwiAppHeader from "./QiwiAppHeader";
import { IMarketAppList } from "../../../../api/types.response";
import Localization from "../../../../utils/Localization";
import { DONE, UPDATING } from "../../../../constants/Messages";
import SmsCampaign from "./SMS";
import Integration from "./Integration";

enum typeOf {
  Retail = 10,
  Agent = 20,
  Expert = 30,
  MyDiscount = 60,
  StockManager = 21,
  WaiterAssistant = 31,
  KitchetAssistant = 32,
  Qiwi = 100,
  SMS = 50,
}
const Options = ({ AppType, location, match }: any) => {
  if (
    AppType === typeOf.Retail ||
    AppType === typeOf.Agent ||
    AppType === typeOf.Expert ||
    AppType === typeOf.StockManager ||
    AppType === typeOf.WaiterAssistant ||
    AppType === typeOf.KitchetAssistant
  ) {
    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={[`${match.url}/:appId/`]}
        selectedKeys={[location.pathname]}
      >
        <Menu.Item key={`${match.url}/description`}>
          <span>
            <IntlMessage id="app.Description" />
          </span>
          <Link to={"description"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/packages`}>
          <span>
            <IntlMessage id="app.Packages" />
          </span>
          <Link to={"packages"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/licenses`}>
          <span>
            <IntlMessage id="app.Licenses" />
          </span>
          <Link to={"licenses"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/devices`}>
          <span>
            <IntlMessage id="app.Devices" />
          </span>
          <Link to={"devices"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/integration`}>
          <span>Integration</span>
          <Link to={"integration"} />
        </Menu.Item>
      </Menu>
    );
  } else if (AppType === typeOf.MyDiscount) {
    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={[`${match.url}/:appId/`]}
        selectedKeys={[location.pathname]}
      >
        <Menu.Item key={`${match.url}/description`}>
          <span>
            <IntlMessage id="app.Description" />
          </span>
          <Link to={"description"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/packages`}>
          <span>
            <IntlMessage id="app.Packages" />
          </span>
          <Link to={"packages"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/news`}>
          <span>
            <IntlMessage id="app.News" />
          </span>
          <Link to={"news"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/integration`}>
          <span>Integration</span>
          <Link to={"integration"} />
        </Menu.Item>
      </Menu>
    );
  } else if (AppType === typeOf.SMS) {
    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={[`${match.url}/:appId/`]}
        selectedKeys={[location.pathname]}
      >
        <Menu.Item key={`${match.url}/description`}>
          <span>
            <IntlMessage id="app.Description" />
          </span>
          <Link to={"description"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/packages`}>
          <span>
            <IntlMessage id="app.Packages" />
          </span>
          <Link to={"packages"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/campaign`}>
          <span>Campaign</span>
          <Link to={"campaign"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/integration`}>
          <span>Integration</span>
          <Link to={"integration"} />
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={[`${match.url}/:appId/`]}
        selectedKeys={[location.pathname]}
      >
        <Menu.Item key={`${match.url}/description`}>
          <span>
            <IntlMessage id="app.Description" />
          </span>
          <Link to={"description"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/packages`}>
          <span>
            <IntlMessage id="app.Packages" />
          </span>
          <Link to={"packages"} />
        </Menu.Item>
        <Menu.Item key={`${match.url}/integration`}>
          <span>Integration</span>
          <Link to={"integration"} />
        </Menu.Item>
      </Menu>
    );
  }
};
const AppOption = (props: any) => {
  return <Options {...props} />;
};

const AppRoute = ({ match, app }: { [key: string]: any }) => {
  return (
    <Switch>
      <Redirect exact from={`${match.url}`} to={`${match.url}/description`} />
      <Route
        path={`${match.url}/description`}
        render={(props) => (
          <Description {...props} LongDescription={app.LongDescription} />
        )}
      />
      <Route
        path={`${match.url}/licenses`}
        render={(props) => <Licenses {...props} AppType={app.AppType} />}
      />
      <Route
        path={`${match.url}/packages`}
        render={(props) => <Packages {...props} packages={app.packages} />}
      />
      <Route
        path={`${match.url}/devices`}
        render={(props) => <Devices {...props} AppType={app.AppType} />}
      />
      <Route
        path={`${match.url}/news`}
        render={(props) => <News {...props} AppType={app.AppType} />}
      />
      <Route path={`${match.url}/campaign`} render={() => <SmsCampaign />} />
      <Route
        path={`${match.url}/integration`}
        render={() => <Integration appData={app} />}
      />
    </Switch>
  );
};

const AboutItem = ({ appData }: any) => {
  const { Photo, Status, Name, ShortDescription, LongDescription } = appData;
  const [shortDesc, setShortDesc] = useState<any>();
  const [longDesc, setLongDesc] = useState<any>();
  const locale = useSelector((state: IState) => state["theme"]!.locale) ?? "en";
  useEffect(() => {
    try {
      setShortDesc(JSON.parse(window.atob(ShortDescription)));
    } catch {
      setShortDesc({ en: "", ru: "", ro: "" });
    }
  }, []);
  useEffect(() => {
    try {
      setLongDesc(JSON.parse(window.atob(LongDescription)));
    } catch {
      setLongDesc({ en: "", ru: "", ro: "" });
    }
  }, []);
  return (
    <Card className="mb-5">
      <Flex>
        <div className="mr-3">
          <Avatar
            src={Photo}
            icon={<ExperimentOutlined />}
            shape="square"
            size={80}
          />
        </div>
        <Flex flexDirection="column">
          <Flex flexDirection="row">
            <h2 className="mr-3">{Name} </h2>
          </Flex>
          <div>
            <span className="text-muted ">
              {shortDesc ? shortDesc[locale] : null}
            </span>
            {Status === 0 && (
              <p
                className="mt-4"
                dangerouslySetInnerHTML={{
                  __html: longDesc ? longDesc[locale] : null,
                }}
              ></p>
            )}
          </div>
        </Flex>
      </Flex>
    </Card>
  );
};

const SingleAppPage = ({ match, location }: any) => {
  const { appID } = match.params;
  const [app, setApp] = useState<IMarketAppList>();
  const [apiKey, setApiKey] = useState<string>("");
  const [activationCode, setActivationCode] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [ExternalSecurityPolicy, setExternalSecurityPolicy] = useState<any>("");
  const getMarketApp = async () => {
    return new AppService().GetMarketAppList().then(async (data) => {
      setLoading(false);
      if (data) {
        const { ErrorCode, MarketAppList } = data;
        if (ErrorCode === 0) {
          const currentApp = MarketAppList.find(
            (app) => app.AppType === +appID
          );
          document.title = `${APP_NAME} - ${currentApp!.Name}`;
          setApp(currentApp);
          if (currentApp) {
            setApiKey(currentApp.ApyKey ?? "");
            setActivationCode(currentApp.LicenseActivationCode ?? 0);
          }
          return currentApp;
        }
      }
    });
  };

  useEffect(() => {
    getMarketApp().then((app) => {
      try {
        setExternalSecurityPolicy(
          JSON.parse(window.atob(app!.ExternalSecurityPolicy.toString()))
        );
      } catch {
        setExternalSecurityPolicy({ CustomerID: null, PublicKey: null });
      }
    });
  }, [appID]);
  const generateApiKey = () => {
    Modal.confirm({
      title: "Are you sure you want to generate a new API Key?",
      onOk: () => {
        return new AppService().GenerateApiKey(app!.ID).then((data) => {
          if (data) {
            if (data.ErrorCode === 0) {
              message
                .loading("Loading...", 1)
                .then(() => {
                  setApiKey(data.ApiKey);
                })
                .then(() =>
                  message.success({
                    content: <Localization msg={DONE} />,
                    key: "updatable",
                    duration: 1,
                  })
                );
            }
          }
        });
      },
    });
  };

  const deleteApiKey = () => {
    Modal.confirm({
      title: "Are you sure you want to delete current API Key?",
      onOk: () =>
        new AppService().DeleteApiKey(app!.ID).then((data) => {
          if (data) {
            if (data.ErrorCode === 0) {
              message
                .loading({
                  content: <Localization msg={UPDATING} />,
                  key: "updatable",
                })
                .then(() => {
                  setApiKey("00000000-0000-0000-0000-000000000000");
                })
                .then(() =>
                  message.success({
                    content: <Localization msg={DONE} />,
                    key: "updatable",
                    duration: 1,
                  })
                );
            }
          }
        }),
      onCancel: () => {},
    });
  };

  if (!app) {
    return <Loading cover="content" />;
  }

  //{appID == typeOf.Agent ||
  //appID == typeOf.Expert ||
  //appID == typeOf.Retail ||
  //appID == typeOf.StockManager ||
  //appID == typeOf.WaiterAssistant ||
  //appID == typeOf.KitchetAssistant ? (
  if (loading) {
    return <Loading cover="content" />;
  }
  return (
    <>
      {app.Status === 1 ? (
        <>
          <AboutItem appData={app} />
          {/*<IntegrationsHeader
            activationCode={activationCode}
            BackOfficeURI={app!.BackOfficeURI}
            setActivationCode={setActivationCode}
            AppID={app.ID}
            apiKey={apiKey}
            setApiKey={setApiKey}
            getMarketApp={getMarketApp}
            generateApiKey={generateApiKey}
            deleteApiKey={deleteApiKey}
            ExternalSecurityPolicy={ExternalSecurityPolicy}
            setExternalSecurityPolicy={setExternalSecurityPolicy}
            /> */}

          {/* {+appID === typeOf.Qiwi && (
            <QiwiAppHeader
              AppID={app.ID}
              BackOfficeURI={app.BackOfficeURI}
              ExternalSecurityPolicy={ExternalSecurityPolicy}
              setExternalSecurityPolicy={setExternalSecurityPolicy}
              apiKey={apiKey}
              generateApiKey={generateApiKey}
              deleteApiKey={deleteApiKey}
              setApiKey={setApiKey}
            />
                )} */}
          <InnerAppLayout
            sideContent={
              <AppOption
                location={location}
                match={match}
                AppType={app.AppType}
              />
            }
            mainContent={<AppRoute match={match} app={app} />}
          />
        </>
      ) : (
        <AboutItem appData={app} />
      )}
    </>
  );
};
export default SingleAppPage;

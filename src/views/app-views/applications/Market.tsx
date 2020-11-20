import React, { lazy, useEffect, useState } from "react";
import PageHeaderAlt from "../../../components/layout-components/PageHeaderAlt";
import {
    Radio,
    Button,
    Row,
    Col,
    Tooltip,
    Tag,
    Progress,
    Avatar,
    Menu,
    Card,
    Modal,
    message,
    Empty,
} from "antd";
import {
    AppstoreOutlined,
    UnorderedListOutlined,
    VerticalAlignBottomOutlined,
    ExperimentOutlined,
    PlusOutlined,
    PaperClipOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import utils from "../../../utils";
import { COLORS } from "../../../constants/ChartConstant";
import Flex from "../../../components/shared-components/Flex";
import EllipsisDropdown from "../../../components/shared-components/EllipsisDropdown";
import { Link, NavLink, Redirect, Route, useHistory } from "react-router-dom";
import { API_APP_URL, APP_PREFIX_PATH } from "../../../configs/AppConfig";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { IApplications } from ".";
import { refreshToken, signOut } from "../../../redux/actions/Auth";
import Loading from "../../../components/shared-components/Loading";

const GridItem = ({ activateApp, deactivateApp, data }) => {
    const [shortDesc, setShortDesc] = useState<any>();
    const locale = useSelector((state) => state["theme"].locale);
    useEffect(() => {
        try {
            setShortDesc(JSON.parse(window.atob(data.ShortDescription)));
        } catch {
            setShortDesc({ en: "", ru: "", ro: "" });
        }
    }, []);
    return (
        <Card>
            <Flex className="mb-3 " justifyContent="between">
                <Link to={`${APP_PREFIX_PATH}/applications/${data.AppType}`}>
                    <div className="cursor-pointer">
                        <Avatar
                            src={data.Photo}
                            icon={<ExperimentOutlined />}
                            shape="square"
                            size={60}
                        />
                    </div>
                </Link>
                {data.Status === 0 ? (
                    <Tag
                        className="text-capitalize cursor-pointer"
                        color="default"
                        onClick={() => activateApp(data.ID)}
                    >
                        <VerticalAlignBottomOutlined />
                        <span className="ml-2 font-weight-semibold">
                            Install
                        </span>
                    </Tag>
                ) : (
                    <Tag className="text-capitalize" color="cyan">
                        <CheckCircleOutlined />
                        <span className="ml-2 font-weight-semibold">
                            Installed
                        </span>
                    </Tag>
                )}
            </Flex>
            <div>
                <Link to={`${APP_PREFIX_PATH}/applications/${data.AppType}`}>
                    <h3 className="mb-0 cursor-pointer ">{data.Name}</h3>
                </Link>
                <p className="text-muted">By IntelectSoft</p>
                <div style={{ minHeight: "70px" }}>
                    {shortDesc ? shortDesc[locale] : null}
                </div>
            </div>
            <Flex justifyContent="between" alignItems="center">
                <div className="text-muted">Free</div>
                <Button
                    onClick={() => deactivateApp(data.ID)}
                    danger
                    type={"link"}
                    style={{
                        visibility: data.Status === 1 ? "visible" : "hidden",
                    }}
                >
                    Delete
                </Button>
            </Flex>
        </Card>
    );
};

const Market = () => {
    const [apps, setApps] = useState<any>([]);
    const dispatch = useDispatch();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const Token = useSelector((state) => state["auth"].token);
    const { confirm } = Modal;
    const getMarketApps = () => {
        setLoading(true);
        return Axios.get(`${API_APP_URL}/GetMarketAppList`, {
            params: { Token },
        })
            .then((res) => {
                setLoading(false);
                console.log(res.data);
                const {
                    ErrorCode,
                    ErrorMessage,
                    MarketAppList,
                } = res.data as IApplications;
                if (ErrorCode === 0) {
                    setApps(MarketAppList);
                } else if (ErrorCode === 118) {
                    dispatch(refreshToken(Token));
                } else if (ErrorCode === -1) {
                    const key = "updatable";
                    message.error({ content: "Error: Internal error.", key });
                }
            })
            .catch((error) => {
                setLoading(false);
                const key = "updatable";
                message.error({ content: error.toString(), key });
            });
    };
    useEffect(() => {
        getMarketApps();
    }, []);

    const deactivateApp = (AppID) => {
        confirm({
            title: `Are you sure you want to deactivate app with ID: ${AppID}?`,
            onOk: () => {
                return new Promise((resolve) => {
                    setTimeout(
                        () =>
                            resolve(
                                Axios.post(`${API_APP_URL}/DeactivateApp`, {
                                    AppID,
                                    Token,
                                })
                                    .then(async (res) => {
                                        console.log(res.data);
                                        if (res.data.ErrorCode === 0) {
                                            await getMarketApps();
                                        } else if (res.data.ErrorCode === 118) {
                                            dispatch(refreshToken(Token));
                                        }
                                    })
                                    .catch((error) => {
                                        const key = "updatable";
                                        message.error({
                                            content: error.toString(),
                                            key,
                                        });
                                    })
                            ),
                        1000
                    );
                });
            },
            onCancel: () => {},
        });
    };

    const activateApp = (AppID) => {
        confirm({
            title: `Are you sure you want to activate app with ID: ${AppID}?`,
            onOk: () => {
                return new Promise((resolve) => {
                    setTimeout(
                        () =>
                            resolve(
                                Axios.post(`${API_APP_URL}/ActivateApp`, {
                                    AppID,
                                    Token,
                                })
                                    .then(async (res) => {
                                        console.log(res.data);
                                        if (res.data.ErrorCode === 0) {
                                            await getMarketApps();
                                        } else if (res.data.ErrorCode === 118) {
                                            dispatch(refreshToken(Token));
                                        } else {
                                            message.error(
                                                res.data.ErrorMessage
                                            );
                                        }
                                    })
                                    .catch((error) => {
                                        const key = "updatable";
                                        message.error({
                                            content: error.toString(),
                                            key,
                                        });
                                    })
                            ),
                        1000
                    );
                });
            },
        });
    };

    return (
        <>
            {loading ? (
                <Loading cover="content" />
            ) : (
                <div
                    className={`my-4 
                    container-fluid`}
                >
                    <Row gutter={16}>
                        {apps.length > 0 && !loading ? (
                            apps.map((elm) => (
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={12}
                                    xl={6}
                                    xxl={6}
                                    key={elm["AppType"]}
                                >
                                    <GridItem
                                        activateApp={activateApp}
                                        deactivateApp={deactivateApp}
                                        data={elm}
                                        key={elm["AppType"]}
                                    />
                                </Col>
                            ))
                        ) : (
                            <Flex justifyContent="center" className="w-100">
                                <Empty />
                            </Flex>
                        )}
                    </Row>
                </div>
            )}
        </>
    );
};

export default Market;

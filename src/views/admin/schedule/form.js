import React, { useState } from "react";
// reactstrap components
import { Card, CardBody, CardHeader, FormGroup } from "reactstrap";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { Modal } from "./styled";

import "./style.scss";
import userProvider from "../../../data-access/user";
import placeProvider from "../../../data-access/place";
import scheduleProvider from "../../../data-access/schedule";

import constants from "../../../utils/const";
import { useEffect } from "react";
import { toast } from "react-toastify";
// import Select from "react-select";
import { MultiDateSelect } from "../../../components/DatePicker";
import moment from "moment";
import { getDay, getKipHoc } from "../../../utils/common";
import { RollbackOutlined, ZoomInOutlined } from "@ant-design/icons";
import sessionScheduleProvider from "@data-access/session-schedule";
import TimeGrid from "./component/TimeGrid";
import schedule from "../../../data-access/schedule";

const ScheduleForm = ({
  eventBack,
  isCreate,
  data,
  courseId,
  listSubject,
  listSchedule = [],
}) => {
  const [state, setState] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [form] = Form.useForm();

  const handleSchedules = (schedules) => {
    const set = new Set();
    (schedules.teacherSchedules || []).forEach((item) =>
      set.add(item.day + "" + item.sessionInfo?.id)
    );
    (schedules.placeSchedules || []).forEach((item) =>
      set.add(item.day + "" + item.sessionInfo?.id)
    );
    (schedules.courseSchedules || []).forEach((item) =>
      set.add(item.day + "" + item.sessionInfo?.id)
    );
    return Array.from(set).map((item) => {
      const session = [
        ...(schedules.teacherSchedules || []),
        ...(schedules.placeSchedules || []),
        ...(schedules.courseSchedules || []),
      ].find(
        (e) =>
          e.day + "" === item.charAt(0) &&
          e.sessionId + "" === item.substring(1)
      );
      return session;
    });
  };

  const [schedules, setSchedules] = useState({
    listSchedule: handleSchedules({ courseSchedules: listSchedule }),
    courseSchedules: listSchedule,
    teacherSchedules: [],
    placeSchedules: [],
  });

  useEffect(() => {
    getPlaces();
    getSessionSchedule();
    const keys = [
      "courseId",
      "day",
      "teacherId",
      "sessionId",
      "placeId",
      "subjectId",
    ];
    if (data)
      form.setFields(
        keys.map((item) => {
          return {
            name: item,
            value: data[item],
          };
        })
      );
  }, [state.reload, state.param]);

  const getSessionSchedule = () => {
    sessionScheduleProvider.search({ size: 999999 }).then((res) => {
      if (res && res.code === 200 && res.data) {
        setSessions(res.data);
      }
    });
  };

  const getSchedule = (param, type) => {
    scheduleProvider.search(param).then((res) => {
      if (res && res.code === 200 && res.data) {
        const newSchedule = Object.assign([], schedules);
        if (param.teacherId) newSchedule.teacherSchedules = res.data;
        if (param.placeId) newSchedule.placeSchedules = res.data;
        newSchedule.listSchedule = handleSchedules(newSchedule);
        setSchedules(newSchedule);
      }
    });
  };

  const getPlaces = () => {
    placeProvider.search({ page: 0, size: 999999 }).then((json) => {
      if (json && json.code === 200) {
        setPlaces(json.data);
      }
    });
  };
  const getTeacher = (subjectId) => {
    userProvider
      .search({
        page: 0,
        size: 1000,
        subjectId,
        role: constants.roles.teacher.value,
      })
      .then((json) => {
        if (json && json.code === 200 && json.data) {
          setTeachers(json.data);
          if (json.data.length === 0)
            toast.error("Kh??ng c?? gi???ng vi??n n??o d???y m??n n??y");
        }
      });
  };

  const create = (body) => {
    scheduleProvider.create(body).then((json) => {
      if (json && json.code === 200 && json.data) {
        eventBack();
        toast.success("t???o m???i th??nh c??ng");
      } else if (json && json.code === 401) {
        window.location.href = "/login";
      } else {
        setState({ ...state, loading: false });
        toast.error(json.message);
      }
    });
  };
  const update = (body) => {
    scheduleProvider.update(body, data.id).then((json) => {
      if (json && json.code === 200 && json.data) {
        eventBack();
        toast.success(json.message);
      } else if (json && json.code === 401) {
        window.location.href = "/login";
      } else {
        setState({ ...state, loading: false });
        toast.error(json.message);
      }
    });
  };

  const beforeSave = (values) => {
    const time = sessions.find((item) => item.id === values.sessionId);
    const start = moment(time.startTime, "HH:mm");
    const end = moment(time.endTime, "HH:mm");
    if (
      schedules.listSchedule.some((item) => {
        const startTime = moment(item.sessionInfo?.startTime, "HH:mm");
        const endTime = moment(item.sessionInfo?.endTime, "HH:mm");
        if (
          (startTime <= start &&
            start <= endTime &&
            item.day === values.day &&
            (data?.id || -1) != item.id) ||
          (startTime <= end &&
            end <= endTime &&
            item.day === values.day &&
            (data?.id || -1) != item.id)
        ) {
          return true;
        }
        return false;
      })
    ) {
      toast.error("B??? tr??ng l???ch");
      return false;
    }
    return true;
  };

  const onFinish = (values) => {
    const body = { ...values, courseId };
    if (beforeSave(values)) {
      if (isCreate) {
        create(body);
      } else {
        update(body);
      }
    }

    console.log("submit", values);
  };

  return (
    <Modal
      className="modal-lg"
      size="sm"
      onCancel={eventBack}
      footer={null}
      visible={true}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <div className="head text-muted text-center mt-2 mb-3">
          {isCreate ? <big> Th??m l???ch </big> : <big>S???a l???ch</big>}
        </div>
        <Row>
          <Col span={15} style={{ paddingTop: "25px" }}>
            <div className="head-content">
              <h3 className="mb-0 text-center pb-1 mt--3">Th???i gian bi???u</h3>
            </div>
            <TimeGrid listSchedule={schedules.listSchedule} />
          </Col>
          <Col span={9} style={{ padding: "20px" }}>
            <Form.Item
              label="M??n"
              name="subjectId"
              // required
              rules={[
                {
                  required: true,
                  message: "Ch???n m??n",
                },
              ]}
            >
              <Select
                placeholder="Ch???n m??n h???c"
                options={listSubject?.map((item) => {
                  return {
                    label: item.name,
                    value: item.id,
                  };
                })}
                onChange={(id) => getTeacher(id)}
              />
            </Form.Item>
            <Form.Item
              label="Th???"
              name="day"
              required
              rules={[
                {
                  required: true,
                  message: "Ch???n th???",
                },
              ]}
            >
              <Select placeholder="Ch???n th???" options={constants.day} />
            </Form.Item>
            <Form.Item
              label="Gi???ng vi??n"
              name="teacherId"
              required
              rules={[
                {
                  required: true,
                  message: "Ch???n gi???ng vi??n",
                },
              ]}
            >
              <Select
                placeholder="Ch???n gi???ng vi??n"
                options={teachers.map((item) => {
                  return {
                    label: item.fullName,
                    value: item.id,
                  };
                })}
                onChange={(teacherId) => getSchedule({ teacherId })}
              />
            </Form.Item>
            <Form.Item
              label="Th???i gian"
              name="sessionId"
              required
              rules={[
                {
                  required: true,
                  message: "Ch???n k??p",
                },
              ]}
            >
              <Select
                placeholder="Ch???n k??p"
                showSearch
                options={[
                  // {
                  //   label: (
                  //     <div
                  //       style={{
                  //         color: "var(--blue-8)",
                  //         display: "flex",
                  //         alignItems: "baseline",
                  //       }}
                  //     >
                  //       <ZoomInOutlined
                  //         style={{
                  //           marginRight: "10px",
                  //         }}
                  //       />
                  //       <span>Th??m k??p m???i</span>
                  //     </div>
                  //   ),
                  //   value: -1,
                  // },
                  ...sessions.map((item) => {
                    return {
                      label: item.startTime + " - " + item.endTime,
                      value: item.id,
                    };
                  }),
                ]}
              />
            </Form.Item>
            <Form.Item
              label="?????a ??i???m"
              name="placeId"
              required
              rules={[
                {
                  required: true,
                  message: "Ch???n ?????a ??i???m",
                },
              ]}
            >
              <Select
                placeholder="Ch???n ?????a ??i???m"
                options={places.map((item) => {
                  return {
                    label: item.address,
                    value: item.id,
                  };
                })}
                onChange={(placeId) => getSchedule({ placeId })}
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="text-center">
          <Button
            className="mr-3"
            style={{
              backgroundColor: "var(--danger)",
              borderColor: "var(--danger)",
            }}
            type="primary"
            onClick={() => eventBack()}
          >
            Tr??? l???i
          </Button>
          {isCreate ? (
            <Button
              style={{
                backgroundColor: "var(--green)",
                borderColor: "var(--green)",
              }}
              htmlType="submit"
              type="primary"
              // onClick={() => create()}
            >
              Th??m
            </Button>
          ) : (
            <Button
              htmlType="submit"
              type="primary"
              style={{
                backgroundColor: "var(--blue)",
                borderColor: "var(--blue)",
              }}
            >
              S???a
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
};
export default ScheduleForm;

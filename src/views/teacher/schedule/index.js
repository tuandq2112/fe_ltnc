// core components
import { CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";
import Pagination from "@components/Pagination";
import { Content } from "@containers/Content";
import GroupIcon from "@material-ui/icons/Group";
import { defaultState, getKipHoc } from "@utils/common";
import constants from "@utils/const";
import { Badge, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import scheduleProvider from "@data-access/schedule";
import CancelForm from "./CancelForm.js";
import ChangeScheduleForm from "./form";
const Result = (props) => {
  const { currentUser } = props; //useSelector((state) => state.userApp.currentUser);
  const [state, setState] = useState(defaultState);
  const [modal, setModal] = useState({});

  const changePage = (value) => {
    setState({ ...state, page: value });
  };

  const getData = () => {
    let param =
      currentUser.role === constants.role.teacher
        ? { teacherId: currentUser.userId }
        : {};
    scheduleProvider.search(param).then((json) => {
      if (json && json.code === 200) {
        const size = parseInt(json.totalElements / state.size) + 1;
        setState({
          ...state,
          dataRender: json.data,
          totalPage: json.totalPages,
          page: json.pageNumber,
        });
      } else if (json.code === 401) {
        setState({
          loading: false,
        });
        window.location.href = "/auth/login";
      } else {
        setState({
          loading: false,
        });
        toast.error(json.message);
      }
    });
  };
  useEffect(() => {
    getData();
  }, [state.reload, state.param]);

  const showModal = (data, type) => {
    let isCancel = type === "cancel";
    let isChange = type === "change";
    let reload = type === "back" ? !state.reload : state.reload;

    setState({
      ...state,
      showModal: !state.showModal,
      reload,
    });

    setModal({
      dataDetail: data,
      isCancel,
      isChange,
    });
  };
  const showListStudent = (data) => {
    let url = "/teacher/list-student?";
    if (data.courseId) {
      url += "courseId=" + data.courseId;
    }
    if (data.subjectId) {
      url += "&subjectId=" + data.subjectId;
    }
    window.location.href = url;
  };
  const columns = [
    {
      title: (
        <div className="custom-header">
          <div className="title-box">STT</div>
        </div>
      ),
      dataIndex: "stt",
      key: "stt",
      fixed: "left",
      width: 50,
      render: (_, __, index) => {
        return index + 1 + state.page * 10;
      },
    },
    {
      title: (
        <div className="custom-header">
          <div className="title-box">M?? Kh??a</div>
        </div>
      ),
      key: "courseCode",
      width: 100,
      fixed: "left",
      render: (_, data) => {
        return data.codeCourse;
      },
    },
    {
      title: (
        <div className="custom-header">
          <div className="title-box">T??n Kh??a</div>
        </div>
      ),
      fixed: "left",
      key: "courseName",
      width: 180,
      render: (_, data) => {
        return data.nameCourse;
      },
    },
    {
      title: (
        <div className="custom-header">
          <div className="title-box">M?? M??n</div>
        </div>
      ),
      key: "subjectCode",
      fixed: "left",
      width: 100,
      render: (_, data, index) => {
        return data.subjectInfo.code;
      },
    },
    {
      title: (
        <div className="custom-header">
          <div className="title-box">T??n M??n</div>
        </div>
      ),
      fixed: "left",
      key: "subjectName",
      width: 180,
      render: (_, data, index) => {
        return data.subjectInfo.name;
      },
    },
    {
      title: (
        <div className="custom-header">
          <div className="title-box">Tr???ng Th??i</div>
        </div>
      ),
      key: "courseStatus",
      width: 100,
      render: (_, data) => {
        return (
          (data.status === 1 && (
            <div style={{ display: "flex" }}>
              <Tooltip title="D??? ki??n">
                <Badge status="processing" />
              </Tooltip>
              <span>D??? ki???n</span>
            </div>
          )) ||
          (data.status === 2 && (
            <div style={{ display: "flex" }}>
              <Tooltip title="??ang h???c">
                <Badge status="success" />
              </Tooltip>
              <span>??ang h???c</span>
            </div>
          )) ||
          (data.status === 3 && (
            <div style={{ display: "flex" }}>
              <Tooltip title="Ho??n th??nh">
                <Badge status="error" />
              </Tooltip>
              <span>Ho??n th??nh</span>
            </div>
          )) ||
          (data.status === 0 && (
            <div style={{ display: "flex" }}>
              <Tooltip title="Kh??ng x??c ?????nh">
                <Badge status="default" />
              </Tooltip>
              <span>Kh??ng x??c ?????nh</span>
            </div>
          ))
        );
      },
    },
    {
      title: (
        <div className="custom-header">
          <div className="title-box">Th???</div>
        </div>
      ),
      key: "day",
      width: 100,
      render: (_, data) => {
        return "Th??? " + (data.day + 1);
      },
    },
    {
      title: (
        <div className="custom-header">
          <div className="title-box">Th???i gian</div>
        </div>
      ),
      key: "time",
      width: 150,
      render: (_, data) => {
        return getKipHoc(data.kipHoc);
      },
    },
    {
      title: (
        <div className="custom-header">
          <div className="title-box">T??n gi???ng vi??n</div>
        </div>
      ),
      key: "teacherName",
      width: 150,
      render: (_, data) => {
        return data.teacher.fullName;
      },
    },
    {
      title: (
        <div className="custom-header">
          <div className="title-box">?????a ??i???m</div>
        </div>
      ),
      key: "time",
      width: 250,
      render: (_, data) => {
        return data.placeInfo.address;
      },
    },
    {
      title: (
        <div className="custom-header">
          <div className="title-box">Ti???n ??ch</div>
        </div>
      ),
      key: "time",
      width: 100,
      fixed: "right",
      render: (_, data) => {
        return (
          <div>
            <Tooltip placement="top" title="Danh s??ch sinh vi??n">
              <GroupIcon
                className="text-blue pointer"
                onClick={() => showListStudent(data)}
              />
            </Tooltip>
            {/* <Tooltip placement="top" title="?????i l???ch">
              <SyncOutlined
                onClick={() => showModal(data, "change")}
                className="text-info i"
              />
            </Tooltip> */}
            {!data.reason && (
              <Tooltip placement="top" title="H???y l???ch">
                <CloseCircleOutlined
                  onClick={() => showModal(data, "cancel")}
                  className="text-red i"
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <Content>
      <div className="content">
        <div className="head-content">
          <h3>Th???i kh??a bi???u</h3>
        </div>
        <Table
          className="custom-table"
          dataSource={state.dataRender}
          scroll={{ x: 830, y: "auto" }}
          rowKey={(record) => record.id}
          columns={columns}
          footer={null}
        ></Table>
      </div>
      <Pagination
        page={state.page}
        totalPage={state.totalPage}
        changePage={changePage}
      ></Pagination>
      {modal.isChange && (
        <ChangeScheduleForm
          data={modal.dataDetail}
          eventBack={() => showModal(null, "back")}
        />
      )}
      {modal.isCancel && (
        <CancelForm
          data={modal.dataDetail}
          eventBack={() => showModal(null, "back")}
        />
      )}
    </Content>
  );
};

export default connect((state) => {
  return {
    currentUser: state.auth.currentUser,
  };
})(Result);

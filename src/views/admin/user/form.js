import { RollbackOutlined } from "@ant-design/icons";
import { DatePicker } from "@components/DatePicker";
import uploadProvider from "@data-access/upload";
import userProvider from "@data-access/user";
import api from "@utils/api";
import constants from "@utils/const";
import moment from "moment";
import React, { useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Modal,
  Row,
} from "reactstrap";

const UserForm = (props) => {
  const { eventBack, isCreate, isDetail } = props;
  const {
    id,
    fullName,
    age,
    gender,
    address,
    phoneNumber,
    email,
    username,
    password,
    avatar,
    birth,
    cmnd,
    role,
    status,
  } = props.data;
  const [state, setState] = useState({
    defaultModal: true,
    data:
      {
        id,
        fullName,
        age,
        gender: {
          value: gender,
          label:
            gender === constants.gender.nam.value
              ? constants.gender.nam.label
              : constants.gender.nu.label,
        },
        address,
        phoneNumber,
        email,
        username,
        password,
        avatar,
        birth,
        cmnd,
        role,
        status,
      } || {},
  });

  const create = () => {
    const body = { ...state.data, gender: state.gender && state.gender.value };
    userProvider.create(body).then((json) => {
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
  const update = (body) => {
    body.gender = body.gender.value;
    userProvider.update(body.id, body).then((json) => {
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
  const change = (e, value) => {
    if (typeof e === "string") {
      setState({ ...state, data: { ...state.data, [e]: value } });
    } else
      setState({
        ...state,
        data: { ...state.data, [e.target.name]: e.target.value },
      });
  };

  const handleSubmitFile = (event) => {
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    console.log(props);
    console.log("if", !isDetail && !isCreate);

    if (!isDetail) {
      uploadProvider.uploadAvatar2(formData).then((json) => {
        console.log("vao");
        if (json.code === 200) {
          console.log(json.data);
          setState({ ...state, data: { ...state.data, avatar: json.data } });
          toast.success("c???p nh???t th??nh c??ng");
        } else {
          toast.error(json.message);
        }
      });
    } else {
      uploadProvider.uploadAvatar(formData, id).then((json) => {
        if (json.code === 200) {
          console.log(json.data);
          setState({ ...state, data: { ...state.data, avatar: json.data } });
          toast.success("c???p nh???t th??nh c??ng");
        } else {
          toast.error(json.message);
        }
      });
    }
  };

  console.log("props", props);
  return (
    <Modal className="modal-lg" size="sm" isOpen={true}>
      <div className="modal-body p-0">
        <Card className="bg-secondary shadow border-0">
          <CardHeader
            className="bg-transparent"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div className="text-muted text-center mt-2 mb-3">
              {isDetail ? (
                <big>Chi ti???t t??i kho???n</big>
              ) : isCreate ? (
                <big>Th??m m???i t??i kho???n</big>
              ) : (
                <big>Ch???nh s???a t??i kho???n</big>
              )}
            </div>
            <RollbackOutlined
              onClick={() => {
                eventBack();
              }}
            />
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form">
              <Row>
                <Col lg="6">
                  <FormGroup>
                    <label className="form-control-label">Avatar</label>
                    <div class="avatar-wrapper">
                      <label class="profile-pic" htmlFor="file">
                        <span className="title-select">Thay ???nh ?????i di???n</span>
                        <img
                          class="profile-pic"
                          src={api.image + state.data.avatar}
                          htmlFor="file"
                        />
                      </label>
                      <div class="upload-button">
                        <span class="fa fa-arrow-circle-up" aria-hidden="true">
                          Ch???n ???nh
                        </span>
                      </div>
                      <input
                        style={{ display: "none" }}
                        className="file-upload"
                        name="file"
                        id="file"
                        type="file"
                        defaultValue=""
                        accept="image/*"
                        onChange={(event) => handleSubmitFile(event)}
                      ></input>
                    </div>
                    {/* <img
                      alt=""
                      src={api.image + state.data.avatar}
                      style={{marginBottom:"27px"}}
                      width="300px"
                      height="300px"
                    /> */}
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      T??n ????ng nh???p:
                    </label>
                    <Input
                      className="form-control-alternative"
                      value={state.data.username}
                      name="username"
                      type="text"
                      disabled={isDetail || !isCreate}
                      onChange={(e) => change(e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      M???t kh???u
                    </label>
                    <Input
                      className="form-control-alternative"
                      placeholder="M???t kh???u m???c ?????nh: 1"
                      value={state.data.password}
                      name="password"
                      type="text"
                      disabled={isDetail || !isCreate}
                      max="150"
                      onChange={(e) => change(e)}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      H??? v?? t??n:
                    </label>
                    <Input
                      className="form-control-alternative"
                      value={state.data.fullName}
                      name="fullName"
                      type="text"
                      disabled={isDetail}
                      onChange={(e) => change(e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      Tu???i
                    </label>
                    <Input
                      className="form-control-alternative"
                      value={state.data.age}
                      name="age"
                      type="number"
                      disabled={isDetail}
                      max="150"
                      onChange={(e) => change(e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      Ng??y sinh
                    </label>
                    <DatePicker
                      className="form-control"
                      placeholder="Ch???n ng??y"
                      value={state.data.birth && moment(state.data.birth)}
                      format={"DD-MM-YYYY"}
                      picker="date"
                      onChange={(e) => change("birth", e.format("YYYY-MM-DD"))}
                      disabled={isDetail}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      Gi???i t??nh:
                    </label>
                    <Select
                      value={state.data.gender}
                      options={[
                        { label: "Nam", value: "NAM" },
                        { label: "N???", value: "NU" },
                      ]}
                      // name="gender"
                      // type="number"
                      onChange={(item) => change("gender", item)}
                      isDisabled={isDetail}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      ?????a ch???:
                    </label>
                    <Input
                      className="form-control-alternative"
                      value={state.data.address}
                      name="address"
                      type="text"
                      onChange={(e) => change(e)}
                      disabled={isDetail}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      S??? ??i???n tho???i:
                    </label>
                    <Input
                      className="form-control-alternative"
                      value={state.data.phoneNumber}
                      name="phoneNumber"
                      type="number"
                      autoComplete="off"
                      onChange={(e) => change(e)}
                      disabled={isDetail}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      Email:
                    </label>
                    <Input
                      className="form-control-alternative"
                      value={state.data.email}
                      name="email"
                      type="text"
                      autoComplete="off"
                      onChange={(e) => change(e)}
                      disabled={isDetail}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      S??? CMND:
                    </label>
                    <Input
                      className="form-control-alternative"
                      value={state.data.cmnd}
                      name="cmnd"
                      type="number"
                      autoComplete="off"
                      onChange={(e) => change(e)}
                      disabled={isDetail}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="text-center">
                <Button
                  className="my-12"
                  color="primary"
                  type="button"
                  onClick={() => eventBack()}
                >
                  Tr??? l???i
                </Button>
                {!isDetail &&
                  (isCreate ? (
                    <Button
                      className="my-12"
                      color="primary"
                      type="button"
                      onClick={() => create(state.data)}
                    >
                      Th??m
                    </Button>
                  ) : (
                    <Button
                      className="my-12"
                      color="primary"
                      type="button"
                      onClick={() => update(state.data)}
                    >
                      S???a
                    </Button>
                  ))}
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </Modal>
  );
};
export default UserForm;

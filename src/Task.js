/* eslint-disable array-callback-return */
import React, { useState, Suspense, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function Task() {
  const URL = "http://localhost:3000/tasks";
  const [update, setUpdate] = useState(true);
  const [id, setID] = useState(null);
  const [Task, setTask] = useState([]);
  const [TaskStatus, setTaskStatus] = useState("");
  const [query, setQuery] = useState("");
  const [taskHead, setTaskHead] = useState("");
  const [taskDetail, setTaskDetail] = useState("");
  const [taskHeadEdit, setTaskHeadEdit] = useState("");
  const [taskDetailEdit, setTaskDetailEdit] = useState("");
  const [activeMenu, setActiveMenu] = useState("All");

  let disable = false;
  if (taskHead === "" || taskDetail === "") disable = true;

  useEffect(() => {
    getData();
    setUpdate(false);
  }, [update]);
  const getData = async () => {
    const response = await axios.get(URL);
    setTask(response.data);
  };

  const addData = () => {
    axios.post(`${URL}`, {
      taskdetail: taskDetail,
      taskhead: taskHead,
      completed: false,
    });
    setTaskDetail("");
    setTaskHead("");
    cancelCourse();
  };
  const removeData = (id) => {
    axios.delete(`${URL}/${id}`).then(() => {
      const del = Task.filter((task) => id !== task.id);
      setTask(del);
    });
  };
  const completeTask = (id) => {
    axios.patch(`${URL}/${id}`, {
      completed: true,
    });
  };
  const cancelCourse = () => {
    document.getElementById("add-task-form").reset();
  };
  return (
    <div>
      <Suspense
        fallback={
          <div className="center spinner-grow text-warning" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        }
      >
        <div className="container bg-primary pt-3 pb-5 my-6 shadow-lg rounded ">
          <div className="row text-center">
            <p className="text-primary text-uppercase mb-2 text-light">
              # TODO
            </p>
          </div>
          <div className="row text-center">
            <h1 className="display-6 mb-4 Playfair text-secondary ">
              Manage Your Daily Task Here
            </h1>
          </div>

          <div
            class="btn-group container mt-4"
            role="group"
            aria-label="Basic example"
          >
            <button
              type="button"
              class={
                activeMenu === "All"
                  ? "active btn btn-outline-secondary"
                  : "btn btn-outline-secondary"
              }
              onClick={(e) => {
                setActiveMenu("All");
                setUpdate(true);
                return setTaskStatus("");
              }}
            >
              <i class="bi bi-file-text"></i> All
            </button>
            <button
              type="button"
              class={
                activeMenu === "Active"
                  ? "active btn btn-outline-warning"
                  : "btn btn-outline-warning"
              }
              onClick={(e) => {
                setActiveMenu("Active");
                setUpdate(true);
                return setTaskStatus("Active");
              }}
            >
              <i class="bi bi-lightbulb-fill"></i> Active
            </button>
            <button
              type="button"
              class={
                activeMenu === "Completed"
                  ? "active btn btn-outline-success"
                  : "btn btn-outline-success"
              }
              onClick={(e) => {
                setActiveMenu("Completed");
                setUpdate(true);
                return setTaskStatus("Completed");
              }}
            >
              <i class="bi bi-check2-circle"></i> Completed
            </button>
          </div>
          <div className="row text-center g-0 justify-content-center">
            <div className="col">
              <div className="container my-4">
                <div className="row height d-flex justify-content-center align-items-center">
                  <div className="col-md-6">
                    <div className="form">
                      <input
                        type="text"
                        className="form-control form-input"
                        placeholder="Search anything..."
                        onChange={(event) => setQuery(event.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="p-3 text-center rounded mx-auto shadow mx-4 col mb-3 bg-light"
            style={{ width: "55rem" }}
          >
            <form id="add-task-form">
              <div class="form-floating mb-3">
                <input
                  type="text"
                  class="form-control"
                  id="floatingInput"
                  placeholder="GYM"
                  onChange={(e) => setTaskHead(e.target.value)}
                  required
                />
                <label for="floatingInput">Task Heading</label>
              </div>
              <div class="form-floating  mb-3 ">
                <input
                  type="text"
                  class="form-control"
                  id="floatingInput"
                  placeholder="Hit The GYM"
                  onChange={(e) => setTaskDetail(e.target.value)}
                  required
                />
                <label for="floatingInput">Task Detail</label>
              </div>
              <button
                disabled={disable}
                type="button"
                class="btn btn-outline-warning"
                onClick={() => {
                  setUpdate(true);
                  return addData();
                }}
              >
                <i class="bi bi-file-earmark-plus"></i> Add
              </button>
            </form>
          </div>
          {Task.filter((a) => {
            if (TaskStatus === "") {
              return a;
            } else if (TaskStatus === "Active") {
              return !a.completed;
            } else if (TaskStatus === "Completed") {
              return a.completed;
            }
          })
            .filter((p) => {
              if (query === "") {
                return p;
              } else if (
                p.taskdetail.toLowerCase().includes(query.toLowerCase())
              ) {
                return p;
              } else if (
                p.taskhead.toLowerCase().includes(query.toLowerCase())
              ) {
                return p;
              }
            })
            .map((p) => (
              <div
                key={p.id}
                class="p-3 text-center rounded mx-auto shadow mx-4 col mb-3 bg-light"
                style={{ width: "55rem" }}
              >
                {p.completed ? (
                  <>
                    <h5 class=" text-secondary text-uppercase text-decoration-line-through">
                      {p.taskhead}
                    </h5>
                    <p class=" d-inline text-white mt-3  text-decoration-line-through">
                      {p.taskdetail}
                    </p>
                  </>
                ) : (
                  <>
                    <h5 class=" text-secondary text-uppercase ">
                      {p.taskhead}
                    </h5>
                    <p class=" d-inline text-white mt-3  ">{p.taskdetail}</p>
                  </>
                )}

                <div
                  class="btn-group container mt-4"
                  role="group"
                  aria-label="Basic example"
                >
                  <button
                    type="button"
                    class="btn btn-secondary"
                    disabled={p.completed}
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                    onClick={() => {
                      setUpdate(true);
                      return axios.get(`${URL}/${p.id}`).then((res) => {
                        const task = res.data;
                        setID(task.id);
                        setTaskDetailEdit(task.taskdetail);
                        setTaskHeadEdit(task.taskhead);
                      });
                    }}
                  >
                    <i class="bi bi-pencil-square"></i> Edit
                  </button>
                  <button
                    type="button"
                    class="btn btn-success"
                    disabled={p.completed}
                    onClick={() => {
                      setUpdate(true);
                      return completeTask(p.id);
                    }}
                  >
                    <i class="bi bi-check2-circle"></i> Complete
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    onClick={() => {
                      setUpdate(true);
                      return removeData(p.id);
                    }}
                  >
                    <i class="bi bi-trash-fill"></i> Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
        <div
          class="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">
                  Edit Task
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <form id="edit-task-form">
                  <div class="form-floating  mb-3 ">
                    <input
                      type="text"
                      class="form-control"
                      id="floatingInput"
                      value={taskHeadEdit}
                      onChange={(e) => setTaskHeadEdit(e.target.value)}
                      required
                    />
                    <label for="floatingInput">Task Head</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input
                      type="text"
                      class="form-control"
                      id="floatingInput"
                      value={taskDetailEdit}
                      onChange={(e) => setTaskDetailEdit(e.target.value)}
                      required
                    />
                    <label for="floatingInput">Task Detail</label>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    setUpdate(true);
                    return axios.put(`${URL}/${id}`, {
                      taskhead: taskHeadEdit,
                      taskdetail: taskDetailEdit,
                    });
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}

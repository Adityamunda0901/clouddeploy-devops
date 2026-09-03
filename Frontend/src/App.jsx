import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // CREATE / UPDATE
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const isEditing = editingTask !== null;

      const url = isEditing
        ? `${API_URL}/api/tasks/${editingTask.id}`
        : `${API_URL}/api/tasks`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setTitle("");
      setStatus("pending");
      setEditingTask(null);
      setShowForm(false);

      await fetchTasks();
    } catch (error) {
      console.error(error);
      setError(
        isEditing
          ? "Failed to update task"
          : "Failed to create task"
      );
    } finally {
      setSaving(false);
    }
  };

  // EDIT
  const startEditing = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setStatus(task.status);
    setShowForm(true);
    setError("");
  };

  // CANCEL EDIT
  const cancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setTitle("");
    setStatus("pending");
    setError("");
  };

  // DELETE
  const deleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      await fetchTasks();
    } catch (error) {
      console.error(error);
      setError("Failed to delete task");
    }
  };

  const completed = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div>
          <h1>🚀 CloudDeploy</h1>
          <p>DevOps Task Management Dashboard</p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          Backend Connected
        </div>
      </header>

      {/* MAIN */}
      <main className="container">

        <section className="hero">
          <h2>Task Dashboard</h2>
          <p>
            Manage your tasks through the CloudDeploy API and PostgreSQL
            database.
          </p>
        </section>

        {/* STATISTICS */}
        <section className="stats">

          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{tasks.length}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{completed}</strong>
          </div>

          <div className="stat-card">
            <span>In Progress</span>
            <strong>{inProgress}</strong>
          </div>

          <div className="stat-card">
            <span>Pending</span>
            <strong>{pending}</strong>
          </div>

        </section>

        {/* TASK SECTION */}
        <section className="tasks-section">

          <div className="section-header">

            <h2>Tasks</h2>

            <div className="actions">

              <button
                className="refresh-button"
                onClick={fetchTasks}
              >
                ↻ Refresh
              </button>

              <button
                className="add-button"
                onClick={() => {
                  if (showForm) {
                    cancelForm();
                  } else {
                    setShowForm(true);
                    setError("");
                  }
                }}
              >
                {showForm ? "Cancel" : "+ Add Task"}
              </button>

            </div>

          </div>

          {/* CREATE / EDIT FORM */}
          {showForm && (
            <form
              className="task-form"
              onSubmit={handleSubmit}
            >

              <h3>
                {editingTask ? "Edit Task" : "Create New Task"}
              </h3>

              <div className="form-group">

                <label>Task Title</label>

                <input
                  type="text"
                  placeholder="e.g. Learn Kubernetes"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>Status</label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>
                </select>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={cancelForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="create-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingTask
                    ? "Update Task"
                    : "Create Task"}
                </button>

              </div>

            </form>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* TASK LIST */}
          {loading ? (
            <p className="message">
              Loading tasks...
            </p>
          ) : tasks.length === 0 ? (
            <p className="message">
              No tasks found.
            </p>
          ) : (
            <div className="task-list">

              {tasks.map((task) => (

                <div
                  className="task-card"
                  key={task.id}
                >

                  <div className="task-info">

                    <h3>{task.title}</h3>

                    <small>
                      Created:{" "}
                      {new Date(
                        task.created_at
                      ).toLocaleDateString()}
                    </small>

                  </div>

                  <div className="task-actions">

                    <span
                      className={`badge ${task.status}`}
                    >
                      {task.status}
                    </span>

                    <button
                      className="edit-button"
                      onClick={() =>
                        startEditing(task)
                      }
                    >
                      ✏ Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteTask(task.id)
                      }
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

      </main>

      <footer>
        <p>
          CloudDeploy • React + Node.js + PostgreSQL + Docker
        </p>
      </footer>

    </div>
  );
}

export default App;

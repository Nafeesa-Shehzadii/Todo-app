import React, { useState } from "react";
import {
  IonApp,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonCheckbox,
  IonDatetime,
  IonAlert,
  IonToast,
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonToggle,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodo,
  editTodo,
  deleteTodo,
  toggleTodo,
} from "../store/slices/todoSlice";
import { calendarOutline } from "ionicons/icons";
import styles from "./styles.module.css"; // Import the CSS file
import { toggleTheme } from "../store/slices/themeSlice";
const Home: React.FC = () => {
  const todos = useSelector((state: any) => state.todos.todos);
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);
  const [inputVal, setInputVal] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [sort, setSort] = useState<string>("Added date");
  const [showAlert, setShowAlert] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [showToast, setShowToast] = useState({ message: "", show: false });
  const [showPopover, setShowPopover] = useState(false);

  const handleAddTodo = () => {
    if (inputVal && selectedDate) {
      if (editId !== null) {
        dispatch(editTodo({ id: editId, val: inputVal, date: selectedDate }));
        setShowToast({ message: "Task edited successfully!", show: true });
      } else {
        dispatch(
          addTodo({
            id: new Date().getTime(),
            val: inputVal,
            isDone: false,
            date: selectedDate,
          })
        );
        setShowToast({ message: "Task added successfully!", show: true });
      }
      setInputVal("");
      setSelectedDate("");
      setEditId(null);
    }
  };

  const handleDeleteTodo = (id: number) => {
    setTaskToDelete(id);
    setShowAlert(true);
  };

  const confirmDeleteTodo = () => {
    dispatch(deleteTodo(taskToDelete!));
    setShowToast({ message: "Task deleted successfully!", show: true });
    setShowAlert(false);
  };

  const handleEditTodo = (id: number, val: string, date: string) => {
    setInputVal(val);
    setSelectedDate(date);
    setEditId(id);
  };

  const handleToggleDone = (id: number) => {
    dispatch(toggleTodo(id));
  };

  const filteredTodos = todos.filter((todo: any) => {
    if (filter === "All") return true;
    if (filter === "Completed") return todo.isDone;
    if (filter === "Pending") return !todo.isDone;
    return true;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sort === "Date wise") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sort === "Completed first") {
      return a.isDone === b.isDone ? 0 : a.isDone ? -1 : 1;
    } else if (sort === "Pending first") {
      return a.isDone === b.isDone ? 0 : a.isDone ? 1 : -1;
    }
    return 0;
  });

  const handleToggle = () => {
    dispatch(toggleTheme());
    document.body.classList.toggle("dark", !isDarkMode);
  };

  return (
    <IonApp className={styles.todoListCcontainer}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Todo List</IonTitle>
          <IonToggle
            checked={isDarkMode}
            onIonChange={handleToggle}
            slot="end"
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonItem className={styles.inputContainer}>
          <IonInput
            placeholder="What do you need to do?"
            value={inputVal}
            onIonChange={(e) => setInputVal(e.detail.value!)}
          />
          <IonButton slot="end" onClick={() => setShowPopover(true)}>
            <IonIcon icon={calendarOutline} />
          </IonButton>

          <IonButton
            slot="end"
            onClick={handleAddTodo}
            disabled={!inputVal || !selectedDate}
            color="success"
          >
            {editId ? "Edit" : "Add"}
          </IonButton>

          <IonPopover
            isOpen={showPopover}
            onDidDismiss={() => setShowPopover(false)}
          >
            <IonDatetime
              value={selectedDate}
              onIonChange={(e) => setSelectedDate(e.detail.value!)}
              onIonCancel={() => setShowPopover(false)}
              className={styles.customDatePicker}
            />
          </IonPopover>
        </IonItem>

        <IonItem className={styles.filterSortContainer}>
          <IonLabel>Filter:</IonLabel>
          <IonSelect
            value={filter}
            onIonChange={(e) => setFilter(e.detail.value)}
            mode="md"
          >
            <IonSelectOption value="All">All</IonSelectOption>
            <IonSelectOption value="Completed">Completed</IonSelectOption>
            <IonSelectOption value="Pending">Pending</IonSelectOption>
          </IonSelect>

          <IonLabel>Sort:</IonLabel>
          <IonSelect value={sort} onIonChange={(e) => setSort(e.detail.value)}>
            <IonSelectOption value="Added date">Added date</IonSelectOption>
            <IonSelectOption value="Completed first">
              Completed first
            </IonSelectOption>
            <IonSelectOption value="Pending first">
              Pending first
            </IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonList className={styles.customList}>
          {sortedTodos.map((todo) => (
            <IonItem key={todo.id} lines="full">
              <IonCheckbox
                slot="start"
                checked={todo.isDone}
                onIonChange={() => handleToggleDone(todo.id)}
              />
              <IonLabel>
                <h2>{todo.val}</h2>
                <p>{new Date(todo.date).toLocaleDateString()}</p>
              </IonLabel>

              <IonButton
                onClick={() => handleEditTodo(todo.id, todo.val, todo.date)}
              >
                Edit
              </IonButton>
              <IonButton
                color="danger"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                Delete
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          message="Are you sure you want to delete this task?"
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => setShowAlert(false),
            },
            {
              text: "Delete",
              handler: confirmDeleteTodo,
            },
          ]}
        />
        <IonToast
          isOpen={showToast.show}
          message={showToast.message}
          duration={3000}
          onDidDismiss={() => setShowToast({ message: "", show: false })}
          className={styles.customToast}
        />
      </IonContent>
    </IonApp>
  );
};

export default Home;

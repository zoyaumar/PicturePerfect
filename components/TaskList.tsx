import React, { useState, useEffect, createContext } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Task } from "./Task";
import { styles } from "@/assets/tasks/styles";
import { TaskItem } from "./TaskItem";
import { generateUUID } from "@/assets/tasks/uuid";
import { mockTasks } from "@/assets/tasks/mockData";
import Grid from "./Grid";

// const TasksContext = createContext();

// const TasksProvider = ({children} => {
//   const [taskList, setTaskList] = useState<Task[]>(mockTasks);

// })

export const TaskListScreen: React.FC = () => {
  const [taskList, setTaskList] = useState<Task[]>(mockTasks);
  const [taskInput, setTaskInput] = useState<string>("");
  const [error, showError] = useState<boolean>(false);

  const addTask = (): void => {
    if (taskInput.trim()) {
      setTaskList([...taskList, { id: generateUUID(), title: taskInput, description: "" }]);
      setTaskInput("");
      showError(false);
    } else {
      showError(true);
    }
  };

  const toggleComplete = (index: number): void => {
    setTaskList((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task} : task
      )
    );
  };

  const removeTask = (index: number): void => {
    setTaskList((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  return (
    <View>
      {taskList.length == 9 && <Grid rows={3} cols={3} />}
      {taskList.length == 6 && <Grid rows={3} cols={2} />}
      {taskList.length == 5 && <Grid rows={5} cols={1} />}
      {taskList.length == 4 && <Grid rows={2} cols={2} />}
      {taskList.length == 3 && <Grid rows={1} cols={3} />}
      {taskList.length == 2 && <Grid rows={1} cols={2} />}
      {taskList.length == 1 && <Grid rows={1} cols={1} />}

      <View style={styles.container}>
        <Text style={styles.title}>Edit Task List</Text>
        <Text style={styles.underText}>Recommended Amount: 4 or 9 tasks</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Add a new task..."
            value={taskInput}
            onChangeText={(text) => {
              setTaskInput(text);
              showError(false);
            }}
            style={styles.inputBox}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.error}>Error: Input field cannot be empty!</Text>}
        <FlatList
          data={taskList}
          renderItem={({ item, index }) => (
            <TouchableOpacity >
              <TaskItem
                task={item}
                onToggle={() => toggleComplete(index)}
                onDelete={() => removeTask(index)}
              />
            </TouchableOpacity>
          )}
          nestedScrollEnabled={true}
          keyExtractor={(item) => item.id}
        />
        <Text>Limit is 9</Text>
      </View>
    </View>
    
  );
};

// export function getListLength(){
//   return(
    
//   )
// }
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Task } from "./Task";
import { styles } from "@/assets/tasks/styles";
import { TaskItem } from "./TaskItem";
import { generateUUID } from "@/assets/tasks/uuid";
import { mockTasks } from "@/assets/tasks/mockData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "TaskListScreen">;
type TaskListRouteProp = RouteProp<RootStackParamList, "TaskListScreen">;

export const TaskListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TaskListRouteProp>();
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

  const updateTask = (updatedTask: Task): void => {
    setTaskList((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Task List</Text>
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
          keyExtractor={(item) => item.id}
        />
      </View>
  );
};
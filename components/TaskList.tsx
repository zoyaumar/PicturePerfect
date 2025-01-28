import React, { useState, useEffect, createContext } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { styles } from "@/assets/tasks/styles";
import { TaskItem } from "./TaskItem";
import Grid from "./Grid";
import { getUserId, getUserImages, getUserTasks, updateImages, updateTasks } from "@/hooks/useUserData";

export const TaskListScreen: React.FC = () => {
  const [id, setId] = useState('');
  const [taskList, setTaskList] = useState<string[]>(['']);
  const [taskInput, setTaskInput] = useState<string>("");
  const [error, showError] = useState<boolean>(false);




  useEffect(() => {
    const getid = async () => {
      const userId = await getUserId();
      console.log("got id ", userId)
      setId(userId + '')

      const fetchedTasks = await getUserTasks(userId + '');
      setTaskList(fetchedTasks)
    };
    getid()
  }, [])


  const addTask = (): void => {
    if (taskInput.trim()) {
      updateTasks(id, [...taskList, taskInput])
      setTaskList([...taskList, taskInput]);
      
      setTaskInput("");
      showError(false);
    } else {
      showError(true);
    }
  };
  // const toggleComplete = (index: number): void => {
  //   setTaskList((prevTasks) =>
  //     prevTasks.map((task, i) =>
  //       i === index ? { ...task} : task
  //     )
  //   );
  // };
  const getArr = async () => {
    const imgArr = await getUserImages(id);
    if(imgArr)
    updateImages(id, imgArr.slice(0, taskList.length))
}
  const removeTask = (index: number): void => {
    let arr = ((prevTasks: any[]) => prevTasks.filter((_, i) => i !== index))
    updateTasks(id, arr)
    setTaskList((prevTasks) => prevTasks.filter((_, i) => i !== index));
    
    getArr()
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
                onDelete={() => removeTask(index)}
              />
            </TouchableOpacity>
          )}
          nestedScrollEnabled={true}
          //keyExtractor={(item) => item.id}
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
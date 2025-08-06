import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { styles } from "@/assets/tasks/styles";
import { TaskItem } from "./TaskItem";
import Grid from "./Grid";
import { getUserId, getUserImages, getUserTasks, updateImages, updateTasks } from "@/hooks/useUserData";
import { GridConfiguration } from "@/types";
import { GRID_CONFIGURATIONS, MAX_TASKS, TASK_INPUT_MAX_LENGTH } from "@/constants/AppConstants";

/**
 * TaskListScreen component for managing user tasks and displaying them in a grid
 * Allows users to add, remove, and organize tasks with visual grid representation
 */
export const TaskListScreen: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [taskList, setTaskList] = useState<string[]>([]);
  const [taskInput, setTaskInput] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeUserData = async () => {
      try {
        const fetchedUserId = await getUserId();
        if (!fetchedUserId) {
          console.error('No user ID found');
          return;
        }

        console.log("User ID loaded:", fetchedUserId);
        setUserId(fetchedUserId);

        const fetchedTasks = await getUserTasks(fetchedUserId);
        setTaskList(fetchedTasks || []);
      } catch (error) {
        console.error('Error initializing user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUserData();
  }, []);

  /**
   * Gets the appropriate grid configuration based on task count
   */
  const getGridConfiguration = (): GridConfiguration | null => {
    return GRID_CONFIGURATIONS.find(config => config.taskCount === taskList.length) || null;
  };

  /**
   * Adds a new task to the task list
   */
  const addTask = async (): Promise<void> => {
    const trimmedInput = taskInput.trim();
    
    if (!trimmedInput) {
      setHasError(true);
      return;
    }

    if (taskList.length >= MAX_TASKS) {
      console.warn(`Maximum of ${MAX_TASKS} tasks allowed`);
      return;
    }

    try {
      const updatedTasks = [...taskList, trimmedInput];
      await updateTasks(userId, updatedTasks);
      setTaskList(updatedTasks);
      setTaskInput("");
      setHasError(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  /**
   * Removes a task from the task list and adjusts images accordingly
   */
  const removeTask = async (index: number): Promise<void> => {
    try {
      const updatedTasks = taskList.filter((_, i) => i !== index);
      await updateTasks(userId, updatedTasks);
      setTaskList(updatedTasks);

      // Adjust images to match new task count
      await adjustImagesForTaskCount(updatedTasks.length);
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  /**
   * Adjusts the user's images array to match the new task count
   */
  const adjustImagesForTaskCount = async (newTaskCount: number): Promise<void> => {
    try {
      const currentImages = await getUserImages(userId);
      if (currentImages && currentImages.length > newTaskCount) {
        const trimmedImages = currentImages.slice(0, newTaskCount);
        await updateImages(userId, trimmedImages);
      }
    } catch (error) {
      console.error('Error adjusting images:', error);
    }
  };

  /**
   * Handles input change and clears error state
   */
  const handleInputChange = (text: string): void => {
    setTaskInput(text);
    if (hasError) {
      setHasError(false);
    }
  };

  const gridConfig = getGridConfiguration();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      {/* Grid display */}
      {gridConfig && (
        <Grid rows={gridConfig.rows} cols={gridConfig.cols} />
      )}

      {/* Task management section */}
      <View style={styles.container}>
        <Text style={styles.title}>Edit Task List</Text>
        <Text style={styles.underText}>
          Recommended Amount: 4 or 9 tasks (Current: {taskList.length}/{MAX_TASKS})
        </Text>
        
        {/* Task input section */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Add a new task..."
            value={taskInput}
            onChangeText={handleInputChange}
            style={styles.inputBox}
            maxLength={TASK_INPUT_MAX_LENGTH}
            editable={taskList.length < MAX_TASKS}
          />
          <TouchableOpacity 
            style={[
              styles.addButton, 
              taskList.length >= MAX_TASKS && { opacity: 0.5 }
            ]} 
            onPress={addTask}
            disabled={taskList.length >= MAX_TASKS}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Error message */}
        {hasError && (
          <Text style={styles.error}>
            Error: Input field cannot be empty!
          </Text>
        )}

        {/* Task list */}
        <FlatList
          data={taskList}
          renderItem={({ item, index }) => (
            <TaskItem
              task={item}
              onDelete={() => removeTask(index)}
            />
          )}
          keyExtractor={(item, index) => `task-${index}-${item.substring(0, 10)}`}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />

        {/* Task limit info */}
        <Text style={styles.underText}>
          Task limit: {taskList.length}/{MAX_TASKS}
        </Text>
        
        {!gridConfig && taskList.length > 0 && (
          <Text style={[styles.underText, { color: '#ff6b6b' }]}>
            No grid layout available for {taskList.length} tasks
          </Text>
        )}
      </View>
    </View>
  );
};
import { styles } from "@/assets/tasks/styles";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Task } from "./Task";

interface TaskItemProps {
    task: Task;
    onToggle: () => void;
    onDelete: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => (
    <View style={styles.listItem}>        
        <Text style={[styles.task]}>
            {task.title}
        </Text>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={[styles.buttonText, styles.deleteButtonText]}>×</Text>
        </TouchableOpacity>
    </View>
);
import { generateUUID } from "./uuid";

export const mockTasks = [
  { id: generateUUID(), title: "Buy groceries", description: "Milk, Bread, Cheese"},
  { id: generateUUID(), title: "Call mom", description: "Wish her a happy birthday" },
  { id: generateUUID(), title: "Complete project", description: "Finish the React Native app"},
];
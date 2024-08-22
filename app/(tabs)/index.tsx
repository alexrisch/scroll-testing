import { FC, useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";

interface Item {
  text: string;
  id: string;
}

const LIST_LENGTH = 2000;
const MAX_HEIGHT = 10;

const getItems = (deletedItems: Set<string>) => {
  const items: Item[] = [];
  for (let i = 0; i < LIST_LENGTH; i++) {
    const id = String(i);
    if (deletedItems.has(id)) {
      continue
    }
    // const lineCount = Math.floor(Math.random() * MAX_HEIGHT) + 1;
    const lineCount = 1;
    let text = `Item ${i}: `;
    for (let j = 0; j < lineCount; j++) {
      text += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
    }
    items.push({
      text,
      id,
    });
  }

  return items;
};

const RenderItem: FC<{
  item: Item;
  index: number;
  onPress: () => void;
  isPressed: boolean;
  isFocused: boolean;
  setFocusedId: (id: string | null) => void;
}> = ({ item, onPress, isPressed, isFocused, setFocusedId }) => {
  console.log(`Rendering Item ${item.id}`);
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={() =>
        isFocused ? setFocusedId(null) : setFocusedId(item.id)
      }
    >
      <View
        style={[
          isPressed ? { backgroundColor: "gray" } : undefined,
          isFocused ? { borderColor: "black", borderWidth: 1 } : undefined,
        ]}
      >
        <Text style={styles.paragraph}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function App() {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState(new Set<string>());
  const [deletedItems, setDeletedItems] = useState(new Set<string>());
  const items = getItems(deletedItems);

  const toggleItem = (id: string) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedItems(newSet);
  };

  const deleteItems = () => {
    const newSet = new Set(deletedItems);
    selectedItems.forEach((id) => newSet.add(id));
    setDeletedItems(newSet);
    setSelectedItems(new Set());
  };

  console.log("Rendering List");

  return (
    <SafeAreaView style={styles.container}>
      {selectedItems.size > 0 && (
        <TouchableOpacity onPress={deleteItems}>
          <Text style={[styles.paragraph, { color: "red" }]}>
            Delete Selection {selectedItems.size}
          </Text>
        </TouchableOpacity>
      )}
      <ScrollView style={{ flex: 1 }}>
        {items.map((item, index) => {
          return (
            <RenderItem
              item={item}
              index={index}
              onPress={() => toggleItem(item.id)}
              isPressed={selectedItems.has(item.id)}
              setFocusedId={setFocusedId}
              isFocused={focusedId === item.id}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
    marginHorizontal: 16,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

// src/components/NoteItem.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { deleteNote } from "../services/note-service";

const NoteItem = ({ note, onNoteDeleted }) => {
  const [deleting, setDeleting] = useState(false);

  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle delete confirmation and execution
  const handleDelete = () => {
    // Show confirmation dialog
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleting(true);
            // Call the deleteNote service function
            await deleteNote(note.$id);
            // Notify parent component if callback exists
            if (onNoteDeleted) {
              onNoteDeleted(note.$id);
            }
          } catch (error) {
            console.error("Error deleting note:", error);
            Alert.alert("Error", "Failed to delete note. Please try again.");
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.date}>
          Last updated: {formatDate(note.updatedAt)}
        </Text>
        <Text style={styles.noteContent} numberOfLines={3}>
          {note.content}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        disabled={deleting}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: "row",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    color: "#333",
  },
  deleteButton: {
    justifyContent: "center",
    paddingLeft: 12,
  },
  deleteText: {
    color: "red",
    fontWeight: "500",
  },
});

export default NoteItem;
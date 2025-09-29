import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Image, Alert } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";

export default function App() {
  const [text, setText] = useState("");
  const [clipboardContent, setClipboardContent] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  // Función para validar si el texto es URL de imagen
  const isValidImageUrl = (url) => {
    return /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))/i.test(url);
  };

  // Copiar texto o URL al clipboard
  const handleCopy = () => {
    Clipboard.setString(text);
    Alert.alert("Copiado", "Texto copiado al portapapeles!");
  };

  // Cortar (copiar y limpiar)
  const handleCut = () => {
    Clipboard.setString(text);
    setText("");
    Alert.alert("Cortado", "Texto cortado al portapapeles!");
  };

  // Pegar texto o URL
  const handlePaste = async () => {
    const content = await Clipboard.getString();
    setText(content);
    // Si el contenido es URL de imagen, mostrar imagen
    if (isValidImageUrl(content)) {
      setImageUrl(content);
    } else {
      setImageUrl(null);
    }
  };

  // Mostrar contenido del portapapeles y si es imagen, mostrarla
  const handleShowClipboard = async () => {
    const content = await Clipboard.getString();
    setClipboardContent(content);
    if (isValidImageUrl(content)) {
      setImageUrl(content);
    } else {
      setImageUrl(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Escribe algo o pega una URL de imagen:</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={(val) => {
          setText(val);
          if (!isValidImageUrl(val)) setImageUrl(null);
        }}
        placeholder="Ingresa texto o URL aquí"
      />

      <View style={styles.buttons}>
        <Button title="Copy" onPress={handleCopy} />
        <Button title="Cut" onPress={handleCut} />
        <Button title="Paste" onPress={handlePaste} />
        <Button title="Ver Clipboard" onPress={handleShowClipboard} />
      </View>

      <Text style={styles.result}>Clipboard: {clipboardContent}</Text>

      {/* Mostrar imagen si hay URL válida */}
      {imageUrl && (
        <>
          <Text style={{ marginTop: 15, fontSize: 16 }}>Imagen desde URL pegada:</Text>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: 200, height: 200, marginTop: 10, borderRadius: 10 }}
            resizeMode="contain"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  result: {
    fontSize: 16,
    marginTop: 10,
  },
});

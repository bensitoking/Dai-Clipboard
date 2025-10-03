import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Image, Alert, ScrollView } from "react-native";
import * as Clipboard from "expo-clipboard";

const DATA_IMG_REGEX = /^data:image\/[a-zA-Z0-9.+-]+;base64,[a-zA-Z0-9+/=]+$/;

export default function App() {
  const [text, setText] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [previewImageUri, setPreviewImageUri] = useState(null);

  const copyText = async () => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copiado", "El texto fue copiado al portapapeles.");
  };

  const cutText = async () => {
    await Clipboard.setStringAsync(text);
    setText("");
    Alert.alert("Cortado", "El texto fue cortado al portapapeles.");
  };

  const pasteText = async () => {
    const value = await Clipboard.getStringAsync();
    setText(value);
  };

  const viewClipboard = async () => {
    // En iOS/Android intentamos imagen nativa primero
    try {
      const img = await Clipboard.getImageAsync({ format: "png" }); // iOS/Android
      if (img && img.data) {
        setPreviewImageUri(`data:image/${img.format ?? "png"};base64,${img.data}`);
        setPreviewText("");
        return;
      }
    } catch {
      // En web o si falla, seguimos con texto
    }

    // Fallback a texto (web incluido)
    const value = await Clipboard.getStringAsync();

    // Si el texto es un data URL de imagen, lo renderizamos
    if (DATA_IMG_REGEX.test(value.trim())) {
      setPreviewImageUri(value.trim());
      setPreviewText("");
    } else {
      setPreviewImageUri(null);
      setPreviewText(value);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Demo Clipboard (Texto + Imágenes)</Text>

      <TextInput
        style={styles.input}
        placeholder="Escribí texto o pegá un data URL (data:image/...;base64,...)"
        value={text}
        onChangeText={setText}
        multiline
      />

      <View style={styles.row}>
        <Button title="Copy" onPress={copyText} />
        <Button title="Cut" onPress={cutText} />
        <Button title="Paste" onPress={pasteText} />
        <Button title="Ver clipboard" onPress={viewClipboard} />
      </View>

      {previewImageUri ? (
        <>
          <Text style={styles.subtitle}>Imagen detectada en el portapapeles:</Text>
          <Image source={{ uri: previewImageUri }} style={styles.image} resizeMode="contain" />
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Contenido del portapapeles (texto):</Text>
          <View style={styles.previewBox}>
            <Text selectable>{previewText || "— vacío —"}</Text>
          </View>
        </>
      )}

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: "600" },
  input: {
    borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, minHeight: 80, textAlignVertical: "top"
  },
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  subtitle: { marginTop: 12, fontWeight: "600" },
  image: { width: "100%", height: 260, backgroundColor: "#f5f5f5", borderRadius: 8 },
  previewBox: { padding: 12, borderWidth: 1, borderColor: "#eee", borderRadius: 8, backgroundColor: "#fafafa" },
  hint: { color: "#555", fontSize: 12 }
});

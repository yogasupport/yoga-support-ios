import React, { useRef, useState } from "react";
import {
  SafeAreaView, StyleSheet, ActivityIndicator, View, Text,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";

const SITE = "https://book.yogasupport.org";

const KEEP_IN_APP = [
  "book.yogasupport.org",
  "paypal.com",
  "www.paypal.com",
  "paypalobjects.com",
];

function hostOf(url) {
  try { return new URL(url).hostname; } catch { return ""; }
}

export default function App() {
  const webref = useRef(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const shouldStayInApp = (url) => {
    const host = hostOf(url);
    return KEEP_IN_APP.some((d) => host === d || host.endsWith("." + d));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" backgroundColor="#F6F8F3" />
      {failed ? (
        <View style={styles.center}>
          <Text style={styles.errTitle}>Can't reach the studio</Text>
          <Text style={styles.errBody}>
            Please check your internet connection and try again.
          </Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => { setFailed(false); setLoading(true); }}
          >
            <Text style={styles.btnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <WebView
            ref={webref}
            source={{ uri: SITE }}
            style={{ flex: 1, backgroundColor: "#F6F8F3" }}
            onLoadEnd={() => setLoading(false)}
            onError={() => { setLoading(false); setFailed(true); }}
            javaScriptCanOpenWindowsAutomatically={true}
            setSupportMultipleWindows={false}
            originWhitelist={["https://*"]}
            onShouldStartLoadWithRequest={(req) => {
              if (shouldStayInApp(req.url)) return true;
              WebBrowser.openBrowserAsync(req.url);
              return false;
            }}
            allowsBackForwardNavigationGestures={true}
            decelerationRate="normal"
          />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#52796F" />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F8F3" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  errTitle: { fontSize: 22, fontWeight: "700", color: "#26403B", marginBottom: 8 },
  errBody: { fontSize: 16, color: "#52796F", textAlign: "center", marginBottom: 20 },
  btn: { backgroundColor: "#7FA08A", borderRadius: 12, paddingVertical: 13, paddingHorizontal: 28 },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "600" },
  loadingOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center", justifyContent: "center", backgroundColor: "#F6F8F3",
  },
});

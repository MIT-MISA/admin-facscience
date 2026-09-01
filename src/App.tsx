import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { UniversityAdminApp } from "@/components/university-admin-app";
import { ActivityProvider } from "./context/activity-context";
import { AuthProvider } from "./context/auth-context";
import LoginForm from "./components/login";
import { PrivateRoute } from "./components/private-route";

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <ActivityProvider>
          <Routes>
            {/* route publique */}
            <Route path="/login" element={<LoginForm />} />

            {/* route protégée */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <UniversityAdminApp />
                </PrivateRoute>
              }
            />
          </Routes>
        </ActivityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

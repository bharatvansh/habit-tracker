import React, { Component, ErrorInfo, ReactNode } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Web-optimized with additional error reporting
 */
export class WebErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log to error reporting service (e.g., Sentry, LogRocket)
    this.logErrorToService(error, errorInfo)

    // Log to console in development
    if (__DEV__) {
      console.error("Error Boundary caught an error:", error, errorInfo)
    }
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // TODO: Integrate with error tracking service
    // Example: Sentry, Bugsnag, LogRocket, etc.
    
    if (Platform.OS === "web" && typeof window !== "undefined") {
      // Web-specific error reporting
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      }
      
      // Store in localStorage for later reporting (if offline)
      try {
        const errors = JSON.parse(localStorage.getItem("error_logs") || "[]")
        errors.push(errorData)
        localStorage.setItem("error_logs", JSON.stringify(errors.slice(-10))) // Keep last 10
      } catch (e) {
        console.error("Failed to log error:", e)
      }
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleReload = () => {
    if (Platform.OS === "web") {
      window.location.reload()
    } else {
      this.handleReset()
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>😔</Text>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              We're sorry for the inconvenience. The app encountered an unexpected error.
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Error Details (Dev Only):</Text>
                <Text style={styles.errorText}>{this.state.error.message}</Text>
                {this.state.error.stack && (
                  <Text style={styles.errorStack}>
                    {this.state.error.stack.split("\n").slice(0, 5).join("\n")}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={this.handleReset}>
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.buttonSecondary]} 
                onPress={this.handleReload}
              >
                <Text style={styles.buttonTextSecondary}>Reload App</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    maxWidth: 600,
    width: "100%",
    alignItems: "center",
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#b3b3b3",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  errorDetails: {
    width: "100%",
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff6b6b",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#ffffff",
    fontFamily: Platform.OS === "web" ? "monospace" : "Courier",
    marginBottom: 8,
  },
  errorStack: {
    fontSize: 10,
    color: "#888888",
    fontFamily: Platform.OS === "web" ? "monospace" : "Courier",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#8a2be2",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#8a2be2",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonTextSecondary: {
    color: "#8a2be2",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
})

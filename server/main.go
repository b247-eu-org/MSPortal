package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"
)

// Define context key type for user claims
type contextKey string

const userClaimsKey contextKey = "userClaims"

// CustomClaims represents standard Entra ID / Azure AD token claims
type CustomClaims struct {
	TenantID          string `json:"tid"`
	UPN               string `json:"upn"`
	Email             string `json:"email"`
	PreferredUsername string `json:"preferred_username"`
	Name              string `json:"name"`
	jwt.RegisteredClaims
}

// Global JWKS key manager (caches Microsoft public keys in memory)
var jwks keyfunc.Keyfunc

func initJWKS() {
	tenantID := os.Getenv("AZURE_TENANT_ID")
	if tenantID == "" {
		log.Fatal("❌ AZURE_TENANT_ID environment variable is missing!")
	}

	// Use Tenant-Specific discovery endpoint
	jwksURL := fmt.Sprintf("https://login.microsoftonline.com/%s/discovery/v2.0/keys", tenantID)

	var err error
	jwks, err = keyfunc.NewDefault([]string{jwksURL})
	if err != nil {
		log.Fatalf("❌ Failed to initialize Microsoft JWKS: %v", err)
	}
	fmt.Printf("🔑 Microsoft JWKS initialized for tenant: %s\n", tenantID)
}

// CORS Middleware
func enableCORS(w *http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	allowedOrigin := os.Getenv("ALLOWED_ORIGIN")

	if allowedOrigin != "" && origin == allowedOrigin {
		(*w).Header().Set("Access-Control-Allow-Origin", allowedOrigin)
	} else if allowedOrigin == "" && (strings.HasPrefix(origin, "http://localhost:") || strings.HasPrefix(origin, "http://127.0.0.1:")) {
		(*w).Header().Set("Access-Control-Allow-Origin", origin)
	}

	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
}

// 🛡️ LEVEL 3 ENTERPRISE AUTH MIDDLEWARE
func RequireTenantAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		enableCORS(&w, r)

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// 1. Extract Bearer Token
		authHeader := r.Header.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, `{"error": "Missing Authorization header"}`, http.StatusUnauthorized)
			return
		}
		msToken := strings.TrimPrefix(authHeader, "Bearer ")

		// 2. Cryptographically verify Microsoft's RSA-256 signature and expiration
		var claims CustomClaims
		token, err := jwt.ParseWithClaims(msToken, &claims, jwks.Keyfunc)

		if err != nil || !token.Valid {
			http.Error(w, fmt.Sprintf(`{"error": "Cryptographic verification failed: %v"}`, err), http.StatusUnauthorized)
			return
		}

		// 3. Enforce Tenant ID
		expectedTenant := os.Getenv("AZURE_TENANT_ID")
		if expectedTenant != "" && claims.TenantID != expectedTenant {
			http.Error(w, `{"error": "Forbidden: Tenant mismatch"}`, http.StatusForbidden)
			return
		}

		// 4. Inject claims into request context so endpoints know who is calling
		ctx := context.WithValue(r.Context(), userClaimsKey, &claims)
		next(w, r.WithContext(ctx))
	}
}

// 📊 EXAMPLE PROTECTED ENDPOINT
func handleGetDashboard(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Retrieve user details from request context
	claims, _ := r.Context().Value(userClaimsKey).(*CustomClaims)

	userEmail := claims.Email
	if userEmail == "" {
		userEmail = claims.PreferredUsername
	}
	if userEmail == "" {
		userEmail = claims.UPN
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": fmt.Sprintf("Welcome to the secure ERP dashboard, %s!", claims.Name),
		"user": map[string]string{
			"name":     claims.Name,
			"email":    userEmail,
			"tenantId": claims.TenantID,
		},
		"stats": map[string]int{
			"totalUsers":   142,
			"activeAlerts": 0,
			"activeNodes":  8,
		},
	})
}

func main() {
	// Initialize Microsoft's public keys once at startup
	initJWKS()

	// Endpoints
	http.HandleFunc("/api/getDashboard", RequireTenantAuth(handleGetDashboard))

	port := os.Getenv("FUNCTIONS_CUSTOMHANDLER_PORT")
	if port == "" {
		port = os.Getenv("PORT")
	}
	if port == "" {
		port = "8080"
	}

	fmt.Printf("🚀 Enterprise Go microservice running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

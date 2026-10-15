import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, StatusBar, SafeAreaView } from 'react-native';

interface GitHubProfile {
  name: string;
  bio: string;
  avatar_url: string;
  public_repos: number;
}

export default function HomeScreen() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Solução para remover erro de tipagem do TypeScript no VS Code
  const envProcess = process as any;
  const apiUrl = envProcess.env?.EXPO_PUBLIC_API_URL || '';

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        if (!apiUrl) {
          throw new Error("Variável EXPO_PUBLIC_API_URL não foi definida no arquivo .env!");
        }

        // Validação estrita exigida pelo desafio técnico do SENAI
        if (!apiUrl.startsWith('https://')) {
          throw new Error("Conexão insegura bloqueada! A URL precisa utilizar protocolo HTTPS.");
        }

        const response = await fetch(`${apiUrl}/github`);
        
        if (!response.ok) {
          throw new Error(`Erro na requisição: Status ${response.status}`);
        }

        const data = await response.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido ao carregar dados.");
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, [apiUrl]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121214" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔒 SecureEnv App</Text>
        <Text style={styles.headerSubtitle}>Proteção de Dados & HTTPS</Text>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#00B37E" />
        ) : error ? (
          <View style={styles.cardError}>
            <Text style={styles.errorTitle}>🚨 Falha de Segurança / Rede</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.cardSuccess}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            ) : null}
            <Text style={styles.profileName}>{profile?.name || "Usuário GitHub"}</Text>
            <Text style={styles.profileBio}>{profile?.bio || "Sem biografia disponível."}</Text>
            
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>Repositórios Públicos: {profile?.public_repos}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Painel de Auditoria para o Code Review */}
      <View style={styles.footerPanel}>
        <Text style={styles.panelTitle}>📊 Painel de Auditoria de Variáveis:</Text>
        <Text style={styles.panelCode} numberOfLines={1}>
          URL ativa: {apiUrl || "NENHUMA URL DETECTADA"}
        </Text>
        <Text style={styles.panelStatus}>
          Protocolo Secure: {apiUrl.startsWith('https://') ? "🟢 HTTPS VÁLIDO" : "🔴 INSEGURO"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
  },
  header: {
    padding: 24,
    backgroundColor: '#1F1F23',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#29292E',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E1E1E6',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8D8D99',
    marginTop: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardSuccess: {
    backgroundColor: '#1F1F23',
    borderRadius: 8,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: '#00B37E',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#00B37E',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E1E1E6',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    color: '#C4C4CC',
    textAlign: 'center',
    marginBottom: 16,
  },
  badgeContainer: {
    backgroundColor: '#29292E',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  badgeText: {
    color: '#00B37E',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardError: {
    backgroundColor: '#1F1F23',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: '#F75A68',
  },
  errorTitle: {
    color: '#F75A68',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: {
    color: '#C4C4CC',
    fontSize: 14,
  },
  footerPanel: {
    backgroundColor: '#1F1F23',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#29292E',
  },
  panelTitle: {
    color: '#8D8D99',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  panelCode: {
    color: '#E1E1E6',
    fontFamily: 'monospace',
    fontSize: 12,
    backgroundColor: '#121214',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  panelStatus: {
    color: '#E1E1E6',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

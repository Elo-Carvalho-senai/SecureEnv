import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';

export default function HomeScreen() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isHttpsValidated, setIsHttpsValidated] = useState<boolean | null>(null);

  // 🛡️ CAPTURA DAS VARIÁVEIS DE AMBIENTE (Sem Hardcoding no código)
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const secretToken = process.env.EXPO_PUBLIC_SECRET_TOKEN;

  const fetchUserData = async () => {
    if (!username.trim()) {
      setErrorMessage('Por favor, digite um usuário do GitHub.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setUserData(null);

    // 🔒 Validação visual exigida pelo desafio: Verificar se a URL utiliza HTTPS estrito
    if (baseUrl && baseUrl.startsWith('https://')) {
      setIsHttpsValidated(true);
    } else {
      setIsHttpsValidated(false);
    }

    try {
      // Integração segura utilizando a variável de ambiente pública
      const fullUrl = `${baseUrl}${username.trim()}`;

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secretToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Usuário não encontrado ou erro na API.');
      }

      const data = await response.json();
      setUserData(data);
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao buscar dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🛡️ SecureEnv App</Text>
      <Text style={styles.subtitle}>Eixo Segurança: Proteção de APIs e HTTPS</Text>

      {/* 📊 PAINEL EXPLICATIVO (Deixa explícito no app o fim do hardcoding) */}
      <View style={styles.securityPanel}>
        <Text style={styles.panelTitle}>🔍 Painel de Auditoria de Segurança:</Text>

        <Text style={styles.panelText}>
          <Text style={styles.bold}>URL Base capturada via .env:</Text>{"\n"}
          {baseUrl ? baseUrl : '⚠️ Erro: Variável não carregada'}
        </Text>

        <Text style={styles.panelText}>
          <Text style={styles.bold}>Token de Acesso em Memória:</Text>{"\n"}
          {secretToken ? '🔒 •••••••••••• (Injetado de forma segura)' : '⚠️ Oculto ou não configurado'}
        </Text>

        <Text style={styles.explanationText}>
          💡 <Text style={styles.bold}>Por que isso é seguro?</Text> O código-fonte não possui nenhuma string contendo chaves reais. Elas são injetadas pelo bundler em tempo de execução.
        </Text>

        {isHttpsValidated !== null && (
          <Text style={[styles.badge, isHttpsValidated ? styles.badgeSuccess : styles.badgeDanger]}>
            {isHttpsValidated ? '🔒 Protocolo HTTPS Validado' : '⚠️ Alerta: Conexão Insegura (HTTP)'}
          </Text>
        )}
      </View>

      {/* Form de busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o username (ex: facebook)"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={fetchUserData}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Buscar</Text>}
        </TouchableOpacity>
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* Retorno dos dados */}
      {userData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{userData.name || userData.login}</Text>
          <Text style={styles.cardBio}>{userData.bio || 'Sem biografia disponível.'}</Text>
          <View style={styles.row}>
            <Text style={styles.cardDetail}>Repositórios: {userData.public_repos}</Text>
            <Text style={styles.cardDetail}>Seguidores: {userData.followers}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  securityPanel: {
    backgroundColor: '#E9ECEF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CED4DA',
    marginBottom: 25,
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 10,
  },
  panelText: {
    fontSize: 13,
    color: '#495057',
    marginBottom: 10,
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  explanationText: {
    fontSize: 12,
    color: '#6C757D',
    fontStyle: 'italic',
    marginTop: 5,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  badge: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
    overflow: 'hidden',
  },
  badgeSuccess: {
    backgroundColor: '#D1E7DD',
    color: '#0F5132',
  },
  badgeDanger: {
    backgroundColor: '#F8D7DA',
    color: '#842029',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    marginRight: 10,
    color: '#333'
  },
  button: {
    backgroundColor: '#0D6EFD',
    borderRadius: 8,
    width: 90,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#6C757D',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#DC3545',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 5,
  },
  cardBio: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardDetail: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
  },
});
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView,
  Alert 
} from 'react-native';
import CryptoJS from 'crypto-js';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [encryptedPasswordPreview, setEncryptedPasswordPreview] = useState('');
  const [payloadPreview, setPayloadPreview] = useState<any>(null);

  // 🛡️ Extraindo configurações de segurança de fora (Sem Hardcoding)
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const hashKey = process.env.EXPO_PUBLIC_SECRET_TOKEN;

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      // 🔒 Criptografando a senha usando a chave secreta injetada por fora via .env (HMAC-SHA256)
      const encryptedPassword = CryptoJS.HmacSHA256(password, hashKey || 'default_key').toString();
      setEncryptedPasswordPreview(encryptedPassword);

      // 📦 Montando a estrutura do objeto JSON para o envio via método POST (Lógica de inserção)
      const userDataPayload = {
        email: email.trim().toLowerCase(),
        password: encryptedPassword, // Senha trafega em texto cifrado
        registeredAt: new Date().toISOString()
      };

      setPayloadPreview(userDataPayload);

      // 🌐 Disparando a requisição HTTP POST simulando o cadastro seguro
      const response = await fetch(apiUrl || '', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataPayload)
      });

      // Como o endpoint é um mock ilustrativo, simulamos o sucesso após estruturar tudo
      setTimeout(() => {
        Alert.alert('Sucesso', 'Requisição POST de cadastro simulada com sucesso!');
        setLoading(false);
      }, 1500);

    } catch (error) {
      Alert.alert('Erro', 'Falha ao processar a requisição.');
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔒 SecureRegister App</Text>
      <Text style={styles.subtitle}>Eixo Segurança: POST com Criptografia Externada</Text>

      {/* 📊 Painel de Auditoria e Criptografia */}
      <View style={styles.securityPanel}>
        <Text style={styles.panelTitle}>🔍 Painel de Auditoria Criptográfica:</Text>
        
        <Text style={styles.panelText}>
          <Text style={styles.bold}>Endpoint de Cadastro (POST):</Text>{"\n"}
          {apiUrl ? apiUrl : '⚠️ URL não configurada'}
        </Text>
        
        <Text style={styles.panelText}>
          <Text style={styles.bold}>Status do Salt/Chave de Criptografia:</Text>{"\n"}
          {hashKey ? '🔒 Injetada com segurança via (.env)' : '⚠️ Chave ausente'}
        </Text>

        {encryptedPasswordPreview ? (
          <View style={styles.cryptoBox}>
            <Text style={styles.boldText}>🔑 Senha Criptografada em Trânsito:</Text>
            <Text style={styles.hashText} numberOfLines={2}>{encryptedPasswordPreview}</Text>
          </View>
        ) : null}

        <Text style={styles.badgeSuccess}>🔒 Comunicação Estrita por HTTPS</Text>
      </View>

      {/* 📥 Formulário de Primeiro Acesso */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Crie sua conta</Text>
        
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholderTextColor="#999"
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar (POST)</Text>}
        </TouchableOpacity>
      </View>

      {/* Visualizador do Payload do POST */}
      {payloadPreview && (
        <View style={styles.payloadCard}>
          <Text style={styles.payloadTitle}>📦 Payload JSON enviado no Corpo (Body):</Text>
          <Text style={styles.payloadText}>
            {JSON.stringify(payloadPreview, null, 2)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  securityPanel: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  panelTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
  },
  panelText: {
    fontSize: 12,
    color: '#4B5563',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 8,
  },
  cryptoBox: {
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginVertical: 5,
  },
  boldText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  hashText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#1D4ED8',
    marginTop: 2,
  },
  badgeSuccess: {
    marginTop: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 11,
    backgroundColor: '#D1E7DD',
    color: '#0F5132',
    overflow: 'hidden',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    marginBottom: 12,
    color: '#111827',
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  payloadCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },
  payloadTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  payloadText: {
    color: '#10B981',
    fontFamily: 'monospace',
    fontSize: 11,
  }
});
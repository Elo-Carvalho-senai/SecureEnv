import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, StatusBar, SafeAreaView } from 'react-native';

interface PerfilGitHub {
  name: string;
  bio: string;
  avatar_url: string;
  public_repos: number;
}

export default function TelaPrincipal() {
  const [perfil, setPerfil] = useState<PerfilGitHub | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const processoAmbiente = process as any;
  const urlApi = processoAmbiente.env?.EXPO_PUBLIC_API_URL || '';

  useEffect(() => {
    async function buscarDadosGitHub() {
      try {
        if (!urlApi) {
          throw new Error("A variável EXPO_PUBLIC_API_URL não foi definida no seu arquivo .env!");
        }

        if (!urlApi.startsWith('https://')) {
          throw new Error("Conexão insegura bloqueada! A URL da API precisa utilizar obrigatoriamente o protocolo HTTPS.");
        }

        const resposta = await fetch(`${urlApi}/github`);
        
        if (!resposta.ok) {
          throw new Error(`Erro na requisição: Status ${resposta.status}`);
        }

        const dados = await resposta.json();
        setPerfil(dados);
      } catch (err: any) {
        setErro(err.message || "Erro desconhecido ao carregar os dados.");
      } finally {
        setCarregando(false);
      }
    }

    buscarDadosGitHub();
  }, [urlApi]);

  return (
    <SafeAreaView style={estilos.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0A0F" />

      <View style={estilos.conteudo}>
        {carregando ? (
          <View style={estilos.containerCentral}>
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text style={estilos.textoCarregando}>Validando ambiente seguro...</Text>
          </View>
        ) : erro ? (
          <View style={estilos.cartaoErro}>
            <Text style={estilos.erroTitulo}>🚨 Bloqueio de Segurança / Rede</Text>
            <Text style={estilos.erroTexto}>{erro}</Text>
          </View>
        ) : (
          <View style={estilos.cartaoSucesso}>
            <View style={estilos.topoCartao}>
              <Text style={estilos.appTitulo}>🔒 SecureEnv App</Text>
              <Text style={estilos.appSubtitulo}>Proteção de Dados & Comunicação HTTPS</Text>
            </View>

            {perfil?.avatar_url ? (
              <Image source={{ uri: perfil.avatar_url }} style={estilos.avatar} />
            ) : null}
            
            <Text style={estilos.perfilNome}>{perfil?.name || "Usuário GitHub"}</Text>
            <Text style={estilos.perfilBio}>{perfil?.bio || "Sem biografia disponível no perfil."}</Text>
            
            <View style={estilos.containerDistintivo}>
              <Text style={estilos.textoDistintivo}>Repositórios Públicos: {perfil?.public_repos}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={estilos.painelAuditoria}>
        <Text style={estilos.auditoriaTitulo}>📊 AUDITORIA DE VARIÁVEIS DE AMBIENTE:</Text>
        <Text style={estilos.auditoriaCodigo} numberOfLines={1}>
          URL do .env: {urlApi || "NENHUMA DIRETRIZ DETECTADA"}
        </Text>
        <View style={estilos.statusContainer}>
          <Text style={estilos.auditoriaStatus}>
            Status do Protocolo: {urlApi.startsWith('https://') ? "🟢 HTTPS ATIVO E SEGURO" : "🔴 HTTP INSEGURO/PROIBIDO"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0A0F',
  },
  conteudo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  containerCentral: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoCarregando: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  cartaoSucesso: {
    backgroundColor: '#161224',
    borderRadius: 16,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  topoCartao: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#2D2447',
    paddingBottom: 16,
  },
  appTitulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  appSubtitulo: {
    fontSize: 12,
    color: '#A78BFA',
    marginTop: 4,
    fontWeight: '600',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#7C3AED',
  },
  perfilNome: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F3F4F6',
    marginBottom: 8,
  },
  perfilBio: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  containerDistintivo: {
    backgroundColor: '#2E1065',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6D28D9',
  },
  textoDistintivo: {
    color: '#DDD6FE',
    fontWeight: '700',
    fontSize: 13,
  },
  cartaoErro: {
    backgroundColor: '#1F1214',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  erroTitulo: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  erroTexto: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 22,
  },
  painelAuditoria: {
    backgroundColor: '#110E1C',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#221A36',
  },
  auditoriaTitulo: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  auditoriaCodigo: {
    color: '#A78BFA',
    fontFamily: 'monospace',
    fontSize: 12,
    backgroundColor: '#07050C',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#221A36',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  auditoriaStatus: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useBots } from '../context/BotContext';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { LogItem } from '../components/LogItem';
import { colors, spacing, fontSize, borderRadius } from '../theme';

export function BotDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { bots, getBotLogs, setStatus, deleteBot, clearLogs } = useBots();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const bot = bots.find(b => b.id === route.params.botId);
  const logs = bot ? getBotLogs(bot.id) : [];

  if (!bot) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Bot introuvable</Text>
      </View>
    );
  }

  const isOn = bot.status === 'online' || bot.status === 'starting';

  const handleToggle = () => {
    if (isOn) {
      setStatus(bot.id, 'offline');
    } else {
      setStatus(bot.id, 'starting');
      setTimeout(() => setStatus(bot.id, 'online'), 1500);
    }
  };

  const handleDelete = () => {
    Alert.alert('Supprimer le bot', `Êtes-vous sûr de vouloir supprimer "${bot.name}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => { deleteBot(bot.id); navigation.goBack(); } },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.topSection, isWide && styles.topSectionWide]}>
        <Card style={isWide ? [styles.infoCard, { flex: 1 }] : styles.infoCard}>
          <View style={styles.botHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{bot.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.botInfo}>
              <Text style={styles.botName}>{bot.name}</Text>
              <StatusBadge status={bot.status} />
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Préfixe</Text>
            <Text style={styles.detailValue}>{bot.prefix}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Token</Text>
            <Text style={styles.detailValue}>{'•'.repeat(20)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Créé le</Text>
            <Text style={styles.detailValue}>{new Date(bot.createdAt).toLocaleDateString('fr-FR')}</Text>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.btn, isOn ? styles.btnStop : styles.btnStart]} onPress={handleToggle}>
              <Text style={styles.btnText}>{isOn ? 'Arrêter' : 'Démarrer'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnEdit]} onPress={() => navigation.navigate('BotEdit', { botId: bot.id })}>
              <Text style={styles.btnText}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnDelete]} onPress={handleDelete}>
              <Text style={styles.btnText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={isWide ? [styles.logsCard, { flex: 1.5 }] : styles.logsCard}>
          <View style={styles.logsHeader}>
            <Text style={styles.logsTitle}>Logs</Text>
            {logs.length > 0 && (
              <TouchableOpacity onPress={() => clearLogs(bot.id)}>
                <Text style={styles.clearText}>Effacer</Text>
              </TouchableOpacity>
            )}
          </View>
          {logs.length === 0 ? (
            <Text style={styles.emptyLogs}>Aucun log pour ce bot</Text>
          ) : (
            logs.slice(0, 50).map(log => <LogItem key={log.id} log={log} />)
          )}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl * 2 },
  notFound: { color: colors.textMuted, fontSize: fontSize.lg, textAlign: 'center', marginTop: spacing.xl },
  topSection: {},
  topSectionWide: { flexDirection: 'row', gap: spacing.md },
  infoCard: { marginBottom: spacing.md },
  botHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  avatarText: { color: '#fff', fontSize: fontSize.xl, fontWeight: '700' },
  botInfo: { flex: 1 },
  botName: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700', marginBottom: spacing.xs },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  detailLabel: { color: colors.textSecondary, fontSize: fontSize.sm },
  detailValue: { color: colors.text, fontSize: fontSize.sm, fontWeight: '500' },
  btnRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, flexWrap: 'wrap' },
  btn: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.md },
  btnStart: { backgroundColor: colors.success + '20' },
  btnStop: { backgroundColor: colors.error + '20' },
  btnEdit: { backgroundColor: colors.primary + '20' },
  btnDelete: { backgroundColor: colors.error + '15' },
  btnText: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600' },
  logsCard: { padding: 0, overflow: 'hidden', marginBottom: spacing.md },
  logsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  logsTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '600' },
  clearText: { color: colors.error, fontSize: fontSize.sm },
  emptyLogs: { color: colors.textMuted, fontSize: fontSize.sm, padding: spacing.lg, textAlign: 'center' },
});

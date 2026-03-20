import React from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useBots } from '../context/BotContext';
import { Card } from '../components/Card';
import { LogItem } from '../components/LogItem';
import { colors, spacing, fontSize, borderRadius } from '../theme';

export function DashboardScreen() {
  const { bots, logs } = useBots();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const online = bots.filter(b => b.status === 'online').length;
  const total = bots.length;
  const errors = bots.filter(b => b.status === 'error').length;
  const recentLogs = logs.slice(0, 10);

  const stats = [
    { label: 'Total bots', value: total.toString(), color: colors.primary },
    { label: 'En ligne', value: online.toString(), color: colors.success },
    { label: 'Erreurs', value: errors.toString(), color: colors.error },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tableau de bord</Text>

      <View style={[styles.statsRow, isWide && styles.statsRowWide]}>
        {stats.map(s => (
          <Card key={s.label} style={isWide ? [styles.statCard, styles.statCardWide] : styles.statCard}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: s.color }]}>{s.label}</Text>
          </Card>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Activité récente</Text>
      <Card style={styles.logsCard}>
        {recentLogs.length === 0 ? (
          <Text style={styles.empty}>Aucune activité</Text>
        ) : (
          recentLogs.map(log => <LogItem key={log.id} log={log} />)
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl * 2 },
  title: { color: colors.text, fontSize: fontSize.xxl, fontWeight: '700', marginBottom: spacing.lg },
  statsRow: { gap: spacing.md },
  statsRowWide: { flexDirection: 'row' },
  statCard: { marginBottom: spacing.md, alignItems: 'center', paddingVertical: spacing.lg },
  statCardWide: { flex: 1, marginBottom: 0 },
  statValue: { color: colors.text, fontSize: 36, fontWeight: '700' },
  statLabel: { fontSize: fontSize.sm, fontWeight: '600', marginTop: spacing.xs },
  sectionTitle: { color: colors.textSecondary, fontSize: fontSize.lg, fontWeight: '600', marginTop: spacing.lg, marginBottom: spacing.md },
  logsCard: { padding: 0, overflow: 'hidden' },
  empty: { color: colors.textMuted, fontSize: fontSize.sm, padding: spacing.lg, textAlign: 'center' },
});

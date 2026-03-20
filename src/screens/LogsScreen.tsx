import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useBots } from '../context/BotContext';
import { LogItem } from '../components/LogItem';
import { EmptyState } from '../components/EmptyState';
import { colors, spacing, fontSize, borderRadius } from '../theme';

export function LogsScreen() {
  const { bots, logs, clearLogs } = useBots();
  const [filterBotId, setFilterBotId] = useState<string | null>(null);

  const filteredLogs = filterBotId ? logs.filter(l => l.botId === filterBotId) : logs;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Logs</Text>
        {logs.length > 0 && (
          <TouchableOpacity onPress={() => clearLogs(filterBotId ?? undefined)}>
            <Text style={styles.clearText}>Effacer</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterBtn, !filterBotId && styles.filterBtnActive]}
          onPress={() => setFilterBotId(null)}
        >
          <Text style={[styles.filterText, !filterBotId && styles.filterTextActive]}>Tous</Text>
        </TouchableOpacity>
        {bots.map(bot => (
          <TouchableOpacity
            key={bot.id}
            style={[styles.filterBtn, filterBotId === bot.id && styles.filterBtnActive]}
            onPress={() => setFilterBotId(filterBotId === bot.id ? null : bot.id)}
          >
            <Text style={[styles.filterText, filterBotId === bot.id && styles.filterTextActive]}>{bot.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredLogs.length === 0 ? (
        <EmptyState title="Aucun log" subtitle="Les actions sur vos bots apparaîtront ici" />
      ) : (
        <FlatList
          data={filteredLogs}
          keyExtractor={l => l.id}
          renderItem={({ item }) => <LogItem log={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  title: { color: colors.text, fontSize: fontSize.xxl, fontWeight: '700' },
  clearText: { color: colors.error, fontSize: fontSize.sm },
  filters: { flexDirection: 'row', paddingHorizontal: spacing.md, gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.sm },
  filterBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  filterBtnActive: { backgroundColor: colors.primary + '30', borderColor: colors.primary },
  filterText: { color: colors.textSecondary, fontSize: fontSize.sm },
  filterTextActive: { color: colors.primary, fontWeight: '600' },
});
